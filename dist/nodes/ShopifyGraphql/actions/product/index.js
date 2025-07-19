"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeDelete = exports.executeUpdate = exports.executeCreate = exports.executeGet = exports.productProperties = exports.deleteOperation = exports.updateOperation = exports.createOperation = exports.getOperation = exports.productFields = exports.productOperations = void 0;
// Export all product operations and resource definition
var product_resource_1 = require("./product.resource");
Object.defineProperty(exports, "productOperations", { enumerable: true, get: function () { return product_resource_1.productOperations; } });
Object.defineProperty(exports, "productFields", { enumerable: true, get: function () { return product_resource_1.productFields; } });
exports.getOperation = __importStar(require("./get.operation"));
exports.createOperation = __importStar(require("./create.operation"));
exports.updateOperation = __importStar(require("./update.operation"));
exports.deleteOperation = __importStar(require("./delete.operation"));
// Combined properties for easy import
const product_resource_2 = require("./product.resource");
const get_operation_1 = require("./get.operation");
const create_operation_1 = require("./create.operation");
const update_operation_1 = require("./update.operation");
const delete_operation_1 = require("./delete.operation");
exports.productProperties = [
    ...product_resource_2.productOperations,
    ...product_resource_2.productFields,
    ...get_operation_1.description,
    ...create_operation_1.description,
    ...update_operation_1.description,
    ...delete_operation_1.description,
];
// Operation executors
var get_operation_2 = require("./get.operation");
Object.defineProperty(exports, "executeGet", { enumerable: true, get: function () { return get_operation_2.execute; } });
var create_operation_2 = require("./create.operation");
Object.defineProperty(exports, "executeCreate", { enumerable: true, get: function () { return create_operation_2.execute; } });
var update_operation_2 = require("./update.operation");
Object.defineProperty(exports, "executeUpdate", { enumerable: true, get: function () { return update_operation_2.execute; } });
var delete_operation_2 = require("./delete.operation");
Object.defineProperty(exports, "executeDelete", { enumerable: true, get: function () { return delete_operation_2.execute; } });
