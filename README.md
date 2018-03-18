
# Ollieships

Battleship, except played with robots instead of by humans. The implementation is similar to 'tik-tak-toe', however the behavior of this engine is recursive. Participants will create callback functions as well as execute one in order to play.

![image](https://i.imgur.com/EgXNcBB.png)

## Install

`yarn add git https://github.com/abramsba/ollieships`

```
const Ollieships = require('ollieships')
```

## Usage

### Creating the Template

The template file tells the engine where you position your pieces.

```js
let my_template = {
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
```

Which will look like:

```
1 = carrier
2 = battleship
3 = cruiser
4 = submarine
5 = destroyer
[A - F] = [1 - 10] = [0 - 9]

  0123456789
  ----------
A|12222.....
B|1.333.....
C|1..4......
D|1..4......
E|1..4......
F|....55....
G|..........
H|..........
I|..........
J|..........
```

Each ship takes up so many spaces

`carrier`|5
`battleship`|4
`cruiser`|3
`submarine`|3
`destroyer`|2

The following rotations are possible

North|`{x:0,y:1}`
South|`{x:0,y:-1}`
East|`{x:1,y:0}`
West|`{x-1,y:0}`

To check if the template is valid the debug function `Ollieboards.Board.test(my_template)` is avaliable.

### Creating the AI

For testing purposes `Ollieships.Ai.Random` is avaliable as an example and also a bot to practice against. It will pick positions at random. 

To create your own AI create a javascript class which has implementations for the following three functions:

#### `decision(turn, decide)`

* `turn`: integer, how many shots have been fired
* `decide(position)`: function, call `decide` and pass a position object, `{x:0,y:0}`. 

When it is the player's turn the engine will call decision and provide a callback for decide. 

#### `confirmed(turn, position, hit)`

* `turn`: integer, how many shots have been fired
* `position`: object `{x:integer, y:integer}`, the position that was supplied
* `hit`: boolean, if the shot resulted in a hit

Called from the engine to report back to the AI the status of the last shot.

#### `denied(turn, position, decide)`

* `turn`: integer, how many shots have been fired
* `position`: object `{x:integer, y:integer}`, the position that was not permitted
* `decide`: function, call when new choice is ready

### Testing

`yarn run test`

Or

```js
const Ollieships = require('ollieships')
const my_ship_ai = require('./myai.js')
const tmpl1 = { ... }
const tmpl2 = { ... }
const p1 = {
	name: 'Steve',
    board: Ollieships.Board.template(tmpl1),
    ai: new my_ship_ai(...)
}
const p2 = {
	name: 'Random AI',
	board: Ollieships.Board.template(tmpl2),
	ai: new Ollieships.Ai.Random()
}
const game = new Ollieships.Game(p1, p2)
function game_finished(turns, log, winner, loser) {
	...console output...
}
game.runGame(game_finished)
```
