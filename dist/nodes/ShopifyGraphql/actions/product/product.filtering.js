"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductAdvancedOptions = exports.shouldIncludeMetafields = exports.buildProductQueryFilters = void 0;
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
        variantsLimit: advancedOptions.variantsLimit || 250,
        imagesLimit: advancedOptions.imagesLimit || 250,
    };
}
exports.getProductAdvancedOptions = getProductAdvancedOptions;
