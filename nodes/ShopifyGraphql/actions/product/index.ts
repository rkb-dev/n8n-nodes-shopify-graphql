// Export all product operations and resource definition
export { productOperations, productFields } from './product.resource';
export * as getOperation from './get.operation';
export * as createOperation from './create.operation';
export * as updateOperation from './update.operation';
export * as deleteOperation from './delete.operation';

// Combined properties for easy import
import { productOperations, productFields } from './product.resource';
import { description as getDescription } from './get.operation';
import { description as createDescription } from './create.operation';
import { description as updateDescription } from './update.operation';
import { description as deleteDescription } from './delete.operation';

export const productProperties = [
	...productOperations,
	...productFields,
	...getDescription,
	...createDescription,
	...updateDescription,
	...deleteDescription,
];

// Operation executors
export { execute as executeGet } from './get.operation';
export { execute as executeCreate } from './create.operation';
export { execute as executeUpdate } from './update.operation';
export { execute as executeDelete } from './delete.operation';
