const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const convert = (num, decimal) => {
    return Math.round((num / (10*10**(decimal-3))))/100
}

async function calcPoolFeeAPR(apiUrl, feeRate, LPContractObject, LPPrice, base, target) {
    async function getVolume() {
        let response =  await fetch(apiUrl)
        let data = await response.json()
        for (var i = 0; i < data['tickers'].length; i++) {
            const ticker = data['tickers'][i]
            if (ticker['base'] == base && ticker['target'] == target) {
                return data['tickers'][i]["converted_volume"]['usd']
            }
        }
        return 0
    }
    
    const tradingVolume = await getVolume()
    
    const feeShare = tradingVolume * feeRate * 365
    const totalLiquidity = Number(await LPContractObject.methods.totalSupply().call())
    
    const totalLiquidityUSD = convert(totalLiquidity * LPPrice, 36)
    const yearlyFees = feeShare / totalLiquidityUSD
    return yearlyFees
}

async function calcPoolFeeAPRTest(apiUrl, feeRate, LPContractObject, LPPrice, base, target) {
    async function getVolume() {
        let response =  await fetch(apiUrl)
        let data = await response.json()
        for (var i = 0; i < data['tickers'].length; i++) {
            const ticker = data['tickers'][i]
            if (ticker['base'] == base && ticker['target'] == target) {
                return data['tickers'][i]["converted_volume"]['usd']
            }
        }
        return 0
    }
    
    const tradingVolume = await getVolume()
    
    const feeShare = tradingVolume * feeRate * 365
    const totalLiquidity = Number(await LPContractObject.methods.totalSupply().call())
    const totalLiquidityUSD = convert(totalLiquidity * LPPrice, 36)
    const yearlyFees = feeShare / totalLiquidityUSD
    return yearlyFees
}

const calcAutoCompound = (apr, num) => {
    return (((apr / num) + 1) ** num) - 1
}

module.exports = {
    calcPoolFeeAPR,
    calcPoolFeeAPRTest,
    calcAutoCompound
}