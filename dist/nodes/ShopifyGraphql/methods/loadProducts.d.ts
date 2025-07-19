import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load products from the Shopify store for dynamic selection
 * Optimized query following research specification (25 items, cost-efficient)
 */
export declare function loadProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
