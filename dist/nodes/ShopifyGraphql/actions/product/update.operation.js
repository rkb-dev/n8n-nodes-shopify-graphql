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
    // Product Title field
    {
        displayName: 'Product Title',
        name: 'productTitle',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The title of the product',
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
    // Product Tags field
    {
        displayName: 'Tags',
        name: 'productTags',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Comma-separated list of product tags',
    },
    // Simple collection selection (optional)
    {
        displayName: 'Add to Collection',
        name: 'collectionId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'loadCollections',
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Select collection to add this product to (optional)',
    },
    // Product Metafields Collection (values only, no type needed)
    {
        displayName: 'Product Metafields',
        name: 'productMetafields',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: {},
        description: 'Update metafield values for existing metafield definitions',
        options: [
            {
                name: 'metafield',
                displayName: 'Metafield',
                values: [
                    {
                        displayName: 'Namespace',
                        name: 'namespace',
                        type: 'string',
                        required: true,
                        default: 'custom',
                        description: 'Metafield namespace (e.g., custom, app, etc.)',
                    },
                    {
                        displayName: 'Key',
                        name: 'key',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'Metafield key identifier',
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'Metafield value to set',
                    },
                ],
            },
        ],
    },
    // SEO Settings Collection
    {
        displayName: 'SEO Settings',
        name: 'seoSettings',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: false,
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
            },
        },
        default: {},
        description: 'SEO settings for the product',
        options: [
            {
                name: 'seo',
                displayName: 'SEO',
                values: [
                    {
                        displayName: 'SEO Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'SEO title for search engines',
                    },
                    {
                        displayName: 'SEO Description',
                        name: 'description',
                        type: 'string',
                        typeOptions: {
                            rows: 3,
                        },
                        default: '',
                        description: 'SEO description for search engines',
                    },
                ],
            },
        ],
    },
];
async function execute(i) {
    // Get product ID from simple dropdown selection
    const productId = this.getNodeParameter('productId', i);
    // Validate product ID
    if (!productId) {
        throw new Error('Product ID is required');
    }
    // Get all product fields
    const productTitle = this.getNodeParameter('productTitle', i, '');
    const productDescription = this.getNodeParameter('productDescription', i, '');
    const productHandle = this.getNodeParameter('productHandle', i, '');
    const productStatus = this.getNodeParameter('productStatus', i, '');
    const productVendor = this.getNodeParameter('productVendor', i, '');
    const productType = this.getNodeParameter('productType', i, '');
    const productTags = this.getNodeParameter('productTags', i, '');
    const collectionId = this.getNodeParameter('collectionId', i, '');
    const productMetafields = this.getNodeParameter('productMetafields', i, {});
    const seoSettings = this.getNodeParameter('seoSettings', i, {});
    // Build product input object with only provided fields
    const productInput = {
        id: `gid://shopify/Product/${productId}`,
    };
    if (productTitle)
        productInput.title = productTitle;
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
    // Handle tags (convert comma-separated string to array)
    if (productTags) {
        const tagsArray = productTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        if (tagsArray.length > 0) {
            productInput.tags = tagsArray;
        }
    }
    // Handle collection assignment
    if (collectionId) {
        if (!collectionId.startsWith('gid://shopify/Collection/')) {
            const finalCollectionId = `gid://shopify/Collection/${collectionId}`;
            productInput.collectionsToJoin = [finalCollectionId];
        }
        else {
            productInput.collectionsToJoin = [collectionId];
        }
    }
    // Handle SEO settings
    if (seoSettings && seoSettings.seo && seoSettings.seo.length > 0) {
        const seo = seoSettings.seo[0];
        productInput.seo = {};
        if (seo.title)
            productInput.seo.title = seo.title;
        if (seo.description)
            productInput.seo.description = seo.description;
    }
    // Handle metafields (values only, no type needed for updates)
    if (productMetafields && productMetafields.metafield && productMetafields.metafield.length > 0) {
        productInput.metafields = productMetafields.metafield.map((metafield) => ({
            namespace: metafield.namespace,
            key: metafield.key,
            value: metafield.value,
        }));
    }
    // Execute simple product update
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
						collections(first: 10) {
							edges {
								node {
									id
									title
								}
							}
						}
						metafields(first: 20) {
							edges {
								node {
									id
									namespace
									key
									value
								}
							}
						}
						seo {
							title
							description
						}
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
            throw new Error(`Product update failed: ${productResponse.data.productUpdate.userErrors.map((e) => e.message).join('; ')}`);
        }
        return productResponse.data.productUpdate.product;
    }
    else {
        throw new Error('No product fields provided for update');
    }
}
exports.execute = execute;
