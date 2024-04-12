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

// VARIABLES
// credtir cards and one add card
const methodCards = document.querySelectorAll(".method-card")

// card preview form cardForm[0].value
const editInputs = document.querySelectorAll('#card-info input')

// elements of card preview
const holderName = document.querySelector('#card-preview-info .holder-name')
const cardExpiration = document.querySelector('#card-preview-info .card-expiration')
const cardNumber = document.querySelector('#card-preview-info .card-number')
const cardBankImg = document.querySelector('#card-preview-info > img')

// BUTTONS
// кнопка для подтверждения выбраной карты3
const paymentMethodBtn = document.querySelector('#payment-method-btn')
// кнопка для подтверждения изменения инфо карты
const changeBtn = document.querySelector('#change-btn')

// ----------------------------------------------------------------------

// FUNCTIONS

methodCards.forEach(card => {
  card.addEventListener('click', (e) => {
    if (!card.classList.contains('checked')) {
      methodCards.forEach(item => {
        item.classList.remove('checked')
      })

      // geting data from server
      card.getAttribute('bank') === 'add' ? clearPreview() : updatePreview(card.getAttribute('bank'))

      card.classList.add('checked')
    }
  })
})

async function getData(bank) {
  const response = await fetch(`http://localhost:3000/` + bank)
  return await response.json()
}

async function updatePreview(bank) {
  const data = await getData(bank)

  holderName.innerText = data.holderName
  cardExpiration.innerText = data.expiration
  cardNumber.innerText = data.cardNumber
  cardBankImg.src = `http://127.0.0.1:5500/img/${bank}.png`

  editInputs.forEach(input => {
    console.dir(data)
    let currentInput = input.getAttribute('id')
    if (input.getAttribute(currentInput) === data[currentInput]) {
      input.value = data[currentInput]
    }

  })
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

