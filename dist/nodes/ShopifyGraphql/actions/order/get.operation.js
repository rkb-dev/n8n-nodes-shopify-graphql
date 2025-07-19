"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
const order_filters_1 = require("./order.filters");
const order_filtering_1 = require("./order.filtering");
exports.description = [
    // Order ID field for get operation
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
    // Modular UI toggles for data inclusion
    {
        displayName: 'Include Customer Information',
        name: 'includeCustomer',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['get', 'getAll'],
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
                operation: ['get', 'getAll'],
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
                operation: ['get', 'getAll'],
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
                operation: ['get', 'getAll'],
            },
        },
        description: 'Include billing and shipping addresses',
    },
    // Batch size for getAll operation
    {
        displayName: 'Batch Size',
        name: 'batchSize',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['getAll'],
            },
        },
        default: 50,
        description: 'Number of orders to fetch per batch (max 250)',
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
                resource: ['order'],
                operation: ['getAll'],
            },
        },
        default: 0,
        description: 'Maximum number of orders to return (0 = no limit)',
        typeOptions: {
            minValue: 0,
        },
    },
    // Date filtering parameters
    {
        displayName: 'Created After',
        name: 'createdAfter',
        type: 'dateTime',
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['getAll'],
            },
        },
        default: '',
        description: 'Filter orders created after this date/time',
    },
    {
        displayName: 'Created Before',
        name: 'createdBefore',
        type: 'dateTime',
        displayOptions: {
            show: {
                resource: ['order'],
                operation: ['getAll'],
            },
        },
        default: '',
        description: 'Filter orders created before this date/time',
    },
    // Order Filters Collection (Phase 1-3 filters)
    order_filters_1.orderFiltersCollection,
    // Advanced Options Collection
    order_filters_1.ordersAdvancedOptionsCollection,
];
async function execute(operation, i) {
    if (operation === 'get') {
        const orderId = this.getNodeParameter('orderId', i);
        // Get modular UI selections
        const includeCustomer = this.getNodeParameter('includeCustomer', i, false);
        const includeLineItems = this.getNodeParameter('includeLineItems', i, false);
        const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false);
        const includeAddresses = this.getNodeParameter('includeAddresses', i, false);
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
				lineItems(first: 250) {
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
					address1
					address2
					city
					province
					country
					zip
					firstName
					lastName
					phone
				}
				billingAddress {
					address1
					address2
					city
					province
					country
					zip
					firstName
					lastName
					phone
				}`;
        }
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
					}${customerFragment}${lineItemsFragment}${taxFragment}${addressesFragment}
				}
			}
		`;
        const variables = { id: `gid://shopify/Order/${orderId}` };
        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
        return response.data.order;
    }
    else if (operation === 'getAll') {
        const batchSize = this.getNodeParameter('batchSize', i, 50);
        const maxItems = this.getNodeParameter('maxItems', i, 0);
        // Get modular UI selections
        const includeCustomer = this.getNodeParameter('includeCustomer', i, false);
        const includeLineItems = this.getNodeParameter('includeLineItems', i, false);
        const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false);
        const includeAddresses = this.getNodeParameter('includeAddresses', i, false);
        // Build the same dynamic fragments (reuse logic from get operation)
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
				lineItems(first: 250) {
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
					address1
					address2
					city
					province
					country
					zip
					firstName
					lastName
					phone
				}
				billingAddress {
					address1
					address2
					city
					province
					country
					zip
					firstName
					lastName
					phone
				}`;
        }
        // Build query filters using extracted filtering logic
        const queryString = (0, order_filtering_1.buildOrderQueryFilters)(this, i);
        // Build GraphQL query with dynamic fragments and filtering
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
							}${customerFragment}${lineItemsFragment}${taxFragment}${addressesFragment}
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
        return await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'orders', query, variables, batchSize, maxItems);
    }
    throw new Error(`Unknown order operation: ${operation}`);
}
exports.execute = execute;
