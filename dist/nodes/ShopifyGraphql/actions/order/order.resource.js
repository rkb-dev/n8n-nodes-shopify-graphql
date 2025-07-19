"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderOperations = void 0;
exports.orderOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['order'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get an order by ID',
                action: 'Get an order',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many orders with smart batching',
                action: 'Get many orders',
            },
        ],
        default: 'get',
    },
];
