const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');
const UniswapV3Factory_Addr = require(`../../../deployments/${network.name}/UniswapV3Factory.json`);
const SwapRouter_Addr = require(`../../../deployments/${network.name}/SwapRouter.json`);
const NonfungiblePositionManager_Addr = require(`../../../deployments/${network.name}/NonfungiblePositionManager.json`);

async function main() {
    let [owner]  = await ethers.getSigners();
    
    const _DuetZapV3 = await ethers.getContractFactory("DuetZapV3");
    const DuetZapV3 = await _DuetZapV3.deploy(
        UniswapV3Factory_Addr.address, 
        SwapRouter_Addr.address,
        NonfungiblePositionManager_Addr.address
    );
    await DuetZapV3.deployed();

    let Artifact = await artifacts.readArtifact("DuetZapV3")
    await writeAbiAddr(Artifact, DuetZapV3.address, "DuetZapV3", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});