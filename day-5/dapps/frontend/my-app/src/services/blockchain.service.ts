const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

export async function getBlockchainValue() {
  const res = await fetch(`${BACKEND_URL}/blockchain/value`);

  return res.json();
}

export async function getBlockchainEvents() {
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromBlock: 0,
      toBlock: 99999999,
    }),
  });

  return res.json();
}