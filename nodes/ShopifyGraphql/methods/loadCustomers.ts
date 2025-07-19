import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load customers from the Shopify store for dynamic selection
 * Useful for order filtering, customer relationships, etc.
 */
export async function loadCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Optimized query for 50 customers (research spec recommendation)
		const query = `
			query CustomersLoadOptions($first: Int = 50) {
				customers(first: $first, sortKey: UPDATED_AT, reverse: true) {
					edges {
						node {
							id
							displayName
							email
							phone
							state
							createdAt
							ordersCount
						}
					}
				}
			}
		`;

		const variables = { first: 50 }; // Research spec: 50 customers optimal
		
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

		if (response.data?.customers?.edges) {
			for (const edge of response.data.customers.edges) {
				const customer = edge.node;
				const stateIcon = customer.state === 'ENABLED' ? '✅' : 
								 customer.state === 'DISABLED' ? '❌' : '⚠️';
				
				const displayName = `${stateIcon} ${customer.displayName || customer.email}`;
				const description = [
					customer.email && `Email: ${customer.email}`,
					customer.phone && `Phone: ${customer.phone}`,
					`Orders: ${customer.ordersCount || 0}`,
					`State: ${customer.state}`
				].filter(Boolean).join(' | ');

				options.push({
					name: displayName,
					value: customer.id,
					description,
				});
			}
		}

		// Sort by display name
		options.sort((a, b) => a.name.localeCompare(b.name));

		return options;
	} catch (error: any) {
		// Graceful fallback if customers can't be loaded
		return [
			{
				name: 'Unable to load customers',
				value: '__error__',
				description: `Error: ${error.message || 'Unknown error'}`,
			},
		];
	}
}
