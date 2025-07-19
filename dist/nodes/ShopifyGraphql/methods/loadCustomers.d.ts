import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load customers from the Shopify store for dynamic selection
 * Useful for order filtering, customer relationships, etc.
 */
export declare function loadCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
