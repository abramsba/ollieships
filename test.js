
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

game.runGame( (t, p, w, l) => {

  const miss = '░'
  const hit = '█'
  const miss_clr = '\x1b[36m'+miss+'\x1b[0m'
  const hit_clr  = '\x1b[31m'+hit+'\x1b[0m'

  console.log(' -- Winner --: ' + w.name)
  console.log(w.board.toString())

  console.log('\n -- Shots --')
  var rows = l.board.toString().split("\n")
  var replace = (p, c) => {
      let r = rows[p.y]
      let f = r.substring(0, p.x)
      let e = r.substring((p.x+1), r.length)

      rows[p.y] = (f + c + e)
  }
  w.shots.forEach(s => replace(s, miss))
  w.hits.forEach(s => replace(s, hit))
  var out = rows.join("\n")
  out = out.replace(new RegExp(miss, 'g'), miss_clr)
  out = out.replace(new RegExp(hit, 'g'), hit_clr)

  console.log(out)
  console.log("")

  console.log('\n -- Loser --: '+ l.name)
  console.log(l.board.toString())

  console.log('\n -- Shots --')
  rows = w.board.toString().split("\n")
  l.shots.forEach(s => replace(s, miss))
  l.hits.forEach(s => replace(s, hit))
  out = rows.join("\n")
  out = out.replace(new RegExp(miss, 'g'), miss_clr)
  out = out.replace(new RegExp(hit, 'g'), hit_clr)
  console.log(out)
  console.log("Log messages: " + p.length)
  console.log("Shots fired: " + t)
})

