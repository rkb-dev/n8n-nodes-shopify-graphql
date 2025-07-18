# Local Testing Setup - Shopify GraphQL Node

This guide shows you how to test the Shopify GraphQL node locally with your own n8n installation before publishing.

## Prerequisites

1. **n8n installed locally** (not n8n cloud)
2. **Node.js and npm** installed
3. **Shopify development store** or access to a Shopify store
4. **Shopify Admin API access token**

## Method 1: NPM Link (Recommended for Development)

This method creates a symlink so changes to your code are immediately reflected in n8n.

### Step 1: Build the Node
```bash
cd /Users/amad/CascadeProjects/n8n-nodes-shopify-graphql
npm install
npm run build
```

### Step 2: Create NPM Link
```bash
# In the node directory
npm link
```

### Step 3: Link to n8n Installation
```bash
# Find your n8n installation directory
# If installed globally: usually /usr/local/lib/node_modules/n8n
# If using npx: ~/.npm/_npx/*/node_modules/n8n

# Example for global installation:
cd /usr/local/lib/node_modules/n8n
npm link n8n-nodes-shopify-graphql

# Example for npx installation:
# You may need to find the exact path with: find ~/.npm -name "n8n" -type d
```

### Step 4: Restart n8n
```bash
# Stop n8n if running, then start again
n8n start
```

## Method 2: Direct Installation (Simpler Setup)

This method installs the node directly without publishing to NPM.

### Step 1: Build and Pack
```bash
cd /Users/amad/CascadeProjects/n8n-nodes-shopify-graphql
npm run build
npm pack
```

This creates a file like `n8n-nodes-shopify-graphql-0.1.0.tgz`

### Step 2: Install in n8n
```bash
# If n8n is installed globally
npm install -g /Users/amad/CascadeProjects/n8n-nodes-shopify-graphql/n8n-nodes-shopify-graphql-0.1.0.tgz

# If n8n is installed locally in a project
cd /path/to/your/n8n/project
npm install /Users/amad/CascadeProjects/n8n-nodes-shopify-graphql/n8n-nodes-shopify-graphql-0.1.0.tgz
```

### Step 3: Restart n8n
```bash
n8n start
```

## Method 3: Docker Development (If using Docker)

### Step 1: Build the Node
```bash
cd /Users/amad/CascadeProjects/n8n-nodes-shopify-graphql
npm run build
npm pack
```

### Step 2: Create Custom Docker Image
Create a `Dockerfile`:
```dockerfile
FROM n8nio/n8n:latest

USER root
COPY n8n-nodes-shopify-graphql-0.1.0.tgz /tmp/
RUN npm install -g /tmp/n8n-nodes-shopify-graphql-0.1.0.tgz
USER node
```

### Step 3: Build and Run
```bash
docker build -t n8n-with-shopify-graphql .
docker run -p 5678:5678 n8n-with-shopify-graphql
```

## Verification Steps

### 1. Check Node Registration
1. Open n8n in browser (usually http://localhost:5678)
2. Create a new workflow
3. Click the "+" to add a node
4. Search for "Shopify GraphQL"
5. You should see the "Shopify GraphQL" node appear

### 2. Test Credentials
1. Go to **Credentials** → **Add New**
2. Search for "Shopify GraphQL API"
3. Fill in your test credentials:
   - **Shop Name**: `your-dev-store` (without .myshopify.com)
   - **Access Token**: Your development store access token
   - **API Version**: `2024-07`
4. Click **Test** - should show "Connection successful"

### 3. Test Basic Operations
1. Add the Shopify GraphQL node to a workflow
2. Select your credentials
3. Try a simple operation:
   - **Resource**: Customer
   - **Operation**: Get All
   - **Batch Size**: 10
   - **Max Items**: 50
4. Execute the workflow

## Getting Shopify Test Credentials

### Option 1: Shopify Development Store
1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a partner account
3. Create a development store
4. In the store admin, go to **Apps** → **App and sales channel settings**
5. Click **Develop apps**
6. Create a private app with Admin API access
7. Copy the access token

### Option 2: Existing Store (Careful!)
1. Go to your Shopify admin
2. **Apps** → **App and sales channel settings**
3. **Develop apps** → **Create an app**
4. Configure Admin API access scopes:
   - `read_customers`
   - `read_orders`
   - `read_products`
5. Install the app and copy the access token

## Troubleshooting

### Node Not Appearing
1. **Check build**: `npm run build` should complete without errors
2. **Check n8n logs**: Look for loading errors
3. **Verify installation**: Check if the package is in node_modules
4. **Restart n8n**: Always restart after installing nodes

### Credentials Test Failing
1. **Check shop name**: Should be just the subdomain (no .myshopify.com)
2. **Verify access token**: Should be from Admin API, not Storefront API
3. **Check API version**: Use supported version (2024-07 or later)
4. **Test manually**: Try the GraphQL endpoint with curl

### API Errors
1. **Rate limiting**: Reduce batch size if getting throttled
2. **Permissions**: Ensure your app has required scopes
3. **Invalid IDs**: Use real customer/order/product IDs from your store

## Development Workflow

### Making Changes
1. Edit source files in `/Users/amad/CascadeProjects/n8n-nodes-shopify-graphql`
2. Run `npm run build`
3. If using npm link: Changes are automatically available
4. If using direct install: Reinstall the package
5. Restart n8n
6. Test your changes

### Testing Different Scenarios
1. **Small datasets**: Test with 10-50 items
2. **Large datasets**: Test with 1000+ items
3. **Error conditions**: Test with invalid IDs, wrong credentials
4. **Rate limiting**: Test with high batch sizes
5. **Different resources**: Test customers, orders, products

## Clean Up

### Remove NPM Link
```bash
# In n8n directory
npm unlink n8n-nodes-shopify-graphql

# In node directory
npm unlink
```

### Remove Direct Installation
```bash
npm uninstall n8n-nodes-shopify-graphql
```

## Next Steps

Once you've tested locally and everything works:
1. Update version in package.json
2. Update CHANGELOG.md
3. Run full test suite
4. Consider publishing to NPM
5. Submit to n8n community

## Security Notes

- **Never use production credentials** for testing
- **Use development stores** when possible
- **Limit API scopes** to minimum required
- **Don't commit credentials** to version control
