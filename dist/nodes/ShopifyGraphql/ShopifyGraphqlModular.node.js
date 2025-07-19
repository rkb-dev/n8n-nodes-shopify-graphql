"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyGraphqlModular = void 0;
const actions_1 = require("./actions");
const methods_1 = require("./methods");
class ShopifyGraphqlModular {
    constructor() {
        this.description = {
            displayName: 'Shopify GraphQL Dynamic',
            name: 'shopifyGraphqlModular',
            icon: 'file:shopify-dynamic.svg',
            group: ['transform'],
            version: 2,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Shopify GraphQL with Dynamic Loading & Smart Dropdowns (v2.0 - Latest)',
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
                ...actions_1.allActionProperties,
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
