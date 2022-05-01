const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const convert = (num, decimal) => {
    return Math.round((num / (10*10**(decimal-3))))/100
}

async function calcPoolFeeAPR(apiUrl, feeRate, LPContractObject, LPPrice) {
    async function getVolume() {
        let response =  await fetch(apiUrl)
        let data = await response.json()
        return data['tickers'][0]["converted_volume"]['usd']
    }
    
    const tradingVolume = await getVolume()
    const feeShare = tradingVolume * feeRate * 365
    const totalLiquidity = Number(await LPContractObject.methods.totalSupply().call())
    
    const totalLiquidityUSD = convert(totalLiquidity * LPPrice, 36)
    const yearlyFees = feeShare / totalLiquidityUSD
    return yearlyFees
}

module.exports = {
    calcPoolFeeAPR
}