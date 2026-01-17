export declare class BlockchainService {
    private client;
    private contractAddress;
    constructor();
    getLatestValue(): Promise<{
        value: any;
    }>;
    getValueUpdatedEvents(fromBlock: number, toBlock: number): Promise<any>;
    private handleRpcError;
}
