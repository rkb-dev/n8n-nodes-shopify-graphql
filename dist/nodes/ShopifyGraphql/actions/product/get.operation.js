"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
const product_fields_1 = require("./product.fields");
const product_filtering_1 = require("./product.filtering");
exports.description = [
    // Product selection with dynamic loading
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
                operation: ['get'],
            },
        },
        default: '',
        description: 'Select product from your Shopify store',
    },
    // Manual Product ID (fallback option)
    {
        displayName: 'Manual Product ID',
        name: 'manualProductId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get'],
                productId: ['__manual__'],
            },
        },
        default: '',
        description: 'Enter product ID manually if not found in dropdown',
    },
    // Batch size for getAll operation
    {
        displayName: 'Batch Size',
        name: 'batchSize',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['getAll'],
            },
        },
        default: 50,
        description: 'Number of products to fetch per batch (max 250)',
        typeOptions: {
            minValue: 1,
            maxValue: 250,
        },
    },
    {
        displayName: 'Max Items',
        name: 'maxItems',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['getAll'],
            },
        },
        default: 0,
        description: 'Maximum number of products to return (0 = no limit)',
        typeOptions: {
            minValue: 0,
        },
    },
    // Additional Fields Collection (metafields, date filtering)
    product_fields_1.additionalFieldsCollection,
    // Product Advanced Options Collection (variants, images)
    product_fields_1.productAdvancedOptionsCollection,
];
async function execute(operation, i) {
    if (operation === 'get') {
        // Handle both dynamic selection and manual entry
        let productId = this.getNodeParameter('productId', i);
        if (productId === '__manual__') {
            productId = this.getNodeParameter('manualProductId', i);
        }
        // Extract numeric ID if full GID is provided from dynamic selection
        if (productId.startsWith('gid://shopify/Product/')) {
            productId = productId.split('/').pop() || productId;
        }
        // Get advanced options for query enhancement
        const includeMetafields = (0, product_filtering_1.shouldIncludeMetafields)(this, i);
        const advancedOptions = (0, product_filtering_1.getProductAdvancedOptions)(this, i);
        // Build metafields fragment if needed
        let metafieldsFragment = '';
        if (includeMetafields) {
            metafieldsFragment = `
				metafields(first: 250) {
					nodes {
						id
						namespace
						key
						value
						type
						description
					}
				}`;
        }
        // Build variants fragment if needed
        let variantsFragment = '';
        if (advancedOptions.includeVariants) {
            // Build conditional inventory item fragments
            let inventoryItemFields = `
							id
							requiresShipping`;
            // Add inventory details if requested
            if (advancedOptions.includeInventoryDetails) {
                inventoryItemFields += `
							measurement {
								id
								weight {
									value
									unit
								}
							}`;
            }
            // Add customs data if requested
            if (advancedOptions.includeCustomsData) {
                inventoryItemFields += `
							countryCodeOfOrigin
							harmonizedSystemCode
							provinceCodeOfOrigin
							countryHarmonizedSystemCodes {
								countryCode
								harmonizedSystemCode
							}`;
            }
            variantsFragment = `
				variants(first: ${advancedOptions.variantsLimit}) {
					nodes {
						id
						title
						sku
						price
						compareAtPrice
						inventoryQuantity
						inventoryItem {${inventoryItemFields}
						}
						taxable
						barcode
						position
						availableForSale
						selectedOptions {
							name
							value
						}
					}
				}`;
        }
        // Build images fragment if needed
        let imagesFragment = '';
        if (advancedOptions.includeImages) {
            imagesFragment = `
				images(first: ${advancedOptions.imagesLimit}) {
					nodes {
						id
						url
						altText
						width
						height
					}
				}`;
        }
        const query = `
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
					updatedAt${metafieldsFragment}${variantsFragment}${imagesFragment}
				}
			}
		`;
        const variables = { id: `gid://shopify/Product/${productId}` };
        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
        return response.data.product;
    }
    else if (operation === 'getAll') {
        const batchSize = this.getNodeParameter('batchSize', i, 50);
        const maxItems = this.getNodeParameter('maxItems', i, 0);
        // Build query filters using extracted filtering logic
        const queryString = (0, product_filtering_1.buildProductQueryFilters)(this, i);
        // Get advanced options for query enhancement
        const includeMetafields = (0, product_filtering_1.shouldIncludeMetafields)(this, i);
        const advancedOptions = (0, product_filtering_1.getProductAdvancedOptions)(this, i);
        // Build metafields fragment if needed
        let metafieldsFragment = '';
        if (includeMetafields) {
            metafieldsFragment = `
				metafields(first: 250) {
					nodes {
						id
						namespace
						key
						value
						type
						description
					}
				}`;
        }
        // Build variants fragment if needed
        let variantsFragment = '';
        if (advancedOptions.includeVariants) {
            // Build conditional inventory item fragments
            let inventoryItemFields = `
							id
							requiresShipping`;
            // Add inventory details if requested
            if (advancedOptions.includeInventoryDetails) {
                inventoryItemFields += `
							measurement {
								id
								weight {
									value
									unit
								}
							}`;
            }
            // Add customs data if requested
            if (advancedOptions.includeCustomsData) {
                inventoryItemFields += `
							countryCodeOfOrigin
							harmonizedSystemCode
							provinceCodeOfOrigin
							countryHarmonizedSystemCodes {
								countryCode
								harmonizedSystemCode
							}`;
            }
            variantsFragment = `
				variants(first: ${advancedOptions.variantsLimit}) {
					nodes {
						id
						title
						sku
						price
						compareAtPrice
						inventoryQuantity
						inventoryItem {${inventoryItemFields}
						}
						taxable
						barcode
						position
						availableForSale
						selectedOptions {
							name
							value
						}
					}
				}`;
        }
        // Build images fragment if needed
        let imagesFragment = '';
        if (advancedOptions.includeImages) {
            imagesFragment = `
				images(first: ${advancedOptions.imagesLimit}) {
					nodes {
						id
						url
						altText
						width
						height
					}
				}`;
        }
        const query = `
			query getProducts($first: Int!, $after: String, $query: String) {
				products(first: $first, after: $after, query: $query) {
					edges {
						node {
							id
							title
							description
							vendor
							productType
							tags
							handle
							status
							createdAt
							updatedAt${metafieldsFragment}${variantsFragment}${imagesFragment}
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`;
        // Pass query filters as GraphQL variable
        const variables = { query: queryString };
        return await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'products', query, variables, batchSize, maxItems);
    }
    throw new Error(`Unknown product operation: ${operation}`);
}
exports.execute = execute;
