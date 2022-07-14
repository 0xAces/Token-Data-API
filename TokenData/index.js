const tokenData = [
  {
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    troveBalance: 0,
    walletBalance: 0,
    token: "WAVAX",
    isStable: false,
    isVault: false,
    underlying: "",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x0A548fcE885482Cd5f2696EC3247DA6A6aF3EE61",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiUSDC",
    isStable: true,
    apr: 0,
    isVault: true,
    underlying: "0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F",
    underlyingDecimals: 8,
    tokenTooltip: "qiUSDC balance is not 1:1 with USDC. ",
    feeTooltip: ""
  },
  {
    address: "0xB775cb337Cf223708Ef053a110B56E4DAbb78132",
    troveBalance: 0,
    walletBalance: 0,
    token: "USDC",
    isStable: true,
    isVault: true,
    underlying: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    underlyingDecimals: 6,
    tokenTooltip: "",
    feeTooltip: ""
  }, 
  {
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    troveBalance: 0,
    walletBalance: 0,
    token: "WETH",
    isStable: false,
    isVault: false,
    underlying: "",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0xEEa35EF62AdbC3BBD4EF137E7CFABA612248f784",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiAVAX",
    isStable: false,
    apr: 0,
    isVault: true,
    underlying: "0x5C0401e81Bc07Ca70fAD469b451682c0d747Ef1c",
    underlyingDecimals: 8,
    tokenTooltip: "qiAVAX balance is not 1:1 with AVAX. ",
    feeTooltip: ""
  },
  {
    address: "0x72ccb37ede985311FECc3987bB0fC0572dA99B41",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiETH",
    isStable: false,
    apr: 0,
    isVault: true,
    underlying: "0x334AD834Cd4481BB02d09615E7c11a00579A7909",
    underlyingDecimals: 8,
    tokenTooltip: "qiETH balance is not 1:1 with ETH. ",
    feeTooltip: ""
  },
  {
    address: "0x72298e47f648CA0215F2e17d5647048B2d42520C",
    troveBalance: 0,
    walletBalance: 0,
    token: "WETH-WAVAX JLP",
    isStable: false,
    apr: 5.87,
    isVault: true,
    underlying: "0xFE15c2695F1F920da45C30AAE47d11dE51007AF9",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x9EF73EAcae3B4143cA8A637a16f178F4bDce65a0",
    troveBalance: 0,
    walletBalance: 0,
    token: "AVAX-USDC JLP",
    isStable: false,
    apr: 0,
    isVault: true,
    underlying: "0xf4003F4efBE8691B60249E6afbD307aBE7758adb",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x9dd17F32Fc8355aE37425F475A10Cc7BEC8CA36A",
    troveBalance: 0,
    walletBalance: 0,
    token: "av3CRV",
    isStable: true,
    apr: 0,
    isVault: true,
    underlying: "0x1337BedC9D22ecbe766dF105c9623922A27963EC",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x71EbA7AB57a1A03c54878338aA5324056C930605",
    troveBalance: 0,
    walletBalance: 0,
    token: "WBTC",
    isStable: false,
    isVault: true,
    underlying: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    underlyingDecimals: 8,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x0Ca7B267C3C882e74ba3a4B49AD0e82427dc6A74",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiBTC",
    isStable: false,
    apr: 0,
    isVault: true,
    underlying: "0xe194c4c5aC32a3C9ffDb358d9Bfd523a0B6d1568",
    underlyingDecimals: 8,
    tokenTooltip: "qiBTC balance is not 1:1 with BTC. ",
    feeTooltip: ""
  },
  {
    address: "0xCc3ee7CCb14aea851850f46CBBE4d82f5D74c20F",
    troveBalance: 0,
    walletBalance: 0,
    token: "sJOE",
    isStable: false,
    apr: 17.26,
    isVault: true,
    underlying: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    underlyingDecimals: 18,
    tokenTooltip: "Your JOE balance is displayed (JOE deposits will convert to sJOE automatically). ",
    feeTooltip: "Deposit fee does not include a 1% Trader Joe fee",
    additionalFee: 0.01
  },
  {
    address: "0x9A6BCecEEc3FBE2FAcC977E57fBe2508f70DBcd9",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiUSDCn",
    isStable: true,
    apr: 0,
    isVault: true,
    underlying: "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C",
    underlyingDecimals: 8,
    tokenTooltip: "qiUSDCn balance is not 1:1 with USDC. ",
    feeTooltip: ""
  },
  {
    address: "0xCb4B0937904698D6EdDADb2FD3b5FcCE74130c37",
    troveBalance: 0,
    walletBalance: 0,
    token: "sAVAX",
    isStable: false,
    apr: 5.93,
    isVault: true,
    underlying: "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0xAD69de0CE8aB50B729d3f798d7bC9ac7b4e79267",
    troveBalance: 0,
    walletBalance: 0,
    token: "aUSDC",
    isStable: true,
    apr: 3.37,
    isVault: true,
    underlying: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    underlyingDecimals: 6,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0xF311ff3277d42c354Fe9D76D1e286736861844B5",
    troveBalance: 0,
    walletBalance: 0,
    token: "aWAVAX",
    isStable: false,
    apr: 6.60,
    isVault: true,
    underlying: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x0Ad0bC8AA6c76b558EE471b7aD70EE7B65704E5D",
    troveBalance: 0,
    walletBalance: 0,
    token: "aWETH",
    isStable: false,
    apr: 1.65,
    isVault: true,
    underlying: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x6946B0527421b72dF7a5f0C0c7a1474219684e8F",
    troveBalance: 0,
    walletBalance: 0,
    token: "aUSDT",
    isStable: true,
    apr: 5.78,
    isVault: true,
    underlying: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
    underlyingDecimals: 6,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0xBa9fb5adBAf7Ad4Ea7B6913A91c7e3196933fC09",
    troveBalance: 0,
    walletBalance: 0,
    token: "aDAI",
    isStable: true,
    apr: 2.21,
    isVault: true,
    underlying: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
    underlyingDecimals: 18,
    tokenTooltip: "",
    feeTooltip: ""
  },
  {
    address: "0x4353A56822949F534E80f0A595ce4eAb0B5cE23E",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiUSDTn",
    isStable: true,
    apr: 0,
    isVault: true,
    underlying: "0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF",
    underlyingDecimals: 8,
    tokenTooltip: "qiUSDTn balance is not 1:1 with USDT. ",
    feeTooltip: ""
  },
  {
    address: "0x273ae700E8e6ed0F4B002Bb2D482b192A254A73E",
    troveBalance: 0,
    walletBalance: 0,
    token: "qiDAI",
    isStable: true,
    apr: 0,
    isVault: true,
    underlying: "0x835866d37AFB8CB8F8334dCCdaf66cf01832Ff5D",
    underlyingDecimals: 8,
    tokenTooltip: "qiDAI balance is not 1:1 with DAI. ",
    feeTooltip: ""
  },
];



const tokenDataMappingA = {};
tokenData.map(
  token =>
    (tokenDataMappingA[token.address] = token)
);

const tokenDataMappingT = {};
tokenData.map(
  token =>
    (tokenDataMappingT[token.token] = token)
);


module.exports = {tokenDataMappingT, tokenDataMappingA}