import {typingTestTexts} from "./data.js"

   //variables setup and DOM
   let accuracy = 0;
   let wordsPerMin = 0;
   let charsPerMin = 0;
   let timerTens = 0;
   let timerOnes = 0;
   let timerMinutes = 0;
   let counter = 0;
   let seconds = 0;
   let intervalId;
   const selectEl = document.getElementById('timer-select');
   const minuteBox = document.querySelector('.total-timeM');
   const secBoxTens = document.querySelector('.total-timeS1st');
   const secBoxOnes = document.querySelector('.total-timeS2nd');
   const totalTimeBox = document.querySelector('.total-time');
   const wpmCount = document.querySelector('.wpm-count');
   const cpmCount = document.querySelector('.cpm-count');
   const accCount = document.querySelector('.acc-count');
   const displayTextBox = document.querySelector('.text-area');
   const testAgainBtn = document.querySelector('.test-again');
   let textArr = typingTestTexts[counter].split("");
   const inputEl = document.querySelector('.type-area');
   const resultBox = document.querySelector('.result-box');
   resultBox.classList.remove('js-res-box');
   const resetBtn = document.querySelector('.reset-test');
   const startButton = document.querySelector('.start-timer');

   


   //all the stored values 
   let storedCounter = getStorage('counter');
    counter = storedCounter !== null ? storedCounter : counter;
   let storedSelectValue = getStorage('selectvalue');
   selectEl.value = storedSelectValue !== null ? storedSelectValue : selectEl.value;
   let storedAcc = getStorage('accuracy');
   accuracy = storedAcc !== null ? storedAcc : accuracy;
   let storedWpm = getStorage('wpm');
   wordsPerMin = storedWpm !== null ? storedWpm : wordsPerMin;
   let storedCpm = getStorage('cpm');
   charsPerMin = charsPerMin !== null ? storedCpm : charsPerMin;
   

//localStorage setups
 function saveStorage(name,value) {
   localStorage.setItem(`${name}`, JSON.stringify(value));
   }
   
 function getStorage(name) {
   const key = localStorage.getItem(name);
   return key ? JSON.parse(key) : null;
}

   //startups
   
   let targetText = typingTestTexts[counter];
   let targetWords = targetText.split(' ');
   displayTextBox.innerHTML = targetWords.map(word => `<span>${word}</span>`).join(" ");
   inputEl.disabled = true;
   if(!intervalId) {
      renderingValues();
   }

   //nav setups
const navlinks = document.querySelectorAll('.nav-link');
navlinks.forEach((nav) => {
     nav.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = nav.getAttribute('href').substring(1);
        var targetSection = document.getElementById(targetId);
        if(targetSection) {
         targetSection.scrollIntoView({
            behavior: "smooth"
          });
        }
     });
});

//main setups

 function resetTest() {
   clearInterval(intervalId);
   resultBox.classList.remove('js-res-box');
   renderingValues();
}

 function resetUtils() {
   inputEl.value = "";
   checkCounter();
   counter = (counter + 1) % typingTestTexts.length;
   targetText = typingTestTexts[counter];
   targetWords = targetText.split(' ');
   displayTextBox.innerHTML = targetWords.map(word => `<span>${word}</span>`).join(" ");
   saveStorage('counter',counter);
}

 function getResults() {
   //getting WPM
   let wordResultArr = inputEl.value.split(" ");
   let words = 0
   wordResultArr.forEach((value) => {
     if(value !== " ") {
      words++;
     }
   });
   if(inputEl.value === "") {
      words = 0;
   }
   let minutes = seconds/60;
   minutes = minutes === 0 ? 1 : minutes;
   wordsPerMin = words/minutes;
   saveStorage('wpm',wordsPerMin);

   //getting chars per min
   let charResultArr = inputEl.value.split('');
   let chars = 0;
   charResultArr.forEach((letter) => {
      if(letter !== " ") {
         chars++;
      }
   });
    charsPerMin = chars/minutes;
   saveStorage('cpm',charsPerMin);

   //getting accuracy 
   let wrongWords = 0;
   let compareArr = [];
   let compareLength = wordResultArr.length;
   for(let i = 0; i < compareLength; i++) {
      let toBePushed = targetWords[i];
      compareArr.push(toBePushed);
   };
   
   for(let i = 0; i < compareLength; i++) {
      if(wordResultArr[i] !== compareArr[i]) {
        wrongWords++
      }
   }
   let lossPercentage = (wrongWords/compareArr.length)*100;
   accuracy = 100 - lossPercentage;
   saveStorage('accuracy',accuracy);

   function updateResultBox() {
      wpmCount.innerHTML = Math.round(wordsPerMin);
      cpmCount.innerHTML = Math.round(charsPerMin);
      accCount.innerHTML = Math.round(accuracy) + `%`;
 }

   updateResultBox();
   
}

 function getResultScreen() {
   resultBox.classList.add('js-res-box');
   startButton.disabled = true;
   resetBtn.disabled = true;
}

 function updateDisplay() {
    secBoxOnes.innerHTML = timerOnes;
    secBoxTens.innerHTML = timerTens;
    minuteBox.innerHTML = timerMinutes;
    saveStorage('secboxones',secBoxOnes.innerHTML);
    saveStorage('secboxtens',secBoxTens.innerHTML);
    saveStorage('minbox',minuteBox.innerHTML);
} 

 function checkCounter() {
   if(counter >= typingTestTexts.length) {
      counter = 0;
      saveStorage('counter',counter);
   }
}




function renderingValues() {
   if(selectEl.value === "1") {
      totalTimeBox.innerHTML = "1M";
      minuteBox.innerHTML = "1"
      secBoxTens.innerHTML = "0";
      secBoxOnes.innerHTML = "0"
   } else if(selectEl.value === "2") {
      totalTimeBox.innerHTML = "2M";
      minuteBox.innerHTML = "2"
      secBoxTens.innerHTML = "0";
      secBoxOnes.innerHTML = "0"
   } else if(selectEl.value === "3") {
      totalTimeBox.innerHTML = "3M";
      minuteBox.innerHTML = "3"
      secBoxTens.innerHTML = "0";
      secBoxOnes.innerHTML = "0"
   }
}

function StopWatch() {
   seconds++;
   timerOnes--;
   if (timerOnes < 0) {
      timerOnes = 9;
      timerTens--;
  
      if (timerTens < 0) {
         timerTens = 5;
         timerMinutes--;

         if (timerMinutes < 0) {
            timerMinutes = 0;
            timerTens = 0;
            timerOnes = 0;
            clearInterval(intervalId);
            getResults();
            getResultScreen();
            updateDisplay();
            return;
         }
      }
   }
   updateDisplay();
   if(timerOnes === 0 && timerTens === 0 && timerMinutes === 0) {
      clearInterval(intervalId);
      getResults();
      getResultScreen();
   }
   updateDisplay();

}



function checkWords() {
   let typedWords = inputEl.value.trim().split(" ");
   let spans = displayTextBox.querySelectorAll("span");
   let allCorrect = true;

spans.forEach((span,index) => { //very much confusing algorithm but still managed to handle it! learning day by day:)
   if(typedWords[index] === undefined) {
      span.style.color = "";
      allCorrect = false
   } else if(typedWords[index] === targetWords[index]) {
      span.style.color = "green";
   
   } else {
      span.style.color = "red";
      allCorrect = false;
   }

});

   const currentIndex = typedWords.length - 1;
   if(spans[currentIndex]) {
      spans[currentIndex].scrollIntoView({
         behavior: "smooth",
         inline: "center",
         block: "nearest"
      });
   }

   if(typedWords.length === targetWords.length && allCorrect) {
            timerMinutes = 0;
            timerTens = 0;
            timerOnes = 0;
            clearInterval(intervalId);
            getResults();
            getResultScreen();
            updateDisplay();
            return;
   }


};


function startTimer() {
   if(intervalId) {
      clearInterval(intervalId);
   }
   let timeValue = selectEl.value;
   if(timeValue === "1") {
      timerMinutes = 0;
      timerTens = 5;
      timerOnes = 9;
      updateDisplay();
      intervalId = setInterval(StopWatch,1000)
   } else if(timeValue === "2") {
      timerMinutes = 1;
      timerTens = 5;
      timerOnes = 9;
      updateDisplay();
      intervalId = setInterval(StopWatch,1000)
   } else if(timeValue === "3") {
      timerMinutes = 2;
      timerTens = 5;
      timerOnes = 9;
      updateDisplay();
      intervalId = setInterval(StopWatch,1000)
   }

}


//handling events
inputEl.addEventListener('input', checkWords);

selectEl.addEventListener('change', () => {
   renderingValues();
   saveStorage('selectvalue',selectEl.value);
});

resetBtn.addEventListener('click', () => {
   displayTextBox.scrollLeft = 0;
   resetTest();
   seconds = 0;
   inputEl.disabled = true;
   inputEl.value = "";
   displayTextBox.innerHTML = targetWords.map(word => `<span>${word}</span>`).join(" ");
});

startButton.addEventListener('click', ()=> {
   seconds = 0;
   startTimer();
   inputEl.disabled = false;
});

testAgainBtn.addEventListener('click' , ()=> {
   resultBox.classList.remove('js-res-box');
   renderingValues();
   resetUtils();
   startButton.disabled = false;
   resetBtn.disabled = false;
   seconds = 0;
   inputEl.disabled = true;
   displayTextBox.scrollLeft = 0;
});

