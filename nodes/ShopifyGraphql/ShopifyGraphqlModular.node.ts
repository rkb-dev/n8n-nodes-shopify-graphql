import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

import {
	allActionProperties,
	executeProductGet,
	executeProductCreate,
	executeProductUpdate,
	executeProductDelete,
	executeCustomerGet,
	executeOrderGet,
} from './actions';

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
} from './methods';

export class ShopifyGraphqlModular implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shopify GraphQL Dynamic',
		name: 'shopifyGraphqlModular',
		icon: 'file:shopify-dynamic.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Shopify GraphQL with Dynamic Loading & Smart Dropdowns (v2.0 - Latest)',
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
			...allActionProperties,
		],
	};

	// Dynamic loading methods for improved UX
	methods = {
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
