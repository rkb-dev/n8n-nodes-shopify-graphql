import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load unique product types from the Shopify store for dynamic selection
 * Aggregates all product types used in the store for categorization
 */
export declare function loadProductTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
