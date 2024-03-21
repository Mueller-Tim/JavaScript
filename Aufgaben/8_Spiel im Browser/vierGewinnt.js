const rows = 6
const cols = 7

function showBoard(){
    let board = document.querySelector(".board")
    for (i = 0; i < rows * cols; i++){
        board.appendChild(elt("div", {"class":"field"}, randomPlayingFigure()))
    }
}

function elt (type, attrs, ...children) {
    let node = document.createElement(type)
    Object.keys(attrs).forEach(key => {
        node.setAttribute(key, attrs[key])
    })
    for (let child of children) {
        if (typeof child != "string") node.appendChild(child)
        else node.appendChild(document.createTextNode(child))
    }
    return node
}

function randomPlayingFigure(){
    let figureType = Math.floor(Math.random()*3)
    let colorClass
    switch (figureType) {
        case 0:
           colorClass = "blue piece"
            break
        case 1:
            colorClass = "red piece"
            break
    }
    return elt("div", {"class": colorClass})
}
