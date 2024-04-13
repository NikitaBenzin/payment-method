
// getting data from server
const URL = 'http://localhost:3000/cards'
//const axios = require('axios/dist/browser/axios.cjs'); // browser
//const axios = require('axios/dist/node/axios.cjs'); // node

export async function getData(bank) {

  const response = await fetch(URL)
  const cards = await response.json()

  let bankCard
  cards.map(card => {
    if (card.bank == bank) {
      bankCard = card
    }
  })
  return bankCard
}

export async function getAllData() {
  const response = await fetch(URL)
  return await response.json()
}

export async function addMethod(card) {

  await fetch('https://reqres.in/api/cards', {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(card)
  })
    .then(response => response.json())
    .then(data => console.log(data))
}