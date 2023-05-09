let winAudio = new Audio();
winAudio.src = 'https://audio-previews.elements.envatousercontent.com/files/206084513/preview.mp3?response-content-disposition=attachment%3B+filename%3D%222PBE8A4-huge-win.mp3%22';

let loseAudio = new Audio();
loseAudio.src = 'https://assets.mixkit.co/active_storage/sfx/2027/2027-preview.mp3';

let errorAudio = new Audio();
errorAudio.src = 'https://assets.mixkit.co/active_storage/sfx/954/954-preview.mp3';

const buttonsContainer = document.getElementById('buttons');
const hintButtonsContainer = document.getElementById('hint-buttons');
const guessSubmitBtn = document.getElementById('guess-btn');
const guessAmount = document.getElementById('guess-amount');
const totalPrice = document.getElementById('total-price');

for (let i = 0; i < 100; i++) {
  const button = document.createElement('button');
  const value = i.toString().padStart(2, '0');
  button.innerHTML = value;
  button.value = value;
  button.className = 'p-3 guess-digit'
  button.id = `digit_${value}`;
  buttonsContainer.appendChild(button);

  button.onclick = function() {
    handleGuess(value);
  };

}

let remainingGuesses = 5;
let guessedNumbers = [];

function handleGuess(guess) {
  if (remainingGuesses === 0 && !guessedNumbers.includes(guess)) {
    errorAudio.play();
    alert("\u26A0\ufe0f\u26A0\ufe0f The maximum guess number is 5. \u26A0\ufe0f\u26A0\ufe0f");
    return;
  }

  let guessButton = document.getElementById(`digit_${guess}`);
  guessButton.classList.toggle('bg-success');

  if(!guessedNumbers.includes(guess)) {
    remainingGuesses--;
    guessedNumbers.push(guess);
  } else {
    remainingGuesses++;
    guessedNumbers.splice(guessedNumbers.indexOf(guess));
  }
}

function handleCalculation(amount) {
  let currentAmount = totalPrice.innerHTML;

  if(guessedNumbers.length === 0) {
    errorAudio.play();
    alert("\u26A0\ufe0f\u26A0\ufe0f Please select guess number. \u26A0\ufe0f\u26A0\ufe0f");
    return;
  }
  if(+amount == '') {
    errorAudio.play();
    alert("\u26A0\ufe0f\u26A0\ufe0f Please enter amount. \u26A0\ufe0f\u26A0\ufe0f");
    guessAmount.focus();
    return;
  }
  if(+amount < 500) {
    errorAudio.play();
    alert("\u26A0\ufe0f\u26A0\ufe0f Minimum amount is 500. \u26A0\ufe0f\u26A0\ufe0f");
    return;
  }
  if(+amount > +currentAmount) {
    errorAudio.play();
    alert("\u26A0\ufe0f\u26A0\ufe0f Not enough amount. \u26A0\ufe0f\u26A0\ufe0f");
    return;
  }

  const randomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  if(guessedNumbers.includes(randomNumber)) {
      winAudio.play();
      let winPrice = amount * 80;
      let updatePrice = currentAmount - amount + winPrice;
      let message = `The number is ${randomNumber}. You Win ${winPrice} USD.`;
      alert(message);
      totalPrice.innerHTML = ''+BigInt(updatePrice);
  } else {
    loseAudio.play();
    let updatePrice = currentAmount - amount;
    let message = `The number is ${randomNumber}. You Loss ${amount} USD. Try again..`;
    alert(message);
    totalPrice.innerHTML = ''+BigInt(updatePrice);
  }

  reset();
  return;
}

guessSubmitBtn.onclick = function() {
  let amount = guessAmount.value;
  handleCalculation(amount);
};

setInterval(() => {
  fetch('https://api.thaistock2d.com/2d_result')
    .then(response => response.json())
    .then(data => {
        let lastTenDays = data.flatMap(obj => obj.child.map(child => (child.twod )));
        const randomValues = getRandomValuesFromArray(lastTenDays, 10);

        while (hintButtonsContainer.firstChild) {
          hintButtonsContainer.removeChild(hintButtonsContainer.firstChild);
        }

        for (let i = 0; i < randomValues.length; i++) {
          const hintButton = document.createElement('button');
          const value = randomValues[i].toString().padStart(2, '0');
          hintButton.innerHTML = value;
          hintButton.value = value;
          hintButton.className = 'p-3';
          hintButtonsContainer.appendChild(hintButton);
      }
    })
    .catch(error => console.error(error));
}, 1000);

setInterval(() => {
  fetch('https://api.thaistock2d.com/live')
    .then(response => response.json())
    .then(data => {
      let live = data.live;
      let elevenOclock = data.result[0];
      let twelveOclock = data.result[1];
      let threeOclock = data.result[2];
      let fourThirtyOclock = data.result[3];

      document.getElementById('live-set').innerHTML = live.set;
      document.getElementById('live-value').innerHTML = live.value;
      document.getElementById('live-twod').innerHTML = live.twod;
      document.getElementById('updated-hour').innerHTML = live.time;
      
      document.getElementById('eleven-oc-set').innerHTML = elevenOclock.set;
      document.getElementById('eleven-oc-value').innerHTML = elevenOclock.value;
      document.getElementById('eleven-oc-twod').innerHTML = elevenOclock.twod;

      document.getElementById('twelve-oc-set').innerHTML = twelveOclock.set;
      document.getElementById('twelve-oc-value').innerHTML = twelveOclock.value;
      document.getElementById('twelve-oc-twod').innerHTML = twelveOclock.twod;

      document.getElementById('three-oc-set').innerHTML = threeOclock.set;
      document.getElementById('three-oc-value').innerHTML = threeOclock.value;
      document.getElementById('three-oc-twod').innerHTML = threeOclock.twod;

      document.getElementById('four-thirty-oc-set').innerHTML = fourThirtyOclock.set;
      document.getElementById('four-thirty-oc-value').innerHTML = fourThirtyOclock.value;
      document.getElementById('four-thirty-oc-twod').innerHTML = fourThirtyOclock.twod;
    })
    .catch(error => console.error(error));
}, 1000);

function getRandomValuesFromArray(arr, count) {
  const randomValues = [];

  while (randomValues.length < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomValue = arr[randomIndex];

    if (!randomValues.includes(randomValue)) {
      randomValues.push(randomValue);
    }
  }

  return randomValues;
}

function reset() {
  guessedNumbers = [];
  remainingGuesses = 5;
  guessAmount.value = '';
  const elements = document.querySelectorAll('.guess-digit');
  elements.forEach(element => element.classList.remove('bg-success'));    
}