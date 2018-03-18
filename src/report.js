
const C_HIT = '█'
const C_MISS = '■'
const C_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

function replace(data, position, chr) {
	let row = data[position.y]
	let front = row.substring(0, position.x)
    let back = row.substring((position.x+1), row.length)
	data[position.y] = front + chr + back
	return data
}

function coloriseMap(layout) {
    let header = " \x1b[36m0123456789\x1b[0m\n"
	return header + layout.map(v => v.replace(/3/g, '\x1b[33m3\x1b[0m'))
                          .map(v => v.replace(/1/g, '\x1b[31m1\x1b[0m'))
			              .map(v => v.replace(/2/g, '\x1b[32m2\x1b[0m'))
			              .map(v => v.replace(/4/g, '\x1b[37m4\x1b[0m'))
			              .map(v => v.replace(/5/g, '\x1b[35m5\x1b[0m'))
						  .map(v => v.replace(/~/g, '\x1b[34m~\x1b[0m'))
                          .map(v => v.replace(new RegExp(C_HIT, 'g'), '\x1b[31m'+C_HIT+'\x1b[0m'))
                          .map(v => v.replace(new RegExp(C_MISS, 'g'), '\x1b[30m'+C_MISS+'\x1b[0m'))
				          .map((v, i) => '\x1b[36m' + C_LETTERS[i] + '\x1b[0m' + v)
                          .join("\n")
}

function damageMap(a, b) {
	var layout = a.board.toString().split("\n")
	b.shots.forEach(s => {
		replace(layout, s, C_MISS)
	})
    b.hits.forEach(s => {
		replace(layout, s, C_HIT)
	})
	return layout
}


function defaultReport(turns, log, winner, loser) {
    console.log('   Turns: ', turns)
	console.log('🏆  Victory: %s', winner.name)
	console.log('🗺️  Layout   . Damage')

	let header = "\x1b[36m0123456789\x1b[0m\n----------"
	var win_layout = winner.board.toString().split("\n")
	let winner_lay = coloriseMap(win_layout).split("\n")
    let winner_dmg = coloriseMap(damageMap(winner, loser)).split("\n")
	let winner_map = winner_lay.map((v, i) => v + " | " + winner_dmg[i]).join("\n")
	console.log(winner_map)
	console.log('')

   	console.log('😞  Defeat:  %s', loser.name)
	console.log('🗺️  Layout   . Damage')
	var los_layout = loser.board.toString().split("\n")
	let loser_lay = coloriseMap(los_layout).split("\n")
	let loser_dmg = coloriseMap(damageMap(loser, winner)).split("\n")
	let loser_map = loser_lay.map((v, i) => v + " | " + loser_dmg[i]).join("\n")
	console.log(loser_map)


}

module.exports = defaultReport

