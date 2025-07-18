# Shopify GraphQL Node - Testing & Validation Guide

This guide is for developers maintaining and extending the Shopify GraphQL node. Follow these procedures to ensure code quality and functionality.

## Pre-Development Checklist

1. **Review the plan.md file** - Always start here for current status and file structure
2. **Check TypeScript compilation**: `npx tsc --noEmit`
3. **Verify build process**: `npm run build`
4. **Clean workspace**: Remove any temporary or test files

## Development Testing Workflow

### 1. Code Structure Validation

```bash
# Verify TypeScript compilation
npx tsc --noEmit

# Check linting
npm run lint

# Build the project
npm run build
```

### 2. Node Structure Testing

Create a temporary test file (remember to delete after use):

```javascript
// temp-test.js - DELETE AFTER USE
const { ShopifyGraphql } = require('./dist/nodes/ShopifyGraphql/ShopifyGraphql.node.js');

const node = new ShopifyGraphql();
console.log('✅ Node name:', node.description.displayName);
console.log('✅ Properties count:', node.description.properties.length);
console.log('✅ Resources:', node.description.properties.find(p => p.name === 'resource')?.options?.map(o => o.value));

// Clean up: rm temp-test.js
```

### 3. Helper Functions Testing

Create a temporary test file (remember to delete after use):

```javascript
// temp-helpers-test.js - DELETE AFTER USE
const { shopifyGraphqlApiRequest, shopifyGraphqlApiRequestAllItems } = require('./dist/nodes/ShopifyGraphql/GenericFunctions.js');

console.log('✅ shopifyGraphqlApiRequest:', typeof shopifyGraphqlApiRequest);
console.log('✅ shopifyGraphqlApiRequestAllItems:', typeof shopifyGraphqlApiRequestAllItems);

// Clean up: rm temp-helpers-test.js
```

### 4. GraphQL Query Validation

Verify all GraphQL queries are syntactically correct:

```javascript
// temp-query-test.js - DELETE AFTER USE
const queries = {
  customerGet: `query getCustomer($id: ID!) { customer(id: $id) { id email } }`,
  customerGetAll: `query getCustomers($first: Int!, $after: String) { customers(first: $first, after: $after) { edges { node { id } } pageInfo { hasNextPage endCursor } } }`,
  orderGet: `query getOrder($id: ID!) { order(id: $id) { id name } }`,
  productGet: `query getProduct($id: ID!) { product(id: $id) { id title } }`
};

Object.entries(queries).forEach(([name, query]) => {
  console.log(`✅ ${name}:`, query.includes('query '));
});

// Clean up: rm temp-query-test.js
```

## Integration Testing (With Real Shopify Store)

### Prerequisites
- Shopify development store
- Admin API access token
- Test data (customers, orders, products)

### Test Scenarios

1. **Credentials Test**
   - Create credentials in n8n
   - Test connection using the built-in test
   - Verify shop information is returned

2. **Customer Operations**
   ```json
   // Test single customer fetch
   {
     "resource": "customer",
     "operation": "get",
     "customerId": "REAL_CUSTOMER_ID"
   }
   
   // Test batch customer fetch
   {
     "resource": "customer",
     "operation": "getAll",
     "batchSize": 10,
     "maxItems": 50
   }
   
   // Test customer search
   {
     "resource": "customer",
     "operation": "search",
     "searchQuery": "state:enabled",
     "batchSize": 10,
     "maxItems": 20
   }
   ```

3. **Order Operations**
   ```json
   // Test single order fetch
   {
     "resource": "order",
     "operation": "get",
     "orderId": "REAL_ORDER_ID"
   }
   
   // Test batch order fetch
   {
     "resource": "order",
     "operation": "getAll",
     "batchSize": 5,
     "maxItems": 25
   }
   ```

4. **Product Operations**
   ```json
   // Test single product fetch
   {
     "resource": "product",
     "operation": "get",
     "productId": "REAL_PRODUCT_ID"
   }
   
   // Test batch product fetch
   {
     "resource": "product",
     "operation": "getAll",
     "batchSize": 10,
     "maxItems": 50
   }
   ```

## Error Testing

### Rate Limiting
1. Set very high batch sizes (250+) and maxItems (10000+)
2. Verify the node handles rate limiting gracefully
3. Check for exponential backoff in logs

### Authentication Errors
1. Use invalid shop name
2. Use invalid access token
3. Use unsupported API version
4. Verify error messages are clear

### Data Errors
1. Use non-existent customer/order/product IDs
2. Use invalid search queries
3. Verify graceful error handling

## Performance Testing

### Batch Size Optimization
Test different batch sizes and measure:
- Total execution time
- API cost consumption
- Memory usage
- Error rates

### Large Dataset Testing
- Test with 1000+ customers
- Test with 500+ orders
- Test with 2000+ products
- Monitor for memory leaks or timeouts

## Code Quality Checks

### Before Committing
```bash
# Format code
npm run format

# Fix linting issues
npm run lintfix

# Verify build
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### File Structure Validation
- Ensure no temporary test files remain
- Verify all critical files are documented in plan.md
- Check that dist/ contains expected build output

## Regression Testing

After any changes to critical files:

1. **ShopifyGraphql.node.ts changes**:
   - Test all operations (get, getAll, search)
   - Test all resources (customer, order, product)
   - Verify error handling still works

2. **GenericFunctions.ts changes**:
   - Test API request functionality
   - Test batch processing
   - Test rate limiting handling
   - Test pagination

3. **Credentials changes**:
   - Test authentication
   - Test credential validation
   - Test connection test functionality

## Documentation Updates

After any changes:
1. Update plan.md with changes made
2. Update USAGE_EXAMPLES.md if new features added
3. Update README.md if necessary
4. Document any new files or scripts

## Cleanup Checklist

Before finishing any development session:
- [ ] Remove all temporary test files
- [ ] Update plan.md with current status
- [ ] Verify TypeScript compilation
- [ ] Run `npm run build` successfully
- [ ] Document any known issues or next steps
- [ ] Commit changes with descriptive messages

## Emergency Recovery

If the project becomes corrupted:
1. Check git history for last working state
2. Review plan.md for file structure
3. Verify critical files are intact:
   - `nodes/ShopifyGraphql/ShopifyGraphql.node.ts`
   - `nodes/ShopifyGraphql/GenericFunctions.ts`
   - `credentials/ShopifyGraphqlApi.credentials.ts`
4. Run build process to regenerate dist/
5. Update plan.md with recovery actions taken
