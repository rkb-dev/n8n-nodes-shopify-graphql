# Shopify GraphQL Node - Usage Examples

This document provides comprehensive examples of how to use the Shopify GraphQL node in n8n workflows.

## Prerequisites

1. **Shopify Store**: You need a Shopify store with Admin API access
2. **Access Token**: Create a private app or use Shopify CLI to get an access token
3. **API Version**: Use a supported Shopify Admin API version (e.g., 2024-07)

## Setting Up Credentials

1. In n8n, go to **Credentials** → **Create New**
2. Search for "Shopify GraphQL API"
3. Fill in:
   - **Shop Name**: `your-shop-name` (without .myshopify.com)
   - **Access Token**: Your Shopify Admin API access token
   - **API Version**: `2024-07` (or your preferred version)

## Customer Operations

### Get Single Customer
```json
{
  "resource": "customer",
  "operation": "get",
  "customerId": "123456789"
}
```

### Get All Customers (Batched)
```json
{
  "resource": "customer",
  "operation": "getAll",
  "batchSize": 100,
  "maxItems": 1000
}
```

### Search Customers
```json
{
  "resource": "customer",
  "operation": "search",
  "searchQuery": "email:john@example.com",
  "batchSize": 50,
  "maxItems": 500
}
```

**Search Query Examples:**
- `email:john@example.com` - Find customer by email
- `first_name:John` - Find customers by first name
- `last_name:Doe` - Find customers by last name
- `phone:+1234567890` - Find customer by phone
- `state:enabled` - Find enabled customers
- `created_at:>2024-01-01` - Find customers created after date

## Order Operations

The Orders resource features a **modular query system** that allows you to select exactly which data you need, optimizing performance and reducing API costs.

### Basic Order Query (Minimal Data)
```json
{
  "resource": "order",
  "operation": "get",
  "orderId": "987654321"
}
```
**Returns:** Basic order info (id, name, email, phone, dates, status, totalPrice)

### Enhanced Order Query with Customer Information
```json
{
  "resource": "order",
  "operation": "get",
  "orderId": "987654321",
  "includeCustomer": true
}
```
**Returns:** Basic order info + customer details (name, email, phone, default address)

### Complete Order Query with Line Items
```json
{
  "resource": "order",
  "operation": "get",
  "orderId": "987654321",
  "includeCustomer": true,
  "includeLineItems": true,
  "includeTaxDetails": true,
  "includeAddresses": true,
  "ordersAdvancedOptions": {
    "lineItemsLimit": 250,
    "includeShippingLines": true,
    "includeFulfillmentDetails": true
  }
}
```
**Returns:** Complete order data with all business details

### Bulk Orders with Selective Data
```json
{
  "resource": "order",
  "operation": "getAll",
  "batchSize": 50,
  "maxItems": 2000,
  "includeLineItems": true,
  "includeTaxDetails": true,
  "ordersAdvancedOptions": {
    "lineItemsLimit": 100,
    "includeFinancialDetails": true
  }
}
```
**Returns:** Bulk orders with line items, tax details, and financial information

## Modular Orders Query Options

### Main Data Toggles

| Toggle | Description | Adds to Query |
|--------|-------------|---------------|
| `includeCustomer` | Customer details | Customer info, email, phone, default address |
| `includeLineItems` | Product line items | Products, variants, quantities, SKUs, pricing |
| `includeTaxDetails` | Tax calculations | Tax lines, rates, total tax amounts |
| `includeAddresses` | Billing/shipping | Full billing and shipping address details |

### Advanced Options Collection

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lineItemsLimit` | number | 250 | Max line items per order (1-250) |
| `includeShippingLines` | boolean | false | Shipping methods and costs |
| `includeFulfillmentDetails` | boolean | false | Tracking info and fulfillment status |
| `includeCustomAttributes` | boolean | false | Custom order attributes and notes |
| `includeFinancialDetails` | boolean | false | Transactions and payment details |

### Performance Optimization Examples

#### Light Query (Fast, Low API Cost)
```json
{
  "resource": "order",
  "operation": "getAll",
  "batchSize": 250,
  "maxItems": 5000
}
```
**Use Case:** Order status monitoring, basic reporting

#### Medium Query (Balanced)
```json
{
  "resource": "order",
  "operation": "getAll",
  "batchSize": 100,
  "maxItems": 2000,
  "includeCustomer": true,
  "includeLineItems": true,
  "ordersAdvancedOptions": {
    "lineItemsLimit": 50
  }
}
```
**Use Case:** Sales analysis, customer insights

#### Heavy Query (Complete Data)
```json
{
  "resource": "order",
  "operation": "getAll",
  "batchSize": 25,
  "maxItems": 500,
  "includeCustomer": true,
  "includeLineItems": true,
  "includeTaxDetails": true,
  "includeAddresses": true,
  "ordersAdvancedOptions": {
    "lineItemsLimit": 250,
    "includeShippingLines": true,
    "includeFulfillmentDetails": true,
    "includeCustomAttributes": true,
    "includeFinancialDetails": true
  }
}
```
**Use Case:** Data migration, comprehensive analysis, accounting integration

## Product Operations

### Get Single Product
```json
{
  "resource": "product",
  "operation": "get",
  "productId": "456789123"
}
```

### Get All Products (Batched)
```json
{
  "resource": "product",
  "operation": "getAll",
  "batchSize": 100,
  "maxItems": 5000
}
```

## Advanced Configuration

### Batch Size Guidelines
- **Small stores** (< 1000 items): Use batch size 50-100
- **Medium stores** (1000-10000 items): Use batch size 100-200
- **Large stores** (> 10000 items): Use batch size 200-250 (max)

### Rate Limiting
The node automatically handles Shopify's cost-based rate limiting:
- Monitors API cost in responses
- Implements exponential backoff on rate limit hits
- Adjusts batch sizes based on API cost feedback

### Error Handling
- **Continue on Fail**: Enable to process remaining items if one fails
- **Detailed Errors**: Error messages include Shopify API details
- **Retry Logic**: Automatic retry on temporary failures

## Common Workflow Patterns

### 1. Customer Data Export
```
Start → Shopify GraphQL (Get All Customers) → Transform Data → Export to CSV
```

### 2. Order Processing
```
Schedule → Shopify GraphQL (Get All Orders) → Filter New Orders → Process → Update Database
```

### 3. Product Sync
```
HTTP Request (External API) → Transform → Shopify GraphQL (Get Product) → Compare → Update if Changed
```

### 4. Customer Search and Update
```
Manual Trigger → Shopify GraphQL (Search Customers) → Filter Results → Update Customer Data
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify shop name (without .myshopify.com)
   - Check access token permissions
   - Ensure API version is supported

2. **Rate Limiting**
   - Reduce batch size
   - Add delays between requests
   - Monitor API cost in responses

3. **GraphQL Errors**
   - Check field permissions in your app
   - Verify resource IDs are valid
   - Review Shopify API documentation

### Performance Tips

1. **Use appropriate batch sizes** for your store size
2. **Set maxItems limits** to avoid overwhelming workflows
3. **Enable continue-on-fail** for bulk operations
4. **Monitor API costs** in node outputs

## API Cost Information

Shopify uses a cost-based rate limiting system:
- **Single queries**: Max 1,000 points
- **Batch queries**: Each item costs points
- **Rate limit**: 1,000 points per second (replenished over time)

The node automatically manages these costs and provides feedback in the response data.

## Support

For issues or questions:
1. Check the Shopify GraphQL API documentation
2. Review n8n community forums
3. Verify your app permissions in Shopify Admin
4. Test with smaller batch sizes first
