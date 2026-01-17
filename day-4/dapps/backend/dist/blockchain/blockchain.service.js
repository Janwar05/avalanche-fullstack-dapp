"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const simple_storage_json_1 = __importDefault(require("./simple-storage.json"));
let BlockchainService = class BlockchainService {
    client;
    contractAddress;
    constructor() {
        this.client = (0, viem_1.createPublicClient)({
            chain: chains_1.avalancheFuji,
            transport: (0, viem_1.http)("https://api.avax-test.network/ext/bc/C/rpc"),
        });
        this.contractAddress = "0x4f1ca53d85b82360fa5637dc51a4a7658fd283ac";
    }
    async getLatestValue() {
        try {
            const value = await this.client.readContract({
                address: this.contractAddress,
                abi: simple_storage_json_1.default.abi,
                functionName: "getValue",
            });
            return {
                value: value.toString(),
            };
        }
        catch (error) {
            this.handleRpcError(error);
        }
    }
    async getValueUpdatedEvents(fromBlock, toBlock) {
        try {
            const events = await this.client.getLogs({
                address: this.contractAddress,
                event: {
                    type: "event",
                    name: "ValueUpdated",
                    inputs: [
                        {
                            name: "newValue",
                            type: "uint256",
                            indexed: false,
                        },
                    ],
                },
                fromBlock: BigInt(fromBlock),
                toBlock: BigInt(toBlock),
            });
            return events.map((event) => ({
                blockNumber: event.blockNumber?.toString(),
                value: event.args.newValue.toString(),
                txHash: event.transactionHash,
            }));
        }
        catch (error) {
            this.handleRpcError(error);
        }
    }
    handleRpcError(error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log({ error: message });
        if (message.includes("timeout")) {
            throw new common_1.ServiceUnavailableException("RPC timeout. Silakan coba beberapa saat lagi.");
        }
        if (message.includes("network") ||
            message.includes("fetch") ||
            message.includes("failed")) {
            throw new common_1.ServiceUnavailableException("Tidak dapat terhubung ke blockchain RPC.");
        }
        throw new common_1.InternalServerErrorException("Terjadi kesalahan saat membaca data blockchain.");
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map