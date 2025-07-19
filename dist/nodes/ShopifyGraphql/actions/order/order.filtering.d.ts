import type { IExecuteFunctions } from 'n8n-workflow';
/**
 * Build order query filters from user parameters
 * Extracted from monolithic version - handles all Phase 1-3 filters
 */
export declare function buildOrderQueryFilters(executeFunctions: IExecuteFunctions, itemIndex: number): string;
