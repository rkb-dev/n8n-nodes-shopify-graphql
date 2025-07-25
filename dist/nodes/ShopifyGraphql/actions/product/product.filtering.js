"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProductCostEstimate = exports.getProductAdvancedOptions = exports.shouldIncludeMetafields = exports.buildProductQueryFilters = void 0;
/**
 * Build product query filters from user parameters
 * Extracted from monolithic version - handles Additional Fields collection
 */
function buildProductQueryFilters(executeFunctions, itemIndex) {
    const queryFilters = [];
    // Get additional fields collection
    const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {});
    // Date filters (created_at)
    if (additionalFields.createdAfter) {
        const afterDate = additionalFields.createdAfter.split('T')[0]; // Convert to YYYY-MM-DD format
        queryFilters.push(`created_at:>=${afterDate}`);
    }
    if (additionalFields.createdBefore) {
        const beforeDate = additionalFields.createdBefore.split('T')[0]; // Convert to YYYY-MM-DD format
        queryFilters.push(`created_at:<=${beforeDate}`);
    }
    // Join all filters with AND
    return queryFilters.length > 0 ? queryFilters.join(' AND ') : '';
}
exports.buildProductQueryFilters = buildProductQueryFilters;
/**
 * Check if metafields should be included in the product query
 */
function shouldIncludeMetafields(executeFunctions, itemIndex) {
    const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {});
    return additionalFields.includeMetafields === true;
}
exports.shouldIncludeMetafields = shouldIncludeMetafields;
/**
 * Get product advanced options from user parameters
 */
function getProductAdvancedOptions(executeFunctions, itemIndex) {
    const advancedOptions = executeFunctions.getNodeParameter('productAdvancedOptions', itemIndex, {});
    return {
        includeVariants: advancedOptions.includeVariants === true,
        includeImages: advancedOptions.includeImages === true,
        includeInventoryDetails: advancedOptions.includeInventoryDetails === true,
        includeCustomsData: advancedOptions.includeCustomsData === true,
        variantsLimit: advancedOptions.variantsLimit || 250,
        imagesLimit: advancedOptions.imagesLimit || 250,
    };
}
exports.getProductAdvancedOptions = getProductAdvancedOptions;
/**
 * Calculate estimated GraphQL cost per product based on enabled features
 * Based on real-world testing:
 * - 50 products basic+variants = 1255 cost (~25 per product)
 * - 10 products variants+customs = 1971 cost (~197 per product)
 */
function calculateProductCostEstimate(includeMetafields, advancedOptions) {
    let cost = 5; // Base product cost (more realistic)
    if (includeMetafields) {
        cost += 20; // Metafields are expensive
    }
    if (advancedOptions.includeVariants) {
        // Base variant cost is significant
        const effectiveVariants = Math.min(advancedOptions.variantsLimit, 10);
        let variantCost = effectiveVariants * 12; // Higher base cost per variant
        if (advancedOptions.includeInventoryDetails) {
            variantCost += effectiveVariants * 25; // Inventory measurement data is very expensive
        }
        if (advancedOptions.includeCustomsData) {
            variantCost += effectiveVariants * 35; // Customs data + connections are most expensive
        }
        cost += variantCost;
    }
    if (advancedOptions.includeImages) {
        cost += Math.min(advancedOptions.imagesLimit, 10) * 3; // Images have some cost
    }
    // Add 30% buffer for safety (was 20%)
    return Math.ceil(cost * 1.3);
}
exports.calculateProductCostEstimate = calculateProductCostEstimate;
