import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Get metafield mapping columns for a specific product
 * Implements Google Sheets-style dynamic field discovery for metafields
 * This method is called by resourceMapper to dynamically load product-specific metafields
 *
 * @param this ILoadOptionsFunctions context
 * @returns Promise<INodePropertyOptions[]> Formatted metafield options for resourceMapper
 */
export declare function getMetafieldMappingColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
