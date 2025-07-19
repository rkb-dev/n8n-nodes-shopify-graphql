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
	variantsLimit: number;
	imagesLimit: number;
} {
	const advancedOptions = executeFunctions.getNodeParameter('productAdvancedOptions', itemIndex, {}) as any;
	
	return {
		includeVariants: advancedOptions.includeVariants === true,
		includeImages: advancedOptions.includeImages === true,
		variantsLimit: advancedOptions.variantsLimit || 250,
		imagesLimit: advancedOptions.imagesLimit || 250,
	};
}
