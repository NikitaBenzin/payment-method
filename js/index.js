/* TODO: 
x 1: check radio inputs (change checked state)
x 2: change bank image
  3: validate form
  4: clear on cancel button
  5: add on card preview value from inputs
  6: create 'adding payment method'

  INFORMATION:
  Это редактор существующих карт! и добавление новых,
  они должны быть списком добавленных методов оплаты

  visa: 4...
  mastercard: 5...
  paypal: 53...
*/
import { addMethod, getAllData, getData } from './service.js'

// VARIABLES
// credit cards and one add card
const methodsContainer = document.querySelector("#methods")

// card preview form cardForm[0].value
const editInputs = document.querySelectorAll('#card-info input')

// elements of card preview
const holderName = document.querySelector('#card-preview-info .holder-name')
const cardExpiration = document.querySelector('#card-preview-info .card-expiration')
const cardNumber = document.querySelector('#card-preview-info .card-number')
const cardBankImg = document.querySelector('#card-preview-info > img')

// BUTTONS
// кнопка для подтверждения выбранной карты
const paymentMethodBtn = document.querySelector('#payment-method-btn')
// кнопка для подтверждения изменения инфо карты
const changeBtn = document.querySelector('#change-btn')
const cancelBtn = document.querySelector('#cancel-btn')

// ----------------------------------------------------------------------

// FUNCTIONS
loadCards()

async function loadCards() {
  const data = await getAllData()

  let result = ``
  data.map(card => {
    // вырезаем первые 12 символов
    let dataCardNumber = `${'#'.repeat(12)}${card.cardNumber.slice(-4)}`
    // создаем пробелы каждые 4 символа
    const formattedNumber = [...dataCardNumber]
      .map((char, index) => (index % 4 === 0 ? ' ' : '') + char).join('').trim()

    result += `
      <li bank="${card.bank}" class="method-card">
        <img class="bank-img" src="./img/${card.bank}.png" alt="bank preview">
        <div class="card-format">
          <p class="format">${formattedNumber}</p>
          <div>
            <p class="card-expiration">${card.expiration}</p>
            <p class="default"></p>
          </div>
        </div>
        <div class="radio"></div>
      </li>
    `
  })
  // подбираем кнопку добавления карт
  result += `${methodsContainer.innerHTML}`

  methodsContainer.innerHTML = result

  // adding interaction with credit cards
  const methodCards = document.querySelectorAll(".method-card")
  methodCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('checked')) {
        methodCards.forEach(item => {
          item.classList.remove('checked')
        })

        // getting data from server
        card.getAttribute('bank') === 'add' ? clearPreview() : updatePreview(card.getAttribute('bank'))

        card.classList.add('checked')
      }
    })
  })
}

async function updatePreview(bank) {
  const data = await getData(bank)

  holderName.innerText = data.holderName
  cardExpiration.innerText = data.expiration
  cardNumber.innerText = data.cardNumber
  cardBankImg.src = `http://127.0.0.1:5500/img/${bank}.png`


  for (const key in data) {
    const input = document.getElementById(key) // Получаем элемент input по айдишнику (ключу)
    if (input) {
      input.value = data[key] // Присваиваем значение из объекта data в input
    }
  }
}

function clearPreview() {
  // clearing the card preview
  holderName.innerText = ''
  cardExpiration.innerText = ''
  cardNumber.innerText = ''
  cardBankImg.src = `http://127.0.0.1:5500/img/card.png`
  editInputs.forEach(input => {
    input.value = ''
  })
}

cancelBtn.addEventListener('click', () => {
  clearPreview()
})

changeBtn.addEventListener('click', () => {
  const newCard = {
    "bank": "",
    "holderName": "",
    "expiration": "",
    "cardNumber": "",
    "cvv": ""
  }


  for (const key in newCard) {
    const input = document.getElementById(key)
    if (input) {
      newCard[key] = input.value
    }
  }

  addMethod(newCard)
})