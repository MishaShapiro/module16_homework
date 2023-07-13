import {bird, game, screenSize, ctx, img} from "./script.js"

export const audio = {
	flap: new Audio("audio/sfx_flap.wav"),
	start: new Audio("audio/sfx_swooshing.wav"),
	die: new Audio("audio/sfx_die.wav"),
	hit: new Audio("audio/sfx_hit.wav"),
	point: new Audio("audio/sfx_point.wav")
}

let types = []

fetch('audiolinks.json')
.then(Response => Response.json())
.then(json => {
	types = json.types
})

export class Game {
    constructor() {
        this.start = false
        this.finish = false
        this.falling = true
		this.score = 0
		this.bestScore = 0
    }

	getBestScore() { // Хранение данных
		this.bestScore = localStorage.getItem("BestScore")
		if (this.bestScore == null || this.score >= this.bestScore) {
			localStorage.setItem("BestScore", this.score)
			this.bestScore = this.score
		}
	}
}

export class CanvasObjects { // Родительскитй класс для всех объектов
	constructor() {
		this.image_x = 0
		this.image_y = 0 
		this.image_width = 0
		this.image_height = 0

		this.x = 0
		this.y = 0
		this.width = 0
		this.height = 0
	}
	drawImg() { // Метод отрисовки объектов
		ctx.drawImage(
			img,
			this.image_x, this.image_y, this.image_width, this.image_height,
			this.x, this.y, this.width, this.height
		)
	}
}

export class Bg extends CanvasObjects {
	constructor() {
		super()
		this.image_x =  0
		this.image_y =  0
		this.image_width = 275
		this.image_height = 227

		this.x = 0
		this.y = canvas.height - this.image_height * screenSize
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize
	}
}

export class Floor extends CanvasObjects {
	constructor() {
		super()
		this.image_x =  277
		this.image_y =  0
		this.image_width = 224
		this.image_height = 112

		this.x = 0
		this.y = canvas.height - this.image_height * screenSize
		this.width = this.image_width * screenSize * (275 / this.image_width) + 10
		this.height = this.image_height * screenSize
	}
}

export class Menu extends CanvasObjects {
	constructor(image_x, image_y, image_width, image_height, y) {
		super()
		this.image_x =  image_x
		this.image_y =  image_y
		this.image_width = image_width
		this.image_height = image_height

		this.x = canvas.width / 2 - this.image_width * screenSize / 2
		this.y = y
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize
	}
}

export class Bird extends CanvasObjects {
	constructor() {
		super()
		this.image_x =  276.5
		this.image_y =  113
		this.image_width = 34
		this.image_height = 26

		this.x =  canvas.width/2 - this.image_width * screenSize /2
		this.y =  200
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize

		this.boost = -20
		this.a = 0
	}

	animation(type) {
		this.image_y = 113 + 26 * type
	}

	tap() {
		audio.flap.play()
		bird.boost = -20
    	bird.a = 0
		if (!game.start) {
			audio.start.play()
		}
    	game.start = true
		game.finish = false
		game.falling = true
	}

	resetObj() { // Обновление положения птицы при проигрыше
		this.x =  canvas.width/2 - this.image_width * screenSize /2
		this.y =  200
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize

		this.boost = -20
		this.a = 0
	}
}

export class Pipes extends CanvasObjects {
	constructor(type) {
		super()
		this.image_x =  503 + 52 * type
		this.image_y =  0
		this.image_width = 52
		this.image_height = 400

		this.x =  0
		this.y =  0
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize
	}

	drawImg(y) {
		this.y = y
		ctx.drawImage(
			img,
			this.image_x, this.image_y, this.image_width, this.image_height,
			this.x, this.y, this.width, this.height
		)
	}

	reserObj() {
		this.x =  canvas.width
		this.y =  0
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize
	}

}

export class Medal extends CanvasObjects {
	constructor(type) {
		super()
		this.image_x = 312 + 48 * types[type][0]
		this.image_y = 112 + 46 * types[type][1]
		this.image_width = 44
		this.image_height = 44

		this.x = 50 * screenSize 
		this.y = canvas.height / 2 - 16 * screenSize 
		this.width = this.image_width * screenSize
		this.height = this.image_height * screenSize
	}
}