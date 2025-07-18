# n8n-nodes-shopify-graphql

A custom n8n community node for Shopify that leverages the GraphQL Admin API with smart batching and rate limiting.

## Features

- **GraphQL API Integration**: Uses Shopify's GraphQL Admin API instead of REST for more efficient data fetching
- **Smart Batching**: Automatically handles large datasets with intelligent batch sizing based on API cost limits
- **Rate Limit Management**: Built-in rate limit detection and adaptive delays to prevent throttling
- **Cursor-based Pagination**: Efficiently handles pagination for large result sets
- **Multiple Authentication Methods**: Supports API Key, Access Token, and OAuth2 authentication
- **Cost-aware Queries**: Monitors GraphQL query costs and optimizes batch sizes accordingly

## Supported Resources

### Customers
- **Get Customer**: Retrieve a single customer by ID
- **Get Many Customers**: Fetch multiple customers with batching
- **Search Customers**: Search customers by email, phone, or other criteria

### Orders
- **Get Order**: Retrieve a single order by ID
- **Get Many Orders**: Fetch multiple orders with batching and filtering

### Products
- **Get Product**: Retrieve a single product by ID
- **Get Many Products**: Fetch multiple products with batching

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** → **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-shopify-graphql`
4. Agree to the risks of using community nodes
5. Select **Install**

After installation restart n8n to register the new nodes.

### Manual installation

1. Install the package in your n8n root folder:

```bash
npm install n8n-nodes-shopify-graphql
```

2. Restart n8n to register the new nodes.

## Configuration

### Credentials

Create a new "Shopify GraphQL API" credential with:

- **Shop Name**: Your Shopify shop name (without .myshopify.com)
- **Access Token**: Your Shopify Admin API access token
- **API Version**: The Shopify API version to use (e.g., "2024-01")

### Node Parameters

- **Resource**: Select the resource type (Customers, Orders, Products)
- **Operation**: Choose the operation to perform
- **Batch Size**: Number of items to fetch per request (1-250, default: 50)
- **Max Items**: Maximum total items to fetch (0 = unlimited)
- **Additional Fields**: Include extra fields like metafields, tags, etc.

## Authentication

### Getting a Shopify Access Token

1. Go to your Shopify Admin panel
2. Navigate to Apps > App and sales channel settings
3. Click "Develop apps for your store"
4. Create a new app or select an existing one
5. Configure the Admin API access scopes you need:
   - `read_customers` for customer data
   - `read_orders` for order data
   - `read_products` for product data
6. Install the app and copy the Admin API access token

### Required Scopes

Make sure your Shopify app has the following scopes:
- `read_customers` - For customer operations
- `read_orders` - For order operations  
- `read_products` - For product operations

## Usage Examples

### Fetch All Customers
1. Add the Shopify GraphQL node to your workflow
2. Select "Customers" as the resource
3. Select "Get Many" as the operation
4. Set batch size to 100 and max items to 1000
5. Execute the node

### Search for Customers
1. Select "Customers" as the resource
2. Select "Search" as the operation
3. Enter search query (e.g., "email:john@example.com")
4. Execute the node

### Get Recent Orders
1. Select "Orders" as the resource
2. Select "Get Many" as the operation
3. Set date filters if needed
4. Execute the node

## Rate Limiting

The node automatically handles Shopify's GraphQL rate limiting:

- **Cost-based System**: Shopify GraphQL uses a cost-based rate limiting system (max 1,000 points per query)
- **Smart Batching**: Automatically adjusts batch sizes based on available cost points
- **Adaptive Delays**: Waits for rate limit recovery when approaching limits
- **Exponential Backoff**: Implements backoff strategy for rate limit errors

## Error Handling

The node provides detailed error messages for:
- Authentication failures
- Rate limit exceeded
- GraphQL query errors
- Invalid parameters
- Network connectivity issues

## Development

### Building the Node

```bash
npm run build
```

### Testing Locally

1. Link the package to your local n8n installation:
```bash
npm link
cd /path/to/n8n
npm link n8n-nodes-shopify-graphql
```

2. Restart n8n and test the node

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] Support for Shopify bulk operations (async data pulls)
- [ ] Additional resources (Inventory, Metafields, etc.)
- [ ] Write operations (Create, Update, Delete)
- [ ] Webhook support
- [ ] Advanced filtering and sorting options

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the n8n community forum
- Review Shopify's GraphQL API documentation
