
const Board = require('./src/board.js')
const Ships = require('./src/ships.js')
const Game = require('./src/game.js')

module.exports = {
    Board: Board,
    Ships: Ships,
    Game: Game,
    Ai: {
        Random: require('./src/ai/random.js')
    }
}

