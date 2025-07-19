"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadVendors = exports.loadProductTypes = exports.loadProductVariants = exports.loadLocations = exports.loadCollections = exports.loadOrders = exports.loadCustomers = exports.loadProducts = exports.loadMetafields = exports.loadOptionsMethods = void 0;
const loadMetafields_1 = require("./loadMetafields");
const loadProducts_1 = require("./loadProducts");
const loadCustomers_1 = require("./loadCustomers");
const loadOrders_1 = require("./loadOrders");
const loadCollections_1 = require("./loadCollections");
const loadLocations_1 = require("./loadLocations");
const loadProductVariants_1 = require("./loadProductVariants");
const loadProductTypes_1 = require("./loadProductTypes");
const loadVendors_1 = require("./loadVendors");
// Export all dynamic loading methods for n8n loadOptions
exports.loadOptionsMethods = {
    // High Priority - Essential Methods (Phase 1)
    loadProducts: loadProducts_1.loadProducts,
    loadCustomers: loadCustomers_1.loadCustomers,
    loadMetafields: loadMetafields_1.loadMetafields,
    loadOrders: loadOrders_1.loadOrders,
    loadCollections: loadCollections_1.loadCollections,
    loadLocations: loadLocations_1.loadLocations,
    // Medium Priority - Enhanced Functionality (Phase 2)
    loadProductVariants: loadProductVariants_1.loadProductVariants,
    loadProductTypes: loadProductTypes_1.loadProductTypes,
    loadVendors: loadVendors_1.loadVendors,
    // Low Priority - Advanced Features (Phase 3)
    // loadShippingZones,
    // loadTaxSettings,
};
// Export individual methods for direct import
var loadMetafields_2 = require("./loadMetafields");
Object.defineProperty(exports, "loadMetafields", { enumerable: true, get: function () { return loadMetafields_2.loadMetafields; } });
var loadProducts_2 = require("./loadProducts");
Object.defineProperty(exports, "loadProducts", { enumerable: true, get: function () { return loadProducts_2.loadProducts; } });
var loadCustomers_2 = require("./loadCustomers");
Object.defineProperty(exports, "loadCustomers", { enumerable: true, get: function () { return loadCustomers_2.loadCustomers; } });
var loadOrders_2 = require("./loadOrders");
Object.defineProperty(exports, "loadOrders", { enumerable: true, get: function () { return loadOrders_2.loadOrders; } });
var loadCollections_2 = require("./loadCollections");
Object.defineProperty(exports, "loadCollections", { enumerable: true, get: function () { return loadCollections_2.loadCollections; } });
var loadLocations_2 = require("./loadLocations");
Object.defineProperty(exports, "loadLocations", { enumerable: true, get: function () { return loadLocations_2.loadLocations; } });
var loadProductVariants_2 = require("./loadProductVariants");
Object.defineProperty(exports, "loadProductVariants", { enumerable: true, get: function () { return loadProductVariants_2.loadProductVariants; } });
var loadProductTypes_2 = require("./loadProductTypes");
Object.defineProperty(exports, "loadProductTypes", { enumerable: true, get: function () { return loadProductTypes_2.loadProductTypes; } });
var loadVendors_2 = require("./loadVendors");
Object.defineProperty(exports, "loadVendors", { enumerable: true, get: function () { return loadVendors_2.loadVendors; } });
