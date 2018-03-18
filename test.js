
const Ollieships = require('./index.js')

let bt1 = {
    carrier: {
        front: { x: 0, y: 0 },
        rotation: { x: 0, y: 1 }
    },
    battleship: {
        front: { x: 1, y: 0 },
        rotation: { x: 1, y: 0 }
    },
    cruiser: {
        front: { x: 2, y: 1 },
        rotation: { x: 1, y: 0 }
    },
    submarine: {
        front: { x: 3, y: 2 },
        rotation: { x: 0, y: 1 }
    },
    destroyer: {
        front: { x: 5, y: 5 },
        rotation: { x: -1, y: 0 }
    }
}

let bt2 = {
    carrier: {
        front: { x: 8, y: 2 },
        rotation: { x: -1, y: 0 }
    },
    battleship: {
        front: { x: 2, y: 2 },
        rotation: { x: 0, y: 1 }
    },
    cruiser: {
        front: { x: 5, y: 3 },
        rotation: { x: 0, y: 1 }
    },
    submarine: {
        front: { x: 3, y: 8 },
        rotation: { x: 1, y: 0 }
    },
    destroyer: {
        front: { x: 0, y: 4 },
        rotation: { x: 0, y: -1 }
    }
}

let p1 = {
    name: 'random1',
    board: Ollieships.Board.template(bt1),
    ai: new Ollieships.Ai.Random()
}
let p2 = {
    name: 'random2',
    board: Ollieships.Board.template(bt2),
    ai: new Ollieships.Ai.Random()
}

let game = new Ollieships.Game(p1, p2)
game.runGame()

