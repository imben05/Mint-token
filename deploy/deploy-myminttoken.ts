import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers, upgrades } from "hardhat";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const [signer] = await ethers.getSigners();

  console.log("");
  console.log("🚀 DEPLOYING MyMintToken (UUPS Proxy)...");
  console.log("Deployer address:", deployer);
  console.log("Signer address:", signer.address);
  console.log("");

  const TokenFactory = await ethers.getContractFactory("MyMintToken");

  const proxy = await upgrades.deployProxy(
    TokenFactory,
    ["MyMintToken", "MMT", deployer],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("✅ Proxy deployed at:", proxyAddress);
  // Attach the proxy address and use a generic type to avoid missing type declarations.
  const token = TokenFactory.attach(proxyAddress) as any;
  const balance = await token.balanceOf(deployer);
  console.log("Deployer balance:", ethers.formatUnits(balance, 18), "MMT");
};

export default func;
func.tags = ["MyMintToken", "deploy"];
