
window.addEventListener('DOMContentLoaded', () => {
    // 'use strict'

const quizStep = document.querySelectorAll('.quiz__step');
const quizStepNumEnd = document.querySelectorAll('.quiz__step-num-end');
const quizBtnPrev = document.querySelector('.quiz__btn-prev');
const quizBtnNext = document.querySelector('.quiz__btn-next');
const quizTextarea = document.querySelector('.quiz__textarea');
const errorQuizWrp = document.querySelector('.error-quiz-wrp');
const errorFormWrp = document.querySelector('.error-form-wrp');
const formQuizSucsess = document.querySelector('.form-quiz-sucsess ');
const quizError = document.querySelector('.quiz__error');






// Вычисление ширины скроллбара
const srollWidth = window.innerWidth - document.documentElement.clientWidth;
// Индикатор для вывода окна ошибки, если не выбран вариант
let indicator = false;




// ДЛЯ ТЕСТОВ (СКРЫТИЕ-ПОКАЗ НУЖНОГО ШАГА)
// quizStep[4].classList.add('active');
// quizStep[0].classList.remove('active');

// PROGRESS BAR=============================================

const quizBarProgress = document.querySelector('.quiz__bar__progress');
const qProgressVal = document.querySelector('#q_progress_val');

let stepQuantity = quizStep.length;
let procents = Math.trunc(100 / stepQuantity);
// qProgressVal.textContent = procents;
quizBarProgress.style.width = procents + '%';

function multiplyProcents(index) {
  let endProcents = procents * (index + 1);
  // qProgressVal.textContent = endProcents;
  quizBarProgress.style.width = endProcents + '%';

  if(index === (quizStep.length)) {
    // qProgressVal.textContent = 100;
    quizBarProgress.style.width = 100 + '%';
  }
}



// ПЕРЕЛИСТЫВАНИЕ КВИЗА ВПЕРЕД С ПРОВЕРКОЙ НАЛИЧИЕ ВЫБОРА ВАРИАНТА====================
let index = 0;

// Проверка на выбранность инпута в конкретном шаге
function indicatorFalse() {
  quizStep.forEach(item => {
    if(window.getComputedStyle(item).display === 'block') {
      const inptsCheck = item.querySelectorAll('.quiz__input-check');

      Array.from(inptsCheck).find(inp => {

        if(inp.checked) {
          return indicator = true;
        } else {
          return indicator = false;
        }
      })
    }
  })
}


// Перелистывание
quizBtnNext.addEventListener('click', () => {
  quizBtnPrev.disabled = false;

  indicatorFalse();

  if(indicator === true) {
    quizStep.forEach(item => {
      item.classList.remove('active');
    })

    index++;
    quizStep[index].classList.add('active');
    multiplyProcents(index);

    if(index === (quizStep.length - 1)) {
      writeAllData();
      quizBtnNext.disabled = true;
    }

    quizError.classList.remove('active');

  } else {
    quizError.classList.add('active');
  }



})

  // Удаление надписи "Выберите вариант"
  const inpCheck = document.querySelectorAll('.quiz__input-check');
  inpCheck.forEach(item => {
    item.addEventListener('input', () => {
      quizError.classList.remove('active');
    })
  })





// ПЕРЕЛИСТЫВАНИЕ КВИЗА НАЗАД===============================

    quizBtnPrev.addEventListener('click', () => {
      quizBtnNext.disabled = false;
        index--;
        if(index < 0) {
          index = 0;
        }
        if(index === 0) {
          quizBtnPrev.disabled = true;
        }
        quizStep.forEach(item => {
          item.classList.remove('active');
        })
        quizStep[index].classList.add('active');

        multiplyProcents(index);

        quizError.classList.remove('active');

        // indicator = true;
        quizTextarea.innerHTML = '';
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
            console.log((quest.innerText) + ': ' + (ans.join('').replace(new RegExp('code', 'g'), ', ')).replace(/,\s*$/, ""));
            quizTextarea.innerHTML += (`<b>${quest.innerText}</b>`) + ': ' + (ans.join('').replace(new RegExp('code', 'g'), ', ')).replace(/,\s*$/, "") + '<br>';
        }

    })
}
// writeAllData();




// ОТПРАВКА ФОРМЫ========================
const quizForm = document.querySelector('.quiz__form');
const quizInputFormTel = document.querySelector('.quiz__input-form-tel');
const quizFormBtn = document.querySelector('.quiz__form-btn');
const quizFormTelError = document.querySelector('.quiz__form-tel-error');

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
  // errorQuizWrp.classList.remove('active');
  // errorFormWrp.classList.remove('active');
  if(quizInputFormTel.value !== '') {
    formSend(quizForm);
  } else {
    quizFormTelError.classList.add('active');
    // showOverlay();
    // errorFormWrp.classList.add('active');
    // errorFormWrp.classList.add('anim');
    // errorQuizWrp.classList.remove('active');
  }
})

quizInputFormTel.addEventListener('input', () => {
  quizFormTelError.classList.remove('active');
})


// mask==============================================

function maskPhone(selector, masked = '+7 (___) ___-__-__') {
	const elems = document.querySelectorAll(selector);

	function mask(event) {
		const keyCode = event.keyCode;
		const template = masked,
			def = template.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");
		//console.log(template);
		let i = 0,
			newValue = template.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
			});
		i = newValue.indexOf("_");
		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}
		let reg = template.substr(0, this.value.length).replace(/_+/g,
			function (a) {
				return "\\d{1," + a.length + "}";
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
			this.value = newValue;
		}
		if (event.type === "blur" && this.value.length < 5) {
			this.value = "";
		}

	}

	for (const elem of elems) {
		elem.addEventListener("input", mask);
		elem.addEventListener("focus", mask);
		elem.addEventListener("blur", mask);
	}

}
maskPhone('.quiz__input-form-tel');


});//end DOMContentLoaded

