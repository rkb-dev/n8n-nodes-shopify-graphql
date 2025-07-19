"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersAdvancedOptionsCollection = exports.orderFiltersCollection = void 0;
// Order Filters Collection - Extracted from monolithic version
// Contains Phase 1-3 filters for advanced order filtering
exports.orderFiltersCollection = {
    displayName: 'Order Filters',
    name: 'orderFilters',
    type: 'collection',
    placeholder: 'Add filter',
    default: {},
    displayOptions: {
        show: {
            resource: ['order'],
            operation: ['getAll'],
        },
    },
    options: [
        // Phase 1: Core Business Filters
        {
            displayName: 'Tag',
            name: 'tag',
            type: 'string',
            default: '',
            description: 'Filter orders by tag (e.g., "priority", "wholesale")',
        },
        {
            displayName: 'Exclude Tag',
            name: 'tagNot',
            type: 'string',
            default: '',
            description: 'Exclude orders with this tag',
        },
        {
            displayName: 'Order Status',
            name: 'status',
            type: 'options',
            default: '',
            description: 'Filter by order status',
            options: [
                {
                    name: 'Any Status',
                    value: '',
                },
                {
                    name: 'Open',
                    value: 'open',
                },
                {
                    name: 'Closed',
                    value: 'closed',
                },
                {
                    name: 'Cancelled',
                    value: 'cancelled',
                },
                {
                    name: 'Not Closed',
                    value: 'not_closed',
                },
            ],
        },
        {
            displayName: 'Financial Status',
            name: 'financialStatus',
            type: 'options',
            default: '',
            description: 'Filter by payment status',
            options: [
                {
                    name: 'Any Payment Status',
                    value: '',
                },
                {
                    name: 'Paid',
                    value: 'paid',
                },
                {
                    name: 'Pending',
                    value: 'pending',
                },
                {
                    name: 'Authorized',
                    value: 'authorized',
                },
                {
                    name: 'Partially Paid',
                    value: 'partially_paid',
                },
                {
                    name: 'Partially Refunded',
                    value: 'partially_refunded',
                },
                {
                    name: 'Refunded',
                    value: 'refunded',
                },
                {
                    name: 'Voided',
                    value: 'voided',
                },
                {
                    name: 'Expired',
                    value: 'expired',
                },
            ],
        },
        {
            displayName: 'Fulfillment Status',
            name: 'fulfillmentStatus',
            type: 'options',
            default: '',
            description: 'Filter by shipping/fulfillment status',
            options: [
                {
                    name: 'Any Fulfillment Status',
                    value: '',
                },
                {
                    name: 'Unfulfilled',
                    value: 'unfulfilled',
                },
                {
                    name: 'Unshipped',
                    value: 'unshipped',
                },
                {
                    name: 'Shipped',
                    value: 'shipped',
                },
                {
                    name: 'Fulfilled',
                    value: 'fulfilled',
                },
                {
                    name: 'Partial',
                    value: 'partial',
                },
                {
                    name: 'Scheduled',
                    value: 'scheduled',
                },
                {
                    name: 'On Hold',
                    value: 'on_hold',
                },
                {
                    name: 'Request Declined',
                    value: 'request_declined',
                },
            ],
        },
        {
            displayName: 'Order Number',
            name: 'orderName',
            type: 'string',
            default: '',
            description: 'Filter by order number/name (e.g., "#1001", "1001-A")',
        },
        {
            displayName: 'Customer ID',
            name: 'customerId',
            type: 'string',
            default: '',
            description: 'Filter by customer ID',
        },
        {
            displayName: 'Customer Email',
            name: 'customerEmail',
            type: 'string',
            default: '',
            description: 'Filter by customer email address',
        },
        // Phase 2: Sales Intelligence Filters
        {
            displayName: 'Risk Level',
            name: 'riskLevel',
            type: 'options',
            default: '',
            description: 'Filter by fraud risk assessment level',
            options: [
                {
                    name: 'Any Risk Level',
                    value: '',
                },
                {
                    name: 'High Risk',
                    value: 'high',
                },
                {
                    name: 'Medium Risk',
                    value: 'medium',
                },
                {
                    name: 'Low Risk',
                    value: 'low',
                },
                {
                    name: 'No Risk',
                    value: 'none',
                },
                {
                    name: 'Pending Analysis',
                    value: 'pending',
                },
            ],
        },
        {
            displayName: 'Return Status',
            name: 'returnStatus',
            type: 'options',
            default: '',
            description: 'Filter by return processing status',
            options: [
                {
                    name: 'Any Return Status',
                    value: '',
                },
                {
                    name: 'No Return',
                    value: 'no_return',
                },
                {
                    name: 'Return Requested',
                    value: 'return_requested',
                },
                {
                    name: 'In Progress',
                    value: 'in_progress',
                },
                {
                    name: 'Inspection Complete',
                    value: 'inspection_complete',
                },
                {
                    name: 'Returned',
                    value: 'returned',
                },
                {
                    name: 'Return Failed',
                    value: 'return_failed',
                },
            ],
        },
        {
            displayName: 'Location ID',
            name: 'locationId',
            type: 'string',
            default: '',
            description: 'Filter by store location ID (numeric ID only, GID format will be applied automatically)',
            placeholder: '106311319881',
        },
        {
            displayName: 'Fulfillment Location ID',
            name: 'fulfillmentLocationId',
            type: 'string',
            default: '',
            description: 'Filter by fulfillment location ID (numeric ID only, GID format will be applied automatically)',
            placeholder: '106311319881',
        },
        {
            displayName: 'Sales Channel',
            name: 'salesChannel',
            type: 'options',
            default: '',
            description: 'Filter by sales channel',
            options: [
                {
                    name: 'Any Channel',
                    value: '',
                },
                {
                    name: 'Online Store',
                    value: '580111',
                },
                {
                    name: 'Point of Sale (POS)',
                    value: '129785',
                },
                {
                    name: 'Draft Orders',
                    value: '1354745',
                },
                {
                    name: 'Google & YouTube',
                    value: '1780363',
                },
                {
                    name: 'Facebook & Instagram',
                    value: '2329312',
                },
                {
                    name: 'Shop',
                    value: '3890849',
                },
                {
                    name: 'Headless',
                    value: '12875497473',
                },
                {
                    name: 'TikTok',
                    value: '4383523',
                },
            ],
        },
        {
            displayName: 'SKU',
            name: 'sku',
            type: 'string',
            default: '',
            description: 'Filter orders containing products with this SKU (exact match will be applied)',
            placeholder: 'PRODUCT-SKU-123',
        },
        // Phase 3: Payment & Advanced Filters
        {
            displayName: 'Payment Gateway',
            name: 'gateway',
            type: 'options',
            default: '',
            description: 'Filter by payment gateway',
            options: [
                {
                    name: 'Any Gateway',
                    value: '',
                },
                {
                    name: 'Shopify Payments',
                    value: 'shopify_payments',
                },
                {
                    name: 'PayPal',
                    value: 'paypal',
                },
                {
                    name: 'Stripe',
                    value: 'stripe',
                },
                {
                    name: 'Square',
                    value: 'square',
                },
                {
                    name: 'Authorize.Net',
                    value: 'authorize_net',
                },
                {
                    name: 'Manual Payment',
                    value: 'manual',
                },
                {
                    name: 'Cash on Delivery',
                    value: 'cod',
                },
                {
                    name: 'Bank Transfer',
                    value: 'bank_transfer',
                },
                {
                    name: 'Gift Card',
                    value: 'gift_card',
                },
                {
                    name: 'Test Gateway',
                    value: 'bogus',
                },
            ],
        },
        {
            displayName: 'Test Orders',
            name: 'testOrders',
            type: 'options',
            default: '',
            description: 'Filter by test vs live orders',
            options: [
                {
                    name: 'All Orders',
                    value: '',
                },
                {
                    name: 'Live Orders Only',
                    value: 'false',
                },
                {
                    name: 'Test Orders Only',
                    value: 'true',
                },
            ],
        },
        {
            displayName: 'Customer Accepts Marketing',
            name: 'customerAcceptsMarketing',
            type: 'options',
            default: '',
            description: 'Filter by customer marketing preferences',
            options: [
                {
                    name: 'Any Preference',
                    value: '',
                },
                {
                    name: 'Accepts Marketing',
                    value: 'true',
                },
                {
                    name: 'Declined Marketing',
                    value: 'false',
                },
            ],
        },
        {
            displayName: 'Updated After',
            name: 'updatedAfter',
            type: 'dateTime',
            default: '',
            description: 'Filter orders updated after this date/time',
        },
        {
            displayName: 'Updated Before',
            name: 'updatedBefore',
            type: 'dateTime',
            default: '',
            description: 'Filter orders updated before this date/time',
        },
        {
            displayName: 'Delivery Method',
            name: 'deliveryMethod',
            type: 'options',
            default: '',
            description: 'Filter by delivery method',
            options: [
                {
                    name: 'Any Method',
                    value: '',
                },
                {
                    name: 'Shipping',
                    value: 'shipping',
                },
                {
                    name: 'Pickup',
                    value: 'pickup',
                },
                {
                    name: 'Local Delivery',
                    value: 'local_delivery',
                },
                {
                    name: 'Pickup Point',
                    value: 'pickup_point',
                },
                {
                    name: 'Retail',
                    value: 'retail',
                },
                {
                    name: 'None',
                    value: 'none',
                },
            ],
        },
    ],
};
// Advanced Options Collection
exports.ordersAdvancedOptionsCollection = {
    displayName: 'Orders Advanced Options',
    name: 'ordersAdvancedOptions',
    type: 'collection',
    placeholder: 'Add advanced option',
    default: {},
    displayOptions: {
        show: {
            resource: ['order'],
            operation: ['get', 'getAll'],
        },
    },
    options: [
        {
            displayName: 'Line Items Limit',
            name: 'lineItemsLimit',
            type: 'number',
            default: 250,
            description: 'Maximum number of line items to fetch per order (1-250)',
            typeOptions: {
                minValue: 1,
                maxValue: 250,
            },
            displayOptions: {
                show: {
                    '/includeLineItems': [true],
                },
            },
        },
        {
            displayName: 'Include Shipping Lines',
            name: 'includeShippingLines',
            type: 'boolean',
            default: false,
            description: 'Include shipping cost breakdown and details',
        },
        {
            displayName: 'Include Fulfillment Details',
            name: 'includeFulfillmentDetails',
            type: 'boolean',
            default: false,
            description: 'Include fulfillment tracking and status details',
        },
        {
            displayName: 'Include Custom Attributes',
            name: 'includeCustomAttributes',
            type: 'boolean',
            default: false,
            description: 'Include custom order attributes and notes',
        },
        {
            displayName: 'Include Financial Details',
            name: 'includeFinancialDetails',
            type: 'boolean',
            default: false,
            description: 'Include transaction details and financial breakdown',
        },
    ],
};
