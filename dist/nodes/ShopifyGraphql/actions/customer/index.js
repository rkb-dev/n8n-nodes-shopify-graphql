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
exports.executeGet = exports.customerProperties = exports.getOperation = exports.customerOperations = void 0;
// Export customer operations and resource definition
var customer_resource_1 = require("./customer.resource");
Object.defineProperty(exports, "customerOperations", { enumerable: true, get: function () { return customer_resource_1.customerOperations; } });
exports.getOperation = __importStar(require("./get.operation"));
// Combined properties for easy import
const customer_resource_2 = require("./customer.resource");
const get_operation_1 = require("./get.operation");
exports.customerProperties = [
    ...customer_resource_2.customerOperations,
    ...get_operation_1.description,
];
// Operation executors
var get_operation_2 = require("./get.operation");
Object.defineProperty(exports, "executeGet", { enumerable: true, get: function () { return get_operation_2.execute; } });
