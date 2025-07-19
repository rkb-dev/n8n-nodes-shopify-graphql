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
exports.executeOrderGet = exports.executeCustomerGet = exports.executeProductDelete = exports.executeProductUpdate = exports.executeProductCreate = exports.executeProductGet = exports.allActionProperties = void 0;
// Import all resource modules
const productModule = __importStar(require("./product"));
const customerModule = __importStar(require("./customer"));
const orderModule = __importStar(require("./order"));
// Combined properties for the main node
exports.allActionProperties = [
    ...productModule.productProperties,
    ...customerModule.customerProperties,
    ...orderModule.orderProperties,
];
// Operation executors by resource with unique names
exports.executeProductGet = productModule.executeGet;
exports.executeProductCreate = productModule.executeCreate;
exports.executeProductUpdate = productModule.executeUpdate;
exports.executeProductDelete = productModule.executeDelete;
exports.executeCustomerGet = customerModule.executeGet;
exports.executeOrderGet = orderModule.executeGet;
