import type { INodeProperties, IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { shopifyGraphqlApiRequest, shopifyGraphqlApiRequestAllItems } from '../../GenericFunctions';
import { orderFiltersCollection, ordersAdvancedOptionsCollection } from './order.filters';
import { buildOrderQueryFilters } from './order.filtering';

export const description: INodeProperties[] = [
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
	orderFiltersCollection,
	// Advanced Options Collection
	ordersAdvancedOptionsCollection,
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'get') {
		const orderId = this.getNodeParameter('orderId', i) as string;
		
		// Get modular UI selections
		const includeCustomer = this.getNodeParameter('includeCustomer', i, false) as boolean;
		const includeLineItems = this.getNodeParameter('includeLineItems', i, false) as boolean;
		const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false) as boolean;
		const includeAddresses = this.getNodeParameter('includeAddresses', i, false) as boolean;
		
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
		const response = await shopifyGraphqlApiRequest.call(this, query, variables);
		return response.data.order;
		
	} else if (operation === 'getAll') {
		const batchSize = this.getNodeParameter('batchSize', i, 50) as number;
		const maxItems = this.getNodeParameter('maxItems', i, 0) as number;
		
		// Get modular UI selections
		const includeCustomer = this.getNodeParameter('includeCustomer', i, false) as boolean;
		const includeLineItems = this.getNodeParameter('includeLineItems', i, false) as boolean;
		const includeTaxDetails = this.getNodeParameter('includeTaxDetails', i, false) as boolean;
		const includeAddresses = this.getNodeParameter('includeAddresses', i, false) as boolean;
		
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
		const queryString = buildOrderQueryFilters(this, i);
		
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
		return await shopifyGraphqlApiRequestAllItems.call(this, 'orders', query, variables, batchSize, maxItems);
	}
	
	throw new Error(`Unknown order operation: ${operation}`);
}
