const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');
const FACTORY = require(`../../../deployments/${network.name}/UniswapV3Factory.json`);
const USDT = require(`../../../deployments/${network.name}/Mock_USDT.json`);
const BUSD = require(`../../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9 = require(`../../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const _SwapRouter = await ethers.getContractFactory("SwapRouter");
    const SwapRouter = await _SwapRouter.deploy(FACTORY.address, WETH9.address);
    await SwapRouter.deployed();

    let Artifact = await artifacts.readArtifact("SwapRouter")
    await writeAbiAddr(Artifact, SwapRouter.address, "SwapRouter", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});