import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Load product variants from a specific product for dynamic selection
 * Conditional loading based on selected product ID
 */
export declare function loadProductVariants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
