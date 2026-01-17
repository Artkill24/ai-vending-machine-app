const hre = require("hardhat");

async function main() {
  try {
    console.log("🔍 Testing Arc Network connection...");
    
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("✅ Connected! Current block:", blockNumber);
    
    const [signer] = await hre.ethers.getSigners();
    console.log("✅ Wallet address:", signer.address);
    
    const balance = await hre.ethers.provider.getBalance(signer.address);
    console.log("✅ Balance:", hre.ethers.formatEther(balance), "ETH");
    
    console.log("\n🎉 RPC working! Ready to deploy.");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

main();
