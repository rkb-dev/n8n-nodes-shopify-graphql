import { loadMetafields } from './loadMetafields';
import { loadProducts } from './loadProducts';
import { loadCustomers } from './loadCustomers';
import { loadOrders } from './loadOrders';
import { loadCollections } from './loadCollections';
import { loadLocations } from './loadLocations';
import { loadProductVariants } from './loadProductVariants';
import { loadProductTypes } from './loadProductTypes';
import { loadVendors } from './loadVendors';

// Export all dynamic loading methods for n8n loadOptions
export const loadOptionsMethods = {
	// High Priority - Essential Methods (Phase 1)
	loadProducts,
	loadCustomers,
	loadMetafields,
	loadOrders,
	loadCollections,
	loadLocations,
	
	// Medium Priority - Enhanced Functionality (Phase 2)
	loadProductVariants,
	loadProductTypes,
	loadVendors,
	
	// Low Priority - Advanced Features (Phase 3)
	// loadShippingZones,
	// loadTaxSettings,
};

export type LoadOptionsMethodName = keyof typeof loadOptionsMethods;

// Export individual methods for direct import
export { loadMetafields } from './loadMetafields';
export { loadProducts } from './loadProducts';
export { loadCustomers } from './loadCustomers';
export { loadOrders } from './loadOrders';
export { loadCollections } from './loadCollections';
export { loadLocations } from './loadLocations';
export { loadProductVariants } from './loadProductVariants';
export { loadProductTypes } from './loadProductTypes';
export { loadVendors } from './loadVendors';
