import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import SIMPLE_STORAGE from "./simple-storage.json";

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
    });

    this.contractAddress =
      "0x4f1ca53d85b82360fa5637dc51a4a7658fd283ac" as `0x${string}`;
  }

  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: "getValue",
      });

      return { value: value.toString() };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    try {
      const logs = await this.client.getLogs({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        eventName: "ValueUpdated",
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      return logs.map((log) => ({
        blockNumber: log.blockNumber?.toString(),
        value: log.args?.newValue?.toString(),
        txHash: log.transactionHash,
      }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);

    console.log("RPC ERROR:", message);

    if (message.includes("timeout")) {
      throw new ServiceUnavailableException("RPC timeout.");
    }

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed")
    ) {
      throw new ServiceUnavailableException("RPC connection failed.");
    }

    throw new InternalServerErrorException(
      "Terjadi kesalahan saat membaca data blockchain."
    );
  }
}