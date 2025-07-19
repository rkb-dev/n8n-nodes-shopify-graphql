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
                // Order Filters (Phase 1: Core Business Filters)
                {
                    displayName: 'Order Filters',
                    name: 'orderFilters',
                    type: 'collection',
                    placeholder: 'Add filter',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['order'],
                            operation: ['getAll', 'search'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Tag',
                            name: 'tag',
                            type: 'string',
                            default: '',
                            description: 'Filter orders by tag (e.g., "priority", "wholesale")',
                        },
                        {
                            displayName: 'Exclude Tag',
                            name: 'tagNot',
                            type: 'string',
                            default: '',
                            description: 'Exclude orders with this tag',
                        },
                        {
                            displayName: 'Order Status',
                            name: 'status',
                            type: 'options',
                            default: '',
                            description: 'Filter by order status',
                            options: [
                                {
                                    name: 'Any Status',
                                    value: '',
                                },
                                {
                                    name: 'Open',
                                    value: 'open',
                                },
                                {
                                    name: 'Closed',
                                    value: 'closed',
                                },
                                {
                                    name: 'Cancelled',
                                    value: 'cancelled',
                                },
                                {
                                    name: 'Not Closed',
                                    value: 'not_closed',
                                },
                            ],
                        },
                        {
                            displayName: 'Financial Status',
                            name: 'financialStatus',
                            type: 'options',
                            default: '',
                            description: 'Filter by payment status',
                            options: [
                                {
                                    name: 'Any Payment Status',
                                    value: '',
                                },
                                {
                                    name: 'Paid',
                                    value: 'paid',
                                },
                                {
                                    name: 'Pending',
                                    value: 'pending',
                                },
                                {
                                    name: 'Authorized',
                                    value: 'authorized',
                                },
                                {
                                    name: 'Partially Paid',
                                    value: 'partially_paid',
                                },
                                {
                                    name: 'Partially Refunded',
                                    value: 'partially_refunded',
                                },
                                {
                                    name: 'Refunded',
                                    value: 'refunded',
                                },
                                {
                                    name: 'Voided',
                                    value: 'voided',
                                },
                                {
                                    name: 'Expired',
                                    value: 'expired',
                                },
                            ],
                        },
                        {
                            displayName: 'Fulfillment Status',
                            name: 'fulfillmentStatus',
                            type: 'options',
                            default: '',
                            description: 'Filter by shipping/fulfillment status',
                            options: [
                                {
                                    name: 'Any Fulfillment Status',
                                    value: '',
                                },
                                {
                                    name: 'Unfulfilled',
                                    value: 'unfulfilled',
                                },
                                {
                                    name: 'Unshipped',
                                    value: 'unshipped',
                                },
                                {
                                    name: 'Shipped',
                                    value: 'shipped',
                                },
                                {
                                    name: 'Fulfilled',
                                    value: 'fulfilled',
                                },
                                {
                                    name: 'Partial',
                                    value: 'partial',
                                },
                                {
                                    name: 'Scheduled',
                                    value: 'scheduled',
                                },
                                {
                                    name: 'On Hold',
                                    value: 'on_hold',
                                },
                                {
                                    name: 'Request Declined',
                                    value: 'request_declined',
                                },
                            ],
                        },
                        {
                            displayName: 'Order Number',
                            name: 'orderName',
                            type: 'string',
                            default: '',
                            description: 'Filter by order number/name (e.g., "#1001", "1001-A")',
                        },
                        {
                            displayName: 'Customer ID',
                            name: 'customerId',
                            type: 'string',
                            default: '',
                            description: 'Filter by customer ID',
                        },
                        {
                            displayName: 'Customer Email',
                            name: 'customerEmail',
                            type: 'string',
                            default: '',
                            description: 'Filter by customer email address',
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
                        // Get modular UI selections
                        const includeCustomer = this.getNodeParameter('includeCustomer', i, false);
                        const includeLineItems = this.getNodeParameter('includeLineItems', i, false);
                        const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false);
                        const includeAddresses = this.getNodeParameter('includeAddresses', i, false);
                        // Get advanced options
                        const advancedOptions = this.getNodeParameter('ordersAdvancedOptions', i, {});
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
                        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
                        responseData = response.data.order;
                    }
                    else if (operation === 'getAll') {
                        const batchSize = this.getNodeParameter('batchSize', i, 50);
                        const maxItems = this.getNodeParameter('maxItems', i, 0);
                        // Get modular UI selections (same as get operation)
                        const includeCustomer = this.getNodeParameter('includeCustomer', i, false);
                        const includeLineItems = this.getNodeParameter('includeLineItems', i, false);
                        const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false);
                        const includeAddresses = this.getNodeParameter('includeAddresses', i, false);
                        // Get date filtering parameters
                        const createdAfter = this.getNodeParameter('createdAfter', i, '');
                        const createdBefore = this.getNodeParameter('createdBefore', i, '');
                        // Get advanced options
                        const advancedOptions = this.getNodeParameter('ordersAdvancedOptions', i, {});
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
                        // Build date filter query string (Shopify format: created_at:>=YYYY-MM-DD)
                        let queryFilters = [];
                        if (createdAfter) {
                            // Extract date part only (YYYY-MM-DD) from n8n datetime
                            const afterDate = createdAfter.split(' ')[0];
                            queryFilters.push(`created_at:>=${afterDate}`);
                        }
                        if (createdBefore) {
                            // Extract date part only (YYYY-MM-DD) from n8n datetime
                            const beforeDate = createdBefore.split(' ')[0];
                            queryFilters.push(`created_at:<=${beforeDate}`);
                        }
                        // Phase 1: Core Business Filters
                        const orderFilters = this.getNodeParameter('orderFilters', i, {});
                        // Tag filters
                        if (orderFilters.tag) {
                            queryFilters.push(`tag:${orderFilters.tag}`);
                        }
                        if (orderFilters.tagNot) {
                            queryFilters.push(`tag_not:${orderFilters.tagNot}`);
                        }
                        // Status filters
                        if (orderFilters.status) {
                            queryFilters.push(`status:${orderFilters.status}`);
                        }
                        if (orderFilters.financialStatus) {
                            queryFilters.push(`financial_status:${orderFilters.financialStatus}`);
                        }
                        if (orderFilters.fulfillmentStatus) {
                            queryFilters.push(`fulfillment_status:${orderFilters.fulfillmentStatus}`);
                        }
                        // Order identification filters
                        if (orderFilters.orderName) {
                            queryFilters.push(`name:${orderFilters.orderName}`);
                        }
                        if (orderFilters.customerId) {
                            queryFilters.push(`customer_id:${orderFilters.customerId}`);
                        }
                        if (orderFilters.customerEmail) {
                            queryFilters.push(`email:${orderFilters.customerEmail}`);
                        }
                        const queryString = queryFilters.length > 0 ? queryFilters.join(' AND ') : '';
                        // Build GraphQL query with proper variable for query parameter (Claude's fix)
                        const query = `
							query getOrders($first: Int!, $after: String, $query: String) {
								orders(first: $first, after: $after, query: $query) {
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
                        // Pass query string as GraphQL variable (proper n8n/GraphQL pattern)
                        const variables = {};
                        if (queryString) {
                            variables.query = queryString;
                        }
                        responseData = await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'orders', query, variables, batchSize, maxItems);
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
