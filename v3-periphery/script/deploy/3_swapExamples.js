const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');
const FACTORY = require(`../../../deployments/${network.name}/UniswapV3Factory.json`);
const SWAPROUTER = require(`../../../deployments/${network.name}/SwapRouter.json`);
const USDT = require(`../../../deployments/${network.name}/Mock_USDT.json`);
const BUSD = require(`../../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9 = require(`../../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const _SwapExamples = await ethers.getContractFactory("SwapExamples");
    const SwapExamples = await _SwapExamples.deploy(BUSD.address, WETH9.address, USDT.address, SWAPROUTER.address);
    await SwapExamples.deployed();

    let Artifact = await artifacts.readArtifact("SwapExamples")
    await writeAbiAddr(Artifact, SwapExamples.address, "SwapExamples", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});