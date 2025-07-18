import { IExecuteFunctions } from 'n8n-workflow';
export interface IShopifyGraphqlResponse {
    data: any;
    extensions?: {
        cost: {
            requestedQueryCost: number;
            actualQueryCost: number;
            throttleStatus: {
                maximumAvailable: number;
                currentlyAvailable: number;
                restoreRate: number;
            };
        };
    };
    errors?: Array<{
        message: string;
        locations?: Array<{
            line: number;
            column: number;
        }>;
        path?: string[];
    }>;
}
/**
 * Make a GraphQL API request to Shopify
 */
export declare function shopifyGraphqlApiRequest(this: IExecuteFunctions, query: string, variables?: any): Promise<IShopifyGraphqlResponse>;
/**
 * Make paginated GraphQL requests to get all items with smart batching
 */
export declare function shopifyGraphqlApiRequestAllItems(this: IExecuteFunctions, resource: string, query: string, variables?: any, batchSize?: number, maxItems?: number): Promise<any[]>;
/**
 * Helper function to extract ID from Shopify GID
 */
export declare function extractIdFromGid(gid: string): string;
/**
 * Helper function to create Shopify GID
 */
export declare function createShopifyGid(resource: string, id: string): string;
