import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load unique product types from the Shopify store for dynamic selection
 * Aggregates all product types used in the store for categorization
 */
export async function loadProductTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Query for products to extract unique product types
		const query = `
			query ProductTypesLoadOptions($first: Int = 250) {
				products(first: $first) {
					edges {
						node {
							id
							productType
						}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		`;

		const variables = { first: 250 };
		
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

		const productTypes = new Set<string>();
		const typeCounts = new Map<string, number>();

		if (response.data?.products?.edges) {
			for (const edge of response.data.products.edges) {
				const product = edge.node;
				if (product.productType && product.productType.trim()) {
					const type = product.productType.trim();
					productTypes.add(type);
					typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
				}
			}
		}

		const options: INodePropertyOptions[] = [];

		// Convert to options with product counts
		for (const type of Array.from(productTypes).sort()) {
			const count = typeCounts.get(type) || 0;
			const displayName = `📂 ${type}`;
			const description = `${count} product${count !== 1 ? 's' : ''} in this category`;

			options.push({
				name: displayName,
				value: type,
				description,
			});
		}

		// Add custom entry option
		options.unshift({
			name: '+ Enter Custom Product Type',
			value: '__custom__',
			description: 'Enter a new product type not in the list',
		});

		// Add empty option for no product type
		options.unshift({
			name: '(No Product Type)',
			value: '',
			description: 'Leave product type empty',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback following research spec error handling
		return [
			{
				name: 'Error loading product types - Check connection',
				value: '__error__',
				description: `${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Enter Custom Product Type',
				value: '__custom__',
				description: 'Enter product type manually',
			},
		];
	}
}
