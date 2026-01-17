const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying RewardsDistributor...");

  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const RewardsDistributor = await hre.ethers.getContractFactory("RewardsDistributor");
  const rewards = await RewardsDistributor.deploy(USDC_ADDRESS);

  await rewards.waitForDeployment();
  const address = await rewards.getAddress();

  console.log("✅ RewardsDistributor deployed to:", address);
  console.log("📝 USDC Token:", USDC_ADDRESS);

  console.log("\n🔧 Add this to your .env.local:");
  console.log(`REWARDS_CONTRACT_ADDRESS=${address}`);

  console.log("\n📋 Next steps:");
  console.log("1. Fund contract with USDC for rewards");
  console.log("2. Update frontend with contract address");
  console.log("3. Update backend API to call addReward()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
