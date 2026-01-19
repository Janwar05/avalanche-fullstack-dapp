import { BlockchainService } from "./blockchain.service";
import { GetEventsDto } from './dto/get-events.dto';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    getValue(): Promise<{
        value: any;
    }>;
    getEvents(body: GetEventsDto): Promise<any>;
}
