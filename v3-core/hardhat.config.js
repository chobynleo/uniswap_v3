require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
module.exports = {
  solidity: {
    version: '0.7.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 800,
        },
        metadata: {
          // do not include the metadata hash, since this is machine dependent
          // and we want all generated code to be deterministic
          // https://docs.soliditylang.org/en/v0.7.6/metadata.html
          bytecodeHash: 'none',
        },
      },
  },

  networks: {
    development: {
      url: 'http://localhost:8545',
      chainId: 31337,
    }
  }
};
