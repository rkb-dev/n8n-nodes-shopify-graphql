"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyGraphqlModular = void 0;
const actions_1 = require("./actions");
// Import individual modules for proper field organization
const productModule = __importStar(require("./actions/product"));
const customerModule = __importStar(require("./actions/customer"));
const orderModule = __importStar(require("./actions/order"));
const methods_1 = require("./methods");
class ShopifyGraphqlModular {
    constructor() {
        this.description = {
            displayName: 'Shopify GraphQL Enhanced',
            name: 'shopifyGraphqlModular',
            icon: 'file:shopify.svg',
            group: ['transform'],
            version: 2,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Shopify GraphQL with Enhanced Product Updates & Comprehensive Fields (v2.2.0 - Latest)',
            defaults: {
                name: 'Shopify GraphQL Dynamic',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'shopifyGraphqlApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Order',
                            value: 'order',
                        },
                        {
                            name: 'Product',
                            value: 'product',
                        },
                    ],
                    default: 'product',
                },
                // Import operation definitions from each resource
                ...productModule.productOperations,
                ...customerModule.customerOperations,
                ...orderModule.orderOperations,
                // Import shared resource fields
                ...productModule.productFields,
                // Import individual operation descriptions
                ...productModule.getOperation.description,
                ...productModule.createOperation.description,
                ...productModule.updateOperation.description,
                ...productModule.deleteOperation.description,
                ...customerModule.getOperation.description,
                ...orderModule.getOperation.description,
            ],
        };
        // Dynamic loading methods for improved UX
        this.methods = {
            loadOptions: {
                // High Priority - Essential Methods
                async loadProducts() {
                    return await methods_1.loadProducts.call(this);
                },
                async loadCustomers() {
                    return await methods_1.loadCustomers.call(this);
                },
                async loadMetafields() {
                    return await methods_1.loadMetafields.call(this);
                },
                async loadOrders() {
                    return await methods_1.loadOrders.call(this);
                },
                async loadCollections() {
                    return await methods_1.loadCollections.call(this);
                },
                async loadLocations() {
                    return await methods_1.loadLocations.call(this);
                },
                // Advanced Methods - Enhanced Functionality
                async loadProductVariants() {
                    return await methods_1.loadProductVariants.call(this);
                },
                async loadProductTypes() {
                    return await methods_1.loadProductTypes.call(this);
                },
                async loadVendors() {
                    return await methods_1.loadVendors.call(this);
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                // Route to appropriate resource and operation
                if (resource === 'product') {
                    if (operation === 'get' || operation === 'getAll') {
                        responseData = await actions_1.executeProductGet.call(this, operation, i);
                    }
                    else if (operation === 'create') {
                        responseData = await actions_1.executeProductCreate.call(this, i);
                    }
                    else if (operation === 'update') {
                        responseData = await actions_1.executeProductUpdate.call(this, i);
                    }
                    else if (operation === 'delete') {
                        responseData = await actions_1.executeProductDelete.call(this, i);
                    }
                    else {
                        throw new Error(`Unknown product operation: ${operation}`);
                    }
                }
                else if (resource === 'customer') {
                    if (operation === 'get' || operation === 'getAll' || operation === 'search') {
                        responseData = await actions_1.executeCustomerGet.call(this, operation, i);
                    }
                    else {
                        throw new Error(`Unknown customer operation: ${operation}`);
                    }
                }
                else if (resource === 'order') {
                    if (operation === 'get' || operation === 'getAll') {
                        responseData = await actions_1.executeOrderGet.call(this, operation, i);
                    }
                    else {
                        throw new Error(`Unknown order operation: ${operation}`);
                    }
                }
                else {
                    throw new Error(`Unknown resource: ${resource}`);
                }
                // Handle response data
                if (Array.isArray(responseData)) {
                    returnData.push(...responseData.map((item) => ({ json: item })));
                }
                else if (responseData) {
                    returnData.push({ json: responseData });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message || 'Unknown error' }, pairedItem: { item: i } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.ShopifyGraphqlModular = ShopifyGraphqlModular;
