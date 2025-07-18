"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadProducts = void 0;
/**
 * Load products from the Shopify store for dynamic selection
 * Optimized query following research specification (25 items, cost-efficient)
 */
async function loadProducts() {
    var _a, _b;
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
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.edges) {
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
    }
    catch (error) {
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
exports.loadProducts = loadProducts;
