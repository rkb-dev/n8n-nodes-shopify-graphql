import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';
import { shopifyGraphqlApiRequest } from '../GenericFunctions';

export async function searchCollections(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const searchTerm = this.getNodeParameter('searchTerm', 0) as string || '';
	
	try {
		// GraphQL query to search collections with optional search term
		const query = `
			query getCollections($first: Int!, $query: String) {
				collections(first: $first, query: $query) {
					edges {
						node {
							id
							title
							handle
							productsCount
							updatedAt
						}
					}
				}
			}
		`;

		const variables = {
			first: 50, // Limit results for performance
			query: searchTerm ? `title:*${searchTerm}* OR handle:*${searchTerm}*` : undefined,
		};

		// Use the same working direct API request pattern as loadProducts
		const credentials = await this.getCredentials('shopifyGraphqlApi');
		const requestOptions: IRequestOptions = {
			method: 'POST' as IHttpRequestMethods,
			body: { query, variables },
			uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
			json: true,
			headers: {
				'X-Shopify-Access-Token': credentials.accessToken,
				'Content-Type': 'application/json',
			},
		};
		const response = await this.helpers.request(requestOptions);
		
		if (!response.data?.collections?.edges) {
			return [];
		}

		const collections = response.data.collections.edges.map((edge: any) => {
			const collection = edge.node;
			const id = collection.id.replace('gid://shopify/Collection/', '');
			
			return {
				name: `${collection.title} (${collection.productsCount} products)`,
				value: id,
				description: `Handle: ${collection.handle} | Updated: ${new Date(collection.updatedAt).toLocaleDateString()}`,
			};
		});

		// Sort by title for better UX
		collections.sort((a: any, b: any) => a.name.localeCompare(b.name));

		return collections;
		
	} catch (error) {
		// Error loading collections for search
		return [
			{
				name: 'Error loading collections',
				value: '',
				description: 'Please check your Shopify credentials and permissions',
			},
		];
	}
}
