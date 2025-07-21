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
