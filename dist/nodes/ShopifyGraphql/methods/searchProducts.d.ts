import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
/**
 * Search products for resourceLocator dropdown with proper n8n patterns
 * Implements Shopify GraphQL pagination and search as per research brief
 *
 * @param this ILoadOptionsFunctions context from n8n framework
 * @returns Promise<INodePropertyOptions[]> Formatted options for resourceLocator
 */
export declare function searchProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
