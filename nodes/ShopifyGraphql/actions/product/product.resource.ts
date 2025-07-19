import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product by ID',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many products with smart batching',
				action: 'Get many products',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product',
				action: 'Create a product',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing product',
				action: 'Update a product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product',
				action: 'Delete a product',
			},
		],
		default: 'get',
	},
];

export const productFields: INodeProperties[] = [
	// Product ID field (for get, update, delete operations only)
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the product to retrieve or delete',
	},
];
