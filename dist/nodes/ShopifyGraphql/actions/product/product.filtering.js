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
 * SCIENTIFIC MODEL based on real Shopify data:
 * - 30 products + metafields = 692 cost (~23 points/product)
 * - 50 products + variants = 1255 cost (~25 points/product)
 * - 10 products + variants + customs = 1971 cost (~197 points/product)
 * - Official: Base object = 1 point, Connection = 2 + objects
 */
function calculateProductCostEstimate(includeMetafields, advancedOptions) {
    // Base product cost: 1 point for object + ~2 for basic fields
    let cost = 3;
    // Metafields: Based on real data (30 products + metafields = 692 = ~23/product vs 3 base = ~20 for metafields)
    if (includeMetafields) {
        cost += 20; // Validated from real data
    }
    if (advancedOptions.includeVariants) {
        // Variants connection: 2 + variants returned
        const effectiveVariants = Math.min(advancedOptions.variantsLimit, 10);
        // Base variants cost: Connection (2) + variants (1 each) + variant fields (~2 each)
        let variantCost = 2 + effectiveVariants * 3; // Connection + basic variant data
        if (advancedOptions.includeInventoryDetails) {
            // InventoryItem connection + measurement object + weight object
            // Based on user feedback: works for ≤10 products, so ~70-90 points total
            variantCost += effectiveVariants * 8; // Realistic based on user experience
        }
        if (advancedOptions.includeCustomsData) {
            // Customs fields + CountryHarmonizedSystemCodes connection
            // From user data: 10 products = 1971, 50 products = 1255
            // Difference = 716 points for customs on 10 products = ~72 points/product with customs
            variantCost += effectiveVariants * 15; // Conservative estimate from real usage
        }
        cost += variantCost;
    }
    if (advancedOptions.includeImages) {
        // Images connection: 2 + images returned + basic image fields
        cost += 2 + Math.min(advancedOptions.imagesLimit, 10) * 2;
    }
    // Conservative 20% buffer for schema changes and edge cases
    return Math.ceil(cost * 1.2);
}
exports.calculateProductCostEstimate = calculateProductCostEstimate;
