import type { IExecuteFunctions } from 'n8n-workflow';
/**
 * Build product query filters from user parameters
 * Extracted from monolithic version - handles Additional Fields collection
 */
export declare function buildProductQueryFilters(executeFunctions: IExecuteFunctions, itemIndex: number): string;
/**
 * Check if metafields should be included in the product query
 */
export declare function shouldIncludeMetafields(executeFunctions: IExecuteFunctions, itemIndex: number): boolean;
/**
 * Get product advanced options from user parameters
 */
export declare function getProductAdvancedOptions(executeFunctions: IExecuteFunctions, itemIndex: number): {
    includeVariants: boolean;
    includeImages: boolean;
    includeInventoryDetails: boolean;
    includeCustomsData: boolean;
    variantsLimit: number;
    imagesLimit: number;
};
/**
 * Calculate estimated GraphQL cost per product based on enabled features
 * SCIENTIFIC MODEL based on real Shopify data:
 * - 30 products + metafields = 692 cost (~23 points/product)
 * - 50 products + variants = 1255 cost (~25 points/product)
 * - 10 products + variants + customs = 1971 cost (~197 points/product)
 * - Official: Base object = 1 point, Connection = 2 + objects
 */
export declare function calculateProductCostEstimate(includeMetafields: boolean, advancedOptions: {
    includeVariants: boolean;
    includeImages: boolean;
    includeInventoryDetails: boolean;
    includeCustomsData: boolean;
    variantsLimit: number;
    imagesLimit: number;
}): number;
