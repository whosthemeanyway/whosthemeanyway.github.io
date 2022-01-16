import { tvThemes } from './themes/tvThemes.js'
import { movieThemes } from './themes/movieThemes.js'
import { getRandomInt } from './utils.js'

const container = document.getElementById('container')
let elementsWritten = []

window.backgroundAudio = buildAudio('./music/ChaCappellaJimmyFontanez.mp3')
document.body.appendChild(backgroundAudio)

let players = localStorage.getItem('players') ? JSON.parse(localStorage.getItem('players')) : []
let tvThemesPlayed = localStorage.getItem('tvThemesPlayed') ? JSON.parse(localStorage.getItem('tvThemesPlayed')) : []

function displayGame (themes) {
  const theme = themes[getRandomInt(themes.length)]

  const categoriesButton = buildButton('Back to Categories')
  categoriesButton.onclick = () => {
    clearContainer()
    displayCategories()
  }

  const header = buildHeader(theme.name)

  function buildIframe (theme) {
    const iframe = document.createElement('iframe')
    iframe.id = theme.name
    iframe.src = `https://open.spotify.com/embed/track/${theme.id}?utm_source=generator`
    iframe.allow = 'autoplay; clipboard-write; encrypted-media'
    iframe.style.width = '100%'
    iframe.style.height = '80%'

    return iframe
  }
  const iframe = buildIframe(theme)
  const nextButton = buildButton('Next')
  nextButton.onclick = () => {
    clearContainer()
    displayGame(themes)
  }
  appendToContainer([categoriesButton, header, iframe, nextButton])

  players.forEach((player) => {
    addPlayerLabel(player)
  })

  function addPlayerLabel (player) {
    const name = document.createElement('a')
    name.style.cursor = 'cell'
    name.innerText = `${player.name}: ${player.score}pts`
    name.style.display = 'block'
    name.style.fontSize = '24px'
    name.style.margin = 'auto'
    name.style.textAlign = 'center'
    name.onclick = () => {
      name.innerText = `${player.name}: ${player.score + 1}pts`
      increasePlayerScore(player)
    }
    appendToContainer([name])
  }
}

function displayWelcome () {
  const header = buildHeader('Who\'s Theme is it Anyway?!')
  header.style.marginTop = '25%'
  const newButton = buildButton('Lets Play!')
  newButton.onclick = () => {
    displayPlayerForm()
  }
  // const continueButton = buildButton('Continue Game')

  appendToContainer([header, newButton])
}
displayWelcome()

function clearContainer () {
  elementsWritten.forEach((element) => {
    container.removeChild(element)
  })
  elementsWritten = []
}

function buildHeader (text) {
  const header = document.createElement('h1')
  header.innerText = text

  return header
}

function buildAudio (url) {
  const audio = document.createElement('audio')
  audio.src = url
  audio.controls = 'controls'
  audio.autoplay = true
  audio.hidden = true

  return audio
  // audio.play()
}

function buildButton (text) {
  const button = document.createElement('button')
  button.innerText = text
  button.style.display = 'block'
  button.style.margin = 'auto'
  button.style.marginTop = '20px'
  button.style.marginBottom = '20px'
  button.style.backgroundColor = 'orange'
  button.style.color = 'white'
  button.style.border = '0px'

  return button
}

function appendToContainer (elements) {
  elements.forEach(element => {
    container.appendChild(element)
    elementsWritten.push(element)
  })
}

function displayPlayerForm () {
  clearContainer()

  const header = buildHeader('Players')

  const form = document.createElement('form')
  const nameInput = document.createElement('input')
  nameInput.style.display = 'block'
  nameInput.style.margin = 'auto'
  nameInput.placeholder = 'Name'
  nameInput.type = 'text'
  nameInput.name = 'name'
  const button = buildButton('Add Player')
  form.appendChild(nameInput)
  form.appendChild(button)
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nameValue = formData.get('name')
    const player = addPlayer(nameValue)
    addPlayerLabel(player)
  })

  function addPlayerLabel (player) {
    const name = document.createElement('a')
    name.style.cursor = 'no-drop'
    name.innerText = `${player.name}: ${player.score}pts`
    name.style.display = 'block'
    name.style.fontSize = '24px'
    name.style.margin = 'auto'
    name.style.textAlign = 'center'
    name.onclick = () => {
      removeFromContainer([name])
      removePlayer(player)
    }
    appendToContainer([name])
  }

  const beginButton = buildButton('Lets Begin!')
  beginButton.onclick = () => {
    clearContainer()
    displayCategories()
  }

  appendToContainer([header, beginButton, form])

  players.forEach(player => addPlayerLabel(player))
}

function removeFromContainer (elements) {
  elements.forEach((element) => {
    container.removeChild(element)
    elementsWritten = elementsWritten.filter(item => item !== element)
  })
}

function addPlayer (nameValue) {
  const player = {
    name: nameValue,
    score: 0
  }
  players.push(player)

  localStorage.setItem('players', JSON.stringify(players))

  return player
}

function removePlayer (player) {
  players = players.filter(entry => entry !== player)

  localStorage.setItem('players', JSON.stringify(players))
}

function displayCategories () {
  const movieButton = buildButton('Movies')
  movieButton.onclick = () => {
    window.backgroundAudio.pause()
    clearContainer()
    displayGame(movieThemes)
  }

  const tvButton = buildButton('TV Themes')
  tvButton.onclick = () => {
    window.backgroundAudio.pause()
    clearContainer()
    displayGame(tvThemes)
  }

  appendToContainer([tvButton, movieButton])
}

function increasePlayerScore (player) {
  player.score++
  localStorage.setItem('players', JSON.stringify(players))
}
