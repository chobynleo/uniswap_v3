const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');


async function main() {
    let [owner]  = await ethers.getSigners();

    const _WETH9 = await ethers.getContractFactory("WETH9");
    const WETH9 = await _WETH9.deploy();
    await WETH9.deployed();

    let Artifact = await artifacts.readArtifact("WETH9")
    await writeAbiAddr(Artifact, WETH9.address, "WETH9", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});