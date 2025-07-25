import type { IExecuteFunctions } from 'n8n-workflow';

/**
 * Build product query filters from user parameters
 * Extracted from monolithic version - handles Additional Fields collection
 */
export function buildProductQueryFilters(
	executeFunctions: IExecuteFunctions,
	itemIndex: number,
): string {
	const queryFilters: string[] = [];

	// Get additional fields collection
	const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as any;

	// Date filters (created_at)
	if (additionalFields.createdAfter) {
		const afterDate = additionalFields.createdAfter.split('T')[0]; // Convert to YYYY-MM-DD format
		queryFilters.push(`created_at:>=${afterDate}`);
	}
	if (additionalFields.createdBefore) {
		const beforeDate = additionalFields.createdBefore.split('T')[0]; // Convert to YYYY-MM-DD format
		queryFilters.push(`created_at:<=${beforeDate}`);
	}

	// Join all filters with AND
	return queryFilters.length > 0 ? queryFilters.join(' AND ') : '';
}

/**
 * Check if metafields should be included in the product query
 */
export function shouldIncludeMetafields(
	executeFunctions: IExecuteFunctions,
	itemIndex: number,
): boolean {
	const additionalFields = executeFunctions.getNodeParameter('additionalFields', itemIndex, {}) as any;
	return additionalFields.includeMetafields === true;
}

/**
 * Get product advanced options from user parameters
 */
export function getProductAdvancedOptions(
	executeFunctions: IExecuteFunctions,
	itemIndex: number,
): {
	includeVariants: boolean;
	includeImages: boolean;
	includeInventoryDetails: boolean;
	includeCustomsData: boolean;
	variantsLimit: number;
	imagesLimit: number;
} {
	const advancedOptions = executeFunctions.getNodeParameter('productAdvancedOptions', itemIndex, {}) as any;
	
	return {
		includeVariants: advancedOptions.includeVariants === true,
		includeImages: advancedOptions.includeImages === true,
		includeInventoryDetails: advancedOptions.includeInventoryDetails === true,
		includeCustomsData: advancedOptions.includeCustomsData === true,
		variantsLimit: advancedOptions.variantsLimit || 250,
		imagesLimit: advancedOptions.imagesLimit || 250,
	};
}

/**
 * Calculate estimated GraphQL cost per product based on enabled features
 * Based on real-world testing: 10 products with variants+customs = 1971 cost (~197 per product)
 */
export function calculateProductCostEstimate(
	includeMetafields: boolean,
	advancedOptions: {
		includeVariants: boolean;
		includeImages: boolean;
		includeInventoryDetails: boolean;
		includeCustomsData: boolean;
		variantsLimit: number;
		imagesLimit: number;
	},
): number {
	let cost = 3; // Base product cost
	
	if (includeMetafields) {
		cost += 15; // Metafields add significant cost
	}
	
	if (advancedOptions.includeVariants) {
		// Variants are expensive, especially with inventory/customs data
		let variantCost = Math.min(advancedOptions.variantsLimit, 10) * 8; // Base variant cost
		
		if (advancedOptions.includeInventoryDetails) {
			variantCost += Math.min(advancedOptions.variantsLimit, 10) * 15; // Inventory measurement data
		}
		
		if (advancedOptions.includeCustomsData) {
			variantCost += Math.min(advancedOptions.variantsLimit, 10) * 20; // Customs data + connections
		}
		
		cost += variantCost;
	}
	
	if (advancedOptions.includeImages) {
		cost += Math.min(advancedOptions.imagesLimit, 10) * 2; // Images are relatively cheap
	}
	
	// Add 20% buffer for safety
	return Math.ceil(cost * 1.2);
}
