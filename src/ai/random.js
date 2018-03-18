
class ai_random {

    constructor() {
        this.xm = 10
        this.ym = 10
        this.name = "ai_random"
        this.moves = []
        this.hits = []
    }

    /*
     * When it's this AI's turn this function gets called
     *
     * turn = the turn number
     * decide = callback function provided by the engine
     *  which the user runs when they're ready to send
     *  the position to the server
     * failed = callback function provided by the engine
     *  to say the participant wishes to quit, for example
     *  a software error results in stopping execution to
     *  gracefully stop the game
     */
    decision( turn, decide ) {
        let rx = Math.floor(Math.random() * this.xm)
        let ry = Math.floor(Math.random() * this.ym)
        decide({x: rx, y: ry})
    }

    /*
     * Confirmed
     * Engine calls this function to alert the AI
     * that their move was successful
     */
    confirmed( turn, position, hit ) {
        this.moves.push(position)
        if(hit) this.hits.push(position)
    }

    /*
     * If the previous request couldn't be handled this
     * function is called to provide another chance
     */
    denied( turn, position, decide ) {
        this.decision(turn, decide)
    }

}

module.exports = ai_random

