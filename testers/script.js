'use strict'

const languageButtons = document.querySelectorAll('[data-select-language]')
const translatedElements = document.querySelectorAll('[data-language]')
const video = document.getElementById('introduction-video')
const videoDownload = document.getElementById('video-download')

function getInitialLanguage() {
	try {
		const savedLanguage = localStorage.getItem('timer-engine-tester-language')
		if (savedLanguage === 'pl' || savedLanguage === 'en') {
			return savedLanguage
		}
	} catch (error) {
		// Storage can be unavailable in private or restricted browser contexts.
		console.info('Language preference storage is unavailable.', error)
	}

	return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en'
}

function updateVideo(language) {
	if (!(video instanceof HTMLVideoElement) || !(videoDownload instanceof HTMLAnchorElement)) {
		return
	}

	const source = video.querySelector('source')
	if (!(source instanceof HTMLSourceElement)) {
		return
	}

	const videoPath = `assets/introduction-${language}.mp4`
	if (source.getAttribute('src') !== videoPath) {
		// A language change deliberately pauses playback; only the visitor can restart it.
		video.pause()
		source.setAttribute('src', videoPath)
		video.setAttribute('poster', `assets/poster-${language}.jpg`)
		video.load()
	}

	video.setAttribute('aria-label', language === 'pl'
		? 'Wprowadzenie do Timer Engine'
		: 'Introduction to Timer Engine')
	videoDownload.href = videoPath
	const fallbackLink = video.querySelector('a')
	if (fallbackLink instanceof HTMLAnchorElement) {
		fallbackLink.href = videoPath
	}
}

function setLanguage(language, persist) {
	if (language !== 'pl' && language !== 'en') {
		return
	}

	document.documentElement.lang = language
	document.title = language === 'pl'
		? 'Dołącz do testów · Timer Engine'
		: 'Join the test · Timer Engine'
	translatedElements.forEach((element) => {
		element.hidden = element.getAttribute('data-language') !== language
	})
	languageButtons.forEach((button) => {
		button.setAttribute('aria-pressed', String(button.getAttribute('data-select-language') === language))
	})
	updateVideo(language)

	if (!persist) {
		return
	}

	try {
		localStorage.setItem('timer-engine-tester-language', language)
	} catch (error) {
		console.info('Language preference could not be saved.', error)
	}
}

languageButtons.forEach((button) => {
	button.addEventListener('click', () => {
		setLanguage(button.getAttribute('data-select-language'), true)
	})
})

setLanguage(getInitialLanguage(), false)
const languagePicker = document.querySelector('.language-picker')
if (languagePicker instanceof HTMLElement) {
	languagePicker.hidden = false
}
