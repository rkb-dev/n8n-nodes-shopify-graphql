import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Search products from the Shopify store with advanced filtering
 * Implements Google Sheets-style searchable dropdown with large dataset support
 * 
 * @param this ILoadOptionsFunctions context
 * @returns Promise<INodePropertyOptions[]> Formatted product options for resourceLocator
 */
export async function searchProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Get search term from n8n's search input
		const searchTerm = this.getCurrentNodeParameter('search') as string || '';
		
		// Limit results for performance (Google Sheets pattern)
		const limit = 50;
		
		// Build GraphQL query with search capabilities
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
							totalInventory
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
		
		// Build search query string for Shopify GraphQL
		let shopifyQuery = '';
		if (searchTerm.trim()) {
			// Search across title, handle, vendor, and product type
			shopifyQuery = `title:*${searchTerm}* OR handle:*${searchTerm}* OR vendor:*${searchTerm}* OR product_type:*${searchTerm}*`;
		}
		
		const variables = {
			query: shopifyQuery,
			first: limit,
		};
		
		// Use the correct API request pattern from GenericFunctions
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
		
		// Handle API errors
		if (response.errors) {
			throw new Error(`Shopify API Error: ${response.errors.map((e: any) => e.message).join(', ')}`);
		}
		
		const products = response.data?.products?.edges || [];
		
		// Transform to n8n option format
		const options: INodePropertyOptions[] = products.map((edge: any) => {
			const product = edge.node;
			
			// Create descriptive display name
			let displayName = product.title;
			if (product.vendor) {
				displayName += ` (${product.vendor})`;
			}
			
			// Add status indicator
			const statusIndicator = product.status === 'ACTIVE' ? '🟢' : 
									product.status === 'DRAFT' ? '🟡' : '🔴';
			
			return {
				name: `${statusIndicator} ${displayName}`,
				value: product.id, // Already in GID format from GraphQL
				description: `Handle: ${product.handle} | Type: ${product.productType || 'N/A'} | Status: ${product.status}`,
			};
		});
		
		// Add helpful message if no results found
		if (options.length === 0 && searchTerm.trim()) {
			return [{
				name: `No products found for "${searchTerm}"`,
				value: '',
				description: 'Try refining your search or check spelling',
			}];
		}
		
		// Add search instruction if no search term provided
		if (options.length === 0 && !searchTerm.trim()) {
			return [{
				name: 'Start typing to search products...',
				value: '',
				description: 'Search by product title, handle, vendor, or type',
			}];
		}
		
		return options;
		
	} catch (error: any) {
		// Comprehensive error handling following research patterns
		if (error?.statusCode === 401) {
			throw new Error('Shopify authentication failed. Please check your API credentials.');
		}
		
		if (error?.statusCode === 429) {
			throw new Error('Shopify API rate limit exceeded. Please wait before retrying.');
		}
		
		if (error?.statusCode === 403) {
			throw new Error('Insufficient permissions. Please ensure your Shopify app has read_products scope.');
		}
		
		// Generic error with helpful context
		throw new Error(`Failed to search products: ${error?.message || 'Unknown error'}`);
	}
}
