import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
    console.log("");
    console.log("DEPLOYING MYMINTTOKEN CONTRACT...");
    console.log("Deployer:", deployer);
    console.log("");
    const myMintToken = await deploy("MyMintToken", {
        from: deployer,
        args: ["MyMintToken","MMT"], // Không có constructor arguments
        log: true,
        waitConfirmations: 1,
    }); 
    console.log("✅ Deployed MyMintToken at:", myMintToken.address);
    console.log("");

    // Kết nối lại contract để mint
    const tokenContract = await ethers.getContractAt("MyMintToken", myMintToken.address, await ethers.getSigner(deployer));
    console.log("Minting 1000 tokens to deployer...");
    const tx = await tokenContract.mint(deployer, ethers.parseUnits("1000", 18));
    await tx.wait();
    console.log("✅ Minted 1000 tokens to deployer:", deployer);
    const balance = await tokenContract.balanceOf(deployer);
    const totalSupply = await tokenContract.totalSupply();
    console.log("Deployer balance:", ethers.formatUnits(balance, 18), "MMT");
    console.log("Total Supply:", ethers.formatUnits(totalSupply, 18), "MMT");
}

export default func;
func.tags = ["MyMintToken", "deploy"];