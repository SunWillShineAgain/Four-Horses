document.addEventListener('DOMContentLoaded', () => {
	// Scroll to
	document.querySelectorAll('.header__link .btn').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			const target = e.target.closest('.header__link') // Находим родителя-ссылку
			const id = target.dataset.link // Находим дата-атрибут

			if (!id) return
			const top = document.getElementById(`${id}`).getBoundingClientRect().top // вычисляем верхнюю точку секции-якоря
			window.scrollTo({ top: top + window.scrollY - 30, behavior: 'smooth' }) // плавный скролл к верхней точке секции. К ней прибавляем текущий скролл страницы и отнимаем 30px для удобства
		})
	})

	// SESSION SLIDER
	const template = {
		large: [1, 1, 1, 1, 1, 1, 1],
		small: [2, 1, 2, 1, 1],
	} // шаблон для разного отображения на разной ширине экрана

	const stageCards = [
		'Строительство железнодорожной магистрали Москва-Васюки',
		'Открытие фешенебельной гостиницы «Проходная пешка» и других небоскрёбов',
		'Поднятие сельского хозяйства в радиусе на тысячу километров: производство овощей, фруктов, икры, шоколадных конфет',
		'Строительство дворца для&nbsp;турнира',
		'Размещение гаражей для гостевого автотранспорта',
		'Постройка сверхмощной радиостанции для передачи всему миру сенсационных результатов',
		'Создание аэропорта «Большие Васюки» с&nbsp;регулярным отправлением почтовых самолётов и дирижаблей во все концы света, включая Лос-Анжелос и Мельбурн',
	]

	const stageNavigation = document.querySelector('.stage__navigation')
	const prevButton = document.querySelector('.stage__navigation .slider-prev')
	const nextButton = document.querySelector('.stage__navigation .slider-next')
	const stageSlider = document.querySelector('.stage__cards')

	const initSessionSlider = () => {
		const dotsContainer = document.querySelector('.stage__dots')
		const sliderWidth = document.querySelector('.stage__slider').clientWidth // определение ширины слайда при изменении ширины экрана
		stageSlider.style.transform = `translateX(0px)` // сбрасывание на первый слайд

		const currentSize =
			window.innerWidth > 991 ? template.large : template.small
		const slidesCount = currentSize.length

		const drawDots = () => {
			dotsContainer.innerHTML = ``
			for (let i = 0; i < slidesCount; i++) {
				const dot = `<div class="dot"></div>`
				dotsContainer.insertAdjacentHTML('afterbegin', dot)
			}
		} // точки навигации

		drawDots()

		const makeDotActive = value => {
			if (window.innerWidth > 991) return
			dotsContainer.childNodes.forEach(dot => dot.classList.remove('active'))
			dotsContainer.childNodes[value - 1].classList.add('active')
		} // активный слайд в навигации

		makeDotActive(1)

		let copy
		const drawCards = size => {
			stageSlider.innerHTML = '' // очистка контейнера при перерисовке
			let card

			copy = [...stageCards] // копирование массива карточек
			const getSlideText = count => {
				let innerText = ''
				for (let i = 0; i < count; i++) {
					innerText += `<div class="stage__card-number">${copy[i]}</div>`
				} // отрисовка количества элементов на слайд
				copy.splice(0, count) // удаление из массива количества элементов по шаблону(template) для странного отображения

				return innerText
			}

			for (let i = 0; i < size.length; i++) {
				card = `<div class="stage__card">${getSlideText(size[i])}</div>`
				stageSlider.insertAdjacentHTML('beforeend', card)
			} // отрисовка слайда
		}

		window.innerWidth > 991
			? drawCards(template.large)
			: drawCards(template.small) // определение количества слайдов для отрисовки

		let offset = 0
		let currentSlide = 1

		const checkButtonsDisability = () => {
			if (currentSlide === 1) {
				prevButton.setAttribute('disabled', 'disabled')
				nextButton.removeAttribute('disabled', 'disabled')
			} else if (currentSlide === slidesCount) {
				prevButton.removeAttribute('disabled', 'disabled')
				nextButton.setAttribute('disabled', 'disabled')
			} else {
				prevButton.removeAttribute('disabled', 'disabled')
				nextButton.removeAttribute('disabled', 'disabled')
			}
		} // проверка доступности кнопок

		checkButtonsDisability()

		const nextSlide = () => {
			if (currentSlide < slidesCount) {
				currentSlide++
				offset -= sliderWidth
				stageSlider.style.transform = `translateX(${offset}px)`
			}

			checkButtonsDisability()
			makeDotActive(currentSlide)
		}

		const prevSlide = () => {
			if (currentSlide > 1) {
				currentSlide--
				offset += sliderWidth
				stageSlider.style.transform = `translateX(${offset}px)`
			} else {
				currentSlide = 1
			}

			checkButtonsDisability()
			makeDotActive(currentSlide)
		}

		stageNavigation.addEventListener('click', e => {
			const button = e.target
			if (button.nodeName !== 'BUTTON') return

			button.classList.contains('slider-next') ? nextSlide() : prevSlide()
		})
	}

	initSessionSlider()
	window.addEventListener('resize', initSessionSlider) // обработчик ресайза окна

	//  Participant Slider (зацикленный и меняющийся автоматически)

	const participantWrap = document.querySelector('.participant__cards')
	const participantSlides = document.querySelectorAll('.participant__card')
	const participantSlider = document.querySelector('.participant__slider')
	const participantNavigation = document.querySelector(
		'.participant__navigation'
	)
	let currentSlides = document.querySelector('.participant__count .first')
	let allSlides = document.querySelector('.participant__count .second')

	let interval
	const breakpoints = {
		xl: 2,
		md: 1,
	} // брейкпоинты для определения количества отображаемых слайдов на экране

	const initParticipantSlider = (value = 3) => {
		clearInterval(interval) // сброс интервала при ресайзе окна
		participantWrap.style.transform = `translateX(0px)` // сбрасывание на начальный экран (экран == количество карточек в одном слайде)
		let SLIDESPERVIEW = value // количество карточек на экране

		if (window.innerWidth < 1200) {
			SLIDESPERVIEW = 2
		}

		if (window.innerWidth < 767) {
			SLIDESPERVIEW = 1
		}

		const slidesCount = participantSlides.length // количество карточек
		const GAP = 20
		const slideWidth =
			(participantSlider.offsetWidth - (SLIDESPERVIEW - 1) * GAP) /
			SLIDESPERVIEW // ширина одной карточки

		participantSlides.forEach(
			slide => (slide.style.flexBasis = `${slideWidth}px`)
		) // присваивание ширины одной карточке

		currentSlides.textContent = SLIDESPERVIEW
		allSlides.textContent = slidesCount

		let offset = 0 // накопитель смещения
		const offsetPerPage = SLIDESPERVIEW * (slideWidth + GAP) // значение смещения экрана
		let pageCount = Math.ceil(slidesCount / SLIDESPERVIEW) // количество экранов
		let currentPage = 1 // текущий экран

		const getCurrentSlide = () => {
			SLIDESPERVIEW * currentPage > slidesCount
				? (currentSlides.textContent = slidesCount)
				: (currentSlides.textContent = SLIDESPERVIEW * currentPage)
		} // Получить текущие слайды

		const nextSlide = () => {
			if (currentPage >= pageCount) {
				offset = 0
				currentPage = 1
				participantWrap.style.transform = `translateX(0px)`
			} else {
				currentPage++
				offset -= offsetPerPage
				participantWrap.style.transform = `translateX(${offset}px)`
			}

			getCurrentSlide()
		} // следующий слайд

		const prevSlide = () => {
			if (currentPage == 1) {
				currentPage = pageCount
				offset = offsetPerPage
				participantWrap.style.transform = `translateX(-${offset}px)`
			} else {
				currentPage--
				offset += offsetPerPage
				participantWrap.style.transform = `translateX(0px)`
			}

			getCurrentSlide()
		} // предыдущий слайд

		participantNavigation.addEventListener('click', e => {
			const button = e.target
			if (button.nodeName !== 'BUTTON') return

			button.classList.contains('slider-next') ? nextSlide() : prevSlide()
		})

		interval = setInterval(() => {
			nextSlide()
		}, 4000)
	}

	initParticipantSlider()
	window.addEventListener('resize', () => {
		if (window.innerWidth < 1200) {
			initParticipantSlider(breakpoints.xl)
			return
		}
		if (window.innerWidth < 576) {
			initParticipantSlider(breakpoints.md)
			return
		}

		initParticipantSlider()
	}) // обработчик ресайза окна
})
