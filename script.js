const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export const img = new Image();
img.src = "img/sprite.png"

ctx.fillStyle = "lightblue"
ctx.rect(0, 0, 1000, 1000)
ctx.fill()

export const screenSize = canvas.width / 275
const counOfPipes = 100
let currentPipes = 0
let medaltype = 0

import {Bird, Bg, Floor, Menu, Medal, Pipes, Game, audio} from "./class.js"

// Задача всех нужных элементов и лбъектов

let index = 0;
let pipesindex = 0
let SPEED = 0;
let g = 0;

fetch('audiolinks.json')
.then(Response => Response.json())
.then(json => {
	g = json.g
	SPEED = json.SPEED
})

export const game = new Game()
export const bird = new Bird()
const bg1 = new Bg()
const bg2 = new Bg()
const floor1 = new Floor()
const floor2 = new Floor()
const pipesList = [] // Трубы на уровне
let randHeight = [] // Определяем высоту труб
for (let i = 0; i < counOfPipes; i++) {
	pipesList.push(new Pipes(0))
	pipesList.push(new Pipes(1))
	randHeight.push(Math.random()*320 + 80)
}

const startMenu = new Menu(25, 274, 124, 117, canvas.height / 2 - 117 * screenSize / 2)
const startText = new Menu(0, 228, 175, 43, 43)
const endMenu = new Menu(175, 273, 226, 116, canvas.height / 2 - 116 * screenSize / 2)
const endText = new Menu(193, 228, 191, 39, 39)

canvas.addEventListener("click", bird.tap)

function reset() { // Обновление игры, когда пользователь проиграл
	bird.resetObj()
	for (let i = 0; i < 4; i++) {
		pipesList[i].reserObj()
	}
	game.start = false
	game.finish = false
	game.falling = true
	game.score = 0
	canvas.removeEventListener("click", reset)
	canvas.addEventListener("click", bird.tap)
	index = 0
	pipesindex = 0
	randHeight = []
	for (let i = 0; i < counOfPipes; i++) {
		randHeight.push(Math.random()*320 + 80)
	}
	currentPipes = 0
	
}

const render = () => {

	if (bird.boost > 0) { // Изменение и отслеживание скорости вверх
        bird.boost = 0
    } else {
        bird.boost += 0.3
    }

	if (!game.finish) {
        index += 0.5
    }

	bird.a += 0.2

	// Движения объектов

	const backgroundX = -((index * SPEED) % canvas.width)

	if (game.start && !game.finish) {
    	pipesindex += 0.5
	}

	const pipesX = -(pipesindex * SPEED)

	if (game.start && game.falling) { // Птица начинает лететь после первого нажатия
        bird.y += (bird.boost + g + bird.a) // Расчёт высоты птицы
    }

	// bird.boost - ускорение при нажатии, g - константа ускорения свободного падения(9.8), a - увеличивающаяся со временем переменная, которая придаёт птице ускорение (Также обнуляется при полёте) 

	bird.animation(Math.floor((index % 9 ) / 3))
	bg1.x = canvas.width + backgroundX
	bg2.x = backgroundX
	floor1.x = canvas.width + backgroundX
	floor2.x = backgroundX

	// Отрисовка объектов
	ctx.fillStyle = "lightblue"
	ctx.fill()
	bg1.drawImg()
	bg2.drawImg()
	if (game.start) {
		for (let i = 0; i < counOfPipes*2; i++) {
			if (i % 2 == 0) {
				pipesList[i].x =  pipesX + canvas.width + i * pipesList[i].width * 2
				pipesList[i].drawImg(pipesList[i].height - randHeight[i / 2])
			} else {
				pipesList[i].x =  pipesX + canvas.width + (i - 1) * pipesList[i].width * 2
				pipesList[i].drawImg(-randHeight[(i - 1) / 2] - 190)
			}
		}
	}
	floor1.drawImg()
	floor2.drawImg()
	bird.drawImg()

	// Подсчёт баллов

	if (currentPipes < pipesList.length && currentPipes /2 != game.score - 1 && pipesList[currentPipes].x < bird.x && game.start) {
		game.score++
		audio.point.play()
	}

	// Отрисовка счётчика

	ctx.fillStyle = "white"
	ctx.font = "72px Flappy Bird"

	if (!game.start) {
		startMenu.drawImg()
		startText.drawImg()
	} else {
		ctx.fillText(`${game.score}`, canvas.width/2 - 20, 70)
	}

	if (game.finish) {
		if (game.score < 3) {
			medaltype = 0
		} else if (game.score >= 3 && game.score < 5) {
			medaltype = 1
		} else if (game.score >= 5 && game.score < 10) {
			medaltype = 2
		} else {
			medaltype = 3
		}
		const medal = new Medal(medaltype)
		endMenu.drawImg()
		endText.drawImg()
		medal.drawImg()
		game.getBestScore()
		ctx.fillText(`${game.score}`, endMenu.x + endMenu.width - 80, endMenu.y + 85)
		ctx.fillText(`${game.bestScore}`, endMenu.x + endMenu.width - 80, endMenu.y + endMenu.height -30)
	}

	// Просмотр, на какой трубе находится птица

	if (currentPipes < pipesList.length && pipesList[currentPipes].x < bird.x - pipesList[currentPipes].width && game.start) {
		currentPipes += 2
	}

	// Окончание игры

	if (bird.y + bird.height >= canvas.height - floor1.height){
		if (!game.finish) {
			audio.hit.play()
		}
        game.finish = true
		game.falling = false
        canvas.removeEventListener("click", bird.tap)
		canvas.addEventListener("click", reset) // Запуск ресета, при проигрыше
    } else if (currentPipes < pipesList.length && (((bird.x + bird.width <= pipesList[currentPipes].x + pipesList[currentPipes].width) && 
	(bird.x + bird.width >= pipesList[currentPipes].x)) || 
	((bird.x >= pipesList[currentPipes].x) && 
	(bird.x <= pipesList[currentPipes].x + pipesList[currentPipes].width))) &&
	(bird.y < pipesList[currentPipes + 1].y + pipesList[currentPipes + 1].height
	|| bird.y + bird.height > pipesList[currentPipes].y)) {
		if (!game.finish) {
			audio.hit.play()
		}
		game.finish = true
        canvas.removeEventListener("click", bird.tap)
		audio.die.play()
	}

	window.requestAnimationFrame(render)
}

img.onload = render
