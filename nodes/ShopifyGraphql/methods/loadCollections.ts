import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load collections from the Shopify store for dynamic selection
 * Optimized query following research specification (50 items, cost-efficient)
 */
export async function loadCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Optimized query for 50 collections per request (research spec recommendation)
		const query = `
			query CollectionsLoadOptions($first: Int = 50) {
				collections(first: $first, sortKey: TITLE) {
					edges {
						node {
							id
							title
							handle
							productsCount
							sortOrder
							description
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

		const variables = { first: 50 };
		
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

		const options: INodePropertyOptions[] = [];

		if (response.data?.collections?.edges) {
			for (const edge of response.data.collections.edges) {
				const collection = edge.node;
				
				// Collection type indicator based on sort order
				const typeIcon = collection.sortOrder === 'MANUAL' ? '📋' : 
								collection.sortOrder === 'BEST_SELLING' ? '🔥' : 
								collection.sortOrder === 'CREATED' ? '🆕' : 
								collection.sortOrder === 'PRICE' ? '💰' : '📚';
				
				const displayName = `${typeIcon} ${collection.title}`;
				
				const description = [
					`${collection.productsCount} products`,
					`Sort: ${collection.sortOrder}`,
					`Handle: ${collection.handle}`
				].join(' | ');

				options.push({
					name: displayName,
					value: collection.id,
					description,
				});
			}
		}

		// Sort by title for better UX (already sorted by API)
		
		// Add manual entry option for backward compatibility
		options.unshift({
			name: '+ Enter Collection ID Manually',
			value: '__manual__',
			description: 'Enter collection ID manually if not found in list',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback following research spec error handling
		return [
			{
				name: 'Error loading collections - Check connection',
				value: '__error__',
				description: `${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Enter Collection ID Manually',
				value: '__manual__',
				description: 'Enter collection ID manually',
			},
		];
	}
}
