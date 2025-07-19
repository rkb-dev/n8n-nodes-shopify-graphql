import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { shopifyGraphqlApiRequest, shopifyGraphqlApiRequestAllItems } from './GenericFunctions';

export class ShopifyGraphql implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shopify GraphQL',
		name: 'shopifyGraphql',
		icon: 'file:shopify.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Shopify GraphQL API with smart batching and rate limiting',
		defaults: {
			name: 'Shopify GraphQL',
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
				default: 'customer',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a customer by ID',
						action: 'Get a customer',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many customers with smart batching',
						action: 'Get many customers',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search customers by query',
						action: 'Search customers',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an order by ID',
						action: 'Get an order',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many orders with smart batching',
						action: 'Get many orders',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a product by ID',
						action: 'Get a product',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many products with smart batching',
						action: 'Get many products',
					},
				],
				default: 'get',
			},
			// Customer ID field
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the customer to retrieve',
			},
			// Order ID field
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the order to retrieve',
			},
			// Orders query data toggles
			{
				displayName: 'Include Customer Information',
				name: 'includeCustomer',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getAll', 'search'],
					},
				},
				description: 'Include customer details (name, email, phone, addresses)',
			},
			{
				displayName: 'Include Line Items',
				name: 'includeLineItems',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getAll', 'search'],
					},
				},
				description: 'Include line items with product details, quantities, and pricing',
			},
			{
				displayName: 'Include Tax Details',
				name: 'includeTaxDetails',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getAll', 'search'],
					},
				},
				description: 'Include tax lines and total tax calculations',
			},
			{
				displayName: 'Include Addresses',
				name: 'includeAddresses',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getAll', 'search'],
					},
				},
				description: 'Include billing and shipping addresses',
			},
			// Product ID field
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the product to retrieve',
			},
			// Search query field
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['customer'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Search query for customers (e.g., "email:john@example.com")',
			},
			// Batching options
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll', 'search'],
					},
				},
				default: 250,
				description: 'Number of items to fetch per GraphQL request (1-250)',
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
						operation: ['getAll', 'search'],
					},
				},
				default: 1000,
				description: 'Maximum total items to fetch (0 = unlimited)',
				typeOptions: {
					minValue: 0,
				},
			},
			// Additional options
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Include Metafields',
						name: 'includeMetafields',
						type: 'boolean',
						default: false,
						description: 'Whether to include metafields in the response',
					},
					{
						displayName: 'Created After',
						name: 'createdAfter',
						type: 'dateTime',
						default: '',
						description: 'Only return items created after this date',
					},
					{
						displayName: 'Created Before',
						name: 'createdBefore',
						type: 'dateTime',
						default: '',
						description: 'Only return items created before this date',
					},
				],
			},
			// Orders advanced options
			{
				displayName: 'Orders Advanced Options',
				name: 'ordersAdvancedOptions',
				type: 'collection',
				placeholder: 'Add advanced option',
				default: {},
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get', 'getAll', 'search'],
					},
				},
				options: [
					{
						displayName: 'Line Items Limit',
						name: 'lineItemsLimit',
						type: 'number',
						default: 250,
						description: 'Maximum number of line items to fetch per order (1-250)',
						typeOptions: {
							minValue: 1,
							maxValue: 250,
						},
						displayOptions: {
							show: {
								'/includeLineItems': [true],
							},
						},
					},
					{
						displayName: 'Include Shipping Lines',
						name: 'includeShippingLines',
						type: 'boolean',
						default: false,
						description: 'Include shipping method and cost details',
					},
					{
						displayName: 'Include Fulfillment Details',
						name: 'includeFulfillmentDetails',
						type: 'boolean',
						default: false,
						description: 'Include fulfillment status and tracking information',
					},
					{
						displayName: 'Include Custom Attributes',
						name: 'includeCustomAttributes',
						type: 'boolean',
						default: false,
						description: 'Include custom order attributes and notes',
					},
					{
						displayName: 'Include Financial Details',
						name: 'includeFinancialDetails',
						type: 'boolean',
						default: false,
						description: 'Include payment status, transactions, and financial summary',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				if (resource === 'customer') {
					if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const query = `
							query getCustomer($id: ID!) {
								customer(id: $id) {
									id
									email
									firstName
									lastName
									phone
									verifiedEmail
									state
									tags
									createdAt
									updatedAt
								}
							}
						`;
						const variables = { id: `gid://shopify/Customer/${customerId}` };
						const response = await shopifyGraphqlApiRequest.call(this, query, variables);
						responseData = response.data.customer;
					} else if (operation === 'getAll') {
						const batchSize = this.getNodeParameter('batchSize', i, 50) as number;
						const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
						const query = `
							query getCustomers($first: Int!, $after: String) {
								customers(first: $first, after: $after) {
									edges {
										node {
											id
											email
											firstName
											lastName
											phone
											verifiedEmail
											state
											tags
											createdAt
											updatedAt
										}
									}
									pageInfo {
										hasNextPage
										endCursor
									}
								}
							}
						`;
						responseData = await shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, {}, batchSize, maxItems);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						const batchSize = this.getNodeParameter('batchSize', i, 50) as number;
						const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
						const query = `
							query searchCustomers($first: Int!, $after: String, $query: String!) {
								customers(first: $first, after: $after, query: $query) {
									edges {
										node {
											id
											email
											firstName
											lastName
											phone
											verifiedEmail
											state
											tags
											createdAt
											updatedAt
										}
									}
									pageInfo {
										hasNextPage
										endCursor
									}
								}
							}
						`;
						responseData = await shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, { query: searchQuery }, batchSize, maxItems);
					}
				} else if (resource === 'order') {
					if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as string;
						
						// Get modular UI selections
						const includeCustomer = this.getNodeParameter('includeCustomer', i, false) as boolean;
						const includeLineItems = this.getNodeParameter('includeLineItems', i, false) as boolean;
						const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false) as boolean;
						const includeAddresses = this.getNodeParameter('includeAddresses', i, false) as boolean;
						
						// Get advanced options
						const advancedOptions = this.getNodeParameter('ordersAdvancedOptions', i, {}) as any;
						const lineItemsLimit = advancedOptions.lineItemsLimit || 250;
						const includeShippingLines = advancedOptions.includeShippingLines || false;
						const includeFulfillmentDetails = advancedOptions.includeFulfillmentDetails || false;
						const includeCustomAttributes = advancedOptions.includeCustomAttributes || false;
						const includeFinancialDetails = advancedOptions.includeFinancialDetails || false;
						
						// Build dynamic query fragments
						let customerFragment = '';
						if (includeCustomer) {
							customerFragment = `
								customer {
									id
									firstName
									lastName
									email
									phone
									verifiedEmail
									defaultAddress {
										address1
										address2
										city
										province
										country
										zip
									}
								}`;
						}
						
						let lineItemsFragment = '';
						if (includeLineItems) {
							lineItemsFragment = `
								lineItems(first: ${lineItemsLimit}) {
									nodes {
										id
										name
										quantity
										sku
										variant {
											id
											title
											price
											sku
											product {
												id
												title
												productType
												vendor
											}
										}
										originalUnitPriceSet {
											shopMoney {
												amount
												currencyCode
											}
										}
										discountedUnitPriceSet {
											shopMoney {
												amount
												currencyCode
											}
										}
									}
								}`;
						}
						
						let taxFragment = '';
						if (includeTaxDetails) {
							taxFragment = `
								taxLines {
									title
									rate
									priceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
								}
								totalTaxSet {
									shopMoney {
										amount
										currencyCode
									}
								}
								currentTotalTaxSet {
									shopMoney {
										amount
										currencyCode
									}
								}`;
						}
						
						let addressesFragment = '';
						if (includeAddresses) {
							addressesFragment = `
								shippingAddress {
									firstName
									lastName
									address1
									address2
									city
									province
									country
									zip
									phone
								}
								billingAddress {
									firstName
									lastName
									address1
									address2
									city
									province
									country
									zip
									phone
								}`;
						}
						
						let shippingFragment = '';
						if (includeShippingLines) {
							shippingFragment = `
								shippingLines {
									title
									code
									originalPriceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
									discountedPriceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
								}`;
						}
						
						let fulfillmentFragment = '';
						if (includeFulfillmentDetails) {
							fulfillmentFragment = `
								fulfillments {
									id
									status
									trackingCompany
									trackingNumbers
									trackingUrls
									createdAt
									updatedAt
								}`;
						}
						
						let customAttributesFragment = '';
						if (includeCustomAttributes) {
							customAttributesFragment = `
								customAttributes {
									key
									value
								}
								note`;
						}
						
						let financialFragment = '';
						if (includeFinancialDetails) {
							financialFragment = `
								transactions {
									id
									status
									kind
									amountSet {
										shopMoney {
											amount
											currencyCode
										}
									}
									gateway
									createdAt
								}
								currentSubtotalPriceSet {
									shopMoney {
										amount
										currencyCode
									}
								}
								currentTotalPriceSet {
									shopMoney {
										amount
										currencyCode
									}
								}`;
						}
						
						// Build complete dynamic query
						const query = `
							query getOrder($id: ID!) {
								order(id: $id) {
									id
									name
									email
									phone
									createdAt
									updatedAt
									processedAt
									displayFinancialStatus
									displayFulfillmentStatus
									totalPriceSet {
										shopMoney {
											amount
											currencyCode
										}
									}${customerFragment}${lineItemsFragment}${taxFragment}${addressesFragment}${shippingFragment}${fulfillmentFragment}${customAttributesFragment}${financialFragment}
								}
							}
						`;
						const variables = { id: `gid://shopify/Order/${orderId}` };
						const response = await shopifyGraphqlApiRequest.call(this, query, variables);
						responseData = response.data.order;
					} else if (operation === 'getAll') {
						const batchSize = this.getNodeParameter('batchSize', i, 50) as number;
						const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
						
						// Get modular UI selections (same as get operation)
						const includeCustomer = this.getNodeParameter('includeCustomer', i, false) as boolean;
						const includeLineItems = this.getNodeParameter('includeLineItems', i, false) as boolean;
						const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false) as boolean;
						const includeAddresses = this.getNodeParameter('includeAddresses', i, false) as boolean;
						
						// Get date filtering parameters
						const createdAfter = this.getNodeParameter('createdAfter', i, '') as string;
						const createdBefore = this.getNodeParameter('createdBefore', i, '') as string;
						
						// Get advanced options
						const advancedOptions = this.getNodeParameter('ordersAdvancedOptions', i, {}) as any;
						const lineItemsLimit = advancedOptions.lineItemsLimit || 250;
						const includeShippingLines = advancedOptions.includeShippingLines || false;
						const includeFulfillmentDetails = advancedOptions.includeFulfillmentDetails || false;
						const includeCustomAttributes = advancedOptions.includeCustomAttributes || false;
						const includeFinancialDetails = advancedOptions.includeFinancialDetails || false;
						
						// Build dynamic query fragments (reuse same logic)
						let customerFragment = '';
						if (includeCustomer) {
							customerFragment = `
								customer {
									id
									firstName
									lastName
									email
									phone
									verifiedEmail
									defaultAddress {
										address1
										address2
										city
										province
										country
										zip
									}
								}`;
						}
						
						let lineItemsFragment = '';
						if (includeLineItems) {
							lineItemsFragment = `
								lineItems(first: ${lineItemsLimit}) {
									nodes {
										id
										name
										quantity
										sku
										variant {
											id
											title
											price
											sku
											product {
												id
												title
												productType
												vendor
											}
										}
										originalUnitPriceSet {
											shopMoney {
												amount
												currencyCode
											}
										}
										discountedUnitPriceSet {
											shopMoney {
												amount
												currencyCode
											}
										}
									}
								}`;
						}
						
						let taxFragment = '';
						if (includeTaxDetails) {
							taxFragment = `
								taxLines {
									title
									rate
									priceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
								}
								totalTaxSet {
									shopMoney {
										amount
										currencyCode
									}
								}
								currentTotalTaxSet {
									shopMoney {
										amount
										currencyCode
									}
								}`;
						}
						
						let addressesFragment = '';
						if (includeAddresses) {
							addressesFragment = `
								shippingAddress {
									firstName
									lastName
									address1
									address2
									city
									province
									country
									zip
									phone
								}
								billingAddress {
									firstName
									lastName
									address1
									address2
									city
									province
									country
									zip
									phone
								}`;
						}
						
						let shippingFragment = '';
						if (includeShippingLines) {
							shippingFragment = `
								shippingLines {
									title
									code
									originalPriceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
									discountedPriceSet {
										shopMoney {
											amount
											currencyCode
										}
									}
								}`;
						}
						
						let fulfillmentFragment = '';
						if (includeFulfillmentDetails) {
							fulfillmentFragment = `
								fulfillments {
									id
									status
									trackingCompany
									trackingNumbers
									trackingUrls
									createdAt
									updatedAt
								}`;
						}
						
						let customAttributesFragment = '';
						if (includeCustomAttributes) {
							customAttributesFragment = `
								customAttributes {
									key
									value
								}
								note`;
						}
						
						let financialFragment = '';
						if (includeFinancialDetails) {
							financialFragment = `
								transactions {
									id
									status
									kind
									amountSet {
										shopMoney {
											amount
											currencyCode
										}
									}
									gateway
									createdAt
								}
								currentSubtotalPriceSet {
									shopMoney {
										amount
										currencyCode
									}
								}
								currentTotalPriceSet {
									shopMoney {
										amount
										currencyCode
									}
								}`;
						}
						
						// Build date filter query string (Shopify format: created_at:>YYYY-MM-DD)
						let queryFilters: string[] = [];
						if (createdAfter) {
							// Extract date part only (YYYY-MM-DD) from n8n datetime
							const afterDate = createdAfter.split(' ')[0];
							queryFilters.push(`created_at:>${afterDate}`);
						}
						if (createdBefore) {
							// Extract date part only (YYYY-MM-DD) from n8n datetime
							const beforeDate = createdBefore.split(' ')[0];
							queryFilters.push(`created_at:<${beforeDate}`);
						}
						const queryString = queryFilters.length > 0 ? queryFilters.join(' AND ') : '';
						
						// Build complete dynamic query with embedded filter (Shopify pattern)
						const query = `
							query getOrders($first: Int!, $after: String) {
								orders(first: $first, after: $after${queryString ? `, query: "${queryString}"` : ''}) {
									edges {
										node {
											id
											name
											email
											phone
											createdAt
											updatedAt
											processedAt
											displayFinancialStatus
											displayFulfillmentStatus
											totalPriceSet {
												shopMoney {
													amount
													currencyCode
												}
											}${customerFragment}${lineItemsFragment}${taxFragment}${addressesFragment}${shippingFragment}${fulfillmentFragment}${customAttributesFragment}${financialFragment}
										}
									}
									pageInfo {
										hasNextPage
										endCursor
									}
								}
							}
						`;
								
								// No variables needed since query filter is embedded directly
								const variables = {};
								responseData = await shopifyGraphqlApiRequestAllItems.call(this, 'orders', query, variables, batchSize, maxItems);
					}
				} else if (resource === 'product') {
					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
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
									updatedAt
								}
							}
						`;
						const variables = { id: `gid://shopify/Product/${productId}` };
						const response = await shopifyGraphqlApiRequest.call(this, query, variables);
						responseData = response.data.product;
					} else if (operation === 'getAll') {
						const batchSize = this.getNodeParameter('batchSize', i, 50) as number;
						const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
						const query = `
							query getProducts($first: Int!, $after: String) {
								products(first: $first, after: $after) {
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
											updatedAt
										}
									}
									pageInfo {
										hasNextPage
										endCursor
									}
								}
							}
						`;
						responseData = await shopifyGraphqlApiRequestAllItems.call(this, 'products', query, {}, batchSize, maxItems);
					}
				}

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
