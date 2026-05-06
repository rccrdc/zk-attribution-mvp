import { ethers } from "ethers";
import fs from "fs";
import crypto from "crypto";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  // Hardhat's default account 0 private key
  const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);

  const artifactPath = "./src/artifacts/contracts/DiscountVault.sol/DiscountVault.json";
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  let currentNonce = await wallet.getNonce();
  const vault = await factory.deploy({ nonce: currentNonce++ });
  await vault.waitForDeployment();
  const address = await vault.getAddress();

  console.log(`DiscountVault deployed to: ${address}`);

  const secret = "nike_summer_sale_2026";
  const secretHash = crypto.createHash('sha256').update(secret).digest('hex');
  const secretHashBytes32 = "0x" + secretHash;

  console.log(`Creating campaign with secret: ${secret}`);
  console.log(`Secret Hash (Bytes32): ${secretHashBytes32}`);

  const tx = await vault.getFunction("createCampaign")(secretHashBytes32, 10, { nonce: currentNonce });
  await tx.wait();

  console.log("Campaign 1 created successfully with a 10% discount!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
