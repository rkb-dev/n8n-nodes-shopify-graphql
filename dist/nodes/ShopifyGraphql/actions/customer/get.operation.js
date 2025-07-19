"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
exports.description = [
    // Customer selection with dynamic loading
    {
        displayName: 'Customer',
        name: 'customerId',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'loadCustomers',
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'Select customer from your Shopify store',
    },
    // Search Query field for search operation
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
        description: 'Search query to find customers (e.g., email:john@example.com, first_name:John)',
    },
    // Batch size for getAll and search operations
    {
        displayName: 'Batch Size',
        name: 'batchSize',
        type: 'number',
        displayOptions: {
            show: {
                resource: ['customer'],
                operation: ['getAll', 'search'],
            },
        },
        default: 50,
        description: 'Number of customers to fetch per batch (max 250)',
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
                resource: ['customer'],
                operation: ['getAll', 'search'],
            },
        },
        default: 0,
        description: 'Maximum number of customers to return (0 = no limit)',
        typeOptions: {
            minValue: 0,
        },
    },
];
async function execute(operation, i) {
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
        return response.data.customer;
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
        return await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, {}, batchSize, maxItems);
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
        return await GenericFunctions_1.shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, { query: searchQuery }, batchSize, maxItems);
    }
    throw new Error(`Unknown customer operation: ${operation}`);
}
exports.execute = execute;
