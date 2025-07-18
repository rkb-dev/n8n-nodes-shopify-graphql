import * as productModule from './product';
import * as customerModule from './customer';
import * as orderModule from './order';
export declare const allActionProperties: import("n8n-workflow").INodeProperties[];
export declare const executeProductGet: typeof productModule.getOperation.execute;
export declare const executeProductCreate: typeof productModule.createOperation.execute;
export declare const executeProductUpdate: typeof productModule.updateOperation.execute;
export declare const executeProductDelete: typeof productModule.deleteOperation.execute;
export declare const executeCustomerGet: typeof customerModule.getOperation.execute;
export declare const executeOrderGet: typeof orderModule.getOperation.execute;
