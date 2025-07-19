# Google Sheets Node UX Research Findings

## Executive Summary

After deep analysis of the n8n Google Sheets node source code, I've identified the key patterns for dynamic, context-aware field loading that create the superior UX you described. These patterns can be directly applied to create dynamic metafield editing in the Shopify GraphQL node.

## Key Technical Discoveries

### 1. Dynamic Field Generation Architecture

**Core Pattern: `resourceMapper` with `loadOptionsDependsOn`**

The Google Sheets node uses a sophisticated `resourceMapper` type that automatically generates form fields based on API responses:

```typescript
{
    displayName: 'Columns',
    name: 'columns',
    type: 'resourceMapper',
    typeOptions: {
        loadOptionsDependsOn: ['sheetName.value'],
        resourceMapper: {
            resourceMapperMethod: 'getMappingColumns',
            mode: 'update',
            fieldWords: {
                singular: 'column',
                plural: 'columns',
            },
            addAllFields: true,
            multiKeyMatch: false,
        },
    },
}
```

**Key Technical Elements:**
- `loadOptionsDependsOn`: Triggers field refresh when dependencies change
- `resourceMapperMethod`: Points to method that fetches and formats dynamic fields
- `addAllFields`: Automatically includes all discovered fields
- Dynamic field generation happens client-side after API response

### 2. Search Functionality in Dropdowns

**Pattern: `resourceLocator` with `searchListMethod`**

```typescript
{
    displayName: 'Document',
    name: 'documentId',
    type: 'resourceLocator',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'spreadSheetsSearch',
                searchable: true,
            },
        }
    ]
}
```

**Key Technical Elements:**
- `resourceLocator`: Provides multiple input modes (list, URL, ID, name)
- `searchListMethod`: Points to method that handles search queries
- `searchable: true`: Enables search input within dropdown
- Built-in pagination and performance optimization

### 3. Loading States and Visual Indicators

**Pattern: Automatic Loading States with `loadOptionsDependsOn`**

The "Fetching columns..." indicator is automatically handled by n8n when:
- A field has `loadOptionsDependsOn` dependencies
- Dependencies change (e.g., sheet selection changes)
- The corresponding `loadOptionsMethod` is called

**Technical Implementation:**
```typescript
// In loadOptions methods
export async function getMappingColumns(
    this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
    // n8n automatically shows loading indicator here
    const documentId = this.getNodeParameter('documentId', 0);
    const sheetName = this.getNodeParameter('sheetName', 0);
    
    // API call to fetch dynamic fields
    const sheetData = await sheet.getData(`${sheetName}!1:1`);
    
    // Transform to field definitions
    const fields = columns.map(col => ({
        id: col,
        displayName: col,
        required: false,
        type: 'string',
        canBeUsedToMatch: true,
    }));
    
    return { fields };
}
```

### 4. Schema Change Detection and Refresh

**Pattern: Dependency-Based Refresh with Visual Indicators**

The yellow warning triangle + refresh mechanism works through:
- `loadOptionsDependsOn` dependency tracking
- Automatic cache invalidation when dependencies change
- Visual refresh indicators when schema mismatches are detected

**Technical Implementation:**
- n8n tracks field schema versions automatically
- When `loadOptionsDependsOn` values change, fields are re-fetched
- UI shows refresh indicators if cached schema differs from current

### 5. Dynamic Field Add/Remove Patterns

**Pattern: `fixedCollection` with Dynamic Options**

```typescript
{
    displayName: 'Values to Send',
    name: 'fieldsUi',
    type: 'fixedCollection',
    typeOptions: {
        multipleValues: true,
    },
    options: [
        {
            displayName: 'Field',
            name: 'values',
            values: [
                {
                    displayName: 'Column',
                    name: 'column',
                    type: 'options',
                    typeOptions: {
                        loadOptionsDependsOn: ['sheetName.value'],
                        loadOptionsMethod: 'getSheetHeaderRowAndAddColumn',
                    },
                }
            ]
        }
    ]
}
```

**Key Technical Elements:**
- `fixedCollection` with `multipleValues: true`: Enables add/remove functionality
- Dynamic options within collections update based on dependencies
- "Add column to send" pattern through special option values

### 6. Resource Mapping Method Implementation

**Core Pattern: `getMappingColumns` Method**

```typescript
export async function getMappingColumns(
    this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
    // Get context (document + sheet selection)
    const documentId = this.getNodeParameter('documentId', 0);
    const sheetName = this.getNodeParameter('sheetName', 0);
    
    // Fetch dynamic schema
    const sheet = new GoogleSheet(spreadsheetId, this);
    const sheetData = await sheet.getData(`${sheetName}!1:1`);
    
    // Transform to field definitions
    const fields: ResourceMapperField[] = columns.map(col => ({
        id: col,
        displayName: col,
        required: false,
        defaultMatch: col === 'id',
        display: true,
        type: 'string',
        canBeUsedToMatch: true,
    }));
    
    return { fields };
}
```

## Application to Shopify Metafields

### Recommended Implementation Strategy

**1. Product Selection with Search**
```typescript
{
    displayName: 'Product',
    name: 'productId',
    type: 'resourceLocator',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'productsSearch',
                searchable: true,
            },
        }
    ]
}
```

**2. Dynamic Metafield Loading**
```typescript
{
    displayName: 'Metafields',
    name: 'metafields',
    type: 'resourceMapper',
    typeOptions: {
        loadOptionsDependsOn: ['productId.value'],
        resourceMapper: {
            resourceMapperMethod: 'getProductMetafields',
            mode: 'update',
            fieldWords: {
                singular: 'metafield',
                plural: 'metafields',
            },
            addAllFields: true,
        },
    },
}
```

**3. Dynamic Metafield Discovery Method**
```typescript
export async function getProductMetafields(
    this: ILoadOptionsFunctions,
): Promise<ResourceMapperFields> {
    const productId = this.getNodeParameter('productId', 0);
    
    // Fetch product-specific metafields
    const query = `
        query getProductMetafields($id: ID!) {
            product(id: $id) {
                metafields(first: 100) {
                    edges {
                        node {
                            namespace
                            key
                            type
                            value
                        }
                    }
                }
            }
        }
    `;
    
    const response = await this.helpers.request({...});
    
    // Transform to field definitions
    const fields = response.data.product.metafields.edges.map(edge => ({
        id: `${edge.node.namespace}.${edge.node.key}`,
        displayName: `${edge.node.namespace}.${edge.node.key}`,
        required: false,
        type: 'string',
        canBeUsedToMatch: false,
    }));
    
    return { fields };
}
```

## Key Benefits of This Approach

1. **Automatic Loading Indicators**: n8n handles "Fetching metafields..." automatically
2. **Schema Refresh**: Built-in refresh when product selection changes
3. **Search Functionality**: Product search works out-of-the-box
4. **Dynamic Field Generation**: All metafields appear as editable form fields
5. **Add/Remove Fields**: Built-in field management functionality
6. **Error Handling**: Automatic error states and user feedback

## Implementation Priority

1. **Phase 1**: Implement `resourceLocator` for product selection with search
2. **Phase 2**: Create `getProductMetafields` resource mapper method
3. **Phase 3**: Add `resourceMapper` field for dynamic metafield editing
4. **Phase 4**: Test and refine loading states and error handling

This approach will create the exact UX you described - select a product, see "Fetching metafields...", then get all metafields as editable form fields, just like Google Sheets columns.
