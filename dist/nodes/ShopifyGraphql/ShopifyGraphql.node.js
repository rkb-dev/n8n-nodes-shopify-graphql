"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyGraphql = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class ShopifyGraphql {
    constructor() {
        this.description = {
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
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
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
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (resource === 'customer') {
                    if (operation === 'get') {
                        const customerId = this.getNodeParameter('customerId', i);
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
                        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
                        responseData = response.data.customer;
                    }
                    else if (operation === 'getAll') {
                        const batchSize = this.getNodeParameter('batchSize', i, 50);
                        const maxItems = this.getNodeParameter('maxItems', i, 0);
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
                        responseData = await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, {}, batchSize, maxItems);
                    }
                    else if (operation === 'search') {
                        const searchQuery = this.getNodeParameter('searchQuery', i);
                        const batchSize = this.getNodeParameter('batchSize', i, 50);
                        const maxItems = this.getNodeParameter('maxItems', i, 0);
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
                        responseData = await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, { query: searchQuery }, batchSize, maxItems);
                    }
                }
                else if (resource === 'order') {
                    if (operation === 'get') {
                        const orderId = this.getNodeParameter('orderId', i);
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
									}
								}
							}
						`;
                        const variables = { id: `gid://shopify/Order/${orderId}` };
                        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
                        responseData = response.data.order;
                    }
                    else if (operation === 'getAll') {
                        const batchSize = this.getNodeParameter('batchSize', i, 50);
                        const maxItems = this.getNodeParameter('maxItems', i, 0);
                        const query = `
							query getOrders($first: Int!, $after: String) {
								orders(first: $first, after: $after) {
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
											}
										}
									}
									pageInfo {
										hasNextPage
										endCursor
									}
								}
							}
						`;
                        responseData = await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'orders', query, {}, batchSize, maxItems);
                    }
                }
                else if (resource === 'product') {
                    if (operation === 'get') {
                        const productId = this.getNodeParameter('productId', i);
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
                        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
                        responseData = response.data.product;
                    }
                    else if (operation === 'getAll') {
                        const batchSize = this.getNodeParameter('batchSize', i, 50);
                        const maxItems = this.getNodeParameter('maxItems', i, 0);
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
                        responseData = await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'products', query, {}, batchSize, maxItems);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push(...responseData.map((item) => ({ json: item })));
                }
                else if (responseData) {
                    returnData.push({ json: responseData });
                }
            }
            catch (error) {
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
exports.ShopifyGraphql = ShopifyGraphql;
