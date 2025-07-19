"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMetafields = void 0;
/**
 * Load metafield definitions from the Shopify store
 * This enables dynamic dropdown selection of existing metafields
 */
async function loadMetafields() {
    var _a, _b;
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
        // Use the correct API request method for loadOptions
        const credentials = await this.getCredentials('shopifyGraphqlApi');
        const response = await this.helpers.requestWithAuthentication.call(this, 'shopifyGraphqlApi', {
            method: 'POST',
            url: `https://${credentials.shopDomain}.myshopify.com/admin/api/2024-01/graphql.json`,
            body: { query, variables },
            headers: { 'Content-Type': 'application/json' },
            json: true,
        });
        const options = [];
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.metafieldDefinitions) === null || _b === void 0 ? void 0 : _b.edges) {
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
    }
    catch (error) {
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
exports.loadMetafields = loadMetafields;
