import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./src/artifacts", // Move artifacts to src so Next.js can read them easily
  }
};

export default config;
