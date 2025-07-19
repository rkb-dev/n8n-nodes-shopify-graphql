"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFields = exports.productOperations = void 0;
exports.productOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['product'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a product by ID',
                action: 'Get a product',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many products with smart batching',
                action: 'Get many products',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new product',
                action: 'Create a product',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing product',
                action: 'Update a product',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a product',
                action: 'Delete a product',
            },
        ],
        default: 'get',
    },
];
exports.productFields = [
    // =============================================================================
    // BASIC PRODUCT FIELDS (Always Visible)
    // =============================================================================
    // Product ID field
    {
        displayName: 'Product ID',
        name: 'productId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['get', 'update', 'delete'],
            },
        },
        default: '',
        description: 'The ID of the product to retrieve, update, or delete',
    },
    // Product Title (Create only)
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
        placeholder: 'e.g., Awesome T-Shirt',
    },
    // Product Description (Create/Update)
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
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'The description of the product (supports HTML). For updates, use expressions like {{ $node["Get Product"].json["description"] }} to pre-populate current value.',
        placeholder: 'Enter product description...',
    },
    // =============================================================================
    // ADVANCED PRODUCT OPTIONS TOGGLE
    // =============================================================================
    {
        displayName: 'Advanced Product Options',
        name: 'showAdvancedOptions',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
            },
        },
        default: false,
        description: 'Show advanced options like variants, SEO, metafields, and inventory management',
    },
    // =============================================================================
    // PRODUCT DETAILS (Behind Advanced Toggle)
    // =============================================================================
    // Product Handle
    {
        displayName: 'Product Handle (URL Slug)',
        name: 'productHandle',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        default: '',
        description: 'The handle of the product (URL slug). If not provided, will be auto-generated from title.',
        placeholder: 'awesome-t-shirt',
    },
    // Product Status
    {
        displayName: 'Product Status',
        name: 'productStatus',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        options: [
            {
                name: 'Active',
                value: 'ACTIVE',
                description: 'Product is published and available for sale',
            },
            {
                name: 'Draft',
                value: 'DRAFT',
                description: 'Product is saved but not published',
            },
            {
                name: 'Archived',
                value: 'ARCHIVED',
                description: 'Product is hidden from all sales channels',
            },
        ],
        default: 'DRAFT',
        description: 'The status of the product',
    },
    // Product Vendor
    {
        displayName: 'Vendor',
        name: 'productVendor',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        default: '',
        description: 'The vendor or manufacturer of the product',
        placeholder: 'e.g., Nike, Apple, Custom Brand',
    },
    // Product Type
    {
        displayName: 'Product Type',
        name: 'productType',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        default: '',
        description: 'The product type or category (e.g., Clothing, Electronics, Books)',
        placeholder: 'e.g., T-Shirts, Accessories, Digital Products',
    },
    // =============================================================================
    // VARIANTS MANAGEMENT (Behind Advanced Toggle)
    // =============================================================================
    {
        displayName: 'Manage Product Variants',
        name: 'manageVariants',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        default: false,
        description: 'Enable variant management for products with multiple options (size, color, etc.)',
    },
    // Product Variants Collection
    {
        displayName: 'Product Variants',
        name: 'productVariants',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
                manageVariants: [true],
            },
        },
        default: {},
        description: 'Product variants with pricing, inventory, and options. Each variant represents a different combination of product options (e.g., Small/Red, Large/Blue).',
        options: [
            {
                name: 'variant',
                displayName: 'Variant',
                values: [
                    {
                        displayName: 'Variant Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                        description: 'Variant title (e.g., "Small / Red", "Large / Blue")',
                        placeholder: 'Small / Red',
                    },
                    {
                        displayName: 'SKU',
                        name: 'sku',
                        type: 'string',
                        default: '',
                        description: 'Stock Keeping Unit identifier',
                        placeholder: 'TSH-SM-RED-001',
                    },
                    {
                        displayName: 'Price',
                        name: 'price',
                        type: 'string',
                        default: '',
                        description: 'Variant price (e.g., "19.99")',
                        placeholder: '19.99',
                    },
                    {
                        displayName: 'Compare At Price',
                        name: 'compareAtPrice',
                        type: 'string',
                        default: '',
                        description: 'Original price for comparison (crossed out price)',
                        placeholder: '29.99',
                    },
                    {
                        displayName: 'Inventory Quantity',
                        name: 'inventoryQuantity',
                        type: 'number',
                        default: 0,
                        description: 'Available inventory quantity',
                    },
                    {
                        displayName: 'Track Inventory',
                        name: 'inventoryManagement',
                        type: 'options',
                        options: [
                            {
                                name: 'Shopify',
                                value: 'SHOPIFY',
                                description: 'Track inventory using Shopify',
                            },
                            {
                                name: 'Not Tracked',
                                value: 'NOT_MANAGED',
                                description: 'Do not track inventory',
                            },
                        ],
                        default: 'NOT_MANAGED',
                        description: 'How inventory is tracked for this variant',
                    },
                    {
                        displayName: 'Weight (grams)',
                        name: 'weight',
                        type: 'number',
                        default: 0,
                        description: 'Variant weight in grams (for shipping calculations)',
                    },
                    {
                        displayName: 'Requires Shipping',
                        name: 'requiresShipping',
                        type: 'boolean',
                        default: true,
                        description: 'Whether this variant requires shipping',
                    },
                    {
                        displayName: 'Taxable',
                        name: 'taxable',
                        type: 'boolean',
                        default: true,
                        description: 'Whether this variant is subject to taxes',
                    },
                ],
            },
        ],
    },
    // =============================================================================
    // SEO & METADATA (Behind Advanced Toggle)
    // =============================================================================
    {
        displayName: 'SEO & Metadata Options',
        name: 'manageSEO',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
            },
        },
        default: false,
        description: 'Enable SEO settings and metadata management',
    },
    // SEO Title
    {
        displayName: 'SEO Title',
        name: 'seoTitle',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
                manageSEO: [true],
            },
        },
        default: '',
        description: 'SEO title for search engines (recommended: 50-60 characters)',
        placeholder: 'Awesome T-Shirt - Comfortable & Stylish',
    },
    // SEO Description
    {
        displayName: 'SEO Description',
        name: 'seoDescription',
        type: 'string',
        typeOptions: {
            rows: 3,
        },
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
                manageSEO: [true],
            },
        },
        default: '',
        description: 'SEO meta description for search engines (recommended: 150-160 characters)',
        placeholder: 'Discover our premium t-shirt collection. Made from 100% organic cotton...',
    },
    // Product Tags
    {
        displayName: 'Product Tags',
        name: 'productTags',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['product'],
                operation: ['create', 'update'],
                showAdvancedOptions: [true],
                manageSEO: [true],
            },
        },
        default: '',
        description: 'Comma-separated tags for organization and filtering',
        placeholder: 'clothing, t-shirt, cotton, casual, summer',
    },
];
