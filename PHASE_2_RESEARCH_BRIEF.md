# Phase 2 Order Filtering Research Brief

**Date**: January 19, 2025  
**Project**: n8n Shopify GraphQL Node - Advanced Order Filtering  
**Phase**: 2 (Sales Intelligence Filters)  
**Status**: Phase 1 Complete ✅ - Ready for Phase 2 Planning

## Context & Current State

### ✅ Phase 1 Success (Just Completed)
We successfully implemented 8 core business filters:
- `tag:` and `tag_not:` - Order tagging system
- `status:` - Order lifecycle (open/closed/cancelled)
- `financial_status:` - Payment states (paid/pending/refunded/etc)
- `fulfillment_status:` - Shipping states (shipped/fulfilled/unfulfilled/etc)
- `name:` - Order number lookup
- `customer_id:` and `email:` - Customer identification

**User Feedback**: "looks good" - Phase 1 tested and approved for production use.

### 🎯 Phase 2 Target Filters (Sales Intelligence)
Based on Shopify GraphQL documentation research, Phase 2 should implement:

1. **`channel:`** - Sales channel filtering (web, pos, etc.)
2. **`source_name:`** - Order source (web, shopify_draft_order, etc.)
3. **`location_id:`** - Store location filtering
4. **`fulfillment_location_id:`** - Fulfillment location filtering
5. **`sku:`** - Product SKU filtering
6. **`risk_level:`** - Fraud risk assessment (high/medium/low/none/pending)
7. **`fraud_protection_level:`** - Fraud protection status
8. **`return_status:`** - Return processing status

## Research Requirements

### 🔍 Critical Research Questions

#### 1. **Sales Channel & Source Filtering**
- **Question**: What are the exact valid values for `channel:` and `source_name:` filters?
- **Why Important**: Phase 1 used hardcoded dropdown options. Need complete list of valid channels.
- **Research Needed**: 
  - Official Shopify documentation for all supported sales channels
  - Difference between `channel:` and `source_name:` filters
  - Common values used in real Shopify stores (web, pos, mobile, facebook, etc.)

#### 2. **Location-Based Filtering**
- **Question**: How do `location_id:` and `fulfillment_location_id:` work in practice?
- **Why Important**: Location filtering is complex - stores can have multiple locations.
- **Research Needed**:
  - How to get/validate location IDs in Shopify
  - Difference between order location and fulfillment location
  - Whether location filtering requires special permissions/scopes

#### 3. **Product SKU Filtering**
- **Question**: Does `sku:` filter work at the order level or line item level?
- **Why Important**: Orders contain multiple products - need to understand scope.
- **Research Needed**:
  - Shopify's SKU filtering behavior (does it match any line item?)
  - Performance implications of SKU filtering
  - Whether partial SKU matching is supported

#### 4. **Risk & Fraud Filtering**
- **Question**: What are the complete valid values and business logic for risk/fraud filters?
- **Why Important**: Fraud detection is sensitive - need accurate filter values.
- **Research Needed**:
  - All valid values for `risk_level:` and `fraud_protection_level:`
  - How Shopify's fraud detection system works
  - Whether these filters require special app permissions

#### 5. **Return Status Filtering**
- **Question**: What are all the valid return status values and their meanings?
- **Why Important**: Returns workflow is complex with multiple states.
- **Research Needed**:
  - Complete list of return status values
  - Return status lifecycle and transitions
  - Whether return filtering requires additional API scopes

### 🛠️ Technical Implementation Questions

#### 1. **UI/UX Design Patterns**
- **Question**: How should Phase 2 filters be organized in the n8n UI?
- **Research Needed**:
  - Should Phase 2 be a separate collection or extend existing "Order Filters"?
  - Best practices for location ID input (text field vs. dropdown vs. lookup?)
  - How to handle filters that might require API calls to populate options

#### 2. **Validation & Error Handling**
- **Question**: What validation is needed for each filter type?
- **Research Needed**:
  - Which filters accept free text vs. enum values
  - How to validate location IDs, SKUs, etc.
  - Error messages for invalid filter combinations

#### 3. **Performance & Rate Limiting**
- **Question**: Do any Phase 2 filters have performance implications?
- **Research Needed**:
  - Whether certain filters are more expensive in Shopify's cost system
  - If any filters require additional API calls
  - Rate limiting considerations for complex filter combinations

### 📋 Specific Documentation to Research

#### Primary Sources (Priority 1)
1. **Shopify GraphQL Admin API - Orders Query Documentation**
   - Focus on: channel, source_name, location_id, fulfillment_location_id filters
   - URL: https://shopify.dev/docs/api/admin-graphql/latest/queries/orders

2. **Shopify API Search Syntax Documentation**
   - Focus on: Complete valid values for each filter type
   - URL: https://shopify.dev/docs/api/usage/search-syntax

3. **Shopify Locations API Documentation**
   - Focus on: How location IDs work, how to validate them
   - URL: https://shopify.dev/docs/api/admin-graphql/latest/objects/Location

#### Secondary Sources (Priority 2)
4. **Shopify Risk Assessment Documentation**
   - Focus on: Fraud protection levels and risk assessment values

5. **Shopify Returns API Documentation**
   - Focus on: Return status values and workflow

6. **Community Examples & Forums**
   - Look for real-world usage examples of these filters
   - Common pitfalls or gotchas mentioned by developers

### 🚨 Known Risks & Pitfalls to Investigate

#### From Phase 1 Experience
1. **Date Filtering Failure**: We had major issues with date filtering. Research if any Phase 2 filters have similar complexity.

2. **API Scope Requirements**: Some filters might require additional Shopify app permissions.

3. **Enum Value Changes**: Shopify sometimes updates valid values - need current documentation.

#### Potential Phase 2 Risks
1. **Location ID Validation**: How to ensure location IDs are valid for the specific store?

2. **SKU Performance**: SKU filtering might be expensive if it searches all line items.

3. **Channel Complexity**: Sales channels might vary by Shopify plan or app installations.

### 📊 Expected Deliverables from Research

#### 1. **Complete Filter Specification**
For each Phase 2 filter, provide:
- Exact Shopify syntax (e.g., `channel:web`)
- Complete list of valid values
- Description of filter behavior
- Any validation requirements

#### 2. **UI/UX Recommendations**
- Recommended input types (dropdown, text, etc.)
- Grouping suggestions for the n8n interface
- Any special handling needed (lookups, validation, etc.)

#### 3. **Implementation Warnings**
- Filters that require special permissions
- Performance considerations
- Known limitations or edge cases

#### 4. **Testing Strategy**
- How to test each filter type
- Sample filter combinations to validate
- Edge cases to verify

## Current Architecture Context

### Working Implementation Pattern (Phase 1)
```typescript
// UI Definition Pattern
{
    displayName: 'Filter Name',
    name: 'filterName',
    type: 'options', // or 'string'
    default: '',
    description: 'Filter description',
    options: [/* valid values */]
}

// Query Building Pattern  
if (orderFilters.filterName) {
    queryFilters.push(`shopify_field:${orderFilters.filterName}`);
}
```

### Current Query Structure
```graphql
query getOrders($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query) {
        edges { node { /* fields */ } }
    }
}
```

**Variables**: `{ query: "tag:priority AND status:open AND financial_status:paid" }`

## Success Criteria

### Research Success Metrics
1. **Completeness**: All 8 Phase 2 filters fully specified
2. **Accuracy**: Filter specifications match current Shopify API
3. **Practicality**: Implementation recommendations are feasible
4. **Risk Mitigation**: Known issues identified and addressed

### Implementation Readiness
After research, we should be able to:
1. Implement Phase 2 filters without trial-and-error
2. Create proper UI with correct validation
3. Avoid the pitfalls that plagued date filtering
4. Deliver working filters in 2-3 days

## Timeline & Next Steps

1. **Research Phase**: Deep research agent completes investigation
2. **Planning Phase**: Use research to create detailed implementation plan
3. **Implementation Phase**: Build Phase 2 filters based on research
4. **Testing Phase**: Validate all filters work as expected
5. **User Feedback**: Get approval before Phase 3

**Target**: Complete Phase 2 within 1 week of research completion.

---

**Note**: This research is critical to avoid the repeated failures we experienced with date filtering. Take time to get it right rather than rushing to implementation.
