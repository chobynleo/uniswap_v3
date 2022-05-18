const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr } = require('../../../script/utils/log');


async function main() {
    let [owner]  = await ethers.getSigners();

    const _BUSD = await ethers.getContractFactory("Mock_BUSD");
    const BUSD = await _BUSD.deploy();
    await BUSD.deployed();

    let Artifact = await artifacts.readArtifact("Mock_BUSD")
    await writeAbiAddr(Artifact, BUSD.address, "Mock_BUSD", network.name);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});