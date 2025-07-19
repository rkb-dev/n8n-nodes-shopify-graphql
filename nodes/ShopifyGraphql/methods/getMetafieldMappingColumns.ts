import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Get metafield mapping columns for a specific product
 * Implements Google Sheets-style dynamic field discovery for metafields
 * This method is called by resourceMapper to dynamically load product-specific metafields
 * 
 * @param this ILoadOptionsFunctions context
 * @returns Promise<INodePropertyOptions[]> Formatted metafield options for resourceMapper
 */
export async function getMetafieldMappingColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Get the selected product from resourceLocator
		const productResource = this.getCurrentNodeParameter('productId') as { mode: string; value: string };
		
		if (!productResource?.value) {
			return [{
				name: 'Please select a product first',
				value: '',
				description: 'Product selection is required to load metafields',
			}];
		}
		
		let productId: string;
		
		// Handle different resourceLocator modes to get product ID
		switch (productResource.mode) {
			case 'list':
				productId = productResource.value; // Already in GID format
				break;
			case 'id':
				productId = productResource.value.startsWith('gid://shopify/Product/')
					? productResource.value
					: `gid://shopify/Product/${productResource.value}`;
				break;
			case 'handle':
				// Need to resolve handle to product ID
				const handleQuery = `
					query getProductByHandle($handle: String!) {
						productByHandle(handle: $handle) {
							id
						}
					}
				`;
				const credentials = await this.getCredentials('shopifyGraphqlApi');
				const requestOptions: IRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					body: { query: handleQuery, variables: { handle: productResource.value } },
					uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
					json: true,
					headers: {
						'X-Shopify-Access-Token': credentials.accessToken,
						'Content-Type': 'application/json',
					},
				};
				const handleResponse = await this.helpers.request(requestOptions);
				
				if (!handleResponse.data.productByHandle) {
					return [{
						name: `Product with handle '${productResource.value}' not found`,
						value: '',
						description: 'Please check the product handle and try again',
					}];
				}
				
				productId = handleResponse.data.productByHandle.id;
				break;
			default:
				return [{
					name: 'Invalid product selection mode',
					value: '',
					description: 'Please reselect the product',
				}];
		}
		
		// Query to get all metafields for the selected product
		const metafieldsQuery = `
			query getProductMetafields($id: ID!) {
				product(id: $id) {
					id
					title
					metafields(first: 100) {
						edges {
							node {
								id
								namespace
								key
								type
								value
								description
								createdAt
								updatedAt
							}
						}
					}
				}
			}
		`;
		
		const credentials = await this.getCredentials('shopifyGraphqlApi');
		const requestOptions: IRequestOptions = {
			method: 'POST' as IHttpRequestMethods,
			body: { query: metafieldsQuery, variables: { id: productId } },
			uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
			json: true,
			headers: {
				'X-Shopify-Access-Token': credentials.accessToken,
				'Content-Type': 'application/json',
			},
		};
		const response = await this.helpers.request(requestOptions);
		
		if (!response.data.product) {
			return [{
				name: 'Product not found',
				value: '',
				description: 'The selected product could not be found',
			}];
		}
		
		const metafields = response.data.product.metafields.edges || [];
		const productTitle = response.data.product.title;
		
		// Transform metafields to resourceMapper format
		const options: INodePropertyOptions[] = metafields.map((edge: any) => {
			const metafield = edge.node;
			
			// Create unique identifier for the metafield
			const metafieldKey = `${metafield.namespace}.${metafield.key}`;
			
			// Create display name with type indicator
			const typeIcon = getMetafieldTypeIcon(metafield.type);
			const displayName = `${typeIcon} ${metafieldKey}`;
			
			// Create description with current value preview
			let description = `Type: ${metafield.type}`;
			if (metafield.description) {
				description += ` | ${metafield.description}`;
			}
			
			// Add value preview (truncated for UI)
			if (metafield.value) {
				const valuePreview = String(metafield.value).length > 50 
					? String(metafield.value).substring(0, 50) + '...'
					: String(metafield.value);
				description += ` | Current: ${valuePreview}`;
			}
			
			return {
				name: displayName,
				value: metafieldKey, // Use namespace.key as unique identifier
				description,
			};
		});
		
		// Add header with product context
		if (options.length > 0) {
			options.unshift({
				name: `📦 ${productTitle} - ${options.length} metafield(s)`,
				value: '__header__',
				description: 'Select metafields to edit below',
			});
		}
		
		// Handle case where no metafields exist
		if (metafields.length === 0) {
			return [
				{
					name: `📦 ${productTitle} - No metafields found`,
					value: '__no_metafields__',
					description: 'This product has no metafields to edit',
				},
				{
					name: '➕ Create new metafield',
					value: '__create_new__',
					description: 'Add a new metafield to this product',
				}
			];
		}
		
		// Add option to create new metafield
		options.push({
			name: '➕ Create new metafield',
			value: '__create_new__',
			description: 'Add a new metafield to this product',
		});
		
		return options;
		
	} catch (error: any) {
		// Comprehensive error handling
		if (error?.statusCode === 401) {
			return [{
				name: '🔒 Authentication Error',
				value: '',
				description: 'Please check your Shopify API credentials',
			}];
		}
		
		if (error?.statusCode === 403) {
			return [{
				name: '🚫 Permission Error',
				value: '',
				description: 'Insufficient permissions. Ensure read_products scope is enabled',
			}];
		}
		
		if (error?.statusCode === 429) {
			return [{
				name: '⏱️ Rate Limited',
				value: '',
				description: 'API rate limit exceeded. Please wait before retrying',
			}];
		}
		
		// Generic error
		return [{
			name: '❌ Error loading metafields',
			value: '',
			description: `Failed to load metafields: ${error?.message || 'Unknown error'}`,
		}];
	}
}

/**
 * Get appropriate icon for metafield type
 * Provides visual indicators for different metafield types
 */
function getMetafieldTypeIcon(type: string): string {
	const typeMap: { [key: string]: string } = {
		'single_line_text_field': '📝',
		'multi_line_text_field': '📄',
		'rich_text_field': '📋',
		'number_integer': '🔢',
		'number_decimal': '💰',
		'date': '📅',
		'date_time': '🕐',
		'boolean': '☑️',
		'color': '🎨',
		'weight': '⚖️',
		'volume': '📦',
		'dimension': '📏',
		'rating': '⭐',
		'json': '🔧',
		'money': '💵',
		'file_reference': '📎',
		'page_reference': '🔗',
		'product_reference': '🛍️',
		'variant_reference': '🏷️',
		'collection_reference': '📚',
		'url': '🌐',
	};
	
	return typeMap[type] || '📋';
}
