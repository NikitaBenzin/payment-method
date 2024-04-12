// getting data from server
const URL = 'http://localhost:3000/cards'

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

  await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(card)
  })
}