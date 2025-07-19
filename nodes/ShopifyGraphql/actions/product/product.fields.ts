import type { INodeProperties } from 'n8n-workflow';

// Additional Fields Collection - Extracted from monolithic version
// Shared collection for customer, order, and product resources
export const additionalFieldsCollection: INodeProperties = {
	displayName: 'Additional Fields',
	name: 'additionalFields',
	type: 'collection',
	placeholder: 'Add Field',
	default: {},
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['getAll'],
		},
	},
	options: [
		{
			displayName: 'Include Metafields',
			name: 'includeMetafields',
			type: 'boolean',
			default: false,
			description: 'Whether to include metafields in the response',
		},
		{
			displayName: 'Created After',
			name: 'createdAfter',
			type: 'dateTime',
			default: '',
			description: 'Only return items created after this date',
		},
		{
			displayName: 'Created Before',
			name: 'createdBefore',
			type: 'dateTime',
			default: '',
			description: 'Only return items created before this date',
		},
	],
};

// Product-specific advanced options for enhanced queries
export const productAdvancedOptionsCollection: INodeProperties = {
	displayName: 'Product Advanced Options',
	name: 'productAdvancedOptions',
	type: 'collection',
	placeholder: 'Add advanced option',
	default: {},
	displayOptions: {
		show: {
			resource: ['product'],
			operation: ['get', 'getAll'],
		},
	},
	options: [
		{
			displayName: 'Include Variants',
			name: 'includeVariants',
			type: 'boolean',
			default: false,
			description: 'Include product variants with pricing, inventory, and options',
		},
		{
			displayName: 'Include Images',
			name: 'includeImages',
			type: 'boolean',
			default: false,
			description: 'Include product images and media',
		},
		{
			displayName: 'Variants Limit',
			name: 'variantsLimit',
			type: 'number',
			default: 250,
			description: 'Maximum number of variants to fetch per product (1-250)',
			typeOptions: {
				minValue: 1,
				maxValue: 250,
			},
			displayOptions: {
				show: {
					'/includeVariants': [true],
				},
			},
		},
		{
			displayName: 'Images Limit',
			name: 'imagesLimit',
			type: 'number',
			default: 250,
			description: 'Maximum number of images to fetch per product (1-250)',
			typeOptions: {
				minValue: 1,
				maxValue: 250,
			},
			displayOptions: {
				show: {
					'/includeImages': [true],
				},
			},
		},
	],
};
