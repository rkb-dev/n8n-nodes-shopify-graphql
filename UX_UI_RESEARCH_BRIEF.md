# n8n Node UX/UI Research Brief: Operation-Specific & Dynamic Data Fetching

## Research Objective
Research n8n best practices for creating intuitive, context-aware node interfaces that provide quality-of-life features similar to popular nodes (Google Sheets, Airtable, etc.). Focus on operation-specific UI design and dynamic data fetching to improve usability and reduce cognitive load.

## Current UX Problems

### 1. **Non-Operation-Specific UI**
- **Problem**: All fields show for all operations (create/update/delete)
- **Impact**: Confusing interface, irrelevant options, cognitive overload
- **Example**: Showing "Product Variants" collection for Delete operation makes no sense

### 2. **Static Metafields Interface**
- **Problem**: Manual namespace/key/type entry with editable type dropdown
- **Impact**: User must know metafield schema, can't change types via API anyway
- **Better UX**: Auto-discover existing metafields like Google Sheets discovers columns

### 3. **No Context for Update Operations**
- **Problem**: Update product shows empty forms, no current data
- **Impact**: User can't see what they're updating, risk of data loss
- **Better UX**: Pre-populate with current product data, show existing variants

### 4. **Missing Quality-of-Life Features**
- **Problem**: No dynamic data fetching, no smart defaults, no validation
- **Impact**: Manual work that could be automated, error-prone workflows

## Research Areas

### A. **n8n Node UX Best Practices**

#### **1. Operation-Specific Field Visibility**
Research how top n8n nodes handle different operations:
- **Google Sheets**: Different fields for Read vs Update vs Append
- **Airtable**: Context-aware field selection
- **Notion**: Operation-specific property handling
- **Slack**: Different UI for Send Message vs Update Message

**Key Questions:**
- How do they use `displayOptions` with operation-specific `show`/`hide`?
- What fields are shared vs operation-specific?
- How do they group related functionality?

#### **2. Dynamic Data Fetching Patterns**
Research how nodes fetch and populate dynamic data:
- **Google Sheets**: Auto-fetch column headers for field selection
- **Airtable**: Auto-discover bases, tables, and fields
- **Notion**: Dynamic database and property discovery
- **Shopify REST**: How does the official node handle dynamic data?

**Key Questions:**
- How do they implement dynamic option loading?
- What's the UX pattern for "loading..." states?
- How do they handle API errors during data fetching?
- When do they refresh dynamic data (on credential change, manual refresh, etc.)?

#### **3. Context-Aware Pre-Population**
Research how nodes handle existing data in update operations:
- **Google Sheets**: Shows current cell values when updating
- **Airtable**: Pre-populates record fields for updates
- **Notion**: Shows current page/database properties

**Key Questions:**
- How do they fetch and display current data?
- What's the UX for "loading current data..."?
- How do they handle partial updates vs full overwrites?
- How do they show "unchanged" vs "will be updated" fields?

### B. **Shopify-Specific UX Patterns**

#### **1. Product Variants Management**
Research how e-commerce tools handle variants:
- **Shopify Admin**: How does the native interface work?
- **Shopify Apps**: Popular product management app UX patterns
- **WooCommerce**: Variant management best practices

**Key Questions:**
- How do they display existing variants for editing?
- What's the UX for adding/removing variants?
- How do they handle variant-specific metafields?
- How do they show inventory across locations?

#### **2. Metafields Discovery & Management**
Research metafield UX patterns:
- **Shopify Admin**: Native metafield interface
- **Metafield management apps**: Popular app UX patterns
- **Shopify CLI**: Developer tool patterns

**Key Questions:**
- How do they discover existing metafield definitions?
- What's the UX for namespace/key selection?
- How do they handle different metafield types?
- How do they validate metafield values by type?

### C. **n8n Technical Implementation Patterns**

#### **1. Dynamic Options Loading**
Research technical implementation:
- **loadOptions methods**: How to implement dynamic dropdowns
- **Credential-dependent loading**: Loading data based on selected credentials
- **Error handling**: Graceful failures when API calls fail
- **Caching**: When and how to cache dynamic data

#### **2. Conditional Field Display**
Research advanced `displayOptions` patterns:
- **Multi-level conditions**: Complex show/hide logic
- **Dynamic field types**: Changing field types based on selections
- **Collection visibility**: Showing/hiding entire collections
- **Validation dependencies**: Fields that depend on other field values

#### **3. Pre-Population Patterns**
Research data pre-loading techniques:
- **loadNodeParameters**: Pre-populating fields with existing data
- **Background loading**: Fetching data without blocking UI
- **Incremental loading**: Loading data as user navigates
- **Error recovery**: Handling failed pre-population gracefully

## Specific Research Questions

### **1. Metafields UX Redesign**
- How should metafields be discovered and presented?
- Should namespace/key be dropdowns populated from the store?
- How to handle metafield values by type (text input vs number vs boolean toggle)?
- Should metafield type be read-only once discovered?

### **2. Product Variants Context**
- How to fetch and display existing variants for update operations?
- Should variant editing be table-like or individual forms?
- How to handle adding new variants vs updating existing ones?
- How to show inventory levels and locations?

### **3. Operation-Specific Field Logic**
- Which fields should show for Create vs Update vs Delete?
- How to group related fields (Basic Info, Variants, SEO, etc.)?
- Should advanced features be behind toggles or always visible?
- How to handle bulk operations vs single item operations?

### **4. Quality-of-Life Features**
- Auto-complete for common values (product types, vendors, etc.)?
- Validation and helpful error messages?
- Smart defaults based on store configuration?
- Bulk actions and templates?

## Expected Deliverables

### **1. UX Pattern Analysis**
- Detailed analysis of top n8n nodes' UX patterns
- Screenshots and examples of best practices
- Technical implementation patterns and code examples

### **2. Shopify-Specific Recommendations**
- Metafield discovery and management UX design
- Product variant editing interface design
- Operation-specific field visibility matrix

### **3. Implementation Roadmap**
- Priority order for UX improvements
- Technical feasibility assessment
- Breaking changes vs backward compatibility considerations

### **4. Code Examples**
- Dynamic options loading implementation
- Context-aware field pre-population
- Operation-specific displayOptions patterns

## Success Criteria

The research should result in a node that:
1. **Feels intuitive** - Users understand what to do without documentation
2. **Shows relevant data** - Only displays fields appropriate for the selected operation
3. **Reduces manual work** - Auto-discovers metafields, variants, and other dynamic data
4. **Provides context** - Shows current data when updating, validates inputs
5. **Follows n8n conventions** - Matches patterns users expect from other nodes

## Timeline
- **Research Phase**: 2-3 days for comprehensive analysis
- **Design Phase**: 1-2 days for UX mockups and technical design
- **Implementation Phase**: 3-5 days for development and testing

## Priority Focus Areas
1. **Metafields auto-discovery** (highest impact on UX)
2. **Operation-specific field visibility** (reduces confusion)
3. **Update operation context** (shows current data)
4. **Dynamic variant management** (complex but essential)
5. **Quality-of-life improvements** (polish and usability)
