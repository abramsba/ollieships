
const board = require("./board.js")
const defaultReport = require('./report.js')

class game {

    constructor(p1, p2) {
        this.p1 = {
            name:  p1.name,
            board: p1.board,
            ai:    p1.ai,
            shots: [],
            hit:   []
        }
        this.p2 = {
            name:  p2.name,
            board: p2.board,
            ai:    p2.ai,
            shots: [],
            hit:   []
        }
        this.turn = 0,
        this.log = []
    }

    _checkAlreadyFired( player, cell ) {
        let count = player.shots.length
        for(var i = 0; i < count; i++) {
            if ( cell.x == player.shots[i].x &&
                 cell.y == player.shots[i].y )
                return true
        }
        return false
    }

    runGame(done=defaultReport) {
        this._playerTurn(this.p1, this.p2, done)
    }

    // Loop this function by swaping
    _playerTurn( pa, pb, done ) {
        let preppl = pl => { return {
            name: pl.name,
            board: pl.board,
            shots: pl.shots,
            hits: pl.hit
        }}
        let decide = p => {
            this.log.push(this.turn + ": " + pa.name + " firing at " + JSON.stringify(p))
            // Block Move if already made
            if(this._checkAlreadyFired(pa, p)) {
                this.log.push("Rejected, " + pa.name + " already fired at this position.")
                pa.ai.denied(this.turn, p, decide)
            }
            else {
                pa.shots.push(p)
                let cell = pb.board.inspectPosition(p)
                if(cell) {
                    this.log.push("Hit!")
                    pa.ai.confirmed(this.turn, p, true)
                    pa.hit.push(p)
                    if ( this._check_victory(pa) ) {
                        this.log.push("Victor: " + pa.name)
                        done(this.turn, this.log, preppl(pa), preppl(pb))
                        return
                    }
                }
                else {
                    this.log.push("Miss.")
                    pa.ai.confirmed(this.turn, p, false)
                }
                this.turn = this.turn + 1
                this._playerTurn( pb, pa, done )
            }
        }
        if ( this.turn > 200 ) {
            done( -1, this.log, preppl(pa), preppl(pb) )
        }
        pa.ai.decision( this.turn, decide )
    }

    _check_victory(p) {
        return (p.hit.length == 17)
    }

}

module.exports = game

