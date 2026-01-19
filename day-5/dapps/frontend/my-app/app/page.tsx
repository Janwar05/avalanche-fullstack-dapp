"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";

// ==============================
// CONFIG
// ==============================

const CONTRACT_ADDRESS = "0x4f1ca53d85b82360fa5637dc51a4a7658fd283ac";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ==============================
// AUTO SWITCH FUJI
// ==============================
const FUJI_CHAIN_ID = 43113;

async function switchToFuji() {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa869" }],
    });
  } catch (err: any) {
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xa869",
            chainName: "Avalanche Fuji Testnet",
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.snowtrace.io"],
          },
        ],
      });
    }
  }
}

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [inputValue, setInputValue] = useState("");

  const { data: value, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleConnect = async () => {
    await switchToFuji();
    connect({ connector: injected() });
  };

  const handleSetValue = () => {
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "setValue",
      args: [BigInt(inputValue)],
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-xl p-6 space-y-6 shadow-lg">

        <h1 className="text-xl font-bold text-center">
          Day 5 – Write Smart Contract
        </h1>

        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="w-full bg-white text-black py-2 rounded hover:bg-gray-300"
          >
            {isPending ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="text-gray-400">Connected</p>
            <p className="font-mono break-all">{address}</p>
            <button
              onClick={() => disconnect()}
              className="text-red-400 underline"
            >
              Disconnect
            </button>
          </div>
        )}

        <div className="border-t border-gray-700 pt-4">
          <p className="text-gray-400">Contract Value</p>
          <p className="text-3xl font-bold">{value?.toString()}</p>
          <button
            onClick={() => refetch()}
            className="text-sm underline text-gray-300"
          >
            Refresh
          </button>
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-gray-400">Update Value</p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting}
            className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700"
          >
            {isWriting ? "Updating..." : "Set Value"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Smart contract = single source of truth
        </p>

      </div>
    </main>
  );
}