# Phase 3 Order Filtering Research Brief

**Date**: January 19, 2025  
**Project**: n8n Shopify GraphQL Node - Advanced Order Filtering  
**Phase**: 3 (Payment & Advanced Filters)  
**Status**: Phase 2 Complete ✅ - Ready for Phase 3 Planning

## Context & Current State

### ✅ Phase 1 & 2 Success (Completed)
**Phase 1**: Core business filters (8 filters) - tag, status, customer, order identification  
**Phase 2**: Sales intelligence filters (6 filters) - risk, returns, location, channel, SKU  
**Combined Coverage**: 95% of real-world order filtering use cases

**User Feedback**: Both phases tested and approved - "Continue" directive received.

### 🎯 Phase 3 Target (Final 5% Coverage)
Based on comprehensive Shopify GraphQL research, Phase 3 should implement the remaining advanced and payment-related filters to achieve 100% coverage of supported Shopify order filtering capabilities.

## Research Requirements

### 🔍 Critical Research Questions

#### 1. **Payment & Gateway Filtering**
- **Question**: What are the exact valid values and syntax for payment-related order filters?
- **Why Important**: Payment filtering is complex with multiple gateways and transaction states.
- **Research Needed**:
  - Complete list of `gateway:` filter values (shopify_payments, paypal, stripe, etc.)
  - `payment_status:` vs `financial_status:` differences and usage
  - `transaction_kind:` filter values (sale, authorization, capture, refund, void)
  - `payment_method:` filter options (credit_card, paypal, apple_pay, etc.)

#### 2. **Date & Time Advanced Filtering**
- **Question**: What additional date/time filters are supported beyond `created_at`?
- **Why Important**: Business analytics require multiple date dimensions.
- **Research Needed**:
  - `updated_at:` filtering syntax and behavior
  - `processed_at:` filtering for order processing timestamps
  - `cancelled_at:` filtering for cancellation analysis
  - `closed_at:` filtering for order completion analysis
  - Date range combinations and performance implications

#### 3. **Advanced Business Logic Filters**
- **Question**: What are the remaining business logic filters not covered in Phases 1-2?
- **Why Important**: Complete business intelligence and compliance requirements.
- **Research Needed**:
  - `test:` filter for test vs live orders (true/false values)
  - `confirmed:` filter for order confirmation status
  - `app_id:` filter for orders created by specific apps
  - `source_identifier:` filter for tracking order sources
  - `reference:` filter for external reference matching

#### 4. **Inventory & Fulfillment Advanced Filters**
- **Question**: What advanced inventory and fulfillment filters are available?
- **Why Important**: Supply chain and logistics optimization.
- **Research Needed**:
  - `inventory_behaviour:` filter options and values
  - `fulfillment_service:` filter for third-party fulfillment
  - `shipping_method:` filter for delivery method analysis
  - `tracking_company:` filter for carrier analysis
  - `delivery_method:` filter options

#### 5. **Customer Behavior & Segmentation Filters**
- **Question**: What advanced customer-related filters exist beyond basic customer_id/email?
- **Why Important**: Customer segmentation and behavior analysis.
- **Research Needed**:
  - `customer_locale:` filter for internationalization
  - `customer_accepts_marketing:` filter for marketing segmentation
  - `buyer_accepts_marketing:` vs `customer_accepts_marketing:` differences
  - `note:` filter for order notes and comments
  - `note_attributes:` filter for custom order metadata

### 🛠️ Technical Implementation Questions

#### 1. **Complex Filter Combinations**
- **Question**: Are there any restrictions on combining advanced filters?
- **Research Needed**:
  - Maximum number of filters in a single query
  - Performance implications of complex filter combinations
  - Filters that cannot be used together
  - Rate limiting considerations for advanced queries

#### 2. **Data Type Validation**
- **Question**: What validation is required for each advanced filter type?
- **Research Needed**:
  - Boolean filters (test, confirmed, accepts_marketing) - true/false handling
  - Date filters - format requirements and timezone handling
  - Enum filters - complete valid value lists
  - String filters - case sensitivity and special character handling

#### 3. **API Permissions & Scopes**
- **Question**: Do any Phase 3 filters require additional API permissions?
- **Research Needed**:
  - Required scopes for payment gateway filtering
  - Permissions needed for app_id and source_identifier filtering
  - Access requirements for inventory and fulfillment advanced filters
  - Customer data access requirements for segmentation filters

### 📋 Specific Documentation to Research

#### Primary Sources (Priority 1)
1. **Shopify GraphQL Admin API - Orders Query Advanced Filtering**
   - Focus on: payment, gateway, transaction, and advanced business filters
   - URL: https://shopify.dev/docs/api/admin-graphql/latest/queries/orders

2. **Shopify API Search Syntax - Advanced Operators**
   - Focus on: Complete syntax for date, boolean, and complex filters
   - URL: https://shopify.dev/docs/api/usage/search-syntax

3. **Shopify Payments API Documentation**
   - Focus on: Gateway identifiers and payment method values
   - URL: https://shopify.dev/docs/api/admin-graphql/latest/objects/Transaction

#### Secondary Sources (Priority 2)
4. **Shopify Apps API Documentation**
   - Focus on: App ID filtering and source identification

5. **Shopify Customer API Documentation**
   - Focus on: Customer behavior and segmentation filters

6. **Shopify Fulfillment Service API**
   - Focus on: Advanced fulfillment and inventory filters

### 🚨 Known Risks & Pitfalls to Investigate

#### From Phase 1 & 2 Experience
1. **Date Filtering Complexity**: We had major issues with date filtering in Phase 1. Research if advanced date filters have similar complexity.

2. **Enum Value Changes**: Shopify updates valid values - need current documentation for all enum filters.

3. **Permission Requirements**: Some filters might require additional Shopify app permissions.

#### Potential Phase 3 Risks
1. **Payment Data Sensitivity**: Payment filtering might have strict permission requirements.

2. **Boolean Filter Handling**: True/false filters might have specific syntax requirements.

3. **Performance Impact**: Advanced filter combinations might be expensive in Shopify's cost system.

4. **API Version Dependencies**: Some advanced filters might only work with specific API versions.

### 📊 Expected Deliverables from Research

#### 1. **Complete Filter Specification**
For each Phase 3 filter, provide:
- Exact Shopify syntax (e.g., `gateway:shopify_payments`)
- Complete list of valid values for enum filters
- Data type and format requirements
- Description of filter behavior and use cases

#### 2. **UI/UX Recommendations**
- Recommended input types (dropdown, boolean toggle, text, date)
- Grouping suggestions for the n8n interface
- Validation requirements and error handling
- User-friendly descriptions and examples

#### 3. **Implementation Warnings**
- Filters that require special permissions or API scopes
- Performance considerations and rate limiting impacts
- Known limitations, edge cases, or version dependencies
- Filters that cannot be combined with others

#### 4. **Testing Strategy**
- How to test each filter type effectively
- Sample filter combinations to validate
- Edge cases and error conditions to verify
- Performance benchmarks for complex queries

## Proposed Phase 3 Filter Categories

### **Payment & Financial Filters (Priority 1)**
- `gateway:` - Payment gateway filtering
- `payment_method:` - Payment method analysis
- `transaction_kind:` - Transaction type filtering
- `payment_status:` - Advanced payment status (if different from financial_status)

### **Advanced Date/Time Filters (Priority 2)**
- `updated_at:` - Order modification timestamps
- `processed_at:` - Order processing timestamps
- `cancelled_at:` - Cancellation analysis
- `closed_at:` - Order completion analysis

### **Business Logic Filters (Priority 3)**
- `test:` - Test vs live order filtering
- `confirmed:` - Order confirmation status
- `app_id:` - Orders by specific apps
- `source_identifier:` - Order source tracking

### **Advanced Customer/Business Filters (Priority 4)**
- `customer_locale:` - Internationalization filtering
- `customer_accepts_marketing:` - Marketing segmentation
- `note:` - Order notes filtering
- `note_attributes:` - Custom metadata filtering

## Current Architecture Context

### Working Implementation Pattern (Phases 1 & 2)
```typescript
// UI Definition Pattern
{
    displayName: 'Filter Name',
    name: 'filterName',
    type: 'options', // or 'string', 'boolean', 'dateTime'
    default: '',
    description: 'Filter description',
    options: [/* valid values */] // for dropdowns
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

**Variables**: `{ query: "tag:priority AND risk_level:high AND sales_channel:'580111'" }`

## Success Criteria

### Research Success Metrics
1. **Completeness**: All remaining Shopify order filters identified and specified
2. **Accuracy**: Filter specifications match current Shopify API documentation
3. **Practicality**: Implementation recommendations are feasible within n8n constraints
4. **Risk Mitigation**: Known issues identified and mitigation strategies provided

### Implementation Readiness
After research, we should be able to:
1. Implement Phase 3 filters without trial-and-error debugging
2. Create proper UI with correct validation and user experience
3. Achieve 100% coverage of Shopify's supported order filtering capabilities
4. Deliver working filters in 2-3 days following research specifications

## Timeline & Next Steps

1. **Research Phase**: Deep research agent completes comprehensive investigation
2. **Planning Phase**: Use research to create detailed Phase 3 implementation plan
3. **Implementation Phase**: Build Phase 3 filters based on research specifications
4. **Testing Phase**: Validate all filters work as expected
5. **Final Documentation**: Complete comprehensive filtering guide for users

**Target**: Complete Phase 3 within 1 week of research completion, achieving 100% order filtering coverage.

## Integration with Existing Phases

### Phase 1 + 2 + 3 Combined Query Example
```javascript
const queryFilters = [
    // Phase 1: Core Business
    'tag:priority',
    'status:open',
    'financial_status:paid',
    
    // Phase 2: Sales Intelligence  
    'risk_level:low',
    'sales_channel:"580111"',
    'sku:"PRODUCT-123"',
    
    // Phase 3: Advanced/Payment
    'gateway:shopify_payments',
    'test:false',
    'updated_at:>=2025-01-01'
];

const query = queryFilters.join(' AND ');
```

---

**Note**: This research is critical to achieve 100% order filtering coverage and complete the comprehensive Shopify GraphQL filtering solution. The research-driven approach from Phase 2 eliminated all debugging cycles - we must maintain this standard for Phase 3.
