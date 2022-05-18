const { ethers, upgrades, network, artifacts } = require("hardhat");
const { writeAbiAddr, writeLog } = require('../../script/utils/log');
const UniswapV3Factory_Addr = require(`../../deployments/${network.name}/UniswapV3Factory.json`);
const SWAPROUTER_Addr = require(`../../deployments/${network.name}/SwapRouter.json`);
const DuetZapV3_Addr = require(`../../deployments/${network.name}/DuetZapV3.json`);
const NonfungiblePositionManager_Addr = require(`../../deployments/${network.name}/NonfungiblePositionManager.json`);
const USDT_Addr = require(`../../deployments/${network.name}/Mock_USDT.json`);
const BUSD_Addr = require(`../../deployments/${network.name}/Mock_BUSD.json`);
const WETH9_Addr = require(`../../deployments/${network.name}/WETH9.json`);

async function main() {
    let [owner]  = await ethers.getSigners();

    const ERC20Abi = [
        "function balanceOf(address owner) external view returns (uint)",
        "function approve(address spender, uint value) external returns (bool)",
        "function allowance(address owner, address spender) external view returns (uint)"
    ];
    const IUniswapV3FactoryAbi = [
        "function getPool(address tokenA,address tokenB,uint24 fee) external view returns (address pool)"
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

    // console.log('BUSD', await BUSD.balanceOf(owner.address))
    // console.log('USDT', await USDT.balanceOf(owner.address))

    let poolDetail = {
        token0: USDT.address,
        token1: BUSD.address,
        fee: 3000,
        sqrtPriceX96: 4295128739
    }
    

    // 创建交易对
    await DuetZapV3.creatPool(...Object.keys(poolDetail).map(function(i){return poolDetail[i]}))

    // 池子地址
    let pool_addr = await UniswapV3Factory.getPool(BUSD.address, USDT.address, poolDetail.fee)
    await writeLog(pool_addr, `BUSD_USDT_POOL_${poolDetail.fee}`, network.name)
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});