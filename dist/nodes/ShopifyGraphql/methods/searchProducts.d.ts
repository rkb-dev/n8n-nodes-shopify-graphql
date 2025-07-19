import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Search products from the Shopify store with advanced filtering
 * Implements Google Sheets-style searchable dropdown with large dataset support
 *
 * @param this ILoadOptionsFunctions context
 * @returns Promise<INodePropertyOptions[]> Formatted product options for resourceLocator
 */
export declare function searchProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
