import { loadMetafields } from './loadMetafields';
import { loadProducts } from './loadProducts';
import { loadCustomers } from './loadCustomers';

// Export all dynamic loading methods for n8n loadOptions
export const loadOptionsMethods = {
	// High Priority - Essential Methods (Phase 1)
	loadProducts,
	loadCustomers,
	loadMetafields,
	
	// Medium Priority - Enhanced Functionality (Phase 2)
	// loadOrders,
	// loadCollections,
	// loadLocations,
	// loadProductVariants,
	
	// Low Priority - Advanced Features (Phase 3)
	// loadShippingZones,
	// loadTaxSettings,
};

export type LoadOptionsMethodName = keyof typeof loadOptionsMethods;

// Export individual methods for direct import
export { loadMetafields } from './loadMetafields';
export { loadProducts } from './loadProducts';
export { loadCustomers } from './loadCustomers';
