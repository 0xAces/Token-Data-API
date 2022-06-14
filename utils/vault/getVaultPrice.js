const vaultOracleABI = require("../../abi/VaultOracle.json")


const getVaultPrice = async (web3s, address, blockNum) => {
    const {avax_web3} = web3s
    
    const vaultOrcaleContract = new avax_web3.eth.Contract(vaultOracleABI, address);

    vaultOrcaleContract.defaultBlock = blockNum - 1

    const result = await vaultOrcaleContract.methods.fetchPrice_v().call()
    .then((value) => {
        return value / 10 ** 18})
    .catch((error) => {
        console.log('Error fetching price', address)
        return 0
    } )

    return result
}

module.exports = getVaultPrice