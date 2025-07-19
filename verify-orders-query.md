# Orders Query Modular UI Testing Verification

## Test Cases for Dynamic Query Building

### Test Case 1: Minimal Query (All toggles OFF)
**Expected:** Basic order fields only
- id, name, email, phone, dates, status, totalPriceSet

### Test Case 2: Customer Information Toggle ON
**Expected:** Basic fields + customer fragment
- All basic fields
- customer { id, firstName, lastName, email, phone, verifiedEmail, defaultAddress }

### Test Case 3: Line Items Toggle ON
**Expected:** Basic fields + lineItems fragment
- All basic fields  
- lineItems(first: 250) with product/variant details

### Test Case 4: Tax Details Toggle ON
**Expected:** Basic fields + tax fragment
- All basic fields
- taxLines, totalTaxSet, currentTotalTaxSet

### Test Case 5: Addresses Toggle ON
**Expected:** Basic fields + addresses fragment
- All basic fields
- shippingAddress, billingAddress

### Test Case 6: All Main Toggles ON
**Expected:** All fragments combined
- All basic fields + customer + lineItems + tax + addresses

### Test Case 7: Advanced Options Testing
**Line Items Limit:** Should only appear when Include Line Items = true
**Shipping Lines:** Should add shippingLines fragment
**Fulfillment Details:** Should add fulfillments fragment
**Custom Attributes:** Should add customAttributes + note
**Financial Details:** Should add transactions + pricing fragments

## Manual Testing Steps

1. Install updated node in n8n Docker environment
2. Create new workflow with Shopify GraphQL node
3. Configure credentials and select Orders resource
4. Test each toggle combination above
5. Verify query output matches expected fragments
6. Check performance with different lineItemsLimit values
7. Validate all advanced options work correctly

## Success Criteria

✅ TypeScript compilation clean
✅ All UI toggles display correctly based on displayOptions
✅ Dynamic query building works for get operation  
✅ Dynamic query building works for getAll operation
✅ Line Items Limit only shows when Include Line Items = true
✅ Query fragments combine correctly without syntax errors
✅ Advanced options all function as expected

## Next Steps After Testing

1. Document new modular UI in USAGE_EXAMPLES.md
2. Update README with enhanced orders query capabilities
3. Test in production environment with real Shopify store
4. Validate performance impact of different toggle combinations
