import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ShopifyGraphqlApi implements ICredentialType {
	name = 'shopifyGraphqlApi';
	displayName = 'Shopify GraphQL API';
	documentationUrl = 'https://shopify.dev/docs/api/admin-graphql';
	properties: INodeProperties[] = [
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

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Shopify-Access-Token': '={{$credentials.accessToken}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
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
