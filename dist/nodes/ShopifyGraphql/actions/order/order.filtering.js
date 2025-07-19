"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderQueryFilters = void 0;
/**
 * Build order query filters from user parameters
 * Extracted from monolithic version - handles all Phase 1-3 filters
 */
function buildOrderQueryFilters(executeFunctions, itemIndex) {
    const queryFilters = [];
    // Get date filtering parameters (top-level fields)
    const createdAfter = executeFunctions.getNodeParameter('createdAfter', itemIndex, '');
    const createdBefore = executeFunctions.getNodeParameter('createdBefore', itemIndex, '');
    // Date filters (created_at)
    if (createdAfter) {
        const afterDate = createdAfter.split('T')[0]; // Convert to YYYY-MM-DD format
        queryFilters.push(`created_at:>=${afterDate}`);
    }
    if (createdBefore) {
        const beforeDate = createdBefore.split('T')[0]; // Convert to YYYY-MM-DD format
        queryFilters.push(`created_at:<=${beforeDate}`);
    }
    // Get order filters collection
    const orderFilters = executeFunctions.getNodeParameter('orderFilters', itemIndex, {});
    // Phase 1: Core Business Filters
    // Tag filters
    if (orderFilters.tag) {
        queryFilters.push(`tag:${orderFilters.tag}`);
    }
    if (orderFilters.tagNot) {
        queryFilters.push(`tag_not:${orderFilters.tagNot}`);
    }
    // Status filters
    if (orderFilters.status) {
        queryFilters.push(`status:${orderFilters.status}`);
    }
    if (orderFilters.financialStatus) {
        queryFilters.push(`financial_status:${orderFilters.financialStatus}`);
    }
    if (orderFilters.fulfillmentStatus) {
        queryFilters.push(`fulfillment_status:${orderFilters.fulfillmentStatus}`);
    }
    // Order identification filters
    if (orderFilters.orderName) {
        queryFilters.push(`name:${orderFilters.orderName}`);
    }
    if (orderFilters.customerId) {
        queryFilters.push(`customer_id:${orderFilters.customerId}`);
    }
    if (orderFilters.customerEmail) {
        queryFilters.push(`email:${orderFilters.customerEmail}`);
    }
    // Phase 2: Sales Intelligence Filters
    if (orderFilters.riskLevel) {
        queryFilters.push(`risk_level:${orderFilters.riskLevel}`);
    }
    if (orderFilters.returnStatus) {
        queryFilters.push(`return_status:${orderFilters.returnStatus}`);
    }
    // Location filters (with GID format)
    if (orderFilters.locationId) {
        const locationGid = `gid://shopify/Location/${orderFilters.locationId}`;
        queryFilters.push(`location_id:${locationGid}`);
    }
    if (orderFilters.fulfillmentLocationId) {
        const fulfillmentLocationGid = `gid://shopify/Location/${orderFilters.fulfillmentLocationId}`;
        queryFilters.push(`fulfillment_location_id:${fulfillmentLocationGid}`);
    }
    // Sales channel filter (with App ID format)
    if (orderFilters.salesChannel) {
        queryFilters.push(`sales_channel:'${orderFilters.salesChannel}'`);
    }
    // SKU filter (with quotes for string values)
    if (orderFilters.sku) {
        queryFilters.push(`sku:"${orderFilters.sku}"`);
    }
    // Phase 3: Payment & Advanced Filters (Tier 1)
    if (orderFilters.gateway) {
        queryFilters.push(`gateway:${orderFilters.gateway}`);
    }
    if (orderFilters.testOrders) {
        queryFilters.push(`test:${orderFilters.testOrders}`);
    }
    if (orderFilters.customerAcceptsMarketing) {
        queryFilters.push(`customer_accepts_marketing:${orderFilters.customerAcceptsMarketing}`);
    }
    if (orderFilters.deliveryMethod) {
        queryFilters.push(`delivery_method:${orderFilters.deliveryMethod}`);
    }
    // Advanced date filters (updated_at)
    if (orderFilters.updatedAfter) {
        // Convert to ISO format as per research specifications
        const afterDate = new Date(orderFilters.updatedAfter).toISOString();
        queryFilters.push(`updated_at:>='${afterDate}'`);
    }
    if (orderFilters.updatedBefore) {
        // Convert to ISO format as per research specifications
        const beforeDate = new Date(orderFilters.updatedBefore).toISOString();
        queryFilters.push(`updated_at:<='${beforeDate}'`);
    }
    // Join all filters with AND
    return queryFilters.length > 0 ? queryFilters.join(' AND ') : '';
}
exports.buildOrderQueryFilters = buildOrderQueryFilters;
