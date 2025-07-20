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
				operation: ['update'],
			},
		},
		default: '',
		description: 'Select the product to update',
	},
	// Product Title field
	{
		displayName: 'Product Title',
		name: 'productTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
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
				name: 'Keep Current Status',
				value: '',
			},
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
	// Product Tags field
	{
		displayName: 'Tags',
		name: 'productTags',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Comma-separated list of product tags',
	},
	// Collection selection with resource locator (searchable) - with searchFilterRequired fix
	{
		displayName: 'Add to Collection',
		name: 'collectionId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a Collection...',
				typeOptions: {
					searchListMethod: 'searchCollections',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g., 123456789 or gid://shopify/Collection/123456789',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^(gid://shopify/Collection/)?[0-9]+$',
							errorMessage: 'Collection ID must be a number or valid GID',
						},
					},
				],
				extractValue: {
						type: 'regex',
						regex: '^(?:gid://shopify/Collection/)?([0-9]+)$',
					},
			},
		],
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		description: 'Select collection to add this product to (optional). Search by typing collection name or handle.',
	},
	// Product Metafields Collection (values only, no type needed)
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
				operation: ['update'],
			},
		},
		default: {},
		description: 'Update metafield values for existing metafield definitions',
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
						description: 'Metafield value to set',
					},
				],
			},
		],
	},
	// SEO Settings Collection
	{
		displayName: 'SEO Settings',
		name: 'seoSettings',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		default: {},
		description: 'SEO settings for the product',
		options: [
			{
				name: 'seo',
				displayName: 'SEO',
				values: [
					{
						displayName: 'SEO Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'SEO title for search engines',
					},
					{
						displayName: 'SEO Description',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						description: 'SEO description for search engines',
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
	// Get product ID from simple dropdown selection
	const productId = this.getNodeParameter('productId', i) as string;
	
	// Validate product ID
	if (!productId) {
		throw new Error('Product ID is required');
	}
	

	
	// Get all product fields
	const productTitle = this.getNodeParameter('productTitle', i, '') as string;
	const productDescription = this.getNodeParameter('productDescription', i, '') as string;
	const productHandle = this.getNodeParameter('productHandle', i, '') as string;
	const productStatus = this.getNodeParameter('productStatus', i, '') as string;
	const productVendor = this.getNodeParameter('productVendor', i, '') as string;
	const productType = this.getNodeParameter('productType', i, '') as string;
	const productTags = this.getNodeParameter('productTags', i, '') as string;
	const collectionIdParam = this.getNodeParameter('collectionId', i, { mode: 'list', value: '' }) as any;
	const productMetafields = this.getNodeParameter('productMetafields', i, {}) as any;
	const seoSettings = this.getNodeParameter('seoSettings', i, {}) as any;

	// Build product input object with only provided fields
	const productInput: any = {
		id: `gid://shopify/Product/${productId}`,
	};

	if (productTitle) productInput.title = productTitle;
	if (productDescription) productInput.descriptionHtml = productDescription;
	if (productHandle) productInput.handle = productHandle;
	if (productStatus) productInput.status = productStatus;
	if (productVendor) productInput.vendor = productVendor;
	if (productType) productInput.productType = productType;
	
	// Handle tags (convert comma-separated string to array)
	if (productTags) {
		const tagsArray = productTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
		if (tagsArray.length > 0) {
			productInput.tags = tagsArray;
		}
	}
	
	// Handle collection assignment (resource locator format)
	if (collectionIdParam && collectionIdParam.value) {
		let collectionId = collectionIdParam.value;
		
		// Handle different resource locator modes
		if (collectionIdParam.mode === 'id') {
			// Direct ID input - extract clean ID using regex if needed
			const match = collectionId.match(/^(?:gid:\/\/shopify\/Collection\/)?([0-9]+)$/);
			collectionId = match ? match[1] : collectionId;
		} else if (collectionIdParam.mode === 'list') {
			// From search list - already clean ID from searchCollections method
			// collectionId is already the clean ID
		}
		
		// Convert to GID format and add to product
		if (collectionId) {
			const finalCollectionId = collectionId.startsWith('gid://shopify/Collection/') 
				? collectionId 
				: `gid://shopify/Collection/${collectionId}`;
			productInput.collectionsToJoin = [finalCollectionId];
		}
	}
	
	// Handle SEO settings
	if (seoSettings && seoSettings.seo && seoSettings.seo.length > 0) {
		const seo = seoSettings.seo[0];
		productInput.seo = {};
		if (seo.title) productInput.seo.title = seo.title;
		if (seo.description) productInput.seo.description = seo.description;
	}
	
	// Handle metafields (values only, no type needed for updates)
	if (productMetafields && productMetafields.metafield && productMetafields.metafield.length > 0) {
		productInput.metafields = productMetafields.metafield.map((metafield: any) => ({
			namespace: metafield.namespace,
			key: metafield.key,
			value: metafield.value,
		}));
	}
	


	// Execute simple product update
	if (Object.keys(productInput).length > 1) { // More than just ID
		const productMutation = `
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
						collections(first: 10) {
							edges {
								node {
									id
									title
								}
							}
						}
						metafields(first: 20) {
							edges {
								node {
									id
									namespace
									key
									value
								}
							}
						}
						seo {
							title
							description
						}
					}
					userErrors {
						field
						message
					}
				}
			}
		`;
		
		const productResponse = await shopifyGraphqlApiRequest.call(this, productMutation, { input: productInput });
		
		if (productResponse.data.productUpdate.userErrors.length > 0) {
			throw new Error(`Product update failed: ${productResponse.data.productUpdate.userErrors.map((e: any) => e.message).join('; ')}`);
		}
		
		return productResponse.data.productUpdate.product;
	} else {
		throw new Error('No product fields provided for update');
	}
}
