// Export customer operations and resource definition
export { customerOperations } from './customer.resource';
export * as getOperation from './get.operation';

// Combined properties for easy import
import { customerOperations } from './customer.resource';
import { description as getDescription } from './get.operation';

export const customerProperties = [
	...customerOperations,
	...getDescription,
];

// Operation executors
export { execute as executeGet } from './get.operation';
