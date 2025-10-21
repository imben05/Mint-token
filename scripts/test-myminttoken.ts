import { ethers } from "hardhat";
import { MyMintToken } from "../typechain";

async function main() {
  console.log("🚀 RUNNING MyMintToken SCRIPT...\n");

  const myMintToken: MyMintToken = await ethers.getContract("MyMintToken");
  const [deployer] = await ethers.getSigners();

  const name = await myMintToken.name();
  const symbol = await myMintToken.symbol();
  const decimals = await myMintToken.decimals();
  const totalSupply = await myMintToken.totalSupply();

  console.log("Token Address:", await myMintToken.getAddress());
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log("Total Supply:", ethers.formatUnits(totalSupply, decimals), symbol, "\n");

  // --- Kiểm tra quyền MINTER_ROLE ---
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const hasMinterRole = await myMintToken.hasRole(MINTER_ROLE, deployer.address);

  if (hasMinterRole) {
    console.log("✅ Deployer đã có quyền MINTER_ROLE");
  } else {
    console.log("⚠️  Deployer CHƯA có quyền MINTER_ROLE → cấp quyền...");
    const tx = await myMintToken.grantRole(MINTER_ROLE, deployer.address);
    await tx.wait();
    console.log("✅ Đã cấp quyền MINTER_ROLE cho deployer");
  }

  // --- Kiểm tra whitelist ---
  const isWhitelisted = await myMintToken.whitelisted(deployer.address);
  if (isWhitelisted) {
    console.log("✅ Deployer đã trong whitelist");
  } else {
    console.log("⚠️  Deployer CHƯA trong whitelist → thêm vào...");
    const tx = await myMintToken.addToWhitelist(deployer.address);
    await tx.wait();
    console.log("✅ Đã thêm deployer vào whitelist");
  }

  // --- Mint token ---
  console.log("\n🪙 Minting 500 tokens to deployer...");
  const mintTx = await myMintToken.mint(deployer.address, ethers.parseUnits("500", decimals));
  await mintTx.wait();
  console.log("✅ Mint thành công 500", symbol);

  // --- Claim airdrop (nếu trong whitelist) ---
  const canClaim = await myMintToken.whitelisted(deployer.address);
  if (canClaim) {
    console.log("\n🎁 Claiming airdrop 1000 tokens...");
    const airdropTx = await myMintToken.claimAirdrop(ethers.parseUnits("1000", decimals));
    await airdropTx.wait();
    console.log("✅ Claim airdrop thành công");
  } else {
    console.log("\n❌ Không thể claim airdrop (đã claim hoặc chưa whitelist)");
  }

  // --- Kiểm tra lại balance ---
  const balance = await myMintToken.balanceOf(deployer.address);
  const newTotalSupply = await myMintToken.totalSupply();
  console.log("\n📊 Balance:", ethers.formatUnits(balance, decimals), symbol);
  console.log("Total Supply:", ethers.formatUnits(newTotalSupply, decimals), symbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
