import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load metafield definitions from the Shopify store
 * This enables dynamic dropdown selection of existing metafields
 */
export declare function loadMetafields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
