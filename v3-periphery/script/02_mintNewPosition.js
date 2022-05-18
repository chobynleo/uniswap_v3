const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr, writeLog } = require('../../script/utils/log');
const UniswapV3Factory_Addr = require(`../../deployments/${network.name}/UniswapV3Factory.json`);
const SWAPROUTER_Addr = require(`../../deployments/${network.name}/SwapRouter.json`);
const DuetZapV3_Addr = require(`../../deployments/${network.name}/DuetZapV3.json`);
const BUSD_USDT_POOL_3000_Addr = require(`../../deployments/${network.name}/BUSD_USDT_POOL_3000.json`);
const NonfungiblePositionManager_Addr = require(`../../deployments/${network.name}/NonfungiblePositionManager.json`);
const USDT_Addr = require(`../../deployments/${network.name}/Mock_USDT.json`);
const BUSD_Addr = require(`../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9_Addr = require(`../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const ERC20Abi = [
        "function balanceOf(address owner) external view returns (uint)",
        "function approve(address spender, uint value) external returns (bool)",
        "function transfer(address recipient, uint256 amount) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint)"
    ];
    const IUniswapV3FactoryAbi = [
        "function getPool(address tokenA,address tokenB,uint24 fee) external view returns (address pool)",
        "function createPool(address tokenA,address tokenB,uint24 fee) external returns (address pool)"
    ];

    let BUSD = new ethers.Contract(BUSD_Addr.address, ERC20Abi, owner);
    let USDT = new ethers.Contract(USDT_Addr.address, ERC20Abi, owner);

    let UniswapV3Factory = new ethers.Contract(
        UniswapV3Factory_Addr.address, 
        IUniswapV3FactoryAbi,
        owner
    );
    let NonfungiblePositionManager = await ethers.getContractAt(
        "NonfungiblePositionManager",
        NonfungiblePositionManager_Addr.address, 
        owner
    );
    let DuetZapV3 = await ethers.getContractAt(
        "DuetZapV3",
        DuetZapV3_Addr.address, 
        owner
    );
    
    console.log('BUSD', await BUSD.balanceOf(owner.address))
    console.log('USDT', await USDT.balanceOf(owner.address))

    let amount = ethers.utils.parseUnits("10000", 18);
    // let amount = '1000'

    // approve 
    await BUSD.approve(DuetZapV3_Addr.address, amount)
    await USDT.approve(DuetZapV3_Addr.address, amount)

    let positionDetail = {
        token0: USDT.address,
        token1: BUSD.address,
        amount0ToMint: amount,
        amount1ToMint: amount
    }

    // await BUSD.transfer(DuetZapV3_Addr.address, amount)
    // await USDT.transfer(DuetZapV3_Addr.address, amount)

    // console.log('BUSD', await BUSD.balanceOf(DuetZapV3_Addr.address))
    // console.log('USDT', await USDT.balanceOf(DuetZapV3_Addr.address))

    // mint new position
    await DuetZapV3.mintNewPosition(...Object.keys(positionDetail).map(function(i){return positionDetail[i]}))
    // console.log(tx)
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});