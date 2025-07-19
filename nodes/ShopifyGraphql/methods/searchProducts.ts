import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Search products for resourceLocator dropdown with proper n8n patterns
 * Implements Shopify GraphQL pagination and search as per research brief
 * 
 * @param this ILoadOptionsFunctions context from n8n framework
 * @returns Promise<INodePropertyOptions[]> Formatted options for resourceLocator
 */
export async function searchProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Get search filter from resourceLocator using correct n8n pattern
		const filter = this.getCurrentNodeParameter('filter') as string || '';
		
		// Implement proper pagination as per research brief
		const limit = 50; // Shopify recommended batch size
		
		// Build GraphQL query with proper pagination pattern
		const query = `
			query searchProducts($query: String, $first: Int) {
				products(query: $query, first: $first, sortKey: UPDATED_AT, reverse: true) {
					edges {
						node {
							id
							title
							handle
							status
							vendor
							productType
							createdAt
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`;
		
		// Build Shopify search query with proper syntax
		let shopifyQuery = '';
		if (filter.trim()) {
			// Use Shopify's search syntax as per research brief
			shopifyQuery = `title:*${filter}* OR handle:*${filter}* OR vendor:*${filter}*`;
		}
		
		const variables = {
			query: shopifyQuery || undefined, // Don't send empty string
			first: limit,
		};
		
		// Use proper n8n API request pattern
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
		
		// Critical: Check for GraphQL errors even on 200 OK (research brief requirement)
		if (response.errors && response.errors.length > 0) {
			throw new Error(`Shopify GraphQL Error: ${response.errors.map((e: any) => e.message).join(', ')}`);
		}
		
		const products = response.data?.products?.edges || [];
		
		// Transform to exact INodePropertyOptions format expected by n8n
		const options: INodePropertyOptions[] = products.map((edge: any) => {
			const product = edge.node;
			
			// Create clear display name with vendor context
			let displayName = product.title;
			if (product.vendor && product.vendor !== product.title) {
				displayName += ` (${product.vendor})`;
			}
			
			// Add visual status indicator
			const statusIcon = product.status === 'ACTIVE' ? '🟢' : 
							   product.status === 'DRAFT' ? '🟡' : '🔴';
			
			return {
				name: `${statusIcon} ${displayName}`,
				value: product.id, // GID format from Shopify GraphQL
				description: `${product.handle} | ${product.productType || 'No type'} | ${product.status}`,
			};
		});
		
		// Handle empty results with helpful messages
		if (options.length === 0) {
			if (filter.trim()) {
				return [{
					name: `No products found for "${filter}"`,
					value: '',
					description: 'Try a different search term or check spelling',
				}];
			} else {
				return [{
					name: 'No products found in store',
					value: '',
					description: 'Your Shopify store has no products',
				}];
			}
		}
		
		return options;
		
	} catch (error: any) {
		// Implement comprehensive error handling as per research brief
		if (error?.statusCode === 401) {
			return [{
				name: '🔒 Authentication Error',
				value: '',
				description: 'Check your Shopify API credentials',
			}];
		}
		
		if (error?.statusCode === 403) {
			return [{
				name: '🚫 Permission Error', 
				value: '',
				description: 'Shopify app needs read_products scope',
			}];
		}
		
		if (error?.statusCode === 429) {
			return [{
				name: '⏱️ Rate Limited',
				value: '',
				description: 'Too many requests, please wait',
			}];
		}
		
		// Generic error with context
		return [{
			name: '❌ Error loading products',
			value: '',
			description: `${error?.message || 'Unknown error occurred'}`,
		}];
	}
}
