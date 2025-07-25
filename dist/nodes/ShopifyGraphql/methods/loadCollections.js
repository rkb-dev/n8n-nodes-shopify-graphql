"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCollections = void 0;
/**
 * Load collections from the Shopify store for dynamic selection
 * Optimized query following research specification (50 items, cost-efficient)
 */
async function loadCollections() {
    var _a, _b;
    try {
        // Standard query for loading all collections (no search filtering at method level)
        const query = `
			query CollectionsLoadOptions($first: Int!) {
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
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.collections) === null || _b === void 0 ? void 0 : _b.edges) {
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
    }
    catch (error) {
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
exports.loadCollections = loadCollections;
