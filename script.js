const fromCurrency = document.getElementById('from')
const toCurrency = document.getElementById('to')
const convertButton = document.getElementById('convert-button')
const inputField = document.getElementById('amount-input')
const result = document.getElementById('result-message')
const errorMessage = document.getElementById('error-message')
const form = document.querySelector('form')

const EXCHANGE_RATE_API_KEY = `b800cfe5f41045458a21f49e`;
const EXCHANGE_RATE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair`

const COUNTRY_LIST_API_URL = 'https://restcountries.com/v3.1/all?fields=name,currencies,flag'

const findCountryDetails = async () => {
  try {
    const receivedData = await fetch(COUNTRY_LIST_API_URL);
    const currencyData = await receivedData.json();
    currencyData.forEach((data) => {

      // Getting the currency code and currency name for the options
      if (!data.currencies && Object.keys(data.currencies).length === 0) {
        return
      }

      const currencyCode = Object.keys(data.currencies)[0];
      const currencyName = data.currencies[currencyCode]?.name;

      if (!currencyName) return;

      const optionText = `${data.flag} ${currencyCode} - ${currencyName}`

      // Creating the option for the converted(from) currency from
      const fromOption = document.createElement('option');
      fromOption.value = currencyCode;
      fromOption.textContent = optionText;
      fromCurrency.appendChild(fromOption);

      // Creating the option for the converting(to) currency from
      const toOption = document.createElement('option');
      toOption.value = currencyCode;
      toOption.textContent = optionText;
      toCurrency.appendChild(toOption);
    })

  } catch (error) {
    console.log(error)
  }
}

findCountryDetails();


// Function to reset everything
const reset = () => {
  inputField.textContent = "";
  inputField.value = "";

  setTimeout(() => {
    result.textContent = "";
    errorMessage.textContent = "";
  }, 8000)
}

// Function to call the exchange api and get the conversion rate
const getConversionRates = async (fromCurrencyCode, toCurrencyCode) => {
  try {
    const conversionRatesResponse = await fetch(`${EXCHANGE_RATE_API_URL}/${fromCurrencyCode}/${toCurrencyCode}`);
    const conversionRatesData = await conversionRatesResponse.json();
    return conversionRatesData.conversion_rate;
  } catch(error) {
    errorMessage.textContent = `An error occurred, please try again later`
  }
}

// Function to make the convert button work
convertButton.addEventListener('click', async function (event) {
  event.preventDefault();
  const inputedAmountToConvert = inputField.value.trim();
  const fromCurrencyCode = fromCurrency.value.trim();
  const toCurrencyCode = toCurrency.value.trim();

  if(!inputedAmountToConvert && !fromCurrencyCode && !toCurrencyCode ) {
    return;
  }
  const conversionRates = await getConversionRates(fromCurrencyCode, toCurrencyCode);

  const resultedRate = inputedAmountToConvert * conversionRates;
  result.textContent = `${inputedAmountToConvert} ${fromCurrencyCode} = ${resultedRate} ${toCurrencyCode}`

  reset();
}, false)