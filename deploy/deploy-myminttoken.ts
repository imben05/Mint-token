import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const [signer] = await ethers.getSigners();

  console.log("══════════════════════════════════");
  console.log("🚀 DEPLOYING MyMintToken & MerkleAirdrop (UUPS Proxy)");
  console.log("══════════════════════════════════");
  console.log("Deployer:", deployer);
  console.log("Signer:", signer.address);
  console.log("");

  // ──────────────────────────────
  // 1️⃣ Deploy MyMintToken (non-upgradeable)
  // ──────────────────────────────
  const TokenFactory = await ethers.getContractFactory("MyMintToken");
  const token = await TokenFactory.deploy("MyMintToken", "MMT", deployer);
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("✅ MyMintToken deployed at:", tokenAddress);

  // ──────────────────────────────
  // 2️⃣ Deploy MerkleAirdropUpgradeable (UUPS Proxy)
  // ──────────────────────────────
  const AirdropFactory = await ethers.getContractFactory("MerkleAirdropUpgradeable");

  const proxy = await upgrades.deployProxy(
    AirdropFactory,
    [tokenAddress, deployer],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await proxy.waitForDeployment();
  const airdropAddress = await proxy.getAddress();

  console.log("✅ MerkleAirdrop Proxy deployed at:", airdropAddress);

  // ──────────────────────────────
  // 3️⃣ Check token linkage
  // ──────────────────────────────
  const airdrop = await ethers.getContractAt("MerkleAirdropUpgradeable", airdropAddress);
  const tokenLinked = await airdrop.token();

  console.log("🔗 Token linked in airdrop:", tokenLinked);
  console.log("");

  console.log("══════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE");
  console.log("══════════════════════════════════");
};

export default func;
func.tags = ["MyMintToken", "MerkleAirdropUpgradeable", "deploy"];
