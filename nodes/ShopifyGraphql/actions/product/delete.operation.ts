import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shopifyGraphqlApiRequest } from '../../GenericFunctions';

export const description: INodeProperties[] = [
	// Simple product selection
	{
		displayName: 'Product',
		name: 'productId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'loadProducts',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'Select the product to delete',
	},
];

export async function execute(
	this: IExecuteFunctions,
	i: number,
): Promise<any> {
	const productId = this.getNodeParameter('productId', i) as string;
	
	const mutation = `
		mutation productDelete($input: ProductDeleteInput!) {
			productDelete(input: $input) {
				deletedProductId
				userErrors {
					field
					message
				}
			}
		}
	`;
	
	const variables = { input: { id: `gid://shopify/Product/${productId}` } };
	const response = await shopifyGraphqlApiRequest.call(this, mutation, variables);
	
	if (response.data.productDelete.userErrors.length > 0) {
		throw new Error(`Product deletion failed: ${response.data.productDelete.userErrors.map((e: any) => e.message).join(', ')}`);
	}
	
	return {
		deletedProductId: response.data.productDelete.deletedProductId,
		success: true,
		message: `Product ${productId} deleted successfully`
	};
}
