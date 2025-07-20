"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCollections = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
async function searchCollections() {
    var _a, _b;
    const searchTerm = this.getNodeParameter('searchTerm', 0) || '';
    try {
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
        const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, query, variables);
        if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.collections) === null || _b === void 0 ? void 0 : _b.edges)) {
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
