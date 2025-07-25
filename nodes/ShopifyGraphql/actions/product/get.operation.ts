import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shopifyGraphqlApiRequest, shopifyGraphqlApiRequestAllItems } from '../../GenericFunctions';
import { additionalFieldsCollection, productAdvancedOptionsCollection } from './product.fields';
import { buildProductQueryFilters, shouldIncludeMetafields, getProductAdvancedOptions, calculateProductCostEstimate } from './product.filtering';

export const description: INodeProperties[] = [
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
	// Auto-optimized batching (no user configuration needed)
	{
		displayName: 'Automatic Batching',
		name: 'autoBatchingInfo',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: '🤖 Batch sizes are automatically optimized based on enabled features to stay within GraphQL cost limits. Complex queries (variants + customs) use smaller batches for speed.',
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
	additionalFieldsCollection,
	// Product Advanced Options Collection (variants, images)
	productAdvancedOptionsCollection,
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'get') {
		// Handle both dynamic selection and manual entry
		let productId = this.getNodeParameter('productId', i) as string;
		if (productId === '__manual__') {
			productId = this.getNodeParameter('manualProductId', i) as string;
		}
		
		// Extract numeric ID if full GID is provided from dynamic selection
		if (productId.startsWith('gid://shopify/Product/')) {
			productId = productId.split('/').pop() || productId;
		}
		
		// Get advanced options for query enhancement
		const includeMetafields = shouldIncludeMetafields(this, i);
		const advancedOptions = getProductAdvancedOptions(this, i);
		
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
							countryHarmonizedSystemCodes(first: 250) {
								edges {
									node {
										countryCode
										harmonizedSystemCode
									}
								}
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
		const response = await shopifyGraphqlApiRequest.call(this, query, variables);
		return response.data.product;
	} else if (operation === 'getAll') {
		const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
		
		// Calculate cost estimate and optimal batch size automatically
		const includeMetafields = shouldIncludeMetafields(this, i);
		const advancedOptions = getProductAdvancedOptions(this, i);
		const costEstimate = calculateProductCostEstimate(includeMetafields, advancedOptions);
		
		// Set optimal batch size: aim for 700-800 points per batch (safe margin)
		const optimalBatchSize = Math.min(Math.floor(700 / costEstimate), 250);
		
		// Build query filters using extracted filtering logic
		const queryString = buildProductQueryFilters(this, i);
		
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
							countryHarmonizedSystemCodes(first: 250) {
								edges {
									node {
										countryCode
										harmonizedSystemCode
									}
								}
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
		return await shopifyGraphqlApiRequestAllItems.call(this, 'products', query, variables, optimalBatchSize, maxItems, costEstimate);
	}
	
	throw new Error(`Unknown product operation: ${operation}`);
}
