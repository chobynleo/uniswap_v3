const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');
const FACTORY = require(`../../../deployments/${network.name}/UniswapV3Factory.json`);
const SWAPROUTER = require(`../../../deployments/${network.name}/SwapRouter.json`);
const USDT = require(`../../../deployments/${network.name}/Mock_USDT.json`);
const BUSD = require(`../../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9 = require(`../../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const _NFTDescriptor = await ethers.getContractFactory("NFTDescriptor");
    const NFTDescriptor = await _NFTDescriptor.deploy();
    await NFTDescriptor.deployed();

    let Artifact = await artifacts.readArtifact("NFTDescriptor")
    await writeAbiAddr(Artifact, NFTDescriptor.address, "NFTDescriptor", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});