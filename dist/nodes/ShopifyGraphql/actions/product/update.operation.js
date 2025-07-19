"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.description = void 0;
const GenericFunctions_1 = require("../../GenericFunctions");
exports.description = [
    // Product selection with dynamic loading
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
        description: 'Select product to update from your Shopify store',
    },
    // Manual Product ID (fallback option)
    {
        displayName: 'Manual Product ID',
        name: 'manualProductId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['update'],
                productId: ['__manual__'],
            },
        },
        default: '',
        description: 'Enter product ID manually if not found in dropdown',
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
async function execute(i) {
    // Handle dynamic product selection with manual fallback
    let productId = this.getNodeParameter('productId', i);
    if (productId === '__manual__') {
        productId = this.getNodeParameter('manualProductId', i);
    }
    // Validate product ID
    if (!productId) {
        throw new Error('Product ID is required');
    }
    // Ensure product ID is in GID format
    if (!productId.startsWith('gid://shopify/Product/')) {
        productId = `gid://shopify/Product/${productId}`;
    }
    const productDescription = this.getNodeParameter('productDescription', i, '');
    const productHandle = this.getNodeParameter('productHandle', i, '');
    const productStatus = this.getNodeParameter('productStatus', i, '');
    const productVendor = this.getNodeParameter('productVendor', i, '');
    const productType = this.getNodeParameter('productType', i, '');
    // Build product input object with only provided fields
    const productInput = {
        id: `gid://shopify/Product/${productId}`,
    };
    if (productDescription)
        productInput.descriptionHtml = productDescription;
    if (productHandle)
        productInput.handle = productHandle;
    if (productStatus)
        productInput.status = productStatus;
    if (productVendor)
        productInput.vendor = productVendor;
    if (productType)
        productInput.productType = productType;
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
    const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, mutation, variables);
    if (response.data.productUpdate.userErrors.length > 0) {
        throw new Error(`Product update failed: ${response.data.productUpdate.userErrors.map((e) => e.message).join(', ')}`);
    }
    return response.data.productUpdate.product;
}
exports.execute = execute;
