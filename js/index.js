/* TODO: 
x 1: check radio inputs (change checked state)
x 2: change bank image
x 3: validate form
x 4: clear on cancel button
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
const submitChangeBtn = document.querySelector('#change-btn')
const cancelBtn = document.querySelector('#cancel-btn')

// ----------------------------------------------------------------------

// FUNCTIONS
initialize()

function initialize() {
  loadCards()
}

async function loadCards() {
  const data = await getAllData()

  let result = ``
  data.map((card, i) => {

    // вырезаем первые 12 символов
    let dataCardNumber = `${'#'.repeat(12)}${card.cardNumber.slice(-4)}`
    // создаем пробелы каждые 4 символа
    const formattedNumber = [...dataCardNumber]
      .map((char, index) => (index % 4 === 0 ? ' ' : '') + char).join('').trim()

    // создаем разделение
    let formattedExpiration = [...card.expiration]
    const after = formattedExpiration.slice(2).join('')
    const before = formattedExpiration.slice(-2).join('')
    formattedExpiration = `${before} / ${after}`

    result += `
      <li bank="${card.bank}" class="method-card ${i === 0 ? 'checked' : ''}">
        <img class="bank-img" src="./img/${card.bank}.png" alt="bank preview">
        <div class="card-format">
          <p class="format">${formattedNumber}</p>
          <div>
            <p class="card-expiration">${formattedExpiration}</p>
            <p class="default">${i === 0 ? 'Default' : ''}</p>
          </div>
        </div>
        <div class="radio"></div>
      </li>
    `
    i === 0 ? updatePreview(card.bank) : ''

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

  // создаем разделение
  let formattedExpiration = [...data.expiration]
  const after = formattedExpiration.slice(2).join('')
  const before = formattedExpiration.slice(-2).join('')
  formattedExpiration = `${before} / ${after}`

  // создаем пробелы каждые 4 символа
  const formattedNumber = [...data.cardNumber]
    .map((char, index) => (index % 4 === 0 ? ' ' : '') + char).join('').trim()

  holderName.innerText = data.holderName
  cardExpiration.innerText = formattedExpiration
  cardNumber.innerText = formattedNumber
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

submitChangeBtn.addEventListener('click', () => {
  let error = false

  const iHolderName = document.getElementById('holderName')
  const iExpiration = document.getElementById('expiration')
  const iCardNumber = document.getElementById('cardNumber')
  const iCvv = document.getElementById('cvv')

  // Check Name input
  if (iHolderName.value.length <= 3
    || iHolderName.value.match(/\d/g)) {
    iHolderName.classList.add('error')
    error = true
  } else {
    iHolderName.classList.remove('error')
    error = false
  }

  // Check Expiration input
  if (iExpiration.value.length <= 3
    || !iExpiration.value.match(/\d/g)) {
    iExpiration.classList.add('error')
    error = true
  } else {
    iExpiration.classList.remove('error')
    error = false
  }

  // Check Card Number input
  if (iCardNumber.value.length <= 15
    || !iCardNumber.value.match(/\d/g)) {
    iCardNumber.classList.add('error')
    error = true
  } else {
    iCardNumber.classList.remove('error')
    error = false
  }

  // Check Cvv input
  if (iCvv.value.length <= 2
    || !iCvv.value.match(/\d/g)) {
    iCvv.classList.add('error')
    error = true
  } else {
    iCvv.classList.remove('error')
    error = false
  }

  if (!error) {
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
  }
})