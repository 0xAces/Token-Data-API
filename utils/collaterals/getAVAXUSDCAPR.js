const res = require('express/lib/response');

const graphQlUrl = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange"
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));


async function getData(pair) {
  const data = JSON.stringify({
    query: `
        query {
            pairHourDatas(where: {pair_contains: "${pair}" date_gte: ${Date.now() - 90000}}) {
                id
                date
                volumeUSD
            }
        }`
  });

  console.log(data)
  const response = await fetch(
    graphQlUrl,
    {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Node',
      },
    }
  );
    // console.log(response)
  const json = await response.json();
  console.log(json);
}

getData("0xbdc7EF37283BC67D50886c4afb64877E3e83f869");
