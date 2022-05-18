// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;
pragma abicoder v2;

import './libraries/TransferHelper.sol';
import './interfaces/ISwapRouter.sol';

contract SwapExamples {
    // For the scope of these swap examples,
    // we will detail the design considerations when using
    // `exactInput`, `exactInputSingle`, `exactOutput`, and  `exactOutputSingle`.

    // It should be noted that for the sake of these examples, we purposefully pass in the swap router instead of inherit the swap router for simplicity.
    // More advanced example contracts will detail how to inherit the swap router safely.

    ISwapRouter public immutable swapRouter;

    // This example swaps BUSD/WETH9 for single path swaps and BUSD/USDT/WETH9 for multi path swaps.

    address public BUSD;
    address public WETH9;
    address public USDT;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(address _busd, address _weth9, address _usdt, ISwapRouter _swapRouter) {
        BUSD = _busd;
        WETH9 = _weth9;
        USDT = _usdt;
        swapRouter = _swapRouter;
    }

    /// @notice swapExactInputSingle swaps a fixed amount of BUSD for a maximum possible amount of WETH9
    /// using the BUSD/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its BUSD for this function to succeed.
    /// @param amountIn The exact amount of BUSD that will be swapped for WETH9.
    /// @return amountOut The amount of WETH9 received.
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        // Transfer the specified amount of BUSD to this contract.
        TransferHelper.safeTransferFrom(BUSD, msg.sender, address(this), amountIn);

        // Approve the router to spend BUSD.
        TransferHelper.safeApprove(BUSD, address(swapRouter), amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: BUSD,
                tokenOut: WETH9,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of BUSD for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its BUSD for this function to succeed. As the amount of input BUSD is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH9 to receive from the swap.
    /// @param amountInMaximum The amount of BUSD we are willing to spend to receive the specified amount of WETH9.
    /// @return amountIn The amount of BUSD actually spent in the swap.
    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
        // Transfer the specified amount of BUSD to this contract.
        TransferHelper.safeTransferFrom(BUSD, msg.sender, address(this), amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of BUSD.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        TransferHelper.safeApprove(BUSD, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: BUSD,
                tokenOut: WETH9,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(BUSD, address(swapRouter), 0);
            TransferHelper.safeTransfer(BUSD, msg.sender, amountInMaximum - amountIn);
        }
    }
}