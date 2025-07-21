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
			displayName: 'Include Inventory Details',
			name: 'includeInventoryDetails',
			type: 'boolean',
			default: false,
			description: 'Include inventory details (weight, dimensions, shipping requirements). Note: This slows down requests and requires variants to be enabled.',
		},
		{
			displayName: 'Include Customs Data',
			name: 'includeCustomsData',
			type: 'boolean',
			default: false,
			description: 'Include customs/trade data (country of origin, harmonized system codes, province codes). Required for international shipping compliance and requires variants to be enabled.',
		},
		{
			displayName: 'Variants Limit',
			name: 'variantsLimit',
			type: 'number',
			default: 250,
			description: 'Maximum number of variants to fetch per product (1-250). Only applies when Include Variants is enabled.',
			typeOptions: {
				minValue: 1,
				maxValue: 250,
			},
		},
		{
			displayName: 'Images Limit',
			name: 'imagesLimit',
			type: 'number',
			default: 250,
			description: 'Maximum number of images to fetch per product (1-250). Only applies when Include Images is enabled.',
			typeOptions: {
				minValue: 1,
				maxValue: 250,
			},
		},
	],
};
