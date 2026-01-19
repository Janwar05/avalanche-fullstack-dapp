import { ethers } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.waitForDeployment();

  const address = await simpleStorage.getAddress();
  console.log("SimpleStorage deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});