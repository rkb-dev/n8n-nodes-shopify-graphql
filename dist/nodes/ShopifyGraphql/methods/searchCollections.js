"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCollections = void 0;
async function searchCollections() {
    var _a, _b, _c;
    const searchTerm = this.getNodeParameter('searchTerm', 0) || '';
    try {
        // DEBUG: Test credential access first
        let credentials;
        try {
            credentials = await this.getCredentials('shopifyGraphqlApi');
        }
        catch (credError) {
            // Credential access failed - return debug info
            return [
                {
                    name: `🚨 CREDENTIAL ERROR: ${credError.message}`,
                    value: 'debug_cred_error',
                    description: `Context: ${typeof this}, getCredentials: ${typeof this.getCredentials}`,
                },
            ];
        }
        // DEBUG: Show credential info (safely)
        if (!credentials || !credentials.shopName || !credentials.accessToken) {
            return [
                {
                    name: `🚨 INVALID CREDENTIALS`,
                    value: 'debug_invalid_creds',
                    description: `shopName: ${!!(credentials === null || credentials === void 0 ? void 0 : credentials.shopName)}, token: ${!!(credentials === null || credentials === void 0 ? void 0 : credentials.accessToken)}, version: ${credentials === null || credentials === void 0 ? void 0 : credentials.apiVersion}`,
                },
            ];
        }
        // GraphQL query to search collections with optional search term
        const query = `
			query getCollections($first: Int!, $query: String) {
				collections(first: $first, query: $query) {
					edges {
						node {
							id
							title
							handle
							productsCount
							updatedAt
						}
					}
				}
			}
		`;
        const variables = {
            first: 50,
            query: searchTerm ? `title:*${searchTerm}* OR handle:*${searchTerm}*` : undefined,
        };
        // Use the same working direct API request pattern as loadProducts
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
        // DEBUG: Show request details (safely)
        const debugInfo = {
            uri: requestOptions.uri,
            method: requestOptions.method,
            hasToken: !!credentials.accessToken,
            tokenLength: ((_a = credentials.accessToken) === null || _a === void 0 ? void 0 : _a.length) || 0,
            queryLength: query.length,
            variables: variables,
        };
        let response;
        try {
            response = await this.helpers.request(requestOptions);
        }
        catch (apiError) {
            // API request failed - return detailed error info
            return [
                {
                    name: `🚨 API ERROR: ${apiError.message || 'Unknown error'}`,
                    value: 'debug_api_error',
                    description: `Status: ${apiError.status || 'unknown'}, URI: ${debugInfo.uri}`,
                },
                {
                    name: `🔍 DEBUG INFO`,
                    value: 'debug_info',
                    description: `Token: ${debugInfo.hasToken ? 'present' : 'missing'} (${debugInfo.tokenLength} chars), Query: ${debugInfo.queryLength} chars`,
                },
            ];
        }
        if (!((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.collections) === null || _c === void 0 ? void 0 : _c.edges)) {
            return [];
        }
        const collections = response.data.collections.edges.map((edge) => {
            const collection = edge.node;
            const id = collection.id.replace('gid://shopify/Collection/', '');
            return {
                name: `${collection.title} (${collection.productsCount} products)`,
                value: id,
                description: `Handle: ${collection.handle} | Updated: ${new Date(collection.updatedAt).toLocaleDateString()}`,
            };
        });
        // Sort by title for better UX
        collections.sort((a, b) => a.name.localeCompare(b.name));
        return collections;
    }
    catch (error) {
        // Error loading collections for search
        return [
            {
                name: 'Error loading collections',
                value: '',
                description: 'Please check your Shopify credentials and permissions',
            },
        ];
    }
}
exports.searchCollections = searchCollections;
