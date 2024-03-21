const Player = require("../../lib/jasmine_examples/Player")
const Song = require("../../lib/jasmine_examples/Song")


let player = new Player()
let song = new Song("Haus")

player.play(song)

if(player.isPlaying) console.log(song.title)

