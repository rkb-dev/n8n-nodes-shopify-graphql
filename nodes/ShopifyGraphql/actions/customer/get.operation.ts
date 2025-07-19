import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shopifyGraphqlApiRequest, shopifyGraphqlApiRequestAllItems } from '../../GenericFunctions';

export const description: INodeProperties[] = [
	// Customer ID field for get operation
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

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
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
		return response.data.customer;
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
		return await shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, {}, batchSize, maxItems);
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
		return await shopifyGraphqlApiRequestAllItems.call(this, 'customers', query, { query: searchQuery }, batchSize, maxItems);
	}
	
	throw new Error(`Unknown customer operation: ${operation}`);
}
