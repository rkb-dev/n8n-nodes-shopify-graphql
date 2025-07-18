"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyGraphqlApi = void 0;
class ShopifyGraphqlApi {
    constructor() {
        this.name = 'shopifyGraphqlApi';
        this.displayName = 'Shopify GraphQL API';
        this.documentationUrl = 'https://shopify.dev/docs/api/admin-graphql';
        this.properties = [
            {
                displayName: 'Shop Name',
                name: 'shopName',
                type: 'string',
                default: '',
                placeholder: 'your-shop-name',
                description: 'The name of your Shopify shop (without .myshopify.com)',
                required: true,
            },
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Your Shopify Admin API access token',
                required: true,
            },
            {
                displayName: 'API Version',
                name: 'apiVersion',
                type: 'string',
                default: '2024-07',
                description: 'Shopify Admin API version to use',
                required: true,
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Shopify-Access-Token': '={{$credentials.accessToken}}',
                    'Content-Type': 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '=https://{{$credentials.shopName}}.myshopify.com/admin/api/{{$credentials.apiVersion}}',
                url: '/graphql.json',
                method: 'POST',
                body: {
                    query: `
					query {
						shop {
							name
							id
						}
					}
				`,
                },
            },
        };
    }
}
exports.ShopifyGraphqlApi = ShopifyGraphqlApi;
