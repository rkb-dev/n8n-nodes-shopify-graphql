import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load collections from the Shopify store for dynamic selection
 * Optimized query following research specification (50 items, cost-efficient)
 */
export declare function loadCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
