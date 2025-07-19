import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shopifyGraphqlApiRequest } from '../../GenericFunctions';

export const description: INodeProperties[] = [
	// Product ID field for update operation
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the product to update',
	},
	// Product Description field
	{
		displayName: 'Product Description',
		name: 'productDescription',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The description of the product (supports HTML)',
	},
	// Product Handle field
	{
		displayName: 'Product Handle',
		name: 'productHandle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The handle of the product (URL slug)',
	},
	// Product Status field
	{
		displayName: 'Product Status',
		name: 'productStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Active',
				value: 'ACTIVE',
			},
			{
				name: 'Draft',
				value: 'DRAFT',
			},
			{
				name: 'Archived',
				value: 'ARCHIVED',
			},
		],
		default: '',
		description: 'The status of the product',
	},
	// Product Vendor field
	{
		displayName: 'Vendor',
		name: 'productVendor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The vendor or manufacturer of the product',
	},
	// Product Type field
	{
		displayName: 'Product Type',
		name: 'productType',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The type or category of the product',
	},
];

export async function execute(
	this: IExecuteFunctions,
	i: number,
): Promise<any> {
	const productId = this.getNodeParameter('productId', i) as string;
	const productDescription = this.getNodeParameter('productDescription', i, '') as string;
	const productHandle = this.getNodeParameter('productHandle', i, '') as string;
	const productStatus = this.getNodeParameter('productStatus', i, '') as string;
	const productVendor = this.getNodeParameter('productVendor', i, '') as string;
	const productType = this.getNodeParameter('productType', i, '') as string;

	// Build product input object with only provided fields
	const productInput: any = {
		id: `gid://shopify/Product/${productId}`,
	};

	if (productDescription) productInput.descriptionHtml = productDescription;
	if (productHandle) productInput.handle = productHandle;
	if (productStatus) productInput.status = productStatus;
	if (productVendor) productInput.vendor = productVendor;
	if (productType) productInput.productType = productType;

	const mutation = `
		mutation productUpdate($input: ProductInput!) {
			productUpdate(input: $input) {
				product {
					id
					title
					description
					vendor
					productType
					tags
					handle
					status
					createdAt
					updatedAt
				}
				userErrors {
					field
					message
				}
			}
		}
	`;
	
	const variables = { input: productInput };
	const response = await shopifyGraphqlApiRequest.call(this, mutation, variables);
	
	if (response.data.productUpdate.userErrors.length > 0) {
		throw new Error(`Product update failed: ${response.data.productUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
	}
	
	return response.data.productUpdate.product;
}
