import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class ShopifyGraphqlModular implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchCollections(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
        };
        loadOptions: {
            loadProducts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadCustomers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadMetafields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadOrders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadProductVariants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadProductTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadVendors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
