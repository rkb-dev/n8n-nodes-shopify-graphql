import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { shopifyGraphqlApiRequest } from '../../GenericFunctions';

export const description: INodeProperties[] = [
	// Product Title field
	{
		displayName: 'Product Title',
		name: 'productTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The title of the product',
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
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'The handle of the product (URL slug). If not provided, will be auto-generated from title.',
	},
	// Product Status field
	{
		displayName: 'Product Status',
		name: 'productStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
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
		default: 'DRAFT',
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
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		default: '',
		description: 'The type or category of the product',
	},
	// Simple collection selection (optional)
	{
		displayName: 'Add to Collection',
		name: 'collectionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'loadCollections',
		},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Select collection to add this product to (optional)',
	},
	// Product Metafields Collection
	{
		displayName: 'Product Metafields',
		name: 'productMetafields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		default: {},
		description: 'Custom metafields for additional product data',
		options: [
			{
				name: 'metafield',
				displayName: 'Metafield',
				values: [
					{
						displayName: 'Namespace',
						name: 'namespace',
						type: 'string',
						required: true,
						default: 'custom',
						description: 'Metafield namespace (e.g., custom, app, etc.)',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
						description: 'Metafield key identifier',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: 'Metafield value',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Single Line Text',
								value: 'single_line_text_field',
							},
							{
								name: 'Multi Line Text',
								value: 'multi_line_text_field',
							},
							{
								name: 'Number (Integer)',
								value: 'number_integer',
							},
							{
								name: 'Number (Decimal)',
								value: 'number_decimal',
							},
							{
								name: 'Date',
								value: 'date',
							},
							{
								name: 'Date and Time',
								value: 'date_time',
							},
							{
								name: 'URL',
								value: 'url',
							},
							{
								name: 'JSON',
								value: 'json',
							},
							{
								name: 'Boolean',
								value: 'boolean',
							},
						],
						default: 'single_line_text_field',
						description: 'The type of data stored in this metafield',
					},
				],
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	i: number,
): Promise<any> {
	const productTitle = this.getNodeParameter('productTitle', i) as string;
	const productDescription = this.getNodeParameter('productDescription', i, '') as string;
	const productHandle = this.getNodeParameter('productHandle', i, '') as string;
	const productStatus = this.getNodeParameter('productStatus', i, 'DRAFT') as string;
	const productVendor = this.getNodeParameter('productVendor', i, '') as string;
	const productType = this.getNodeParameter('productType', i, '') as string;
	
	let collectionId = this.getNodeParameter('collectionId', i, '') as string;
	
	// Get advanced features (these will be moved to separate fields later)
	const productVariants = this.getNodeParameter('productVariants', i, {}) as any;
	const productImages = this.getNodeParameter('productImages', i, {}) as any;
	const productMetafields = this.getNodeParameter('productMetafields', i, {}) as any;
	const seoSettings = this.getNodeParameter('seoSettings', i, {}) as any;

	// Build product input object
	const productInput: any = {
		title: productTitle,
		status: productStatus,
	};
	
	// Handle collection assignment
	if (collectionId) {
		if (!collectionId.startsWith('gid://shopify/Collection/')) {
			collectionId = `gid://shopify/Collection/${collectionId}`;
		}
		productInput.collectionsToJoin = [collectionId];
	}

	if (productDescription) productInput.descriptionHtml = productDescription;
	if (productHandle) productInput.handle = productHandle;
	if (productVendor) productInput.vendor = productVendor;
	if (productType) productInput.productType = productType;

	// Add SEO settings
	if (seoSettings.seoTitle || seoSettings.seoDescription) {
		productInput.seo = {};
		if (seoSettings.seoTitle) productInput.seo.title = seoSettings.seoTitle;
		if (seoSettings.seoDescription) productInput.seo.description = seoSettings.seoDescription;
	}

	// Add tags
	if (seoSettings.tags) {
		productInput.tags = seoSettings.tags.split(',').map((tag: string) => tag.trim());
	}

	// Add variants
	if (productVariants.variant && productVariants.variant.length > 0) {
		productInput.variants = productVariants.variant.map((variant: any) => {
			const variantInput: any = {};
			if (variant.title) variantInput.title = variant.title;
			if (variant.sku) variantInput.sku = variant.sku;
			if (variant.price) variantInput.price = variant.price;
			if (variant.compareAtPrice) variantInput.compareAtPrice = variant.compareAtPrice;
			if (variant.inventoryQuantity !== undefined) variantInput.inventoryQuantities = [{
				locationId: 'gid://shopify/Location/main',
				availableQuantity: variant.inventoryQuantity
			}];
			if (variant.inventoryManagement) variantInput.inventoryManagement = variant.inventoryManagement;
			if (variant.weight) variantInput.weight = variant.weight;
			if (variant.requiresShipping !== undefined) variantInput.requiresShipping = variant.requiresShipping;
			if (variant.taxable !== undefined) variantInput.taxable = variant.taxable;
			return variantInput;
		});
	}

	// Add images
	if (productImages.image && productImages.image.length > 0) {
		productInput.images = productImages.image.map((image: any) => {
			const imageInput: any = {
				src: image.src
			};
			if (image.altText) imageInput.altText = image.altText;
			return imageInput;
		});
	}

	// Add metafields
	if (productMetafields.metafield && productMetafields.metafield.length > 0) {
		productInput.metafields = productMetafields.metafield.map((metafield: any) => ({
			namespace: metafield.namespace,
			key: metafield.key,
			value: metafield.value,
			type: metafield.type
		}));
	}

	const mutation = `
		mutation productCreate($input: ProductInput!) {
			productCreate(input: $input) {
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
	
	if (response.data.productCreate.userErrors.length > 0) {
		throw new Error(`Product creation failed: ${response.data.productCreate.userErrors.map((e: any) => e.message).join(', ')}`);
	}
	
	return response.data.productCreate.product;
}
