"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOrders = void 0;
/**
 * Load orders from the Shopify store for dynamic selection
 * Optimized query following research specification (25 items, cost-efficient)
 */
async function loadOrders() {
    var _a, _b, _c;
    try {
        // Optimized query for 25 orders per request (research spec recommendation)
        const query = `
			query OrdersLoadOptions($first: Int = 25) {
				orders(first: $first, sortKey: CREATED_AT, reverse: true) {
					edges {
						node {
							id
							name
							email
							createdAt
							displayFinancialStatus
							displayFulfillmentStatus
							totalPriceSet {
								shopMoney {
									amount
									currencyCode
								}
							}
							customer {
								displayName
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
        if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.orders) === null || _b === void 0 ? void 0 : _b.edges) {
            for (const edge of response.data.orders.edges) {
                const order = edge.node;
                // Status indicators for financial and fulfillment status
                const financialIcon = order.displayFinancialStatus === 'PAID' ? '💰' :
                    order.displayFinancialStatus === 'PENDING' ? '⏳' :
                        order.displayFinancialStatus === 'REFUNDED' ? '↩️' : '❓';
                const fulfillmentIcon = order.displayFulfillmentStatus === 'FULFILLED' ? '📦' :
                    order.displayFulfillmentStatus === 'PARTIAL' ? '📋' :
                        order.displayFulfillmentStatus === 'UNFULFILLED' ? '⏸️' : '❓';
                const customerName = ((_c = order.customer) === null || _c === void 0 ? void 0 : _c.displayName) || order.email || 'Guest';
                const displayName = `${financialIcon}${fulfillmentIcon} ${order.name} - ${customerName}`;
                const description = [
                    `${order.displayFinancialStatus}`,
                    `${order.displayFulfillmentStatus}`,
                    `${order.totalPriceSet.shopMoney.amount} ${order.totalPriceSet.shopMoney.currencyCode}`,
                    `${new Date(order.createdAt).toLocaleDateString()}`
                ].join(' | ');
                options.push({
                    name: displayName,
                    value: order.id,
                    description,
                });
            }
        }
        // Orders are already sorted by creation date (newest first)
        // Add manual entry option for backward compatibility
        options.unshift({
            name: '+ Enter Order ID Manually',
            value: '__manual__',
            description: 'Enter order ID manually if not found in list',
        });
        return options;
    }
    catch (error) {
        // Graceful fallback following research spec error handling
        return [
            {
                name: 'Error loading orders - Check connection',
                value: '__error__',
                description: `${error.message || 'Unknown error'}`,
            },
            {
                name: '+ Enter Order ID Manually',
                value: '__manual__',
                description: 'Enter order ID manually',
            },
        ];
    }
}
exports.loadOrders = loadOrders;
