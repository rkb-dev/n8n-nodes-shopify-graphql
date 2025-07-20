import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

import {
	executeProductGet,
	executeProductCreate,
	executeProductUpdate,
	executeProductDelete,
	executeCustomerGet,
	executeOrderGet,
} from './actions';

// Import individual modules for proper field organization
import * as productModule from './actions/product';
import * as customerModule from './actions/customer';
import * as orderModule from './actions/order';

import {
	loadProducts,
	loadCustomers,
	loadMetafields,
	loadOrders,
	loadCollections,
	loadLocations,
	loadProductVariants,
	loadProductTypes,
	loadVendors,
	searchCollections,
} from './methods';

export class ShopifyGraphqlModular implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shopify GraphQL Enhanced',
		name: 'shopifyGraphqlModular',
		icon: 'file:shopify.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Shopify GraphQL with Enhanced Product Updates & Comprehensive Fields (v2.2.0 - Latest)',
		defaults: {
			name: 'Shopify GraphQL Dynamic',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'shopifyGraphqlApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Product',
						value: 'product',
					},
				],
				default: 'product',
			},
			// Import operation definitions from each resource
			...productModule.productOperations,
			...customerModule.customerOperations,
			...orderModule.orderOperations,
			
			// Import shared resource fields
			...productModule.productFields,
			
			// Import individual operation descriptions
			...productModule.getOperation.description,
			...productModule.createOperation.description,
			...productModule.updateOperation.description,
			...productModule.deleteOperation.description,
			...customerModule.getOperation.description,
			...orderModule.getOperation.description,
		],
	};

	// Dynamic loading methods for improved UX
	methods = {
		// Search methods for resource locators (n8n listSearch pattern)
		listSearch: {
			async searchCollections(
				this: ILoadOptionsFunctions,
				query?: string,
			): Promise<INodeListSearchResult> {
				try {
					// Build GraphQL query with optional search functionality
					const graphqlQuery = `
						query CollectionsSearch($first: Int!, $query: String) {
							collections(first: $first, sortKey: TITLE, query: $query) {
								edges {
									node {
										id
										title
										handle
										productsCount
										sortOrder
										description
										updatedAt
									}
								}
							}
						}
					`;

					// Include search term in variables if provided
					const variables: any = { first: 50 };
					if (query) {
						// Use Shopify's search syntax for title and handle
						variables.query = `title:*${query}* OR handle:*${query}*`;
					}
					
					// Use the correct API request pattern
					const credentials = await this.getCredentials('shopifyGraphqlApi');
					const requestOptions = {
						method: 'POST' as const,
						body: { query: graphqlQuery, variables },
						uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
						json: true,
						headers: {
							'X-Shopify-Access-Token': credentials.accessToken,
							'Content-Type': 'application/json',
						},
					};
					const response = await this.helpers.request(requestOptions);

					const results = [];
					if (response.data?.collections?.edges) {
						for (const edge of response.data.collections.edges) {
							const collection = edge.node;
							
							// Collection type indicator based on sort order
							const typeIcon = collection.sortOrder === 'MANUAL' ? '📋' : 
											collection.sortOrder === 'BEST_SELLING' ? '🔥' : 
											collection.sortOrder === 'CREATED' ? '🆕' : 
											collection.sortOrder === 'PRICE' ? '💰' : '📚';
							
							const displayName = `${typeIcon} ${collection.title}`;
							
							const description = [
								`${collection.productsCount} products`,
								`Sort: ${collection.sortOrder}`,
								`Handle: ${collection.handle}`
							].join(' | ');

							results.push({
								name: displayName,
								value: collection.id,
								description,
							});
						}
					}

					return { results };
				} catch (error) {
					return { results: [] };
				}
			},
		},
		loadOptions: {
			// High Priority - Essential Methods
			async loadProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadProducts.call(this);
			},
			async loadCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadCustomers.call(this);
			},
			async loadMetafields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadMetafields.call(this);
			},
			async loadOrders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadOrders.call(this);
			},
			async loadCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadCollections.call(this);
			},
			async loadLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadLocations.call(this);
			},
			
			// Advanced Methods - Enhanced Functionality
			async loadProductVariants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadProductVariants.call(this);
			},
			async loadProductTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadProductTypes.call(this);
			},
			async loadVendors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				return await loadVendors.call(this);
			},

		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// Route to appropriate resource and operation
				if (resource === 'product') {
					if (operation === 'get' || operation === 'getAll') {
						responseData = await executeProductGet.call(this, operation, i);
					} else if (operation === 'create') {
						responseData = await executeProductCreate.call(this, i);
					} else if (operation === 'update') {
						responseData = await executeProductUpdate.call(this, i);
					} else if (operation === 'delete') {
						responseData = await executeProductDelete.call(this, i);
					} else {
						throw new Error(`Unknown product operation: ${operation}`);
					}
				} else if (resource === 'customer') {
					if (operation === 'get' || operation === 'getAll' || operation === 'search') {
						responseData = await executeCustomerGet.call(this, operation, i);
					} else {
						throw new Error(`Unknown customer operation: ${operation}`);
					}
				} else if (resource === 'order') {
					if (operation === 'get' || operation === 'getAll') {
						responseData = await executeOrderGet.call(this, operation, i);
					} else {
						throw new Error(`Unknown order operation: ${operation}`);
					}
				} else {
					throw new Error(`Unknown resource: ${resource}`);
				}

				// Handle response data
				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item: any) => ({ json: item })));
				} else if (responseData) {
					returnData.push({ json: responseData });
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message || 'Unknown error' }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
