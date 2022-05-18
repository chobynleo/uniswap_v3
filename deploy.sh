export HARDHAT_NETWORK='development'

cd tokens/script/deploy

node 1_Mock_USDT.js
node 2_Mock_BUSD.js
node 3_Mock_WETH9.js

cd ../../../v3-core/script/deploy
node 1_factory.js

cd ../../../v3-periphery/script/deploy
node 1_SwapRouter.js
node 2_NFTDescriptor.js
node 3_NonfungiblePositionManager.js
node 4_DuetZapV3.js

cd ../
node 01_createPool.js
node 02_mintNewPosition.js