import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load locations from the Shopify store for dynamic selection
 * Optimized query following research specification (all locations, typically <20)
 */
export declare function loadLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
