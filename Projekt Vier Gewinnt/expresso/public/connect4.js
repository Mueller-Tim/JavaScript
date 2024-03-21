import { render, parseSjdon, createElement } from "./lib/suiweb.min.js"

const rows = 6
const cols = 7
let urlStart = "http://localhost:3000/api/data/"
let urlEnd = "?api-key=c4game"
const urlApi = urlStart + urlEnd
let url = ""
let isServerGameSaved = false;
let state = {
    board: Array(rows).fill('').map(el => Array(cols).fill('')),
    currentPlayer: '',
    lastAddedRow: null,
    lastAddedCol: null,
    gameOver: false
}
let stateSeq = []

const App = () => [Board, { board: state.board }]

const Board = ({board}) => {
    let fields = board.map((row, rowIndex) =>
        row.map((type, colIndex) =>
            [Field, { type, row: rowIndex, col: colIndex }]
        )
    );
    return ["div", { "class": "board" }, ...fields.flat()];
}

const Field = ({type, row, col}) => {
    let field = ["div", {"class": "field"}]
    if(type != ''){
        let pieceClass = (type == 'b' ? "blue" : 'red') + " piece"
        if(state.lastAddedRow == row && state.lastAddedCol == col){
            pieceClass = pieceClass + " falling-piece"
        }
        field.push(["div", {"class": pieceClass}])
    }
    return field

}

init()

function init(){
    randomFirstPlayer()
    showCurrentPlayer()
    addListenerButton()
    checkForServer()
    showBoard()
}

function showBoard () {
    const app = document.querySelector(".app")
    render(parseSjdon([App], createElement), app)
    addListenerBoard()
    return app
}


function getUrl(){
    fetch(urlApi,{method:"POST"}).then(response => response.json()).then(object => url = urlStart + object.id + urlEnd)
}

function showCurrentPlayer(){
    let currentPlayer = document.getElementById("currentPlayer")
    currentPlayer.textContent = "Current Player: " + (state.currentPlayer === 'b' ? 'Blue' : 'Red')
    if(currentPlayer.classList.contains('red')){
        currentPlayer.classList.remove('red')
    } else if(currentPlayer.classList.contains('blue')){
        currentPlayer.classList.remove('blue')
    }
    currentPlayer.classList.add(state.currentPlayer === 'b' ? 'blue' : 'red')

}

function checkForServer(){
    fetch('/heartbeat')
        .then(response => {
            if(response.ok) {
                if(!isServerGameSaved) getUrl();
                console.log("Server ist aktiv");
                toggleButton("saveGameServer", !state.gameOver);
                toggleButton("loadGameServer", isServerGameSaved && !state.gameOver);
            } else {
                console.error("Server nicht erreichbar");
                toggleButton("saveGameServer", false);
                toggleButton("loadGameServer", false);
            }
        })
        .catch(error => {
            console.error("Server nicht erreichbar", error);
            toggleButton("saveGameServer", false);
            toggleButton("loadGameServer", false);
            if(isServerGameSaved){
                alert("Server not available.\n" +
                    "Game on server has been deleted." +
                    "as soon as the server connection is re-established and any button is pressed, " +
                    "the server can be accessed again.")
                isServerGameSaved = false;
            }
        });
}
function addListenerButton(){
    if (state.listenersAdded) return;
    let newGameButton = document.getElementById("newGame")
    newGameButton.addEventListener("click", () =>{
        resetBoard()
        checkForServer()
        getUrl()
        init()
    })

    document.getElementById("undoMove").addEventListener("click", () => {
    if (stateSeq.length > 0 && !state.gameOver){
        state = stateSeq.pop()
        state.lastAddedRow = null
        state.lastAddedCol = null
        showCurrentPlayer()
        checkForServer()
        showBoard()
        }
    })

    addListenerBowser()

    fetch('/heartbeat')
        .then(response => {
            if(response.ok) addListenerServer();
        })
        .catch(error => console.error("Server nicht erreichbar", error));

    state.listenersAdded = true;
}

function toggleButton(name, isEnabled) {
    let saveButton = document.getElementById(name);
    if (saveButton) {
        saveButton.disabled = !isEnabled;
    }
}

function addListenerServer(){
    let loadGameButton = document.getElementById("loadGameServer")
    loadGameButton.addEventListener("click", () =>{
        checkForServer()
        loadState()
    })
    let saveGameButton = document.getElementById("saveGameServer")
    saveGameButton.addEventListener("click", () =>{
        checkForServer()
        saveState()
    })
}

function addListenerBowser(){
    let loadGameButton = document.getElementById("loadGameBrowser")
    loadGameButton.addEventListener("click", () =>{
        state = JSON.parse(localStorage.getItem("game"))
        showBoard()
        checkForServer()
        showCurrentPlayer()
        alert("Game loaded successfully from the the browser!")

    })
    let saveGameButton = document.getElementById("saveGameBrowser")
    saveGameButton.addEventListener("click", () =>{
        localStorage.setItem("game", JSON.stringify(state))
        checkForServer()
        alert("Game saved successfully in the browser")
        toggleButton("loadGameBrowser", true)
    })
}

function gameOver(){
    document.getElementById("currentPlayer").textContent = ""
    let endScore = document.getElementById("endScore")
    let text = "Game over! "
    let className = ""
    if(tie()){
        text = "It's a tie!"
        className = "tie"
    } else{
        text = text + "Player " + (state.currentPlayer === 'b' ? 'Blue' : 'Red') + " has won."
        className = state.currentPlayer === 'b' ? 'blue' : 'red'
    }
    endScore.textContent = text
    endScore.classList.add(className)
    toggleButton("loadGameServer", false)
    toggleButton("saveGameServer", false)
    toggleButton("loadGameBrowser", false)
    toggleButton("saveGameBrowser", false)
    toggleButton("undoMove", false)
}

function addListenerBoard(){
    let board = document.querySelector(".board")
    board.addEventListener("click", (event) => {
        if(!state.gameOver && (event.target.classList.contains('field') || event.target.classList.contains('piece'))){
            let target = event.target
            if(event.target.classList.contains('piece')){
                target = event.target.parentNode
            }
            let children = Array.from(board.children)
            let index = children.indexOf(target)
            let row = state.board.length-1
            let col = index%cols
            while(state.board[row][col] != '' && row > 0){
                row--
            }
            if(state.board[row][col] == ''){
                stateSeq.push(state)

                let newBoard = setInList(state.board, row, setInList(state.board[row], col, state.currentPlayer))

                state = setInObject(state, 'board', newBoard)
                state = setInObject(state, 'lastAddedRow', row)
                state = setInObject(state, 'lastAddedCol', col)
                state = setInObject(state, 'gameOver', connect4(state.currentPlayer, state.board) || tie())
                if (state.gameOver){
                    gameOver()
                } else{
                    switchPlayer()
                    showCurrentPlayer()
                }
                showBoard()
            }
        }
    })
}

function randomFirstPlayer(){
    state.currentPlayer = (Math.round(Math.random()) == 0) ? 'b' : 'r'
}

function resetBoard(){
    document.getElementById("endScore").textContent = ""
    state.board = Array(rows).fill('').map(el => Array(cols).fill(''))
    state.gameOver = false
    isServerGameSaved = false;
    localStorage.clear()
    toggleButton("loadGameBrowser", false)
    toggleButton("saveGameBrowser", true)
    toggleButton("undoMove", true)
}

function switchPlayer(){
    state.currentPlayer = (state.currentPlayer === 'b') ? 'r' : 'b'
}

function tie(){
    for(let row = 0; row < rows; row++ ){
        for (let col = 0; col < cols; col++){
            if(state.board[row][col] == ''){
                return false
            }
        }
    }
    return true
}

function connect4(player, board){
    for(let row = 0; row < rows; row++ ){
        for (let col = 0; col < cols; col++){
            if((row + 3 < rows &&
                board[row][col] == player &&
                board[row + 1][col] == player &&
                board[row + 2][col] == player &&
                board[row + 3][col] == player) ||
                (col + 3 < cols &&
                board[row][col] == player &&
                board[row][col + 1] == player &&
                board[row][col + 2] == player &&
                board[row][col + 3] == player) ||
                (row + 3 < rows &&
                col + 3 < cols &&
                board[row][col] == player &&
                board[row + 1][col + 1] == player &&
                board[row + 2][col + 2] == player &&
                board[row + 3][col + 3] == player) ||
                (row + 3 < rows &&
                col + 3 < cols &&
                board[row][col+3] == player &&
                board[row + 1][col + 2] == player &&
                board[row + 2][col + 1] == player &&
                board[row + 3][col] == player)){
                return true
            }
        }
    }
    return false
}

function loadState () {
    if(!isServerGameSaved) {
        alert("No game on the server saved yet!");
        return;
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            state = data
            let board = document.querySelector(".board")
            showBoard()
            showCurrentPlayer()
            alert("Game loaded successfully from the server!")
        })
}

function saveState () {
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(state)
    }).then(response => {
        if (response.ok) {
            alert("Game saved successfully on the server");
            isServerGameSaved = true;
        } else {
            console.error("Game could not be saved on the server");
        }
    });
}

function setInList(list, index, value){
    let newList = [...list]
    newList[index] = value
    return newList
}

function setInObject(object, attribute, value){
    let newObject = {...object}
    newObject[attribute] = value
    return newObject
}