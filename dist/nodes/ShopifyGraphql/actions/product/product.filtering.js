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
 * Based on real-world testing: 10 products with variants+customs = 1971 cost (~197 per product)
 */
function calculateProductCostEstimate(includeMetafields, advancedOptions) {
    let cost = 3; // Base product cost
    if (includeMetafields) {
        cost += 15; // Metafields add significant cost
    }
    if (advancedOptions.includeVariants) {
        // Variants are expensive, especially with inventory/customs data
        let variantCost = Math.min(advancedOptions.variantsLimit, 10) * 8; // Base variant cost
        if (advancedOptions.includeInventoryDetails) {
            variantCost += Math.min(advancedOptions.variantsLimit, 10) * 15; // Inventory measurement data
        }
        if (advancedOptions.includeCustomsData) {
            variantCost += Math.min(advancedOptions.variantsLimit, 10) * 20; // Customs data + connections
        }
        cost += variantCost;
    }
    if (advancedOptions.includeImages) {
        cost += Math.min(advancedOptions.imagesLimit, 10) * 2; // Images are relatively cheap
    }
    // Add 20% buffer for safety
    return Math.ceil(cost * 1.2);
}
exports.calculateProductCostEstimate = calculateProductCostEstimate;
