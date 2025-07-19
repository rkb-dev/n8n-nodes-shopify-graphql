import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load unique vendors from the Shopify store for dynamic selection
 * Aggregates all vendors used in the store for product management
 */
export declare function loadVendors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
