const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');

async function main() {
    let [owner]  = await ethers.getSigners();

    const _UniswapV3Factory = await ethers.getContractFactory("UniswapV3Factory");
    const UniswapV3Factory = await _UniswapV3Factory.deploy();
    await UniswapV3Factory.deployed();

    let Artifact = await artifacts.readArtifact("UniswapV3Factory")
    await writeAbiAddr(Artifact, UniswapV3Factory.address, "UniswapV3Factory", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});