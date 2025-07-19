"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
exports.description = [
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
    // Collection selection with dynamic loading
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
    // Manual Collection ID (fallback option)
    {
        displayName: 'Manual Collection ID',
        name: 'manualCollectionId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create'],
                collectionId: ['__manual__'],
            },
        },
        default: '',
        description: 'Enter collection ID manually if not found in dropdown',
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
                        type: 'options',
                        typeOptions: {
                            loadOptionsMethod: 'loadMetafields',
                        },
                        required: true,
                        default: 'custom',
                        description: 'Select metafield namespace from your Shopify store',
                    },
                    {
                        displayName: 'Manual Namespace',
                        name: 'manualNamespace',
                        type: 'string',
                        displayOptions: {
                            show: {
                                namespace: ['__manual__'],
                            },
                        },
                        default: 'custom',
                        description: 'Enter namespace manually if not found in dropdown',
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
async function execute(i) {
    const productTitle = this.getNodeParameter('productTitle', i);
    const productDescription = this.getNodeParameter('productDescription', i, '');
    const productHandle = this.getNodeParameter('productHandle', i, '');
    const productStatus = this.getNodeParameter('productStatus', i, 'DRAFT');
    const productVendor = this.getNodeParameter('productVendor', i, '');
    const productType = this.getNodeParameter('productType', i, '');
    // Handle dynamic collection selection with manual fallback
    let collectionId = this.getNodeParameter('collectionId', i, '');
    if (collectionId === '__manual__') {
        collectionId = this.getNodeParameter('manualCollectionId', i, '');
    }
    // Ensure collection ID is in GID format if provided
    if (collectionId && !collectionId.startsWith('gid://shopify/Collection/')) {
        collectionId = `gid://shopify/Collection/${collectionId}`;
    }
    // Get advanced features (these will be moved to separate fields later)
    const productVariants = this.getNodeParameter('productVariants', i, {});
    const productImages = this.getNodeParameter('productImages', i, {});
    const productMetafields = this.getNodeParameter('productMetafields', i, {});
    const seoSettings = this.getNodeParameter('seoSettings', i, {});
    // Build product input object
    const productInput = {
        title: productTitle,
        status: productStatus,
    };
    if (productDescription)
        productInput.descriptionHtml = productDescription;
    if (productHandle)
        productInput.handle = productHandle;
    if (productVendor)
        productInput.vendor = productVendor;
    if (productType)
        productInput.productType = productType;
    // Add SEO settings
    if (seoSettings.seoTitle || seoSettings.seoDescription) {
        productInput.seo = {};
        if (seoSettings.seoTitle)
            productInput.seo.title = seoSettings.seoTitle;
        if (seoSettings.seoDescription)
            productInput.seo.description = seoSettings.seoDescription;
    }
    // Add tags
    if (seoSettings.tags) {
        productInput.tags = seoSettings.tags.split(',').map((tag) => tag.trim());
    }
    // Add variants
    if (productVariants.variant && productVariants.variant.length > 0) {
        productInput.variants = productVariants.variant.map((variant) => {
            const variantInput = {};
            if (variant.title)
                variantInput.title = variant.title;
            if (variant.sku)
                variantInput.sku = variant.sku;
            if (variant.price)
                variantInput.price = variant.price;
            if (variant.compareAtPrice)
                variantInput.compareAtPrice = variant.compareAtPrice;
            if (variant.inventoryQuantity !== undefined)
                variantInput.inventoryQuantities = [{
                        locationId: 'gid://shopify/Location/main',
                        availableQuantity: variant.inventoryQuantity
                    }];
            if (variant.inventoryManagement)
                variantInput.inventoryManagement = variant.inventoryManagement;
            if (variant.weight)
                variantInput.weight = variant.weight;
            if (variant.requiresShipping !== undefined)
                variantInput.requiresShipping = variant.requiresShipping;
            if (variant.taxable !== undefined)
                variantInput.taxable = variant.taxable;
            return variantInput;
        });
    }
    // Add images
    if (productImages.image && productImages.image.length > 0) {
        productInput.images = productImages.image.map((image) => {
            const imageInput = {
                src: image.src
            };
            if (image.altText)
                imageInput.altText = image.altText;
            return imageInput;
        });
    }
    // Add metafields
    if (productMetafields.metafield && productMetafields.metafield.length > 0) {
        productInput.metafields = productMetafields.metafield.map((metafield) => ({
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
    const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, mutation, variables);
    if (response.data.productCreate.userErrors.length > 0) {
        throw new Error(`Product creation failed: ${response.data.productCreate.userErrors.map((e) => e.message).join(', ')}`);
    }
    return response.data.productCreate.product;
}
exports.execute = execute;
