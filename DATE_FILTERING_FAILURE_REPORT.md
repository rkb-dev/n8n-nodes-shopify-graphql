# Date Filtering Failure Report - Shopify GraphQL n8n Node

**Date**: January 19, 2025  
**Issue**: Date range filtering (createdAfter/createdBefore) not working in orders query  
**Status**: UNRESOLVED after multiple attempts  
**Cost Impact**: High - multiple failed iterations  

## Problem Statement
The custom n8n Shopify GraphQL node successfully retrieves orders, customers, and products, but date range filtering for orders does not work. Orders from outside the specified date range are still returned, indicating the filters are being ignored by Shopify's API.

## What Has Been Tried

### Attempt 1: ISO 8601 Date Format
- **Approach**: Used full ISO timestamps (`2025-01-01T00:00:00Z`)
- **Implementation**: Converted n8n datetime to ISO format before filtering
- **Result**: FAILED - Shopify rejected the format
- **Code**: `created_at:>=${isoDate}`

### Attempt 2: Simple Date Format
- **Approach**: Used simple `YYYY-MM-DD` format
- **Implementation**: Extracted date part from n8n datetime input
- **Result**: FAILED - Orders outside range still returned
- **Code**: `created_at:>=${simpleDate}`

### Attempt 3: Direct Query String Embedding
- **Approach**: Embedded filter directly in GraphQL query string (no variables)
- **Implementation**: Built query string like `"created_at:>=2025-01-01 AND created_at:<=2025-01-31"`
- **Result**: FAILED - No filtering occurred
- **Code**: 
```graphql
query getOrders($first: Int!, $after: String) {
  orders(first: $first, after: $after, query: "created_at:>=2025-01-01") {
    edges { node { id createdAt } }
  }
}
```

### Attempt 4: Operator Variations
- **Tried**: `>`, `>=`, `<`, `<=` operators
- **Research**: Found Shopify docs showing both `>` and `>=` are valid
- **Implementation**: Changed from `>` to `>=` and `<` to `<=`
- **Result**: FAILED - Still no filtering

### Attempt 5: GraphQL Variables Approach
- **Research**: Investigated n8n GraphQL node implementation
- **Finding**: Official n8n GraphQL node uses separate `variables` object
- **Status**: NOT IMPLEMENTED - stopped before attempting due to cost concerns

## Current Implementation (Latest Attempt)
```typescript
// Extract date from n8n datetime input
const afterDate = createdAfter.split(' ')[0]; // "2025-01-01"
const beforeDate = createdBefore.split(' ')[0]; // "2025-01-31"

// Build query filter string
let queryFilters: string[] = [];
if (createdAfter) {
    queryFilters.push(`created_at:>=${afterDate}`);
}
if (createdBefore) {
    queryFilters.push(`created_at:<=${beforeDate}`);
}
const queryString = queryFilters.join(' AND ');

// Embed in GraphQL query
const query = `
    query getOrders($first: Int!, $after: String) {
        orders(first: $first, after: $after${queryString ? `, query: "${queryString}"` : ''}) {
            edges { node { id createdAt } }
        }
    }
`;
```

## Research Conducted

### Official Documentation Reviewed
1. **Shopify GraphQL Admin API docs** - orders query documentation
2. **Shopify API search syntax** - range query operators and formats
3. **n8n Shopify node source code** - REST API implementation patterns
4. **n8n GraphQL node source code** - variable handling patterns

### Key Findings
- Shopify supports both `>` and `>=` operators for date ranges
- Date format should be `YYYY-MM-DD` (not ISO 8601)
- Official examples show: `query: "updated_at:>2019-12-01"`
- n8n GraphQL node uses separate `variables` object in request body
- n8n Shopify node uses REST API with query string parameters

## Suspected Root Causes (Unverified)

1. **Request Construction Issue**: The way the GraphQL request is being sent to Shopify may not match expected format
2. **Variable vs Query String Confusion**: Mixing REST patterns with GraphQL patterns
3. **GenericFunctions Helper Issue**: The shared request helper may be transforming the query incorrectly
4. **API Version Mismatch**: Using wrong Shopify API version for the query syntax
5. **Authentication/Headers Issue**: Missing required headers or authentication for filtering

## Working Components
- ✅ Basic orders retrieval (without date filtering)
- ✅ Customer queries (get/getAll/search)
- ✅ Product queries (get/getAll/search)
- ✅ Modular UI for orders (toggles for customer info, line items, etc.)
- ✅ TypeScript compilation and build process
- ✅ n8n node structure and property definitions

## Repository State
- **GitHub**: `https://github.com/rkb-dev/n8n-nodes-shopify-graphql.git`
- **Last Commit**: `2b0e77f` - "Fix date filtering: change operators from >/< to >=/<="
- **Status**: Clean, documented, production-ready except for date filtering bug

## Recommendations for Next Developer

1. **Debug the actual GraphQL request** being sent to Shopify (add logging)
2. **Test with minimal hardcoded queries** to isolate the issue
3. **Compare with working Shopify GraphQL examples** from community
4. **Investigate if the issue is in GenericFunctions.ts** request helper
5. **Consider implementing proper GraphQL variables** instead of query string embedding
6. **Test with different Shopify API versions** to rule out version issues

## Files to Focus On
- `/nodes/ShopifyGraphql/ShopifyGraphql.node.ts` (lines 909-956) - Date filtering logic
- `/nodes/ShopifyGraphql/GenericFunctions.ts` - Request helper functions
- Test with simple cURL requests to Shopify API to verify syntax

**Bottom Line**: The architecture is sound, but something fundamental about how the date filter is being passed to or processed by Shopify's API is wrong. Needs deep debugging of the actual HTTP requests being made.
