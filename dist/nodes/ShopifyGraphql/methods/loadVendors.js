"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadVendors = void 0;
/**
 * Load unique vendors from the Shopify store for dynamic selection
 * Aggregates all vendors used in the store for product management
 */
async function loadVendors() {
    var _a, _b;
    try {
        // Query for products to extract unique vendors
        const query = `
			query VendorsLoadOptions($first: Int = 250) {
				products(first: $first) {
					edges {
						node {
							id
							vendor
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
        const vendors = new Set();
        const vendorCounts = new Map();
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.edges) {
            for (const edge of response.data.products.edges) {
                const product = edge.node;
                if (product.vendor && product.vendor.trim()) {
                    const vendor = product.vendor.trim();
                    vendors.add(vendor);
                    vendorCounts.set(vendor, (vendorCounts.get(vendor) || 0) + 1);
                }
            }
        }
        const options = [];
        // Convert to options with product counts
        for (const vendor of Array.from(vendors).sort()) {
            const count = vendorCounts.get(vendor) || 0;
            const displayName = `🏢 ${vendor}`;
            const description = `${count} product${count !== 1 ? 's' : ''} from this vendor`;
            options.push({
                name: displayName,
                value: vendor,
                description,
            });
        }
        // Add custom entry option
        options.unshift({
            name: '+ Enter Custom Vendor',
            value: '__custom__',
            description: 'Enter a new vendor name not in the list',
        });
        // Add empty option for no vendor
        options.unshift({
            name: '(No Vendor)',
            value: '',
            description: 'Leave vendor field empty',
        });
        return options;
    }
    catch (error) {
        // Graceful fallback following research spec error handling
        return [
            {
                name: 'Error loading vendors - Check connection',
                value: '__error__',
                description: `${error.message || 'Unknown error'}`,
            },
            {
                name: '+ Enter Custom Vendor',
                value: '__custom__',
                description: 'Enter vendor name manually',
            },
        ];
    }
}
exports.loadVendors = loadVendors;
