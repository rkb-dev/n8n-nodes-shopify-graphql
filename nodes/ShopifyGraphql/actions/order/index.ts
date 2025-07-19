// Export order operations and resource definition
export { orderOperations } from './order.resource';
export * as getOperation from './get.operation';

// Combined properties for easy import
import { orderOperations } from './order.resource';
import { description as getDescription } from './get.operation';

export const orderProperties = [
	...orderOperations,
	...getDescription,
];

// Operation executors
export { execute as executeGet } from './get.operation';
