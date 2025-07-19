"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
exports.description = [
    // Simple product selection
    {
        displayName: 'Product',
        name: 'productId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'loadProducts',
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Select the product to update',
    },
    // Dynamic Metafield Editing (Google Sheets pattern)
    {
        displayName: 'Product Metafields',
        name: 'metafieldsToUpdate',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        noDataExpression: true,
        typeOptions: {
            loadOptionsDependsOn: ['productId'],
            resourceMapper: {
                resourceMapperMethod: 'getMetafieldMappingColumns',
                mode: 'add',
                addAllFields: true,
                multiKeyMatch: true,
                supportAutoMap: true, // Enable auto-mapping when possible
            },
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        description: 'Select and edit metafields for the chosen product. Metafields will load automatically after selecting a product.',
    },
    // Product Description field
    {
        displayName: 'Product Description',
        name: 'productDescription',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The description of the product (supports HTML)',
    },
    // Product Handle field
    {
        displayName: 'Product Handle',
        name: 'productHandle',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The handle of the product (URL slug)',
    },
    // Product Status field
    {
        displayName: 'Product Status',
        name: 'productStatus',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        options: [
            {
                name: 'Active',
                value: 'ACTIVE',
            },
            {
                name: 'Draft',
                value: 'DRAFT',
            },
            {
                name: 'Archived',
                value: 'ARCHIVED',
            },
        ],
        default: '',
        description: 'The status of the product',
    },
    // Product Vendor field
    {
        displayName: 'Vendor',
        name: 'productVendor',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The vendor or manufacturer of the product',
    },
    // Product Type field
    {
        displayName: 'Product Type',
        name: 'productType',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The type or category of the product',
    },
];
async function execute(i) {
    // Get product ID from simple dropdown selection
    const productId = this.getNodeParameter('productId', i);
    // Validate product ID
    if (!productId) {
        throw new Error('Product ID is required');
    }
    // Get metafields from resourceMapper
    const metafieldsToUpdate = this.getNodeParameter('metafieldsToUpdate', i, {});
    // Get traditional product fields
    const productDescription = this.getNodeParameter('productDescription', i, '');
    const productHandle = this.getNodeParameter('productHandle', i, '');
    const productStatus = this.getNodeParameter('productStatus', i, '');
    const productVendor = this.getNodeParameter('productVendor', i, '');
    const productType = this.getNodeParameter('productType', i, '');
    // Build product input object with only provided fields
    const productInput = {
        id: `gid://shopify/Product/${productId}`,
    };
    if (productDescription)
        productInput.descriptionHtml = productDescription;
    if (productHandle)
        productInput.handle = productHandle;
    if (productStatus)
        productInput.status = productStatus;
    if (productVendor)
        productInput.vendor = productVendor;
    if (productType)
        productInput.productType = productType;
    // Process metafield updates from resourceMapper
    const metafieldUpdates = [];
    if (metafieldsToUpdate && metafieldsToUpdate.value) {
        // Handle resourceMapper data structure
        const metafieldMappings = metafieldsToUpdate.value;
        for (const [metafieldKey, metafieldValue] of Object.entries(metafieldMappings)) {
            // Skip special values
            if (metafieldKey === '__header__' || metafieldKey === '__no_metafields__' || metafieldKey === '__create_new__') {
                continue;
            }
            // Parse namespace.key format
            const [namespace, key] = metafieldKey.split('.');
            if (!namespace || !key) {
                continue; // Skip invalid keys
            }
            // Only update if value is provided and not empty
            if (metafieldValue !== null && metafieldValue !== undefined && metafieldValue !== '') {
                metafieldUpdates.push({
                    namespace,
                    key,
                    value: String(metafieldValue),
                    type: 'single_line_text_field', // Default type, could be enhanced
                });
            }
        }
    }
    // Execute product update and metafield updates
    const results = {
        product: null,
        metafields: [],
        errors: [],
    };
    // 1. Update product basic fields if any are provided
    if (Object.keys(productInput).length > 1) { // More than just ID
        const productMutation = `
			mutation productUpdate($input: ProductInput!) {
				productUpdate(input: $input) {
					product {
						id
						title
						description
						vendor
						productType
						tags
						handle
						status
						createdAt
						updatedAt
					}
					userErrors {
						field
						message
					}
				}
			}
		`;
        const productResponse = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, productMutation, { input: productInput });
        if (productResponse.data.productUpdate.userErrors.length > 0) {
            results.errors.push(...productResponse.data.productUpdate.userErrors.map((e) => `Product: ${e.message}`));
        }
        else {
            results.product = productResponse.data.productUpdate.product;
        }
    }
    // 2. Update metafields if any are provided
    if (metafieldUpdates.length > 0) {
        for (const metafield of metafieldUpdates) {
            try {
                const metafieldMutation = `
					mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
						metafieldsSet(metafields: $metafields) {
							metafields {
								id
								namespace
								key
								value
								type
								updatedAt
							}
							userErrors {
								field
								message
							}
						}
					}
				`;
                const metafieldInput = {
                    ownerId: productId,
                    namespace: metafield.namespace,
                    key: metafield.key,
                    value: metafield.value,
                    type: metafield.type,
                };
                const metafieldResponse = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, metafieldMutation, { metafields: [metafieldInput] });
                if (metafieldResponse.data.metafieldsSet.userErrors.length > 0) {
                    results.errors.push(...metafieldResponse.data.metafieldsSet.userErrors.map((e) => `Metafield ${metafield.namespace}.${metafield.key}: ${e.message}`));
                }
                else {
                    results.metafields.push(...metafieldResponse.data.metafieldsSet.metafields);
                }
            }
            catch (error) {
                results.errors.push(`Metafield ${metafield.namespace}.${metafield.key}: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`);
            }
        }
    }
    // 3. If no product was updated but we have metafields, fetch the product info
    if (!results.product && metafieldUpdates.length > 0) {
        const productQuery = `
			query getProduct($id: ID!) {
				product(id: $id) {
					id
					title
					description
					vendor
					productType
					tags
					handle
					status
					createdAt
					updatedAt
				}
			}
		`;
        const productQueryResponse = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, productQuery, { id: productId });
        results.product = productQueryResponse.data.product;
    }
    // 4. Handle errors
    if (results.errors.length > 0) {
        throw new Error(`Update failed: ${results.errors.join('; ')}`);
    }
    // 5. Return comprehensive results
    return {
        product: results.product,
        metafieldsUpdated: results.metafields,
        updatedCount: {
            product: results.product ? 1 : 0,
            metafields: results.metafields.length,
        },
        summary: `Updated product ${results.product ? '✓' : '✗'}, ${results.metafields.length} metafield(s) ✓`,
    };
}
exports.execute = execute;
