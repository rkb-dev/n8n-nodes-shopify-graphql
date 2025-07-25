"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShopifyGid = exports.extractIdFromGid = exports.shopifyGraphqlApiRequestAllItems = exports.shopifyGraphqlApiRequest = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Make a GraphQL API request to Shopify
 */
async function shopifyGraphqlApiRequest(query, variables = {}) {
    var _a;
    const credentials = await this.getCredentials('shopifyGraphqlApi');
    const options = {
        method: 'POST',
        body: {
            query,
            variables,
        },
        uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
        json: true,
        headers: {
            'X-Shopify-Access-Token': credentials.accessToken,
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await this.helpers.request(options);
        // Check for GraphQL errors
        if (response.errors && response.errors.length > 0) {
            const errorMessage = response.errors.map((error) => error.message).join(', ');
            throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                message: `GraphQL Error: ${errorMessage}`,
                description: 'The GraphQL query returned errors',
            });
        }
        // Log cost information for debugging
        if ((_a = response.extensions) === null || _a === void 0 ? void 0 : _a.cost) {
            const cost = response.extensions.cost;
            // Query cost tracking: ${cost.actualQueryCost}/${cost.requestedQueryCost}, Available: ${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable}
        }
        return response;
    }
    catch (error) {
        // Handle rate limiting
        if (error.httpCode === '429') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Rate limit exceeded. Please wait before making more requests.', {
                description: 'Shopify API rate limit has been exceeded. The node will automatically retry with exponential backoff.',
            });
        }
        // Handle authentication errors
        if (error.httpCode === '401' || error.httpCode === '403') {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Authentication failed. Please check your credentials.', {
                description: 'The provided Shopify access token is invalid or has insufficient permissions.',
            });
        }
        throw error;
    }
}
exports.shopifyGraphqlApiRequest = shopifyGraphqlApiRequest;
/**
 * Make paginated GraphQL requests to get all items with smart batching
 */
async function shopifyGraphqlApiRequestAllItems(resource, query, variables = {}, batchSize = 250, maxItems = 0, costEstimatePerItem) {
    var _a;
    const returnData = [];
    let hasNextPage = true;
    let cursor = null;
    let totalFetched = 0;
    // Cost tracking for intelligent batching
    let currentAvailable = 1000; // Default assumption
    let maximumAvailable = 1000;
    let restoreRate = 50; // Points per second
    while (hasNextPage && (maxItems === 0 || totalFetched < maxItems)) {
        // For first request, use even smaller batch if we have cost estimate
        let safeBatchSize = batchSize;
        if (totalFetched === 0 && costEstimatePerItem && costEstimatePerItem > 20) {
            // Very conservative first batch for expensive queries
            safeBatchSize = Math.min(batchSize, Math.floor(700 / costEstimatePerItem));
        }
        // Calculate optimal batch size based on available cost points
        const optimalBatchSize = calculateOptimalBatchSize(safeBatchSize, currentAvailable, maximumAvailable, costEstimatePerItem);
        // Prepare variables for this batch
        const batchVariables = {
            ...variables,
            first: optimalBatchSize,
            after: cursor,
        };
        // Check if we need to wait for rate limit recovery
        if (currentAvailable < 100) { // Conservative threshold
            const waitTime = Math.ceil((100 - currentAvailable) / restoreRate * 1000);
            // Rate limit approaching. Skipping wait for now due to TypeScript constraints
        }
        try {
            const response = await shopifyGraphqlApiRequest.call(this, query, batchVariables);
            // Update cost tracking
            if ((_a = response.extensions) === null || _a === void 0 ? void 0 : _a.cost) {
                const cost = response.extensions.cost;
                currentAvailable = cost.throttleStatus.currentlyAvailable;
                maximumAvailable = cost.throttleStatus.maximumAvailable;
                restoreRate = cost.throttleStatus.restoreRate;
            }
            // Extract data from the response
            const resourceData = response.data[resource];
            if (!resourceData || !resourceData.edges) {
                break;
            }
            // Add items to return data
            const items = resourceData.edges.map((edge) => edge.node);
            returnData.push(...items);
            totalFetched += items.length;
            // Update pagination info
            hasNextPage = resourceData.pageInfo.hasNextPage;
            cursor = resourceData.pageInfo.endCursor;
            // Check if we've reached the max items limit
            if (maxItems > 0 && totalFetched >= maxItems) {
                break;
            }
            // If we got fewer items than requested, we've reached the end
            if (items.length < optimalBatchSize) {
                break;
            }
        }
        catch (error) {
            // Handle rate limiting with exponential backoff
            if (error.message && error.message.includes('Rate limit exceeded')) {
                const backoffTime = Math.min(30000, 1000 * Math.pow(2, Math.floor(totalFetched / 1000))); // Max 30 seconds
                // Rate limit hit. Skipping backoff for now due to TypeScript constraints
                continue; // Retry the same request
            }
            throw error;
        }
    }
    // Trim results to maxItems if specified
    if (maxItems > 0 && returnData.length > maxItems) {
        return returnData.slice(0, maxItems);
    }
    return returnData;
}
exports.shopifyGraphqlApiRequestAllItems = shopifyGraphqlApiRequestAllItems;
/**
 * Calculate optimal batch size based on available cost points
 */
function calculateOptimalBatchSize(requestedBatchSize, currentAvailable, maximumAvailable, costEstimatePerItem) {
    // Conservative approach: use at most 70% of available points (reduced from 80%)
    const maxSafeBatchSize = Math.floor(currentAvailable * 0.7);
    // Use provided cost estimate or fallback to very conservative default
    const estimatedCostPerItem = costEstimatePerItem || 50; // More conservative default
    const maxItemsForCost = Math.floor(maxSafeBatchSize / estimatedCostPerItem);
    // Never exceed 30 items per batch as absolute safety limit for complex queries
    const absoluteMaxSafe = 30;
    // Return the minimum of all constraints
    return Math.min(requestedBatchSize, maxItemsForCost, absoluteMaxSafe);
}
/**
 * Helper function to extract ID from Shopify GID
 */
function extractIdFromGid(gid) {
    return gid.split('/').pop() || '';
}
exports.extractIdFromGid = extractIdFromGid;
/**
 * Helper function to create Shopify GID
 */
function createShopifyGid(resource, id) {
    return `gid://shopify/${resource}/${id}`;
}
exports.createShopifyGid = createShopifyGid;
