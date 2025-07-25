import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load locations from the Shopify store for dynamic selection
 * Optimized query following research specification (all locations, typically <20)
 */
export async function loadLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Load all locations (typically small number per store)
		const query = `
			query LocationsLoadOptions($first: Int = 50) {
				locations(first: $first, includeInactive: false) {
					edges {
						node {
							id
							name
							isActive
							address {
								formatted
								city
								provinceCode
								countryCode
							}
							fulfillsOnlineOrders
							hasInventory
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

		if (response.data?.locations?.edges) {
			for (const edge of response.data.locations.edges) {
				const location = edge.node;
				
				// Only include active locations
				if (!location.isActive) continue;
				
				// Location type indicators
				const onlineIcon = location.fulfillsOnlineOrders ? '🌐' : '🏪';
				const inventoryIcon = location.hasInventory ? '📦' : '📋';
				
				const displayName = `${onlineIcon}${inventoryIcon} ${location.name}`;
				
				const description = [
					location.address?.city && location.address?.provinceCode 
						? `${location.address.city}, ${location.address.provinceCode}`
						: location.address?.countryCode || 'Location',
					location.fulfillsOnlineOrders ? 'Online Orders' : 'In-Store Only',
					location.hasInventory ? 'Has Inventory' : 'No Inventory'
				].join(' | ');

				options.push({
					name: displayName,
					value: location.id,
					description,
				});
			}
		}

		// Sort by name for better UX
		options.sort((a, b) => a.name.localeCompare(b.name));

		// Add manual entry option for backward compatibility
		options.unshift({
			name: '+ Enter Location ID Manually',
			value: '__manual__',
			description: 'Enter location ID manually if not found in list',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback following research spec error handling
		return [
			{
				name: 'Error loading locations - Check connection',
				value: '__error__',
				description: `${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Enter Location ID Manually',
				value: '__manual__',
				description: 'Enter location ID manually',
			},
		];
	}
}
