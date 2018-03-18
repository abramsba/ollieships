
const ships = require("./ships.js")

/*
 * Board Format
 *  1234567890
 * A          |
 * B          |
 * C          |
 * D          |
 * E          |
 * F          |
 * G          |
 * H          |
 * I          |
 * J          |
 *  ----------
 *
 * Ships are stored with a single position and rotation
 * Examples with submarine:
 *
 * [f]ront (B4), rot [-1, 0], plist = (B4 (3, 1), B3 (2, 1), B2 (1, 1))
 *  12345
 * A
 * B ssf
 * C
 *
 * [f]ront (B2), rot[1, 0], plist = (B2 (1, 1), B3 (2, 1), B4 (3, 1))
 *  12345
 * A
 * B fss
 * C
 *
 * [f]ront (A1), rot[0, 1], plist = (A1 (0, 0), B1 (0, 1), C1 (0, 2))
 *  123
 * Af
 * Bs
 * Cs
 *
 * [f]ront (C1), rot[0, -1], plist = (C1 (0, 2), B1 (0, 1), A1 (0, 0))
 *  123
 * As
 * Bs
 * Cf
 *
 */
class board {

    /*
     * Creates a new board and initializes everything to no rotation and off the board
     * Use static method blank() or template(t) to create a new instance
     */
    constructor() {
        this.shipPositions = {}
        Object.keys(ships).forEach((e, i) => {
            this.shipPositions[e] = { front: { x: -1, y: -1 }, rotation: { x: 0, y: 0 }, size: ships[e] }
        })
    }

    /*
     * Returns a new board that is blank
     */
    static blank() {
        return new board()
    }

    /*
     * Supply a template which is used to initialize the instance
     * The function does not check if all input is valid.
     * Use board.test(t) to check if the template is valid
     * Before trying to use it
     */
    static template(t) {
        let nb = new board();
        let keys = Object.keys(t)
        let spkeys = Object.keys(nb.shipPositions)
        for(var i = 0; i < keys.length; i++) {
            if ( spkeys.indexOf(keys[i]) > -1 )
                if ( !nb.setShipPosition(keys[i], t[keys[i]].front, t[keys[i]].rotation) )
                    throw new Error('Unable to add ' + keys[i])
        }
        return nb
    }

    /*
     * Will print out possible errors with template for debugging purposes
     */
    static test(t) {
        let output = []
        let nb = new board();
        let keys = Object.keys(t)
        let expectedKeys = Object.keys(ships)
        for(var i = 0; i < expectedKeys.length; i++) {
            let ek = expectedKeys[i]
            if ( !(ek in t) )
                output.push("Missing template for: " + ek)
        }
        for(var i = 0; i < keys.length; i++) {

            var positions = []
            let fr = t[keys[i]].front
            let rt = t[keys[i]].rotation
            console.log("Front: " + JSON.stringify(fr) + ", Rotation: " + JSON.stringify(rt) )

            for (var p = 0; p < ships[keys[i]]; p++) {
                let nx = fr.x + (rt.x * p)
                let ny = fr.y + (rt.y * p)
                positions.push({
                    x: nx,
                    y: ny,
                    inspect: nb.inspectPosition({ x: nx, y: ny })
                })
            }
            output.push("Positions:\n" + JSON.stringify(positions))

            let res = nb.setShipPosition(keys[i], t[keys[i]].front, t[keys[i]].rotation)
            if (!res)
                output.push("Failed to set position for: " + keys[i])
        }
        output.push("1 = Carrier")
        output.push("2 = Battleship")
        output.push("3 = Cruiser")
        output.push("4 = Submarine")
        output.push("5 = Destroyer")
        output.push(nb.toString())
        return output.join("\n")
    }

    // todo string prototype
    static replaceAt(s, i, r) {
        return s.substr(0, i) + r + s.substr(i + r.length)
    }

    /*
     * Set a ship by key name, size is indicated by key
     * Position = front, face
     * Rotation = direction the ship extrudes
     */
    setShipPosition(ship, position, rotation) {
        if ( ship in this.shipPositions ) {
            let size = this.shipPositions[ship].size
            if ( !this._validArea(size, position, rotation) ) return false

            for ( var i = 0; i < size; i++ ) {
                let nx = position.x + (rotation.x * i)
                let ny = position.y + (rotation.y * i)
                if ( this.inspectPosition({x: nx, y: ny}) ) return false
            }

            this.shipPositions[ship].front = { x: position.x, y: position.y }
            this.shipPositions[ship].rotation = { x: rotation.x, y: rotation.y }
            return true
        }
        return false
    }

    /*
     * Returns an array of positions the ship is occupying
     */
    getShipPosition(ship) {
        var output = []
        if ( ship in this.shipPositions ) {
            let f = this.shipPositions[ship].front
            let r = this.shipPositions[ship].rotation
            for(var i = 0; i < this.shipPositions[ship].size; i++) {
                let nx = f.x + (r.x * i)
                let ny = f.y + (r.y * i)
                output.push({x: nx, y: ny})
            }
        }
        return output
    }

    /*
     * Returns a string representation of the board if valid
     * for debugging purposes
     */
    toString() {
        if ( this._readyForEngine() ) {
            var yrows = []
            for(var c = 0; c < 10; c++) {
                yrows.push("..........")
            }
            let keys = Object.keys(this.shipPositions)
            for(var i = 0; i < keys.length; i++) {
                let k = keys[i]
                let sp = this.getShipPosition(k)
                for(var pi = 0; pi < sp.length; pi++) {
                    let tp = sp[pi]
                    let rpl = c => board.replaceAt(yrows[tp.y], tp.x, c)
                    yrows[tp.y] = rpl((1+i).toString())
                }
            }
            return yrows.join('\n')
        }
        return "Invalid board"
    }

    /*
     * Check what is at the given position, if nothing 'null' is returned.
     * Otherwise the object's key at the position is returned
     */
    inspectPosition(p) {
        let keys = Object.keys(this.shipPositions)
        for(var i = 0; i < keys.length; i++) {
            let position = this.getShipPosition(keys[i])
            for(var e = 0; e < position.length; e++) {
                let pos = position[e]
                if ( p.x == pos.x && p.y == pos.y ) return keys[i]
            }
        }
        return null
    }

    /*
     * Check function if the board is ready for use in the engine
     * ready = valid template, use board.test
     */
    _readyForEngine() {
        let keys = Object.keys(this.shipPositions)
        var used = []
        for(var i = 0; i < keys.length; i++) {
            let name = keys[i]
            let ship = this.shipPositions[name]

            let valid = this._validArea( ship.size, ship.front, ship.rotation )
            if(!valid) return false

        }
        return true
    }

    /*
     * Validation functions, not for public usage
     */
    _validPos(p)      { return (p.x>=0&&p.x<=9&&p.y>=0&&p.y<=9) }
    _validRot(p)      { return (((p.x==-1||p.x==1)&&(p.y==0))||((p.y==-1||p.y==1)&&(p.x == 0))) }
    _validArea(s,p,r) {
        let nx = (p.x + (r.x * s))
        let ny = (p.y + (r.y * s))
        return ( this._validPos(p) && this._validRot(r) && this._validPos({x: nx, y: ny}) )
    }

}

module.exports = board
