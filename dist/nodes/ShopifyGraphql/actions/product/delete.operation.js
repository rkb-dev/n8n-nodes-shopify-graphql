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
                operation: ['delete'],
            },
        },
        default: '',
        description: 'Select product to delete from your Shopify store',
    },
    // Manual Product ID (fallback option)
    {
        displayName: 'Manual Product ID',
        name: 'manualProductId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['delete'],
                productId: ['__manual__'],
            },
        },
        default: '',
        description: 'Enter product ID manually if not found in dropdown',
    },
];
async function execute(i) {
    const productId = this.getNodeParameter('productId', i);
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
    const response = await GenericFunctions_1.shopifyGraphqlApiRequest.call(this, mutation, variables);
    if (response.data.productDelete.userErrors.length > 0) {
        throw new Error(`Product deletion failed: ${response.data.productDelete.userErrors.map((e) => e.message).join(', ')}`);
    }
    return {
        deletedProductId: response.data.productDelete.deletedProductId,
        success: true,
        message: `Product ${productId} deleted successfully`
    };
}
exports.execute = execute;
