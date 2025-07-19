// Import all resource modules
import * as productModule from './product';
import * as customerModule from './customer';
import * as orderModule from './order';

// Combined properties for the main node
export const allActionProperties = [
	...productModule.productProperties,
	...customerModule.customerProperties,
	...orderModule.orderProperties,
];

// Operation executors by resource with unique names
export const executeProductGet = productModule.executeGet;
export const executeProductCreate = productModule.executeCreate;
export const executeProductUpdate = productModule.executeUpdate;
export const executeProductDelete = productModule.executeDelete;
export const executeCustomerGet = customerModule.executeGet;
export const executeOrderGet = orderModule.executeGet;
