import type { ILoadOptionsFunctions, INodePropertyOptions, IRequestOptions, IHttpRequestMethods } from 'n8n-workflow';

/**
 * Load product variants from a specific product for dynamic selection
 * Conditional loading based on selected product ID
 */
export async function loadProductVariants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Get the selected product ID from the current node parameters
		const productId = this.getCurrentNodeParameter('productId') as string;
		
		if (!productId || productId === '__manual__' || productId === '__error__') {
			return [
				{
					name: 'Select a product first',
					value: '__select_product__',
					description: 'Choose a product to see its variants',
				},
			];
		}

		// Ensure product ID is in GID format
		let formattedProductId = productId;
		if (!productId.startsWith('gid://shopify/Product/')) {
			formattedProductId = `gid://shopify/Product/${productId}`;
		}

		// Query for product variants
		const query = `
			query ProductVariantsLoadOptions($productId: ID!) {
				product(id: $productId) {
					id
					title
					variants(first: 100) {
						edges {
							node {
								id
								title
								sku
								price
								compareAtPrice
								inventoryQuantity
								availableForSale
								selectedOptions {
									name
									value
								}
								image {
									url
									altText
								}
							}
						}
					}
				}
			}
		`;

		const variables = { productId: formattedProductId };
		
		// Use the correct API request pattern from GenericFunctions
		const credentials = await this.getCredentials('shopifyGraphqlApi');
		const requestOptions: IRequestOptions = {
			method: 'POST' as IHttpRequestMethods,
			body: { query, variables },
			uri: `https://${credentials.shopName}.myshopify.com/admin/api/${credentials.apiVersion}/graphql.json`,
			json: true,
			headers: {
				'X-Shopify-Access-Token': credentials.accessToken,
				'Content-Type': 'application/json',
			},
		};
		const response = await this.helpers.request(requestOptions);

		const options: INodePropertyOptions[] = [];

		if (response.data?.product?.variants?.edges) {
			for (const edge of response.data.product.variants.edges) {
				const variant = edge.node;
				
				// Availability indicator
				const availabilityIcon = variant.availableForSale ? '✅' : '❌';
				
				// Price comparison indicator
				const priceIcon = variant.compareAtPrice && parseFloat(variant.compareAtPrice) > parseFloat(variant.price) ? '💰' : '💵';
				
				// Build variant title from selected options
				const optionValues = variant.selectedOptions.map((option: any) => option.value).join(' / ');
				const variantTitle = variant.title === 'Default Title' ? 'Default' : variant.title;
				const displayTitle = optionValues ? `${variantTitle} (${optionValues})` : variantTitle;
				
				const displayName = `${availabilityIcon}${priceIcon} ${displayTitle}`;
				
				const description = [
					`$${variant.price}`,
					variant.compareAtPrice ? `(was $${variant.compareAtPrice})` : '',
					variant.sku ? `SKU: ${variant.sku}` : '',
					`Stock: ${variant.inventoryQuantity || 0}`
				].filter(Boolean).join(' | ');

				options.push({
					name: displayName,
					value: variant.id,
					description,
				});
			}
		}

		// Sort by availability first, then by price
		options.sort((a, b) => {
			const aAvailable = a.name.startsWith('✅');
			const bAvailable = b.name.startsWith('✅');
			if (aAvailable !== bAvailable) {
				return bAvailable ? 1 : -1; // Available first
			}
			return a.name.localeCompare(b.name);
		});

		// Add manual entry option for backward compatibility
		options.unshift({
			name: '+ Enter Variant ID Manually',
			value: '__manual__',
			description: 'Enter variant ID manually if not found in list',
		});

		return options;
	} catch (error: any) {
		// Graceful fallback following research spec error handling
		return [
			{
				name: 'Error loading variants - Check product selection',
				value: '__error__',
				description: `${error.message || 'Unknown error'}`,
			},
			{
				name: '+ Enter Variant ID Manually',
				value: '__manual__',
				description: 'Enter variant ID manually',
			},
		];
	}
}
