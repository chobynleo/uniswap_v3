const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');
const FACTORY = require(`../../../deployments/${network.name}/UniswapV3Factory.json`);
const SWAPROUTER = require(`../../../deployments/${network.name}/SwapRouter.json`);
const NFTDescriptorAddr = require(`../../../deployments/${network.name}/NFTDescriptor.json`);
const USDT = require(`../../../deployments/${network.name}/Mock_USDT.json`);
const BUSD = require(`../../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9 = require(`../../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const _NonfungiblePositionManager = await ethers.getContractFactory("NonfungiblePositionManager");
    const NonfungiblePositionManager = await _NonfungiblePositionManager.deploy(FACTORY.address, WETH9.address, NFTDescriptorAddr.address);
    await NonfungiblePositionManager.deployed();

    let Artifact = await artifacts.readArtifact("NonfungiblePositionManager")
    await writeAbiAddr(Artifact, NonfungiblePositionManager.address, "NonfungiblePositionManager", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});