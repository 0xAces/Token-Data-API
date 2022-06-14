const vaultProxyABI = require("../../abi/VaultProxy.json")


const getUnderlyingPerReceipt = async (web3s, address, blockNum) => {
    const {avax_web3} = web3s

    const vaultProxyContract = new avax_web3.eth.Contract(vaultProxyABI, address);

    vaultProxyContract.defaultBlock = blockNum

    const result = await vaultProxyContract.methods.underlyingPerReceipt().call()
    .then((value) => {
        return value / 10 ** 18})
    .catch((error) => {
        console.log('Error fetching underlying', address)
        return 0
    } )

    return result
}

module.exports = getUnderlyingPerReceipt

