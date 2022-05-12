const poolAbi = require("../../abi/AavePoolAbi.json")
const poolDataProviderAbi = require("../../abi/AavePoolDataProviderAbi.json")
const ERC20Abi = require("../../abi/ERC20Abi.json")
const incentivesAbi = require("../../abi/AaveIncentiveAbi.json")
const addresses = require("../../addresses/aTokens")
const underlyingTokens = require("../../addresses/underlyingTokens")
const numeral = require("numeral") // NPM package for formatting numbers
const apyUtils = require("../apyUtils")

const RAY = 10 ** 27
const SECONDS_PER_YEAR = 31536000

const getaDAIAPY = async (web3s) => {
    // Unpack web3 objects for Ethereum and avax
    const {avax_web3} = web3s
    // // Get Ethereum block number 
    // const blockNumber = await web3.eth.getBlockNumber()
    
    let avax_blockNumber
    try {
        avax_blockNumber = await avax_web3.eth.getBlockNumber() 
    }
    catch(err) {
        avax_blockNumber = 0
        console.log("CANT GET avax_blockNumber")
        console.log(err)
    }
    // Collect addresses in one 'addresses' object
    const {avax_addresses, fees} = addresses
    const underlyingTokenAddress = underlyingTokens.avax_addresses
    
    let APYData = {
        APY: {
            description: null, 
            value: null,
            feeRate: fees.qiUSDTn,
            supplyAPY: null,
            avaxSupplyDistributionAPY: null,
            totalSupplyDistributionAPY: null
        },
    }

    let pool = new avax_web3.eth.Contract(poolAbi, avax_addresses.Pool)
    let incentives = new avax_web3.eth.Contract(incentivesAbi, avax_addresses.Incentives)

    /**
     * Supply APY
     */
    const reserveData = await pool.methods.getReserveData(underlyingTokenAddress.DAI).call()

    const { liquidityIndex, variableBorrowIndex, currentLiquidityRate, 
        currentVariableBorrowRate, currentStableBorrowRate,
         aTokenAddress, stableDebtTokenAddress, variableDebtTokenAddress} = reserveData

    const depositAPR = +currentLiquidityRate / RAY
    const depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1

    APYData.supplyAPY = depositAPY


    /**
     * Incentive WAVAX APY
     */
    let poolDataProvider = new avax_web3.eth.Contract(poolDataProviderAbi, avax_addresses.PoolDataProvider)
    const assetData = await incentives.methods.getRewardsData(aTokenAddress, underlyingTokenAddress.WAVAX).call()
    const aEmissionPerYear = +assetData[1] * SECONDS_PER_YEAR

    let aToken = new avax_web3.eth.Contract(ERC20Abi, avax_addresses.aDAI)
    const totalATokenSupply = Number(await aToken.methods.totalSupply().call())
    console.log(totalATokenSupply)
    // const incentiveDepositAPRPercent = 100 * (aEmissionPerYear * REWARD_PRICE_ETH * WEI_DECIMALS)/
    // (totalATokenSupply * TOKEN_PRICE_ETH * UNDERLYING_TOKEN_DECIMALS)

    
    
    
    
    

    Object.keys(APYData).forEach(key => {
        APYData[key].block = avax_blockNumber
        APYData[key].timestamp = Date()
    })
  
    // Finally after all data has been collected and formatted, we set up our database object and call db.updateYETIData() in order to cache our data in our MongoDB database.

    return APYData
  }

  module.exports = getaDAIAPY