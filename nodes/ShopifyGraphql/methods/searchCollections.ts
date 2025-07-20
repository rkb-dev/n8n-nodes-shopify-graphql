import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';
import { shopifyGraphqlApiRequest } from '../GenericFunctions';

export async function searchCollections(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const searchTerm = this.getNodeParameter('searchTerm', 0) as string || '';
	
	try {
		// DEBUG: Test credential access first
		let credentials;
		try {
			credentials = await this.getCredentials('shopifyGraphqlApi');
		} catch (credError: any) {
			// Credential access failed - return debug info
			return [
				{
					name: `🚨 CREDENTIAL ERROR: ${credError.message}`,
					value: 'debug_cred_error',
					description: `Context: ${typeof this}, getCredentials: ${typeof this.getCredentials}`,
				},
			];
		}

		// DEBUG: Show credential info (safely)
		if (!credentials || !credentials.shopName || !credentials.accessToken) {
			return [
				{
					name: `🚨 INVALID CREDENTIALS`,
					value: 'debug_invalid_creds',
					description: `shopName: ${!!credentials?.shopName}, token: ${!!credentials?.accessToken}, version: ${credentials?.apiVersion}`,
				},
			];
		}

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

		// DEBUG: Show request details (safely)
		const debugInfo = {
			uri: requestOptions.uri,
			method: requestOptions.method,
			hasToken: !!credentials.accessToken,
			tokenLength: (credentials.accessToken as string)?.length || 0,
			queryLength: query.length,
			variables: variables,
		};

		let response;
		try {
			response = await this.helpers.request(requestOptions);
		} catch (apiError: any) {
			// API request failed - return detailed error info
			return [
				{
					name: `🚨 API ERROR: ${apiError.message || 'Unknown error'}`,
					value: 'debug_api_error',
					description: `Status: ${apiError.status || 'unknown'}, URI: ${debugInfo.uri}`,
				},
				{
					name: `🔍 DEBUG INFO`,
					value: 'debug_info',
					description: `Token: ${debugInfo.hasToken ? 'present' : 'missing'} (${debugInfo.tokenLength} chars), Query: ${debugInfo.queryLength} chars`,
				},
			];
		}
		
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
