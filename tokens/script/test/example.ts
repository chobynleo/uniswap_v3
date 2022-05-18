import { ethers } from "ethers";
import { Address } from "cluster";


// const provider = new ethers.providers.WebSocketProvider('ws://127.0.0.1:8545/')
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const BUSD_WETH_POOL = require("../../../deployments/31337/BUSD_WETH_POOL.json")
const poolAddress = BUSD_WETH_POOL.address

// const poolAddress = '0xcB6E69AcF974d17AB5Fd8F81847007F40cF765Ba'

const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function tickSpacing() external view returns (int24)",
  "function maxLiquidityPerTick() external view returns (uint128)",
];

const poolContract = new ethers.Contract(
  poolAddress,
  poolImmutablesAbi,
  provider
);

interface Immutables {
  factory: Address;
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: number;
}

async function getPoolImmutables() {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return immutables;
}

getPoolImmutables().then((result) => {
  console.log(result);
});