import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load metafield definitions from the Shopify store
 * This enables dynamic dropdown selection of existing metafields
 */
export async function loadMetafields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const query = `
			query getMetafieldDefinitions($first: Int!) {
				metafieldDefinitions(first: $first) {
					edges {
						node {
							id
							namespace
							key
							name
							description
							type {
								name
							}
							ownerType
						}
					}
				}
			}
		`;

		const variables = { first: 100 };
		
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

		if (response.data?.metafieldDefinitions?.edges) {
			for (const edge of response.data.metafieldDefinitions.edges) {
				const metafield = edge.node;
				const displayName = metafield.name || `${metafield.namespace}.${metafield.key}`;
				const description = metafield.description 
					? `${metafield.description} (${metafield.type.name})`
					: `Type: ${metafield.type.name}, Owner: ${metafield.ownerType}`;

				options.push({
					name: displayName,
					value: `${metafield.namespace}.${metafield.key}`,
					description,
				});
			}
		}

		// Sort alphabetically by namespace.key
		options.sort((a, b) => String(a.value).localeCompare(String(b.value)));

		// Add option to create new metafield
		options.unshift({
			name: '+ Create New Metafield',
			value: '__create_new__',
			description: 'Create a new metafield definition',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback if metafields can't be loaded
		return [
			{
				name: 'Unable to load metafields',
				value: '__error__',
				description: `Error: ${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Create New Metafield',
				value: '__create_new__',
				description: 'Create a new metafield definition',
			},
		];
	}
}
