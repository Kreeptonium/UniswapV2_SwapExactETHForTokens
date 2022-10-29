import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import * as dotenv from "dotenv";
import {ISwapExactETHForTokensDataModel} from "../Model/swapExactETHForTokensDataModel";


//Configuring the directory path to access .env file
dotenv.config();

//Accessing UniswapV3Router contract's ABI
const UniswapV2Router02ABI = require('../../../abi/UniswapV2Router02ABI.json')
let encoded_tx: string;
/// @notice swapExactInputSingle swaps a fixed amount of Token1 for a maximum possible amount of Token1
/// using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.
/// @dev The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed.
/// @param amountIn The exact amount of DAI that will be swapped for WETH9.
/// @return amountOut The amount of WETH9 received.

export const SwapExactETHForTokensAsync = async(swapExactETHForTokensDataModel:ISwapExactETHForTokensDataModel) : Promise<any>=> {

  // Setting up Ethereum blockchain Node through Infura
  const web3 = new Web3(process.env.infuraUrlRinkeby);
  //Providing Private Key
  const activeAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
  
  // Initialising the Uniswap Router Contract
  // Initialising the Uniswap Router Contract
  const uniswapV2Router02Contract = new web3.eth.Contract(UniswapV2Router02ABI as AbiItem[], process.env.UniswapV2RinkebyRouter02Address);

  //Setting up the deadline for the transaction
  const expiryDate = Math.floor(Date.now() / 1000) + 900;

  // Setting up Quantity in Ether (wei)
  //const executionQty = web3.utils.toWei(swapExactETHForTokensDataModel?.AmountOut?.Value!, swapExactETHForTokensDataModel?.AmountOut?.CurrencyType!);

  // Get WETH address
  const WETH_ADDRESS = swapExactETHForTokensDataModel.TokenIn;
  console.log("Weth Address: ",WETH_ADDRESS);
  // Array of tokens addresses
  const pairArray = [WETH_ADDRESS, swapExactETHForTokensDataModel.TokenOut];
  console.log("DAI Address: ",swapExactETHForTokensDataModel.TokenOut);
  
  //get Token Out amount for 0.01 ETH
  const amountsOut = await uniswapV2Router02Contract.methods.getAmountsOut(web3.utils.toWei(swapExactETHForTokensDataModel.AmountOut?.Value), pairArray).call();
  console.log("Amount Out",amountsOut);
  
  //Calculate AmountOutMin
  const slippage = swapExactETHForTokensDataModel.Slippage;
  let amountOutMin =
    parseFloat(web3.utils.fromWei(amountsOut[0])) -
    (parseFloat(web3.utils.fromWei(amountsOut[0])) * slippage!);
   const amountOutMinBN =web3.utils.toBN(web3.utils.toWei(amountOutMin.toFixed(18).toString()));
    console.log("AmountOutMin : ",amountOutMin);

 

    try {

       // The call to `swapExactETHForTokens` executes the swap.
      let tx_builder = uniswapV2Router02Contract.methods.swapExactETHForTokens(amountOutMinBN, pairArray,activeAccount.address, expiryDate);
      encoded_tx = tx_builder.encodeABI();
    

          } catch (error) {
    
            throw(error);
          }
    

  return encoded_tx;
  
}


