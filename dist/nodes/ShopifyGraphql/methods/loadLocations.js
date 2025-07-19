"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLocations = void 0;
/**
 * Load locations from the Shopify store for dynamic selection
 * Optimized query following research specification (all locations, typically <20)
 */
async function loadLocations() {
    var _a, _b, _c, _d, _e;
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
        const requestOptions = {
            method: 'POST',
            body: { query, variables },
            uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
            json: true,
            headers: {
                'X-Shopify-Access-Token': credentials.accessToken,
                'Content-Type': 'application/json',
            },
        };
        const response = await this.helpers.request(requestOptions);
        const options = [];
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.locations) === null || _b === void 0 ? void 0 : _b.edges) {
            for (const edge of response.data.locations.edges) {
                const location = edge.node;
                // Only include active locations
                if (!location.isActive)
                    continue;
                // Location type indicators
                const onlineIcon = location.fulfillsOnlineOrders ? '🌐' : '🏪';
                const inventoryIcon = location.hasInventory ? '📦' : '📋';
                const displayName = `${onlineIcon}${inventoryIcon} ${location.name}`;
                const description = [
                    ((_c = location.address) === null || _c === void 0 ? void 0 : _c.city) && ((_d = location.address) === null || _d === void 0 ? void 0 : _d.provinceCode)
                        ? `${location.address.city}, ${location.address.provinceCode}`
                        : ((_e = location.address) === null || _e === void 0 ? void 0 : _e.countryCode) || 'Location',
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
    }
    catch (error) {
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
exports.loadLocations = loadLocations;
