import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load products from the Shopify store for dynamic selection
 * Optimized query following research specification (25 items, cost-efficient)
 */
export async function loadProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Optimized query for 25 items per request (research spec recommendation)
		const query = `
			query ProductsLoadOptions($first: Int = 25) {
				products(first: $first, query: "status:active") {
					edges {
						node {
							id
							title
							handle
							status
							productType
							vendor
							featuredImage {
								url(transform: { maxWidth: 50, maxHeight: 50 })
							}
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`;

		const variables = { first: 25 };
		
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

		if (response.data?.products?.edges) {
			for (const edge of response.data.products.edges) {
				const product = edge.node;
				const statusIcon = product.status === 'ACTIVE' ? '✅' : 
								 product.status === 'DRAFT' ? '📝' : '📦';
				
				const displayName = `${statusIcon} ${product.title}`;
				const description = [
					product.productType && `${product.productType}`,
					product.vendor && `by ${product.vendor}`,
					`Handle: ${product.handle}`
				].filter(Boolean).join(' | ');

				options.push({
					name: displayName,
					value: product.id,
					description,
				});
			}
		}

		// Sort by title for better UX
		options.sort((a, b) => a.name.localeCompare(b.name));

		// Add manual entry option for backward compatibility
		options.unshift({
			name: '+ Enter Product ID Manually',
			value: '__manual__',
			description: 'Enter product ID manually if not found in list',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback following research spec error handling
		return [
			{
				name: 'Error loading products - Check connection',
				value: '__error__',
				description: `${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Enter Product ID Manually',
				value: '__manual__',
				description: 'Enter product ID manually',
			},
		];
	}
}
