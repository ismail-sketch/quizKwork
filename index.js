
window.addEventListener('DOMContentLoaded', () => {
    // 'use strict'

const body = document.querySelector('body');
const quizStep = document.querySelectorAll('.quiz__step');
const quizStepNumEnd = document.querySelectorAll('.quiz__step-num-end');
const quizBtnPrev = document.querySelectorAll('.quiz__btn-prev');
const quizBtnLast = document.querySelector('.quiz__btn-last');
const quizTextarea = document.querySelector('.quiz__textarea');
const overlay = document.querySelector('.overlay');
const popups = document.querySelectorAll('.popups');
const crossClosed = document.querySelector('.cross-closed');
const errorQuizWrp = document.querySelector('.error-quiz-wrp');
const errorFormWrp = document.querySelector('.error-form-wrp');
const formQuizSucsess = document.querySelector('.form-quiz-sucsess ');






// Вычисление ширины скроллбара
const srollWidth = window.innerWidth - document.documentElement.clientWidth;
// Индикатор для вывода окна ошибки, если не выбран вариант
let indicator = false;


//ФУНКЦИИ ПОЯВЛЕНИЯ И СКРЫТИЯ OVERLAY ДЛЯ ПОПАПОВ===========================
function showOverlay() {
  overlay.classList.add('active');
  body.classList.add('active');
  body.style.paddingRight = srollWidth + 'px';
  errorQuizWrp.classList.add('anim');
}

crossClosed.addEventListener('click', () => {
  hideOverlay();
})

overlay.addEventListener('click', (e) => {
  if(!e.target.closest('.popup')) {
    hideOverlay();
  }
})

function hideOverlay() {
  overlay.classList.remove('active');
  body.classList.remove('active');
  popups.forEach(item => {
    item.classList.remove('active');
  })
  body.style.paddingRight = '';
  errorQuizWrp.classList.remove('anim');
  errorFormWrp.classList.remove('anim');
  errorQuizWrp.classList.remove('active');
  errorFormWrp.classList.remove('active');
  formQuizSucsess.classList.remove('active');
//   formSucsess.classList.remove('active');
}



// ДЛЯ ТЕСТОВ (СКРЫТИЕ-ПОКАЗ НУЖНОГО ШАГА)
// quizStep[6].classList.add('active');
// quizStep[0].classList.remove('active');

// PROGRESS BAR=============================================
const quizBarProgress = document.querySelector('.quiz__bar__progress');
const qProgressVal = document.querySelector('#q_progress_val');

let stepQuantity = quizStep.length;
let procents = Math.trunc(100 / stepQuantity);
qProgressVal.textContent = procents;
quizBarProgress.style.width = procents + '%';

function multiplyProcents(index) {
  let endProcents = procents * (index + 2);
  qProgressVal.textContent = endProcents;
  quizBarProgress.style.width = endProcents + '%';

  if(index === (quizStep.length - 2)) {
    qProgressVal.textContent = 100;
    quizBarProgress.style.width = 100 + '%';
  }
}


//СКРЫВАЕМ РАДИОКНОПКУ ТАМ, ГДЕ ЕСТЬ ТЕКСТОВЫЙ ИНПУТ
const quizAnswersItem = document.querySelectorAll('.quiz__answers-item');
quizAnswersItem.forEach(item => {
    if(item.querySelector('.quiz__input-text')) {
        item.classList.add('active');
    }
})


// ПЕРЕЛИСТЫВАНИЕ КВИЗА ВПЕРЕД С ПРОВЕРКОЙ НАЛИЧИЕ ВЫБОРА ВАРИАНТА====================
quizStep.forEach((item, index) => {

  item.addEventListener('click', (e) => {
    if(e.target.closest('.quiz__btn-next')) {
      const inpCheck = item.querySelectorAll('.quiz__input-check');

      indicator = false;
      Array.from(inpCheck).find(inpcheck => {
        if(!inpcheck.checked) {
          errorQuizWrp.classList.add('active');
        } else {
          quizStep[index].classList.remove('active');
          quizStep[index + 1].classList.add('active');
          indicator = true;
          multiplyProcents(index);
        }
      })

      if(item.querySelector('input[type="text"') !== null) {
        if(item.querySelector('input[type="text"').value !== '') {
          quizStep[index].classList.remove('active');
          quizStep[index + 1].classList.add('active');
          indicator = true;
          multiplyProcents(index);
        }
      }

      if(item.querySelector('input[type="number"') !== null) {
        if(item.querySelector('input[type="number"').value !== '') {
          quizStep[index].classList.remove('active');
          quizStep[index + 1].classList.add('active');
          indicator = true;
          multiplyProcents(index);
        }
      }

    }
  })
})

// ПЕРЕЛИСТЫВАНИЕ КВИЗА НАЗАД===============================
quizBtnPrev.forEach((item, index) => {
    item.addEventListener('click', () => {
        quizStep[index - 1].classList.add('active');
        quizStep[index].classList.remove('active');
    })
})

// ПОКАЗА ОКНА ОШИБКИ, ЕСЛИ НЕ ВЫБРАН ВАРИАНТ===========================
quizStep.forEach(item => {
  item.addEventListener('click', (e) => {

    if(e.target.closest('.quiz__btn-next')) {
      if(indicator === false) {
        showOverlay();
        errorFormWrp.classList.remove('active');
      }
    }
    if(e.target.closest('.quiz__btn-last')) {
        if(!indicator === false) {
            writeAllData();
            console.log('ok');
        }
    }
  })


})

// ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ СЧЕТЧИКА ШАГОВ=====================
const quizStepNumCurrent = document.querySelectorAll('.quiz__step-num-current');
quizStepNumCurrent.forEach((item, index) => {
  item.innerText = index + 1;
})
quizStepNumEnd.forEach(item => {
  item.innerHTML = quizStep.length - 1;
})





// Вывожу результат опроса куда нужно=====================
function writeAllData() {

    quizStep.forEach(item => {
        const quest = item.querySelector('.quiz__question');
        const answ = item.querySelectorAll('input');

        const ans = Array.from(answ).map(a => {
        if(a.checked || (a.type === 'text' ? a.value : '') || (a.type === 'number' ? a.value : '') ) {
            return a.value + 'code';
        }
        });
        // console.log(JSON.stringify(ans));
        if(quest !== null && ans !== null) {
            console.log((quest.innerText.replace('?', ': ') ) + (ans.join('').replace(new RegExp('code', 'g'), ', ')).replace(/,\s*$/, ""));
            quizTextarea.innerHTML += (quest.innerText.replace('?', ': ') ) + (ans.join('').replace(new RegExp('code', 'g'), ', ')).replace(/,\s*$/, "") + '<br>';
        }

    })
}
// writeAllData();

// ОЧИЩАЮ INPUT-RADIO ПРИ ВВОДЕ В ТЕКСТОВЫЙ И НАОБОРОТ================
quizStep.forEach(item => {
    if(item.querySelector('.quiz__input-text') !== null) {
        item.addEventListener('input', (e) => {
            if(e.target.closest('.quiz__input-check')) {
                item.querySelector('.quiz__input-text').value = '';
            }
            if(e.target.closest('.quiz__input-text')) {
                item.querySelectorAll('.quiz__input-check').forEach(check => {
                    check.checked = false;
                })
            }
        })
    }
})



// ОТПРАВКА ФОРМЫ========================
const quizForm = document.querySelector('.quiz__form');
const quizInputFormTel = document.querySelector('.quiz__input-form-tel');
const quizFormBtn = document.querySelector('.quiz__form-btn');

async function formSend(form) {
  let formData = new FormData(form);
  let respons = await fetch('https://razraber.ru/wp-content/themes/mytheme/sendmail.php', {
      method: 'POST',
      body: formData
  });

  if(respons.ok) {
    showOverlay();
    formQuizSucsess.classList.add('active');
    form.reset();
  } else {
  }
}

quizFormBtn.addEventListener('click', (e) => {
  e.preventDefault();
  errorQuizWrp.classList.remove('active');
  errorFormWrp.classList.remove('active');
  if(quizInputFormTel.value !== '') {
    formSend(quizForm);
  } else {
    showOverlay();
    errorFormWrp.classList.add('active');
    errorFormWrp.classList.add('anim');
    errorQuizWrp.classList.remove('active');
  }
})

// ==================================================================================================
// ==================================================================================================
// ==================================================================================================
// ==================================================================================================

// INPUTS RANGE-----------------------------------

// Получаем нужные элементы
const inputRangeWrp = document.querySelectorAll('.input-range-wrp');
const inputNumberForRange = document.querySelector('.input-number-for-range');
const inputRangeWithInputNum = document.querySelector('.input-range-with-input-num');

inputRangeWrp.forEach((item) => {
  const range = item.querySelector('.range');
  const rangeBtn = item.querySelector('.input-range-btn-fake');
  const inputRangeColorFake = item.querySelector('.input-range-color-fake ');
  const inputCountForRange = item.querySelector('.input-count-for-range');

  const maxValue = range.getAttribute("max");

  // Высчитываем ширину заполняющего прогресс-бара
  function rangePosition() {
    let rangeValue = range.value;

    inputNumberForRange.value = inputRangeWithInputNum.value;

    rangeBtn.style.left = rangeValue / (+maxValue/100) + '%';

    inputCountForRange.style.left = rangeValue / (+maxValue/100) + '%';
    inputCountForRange.value = rangeValue;

    inputRangeColorFake.style.width = rangeValue / (+maxValue/100) + '%';
  }

  rangePosition();

  // Запускаем функцию rangePosition при событии input
  range.addEventListener('input', () => {
    rangePosition();
  });

  inputNumberForRange.addEventListener('input', () => {
    inputRangeWithInputNum.value = inputNumberForRange.value;
    rangePosition();
  });
});






});//end DOMContentLoaded

