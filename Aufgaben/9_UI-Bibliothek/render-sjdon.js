function renderSJON(element, appRoot){
        while(appRoot.firstChild) {
                appRoot.removeChild(appRoot.firstChild)
        }
        if(element.isArray()){
                let node = document.createElement(element.shift);
                element.forEach(child =>{
                       if(child.isObject() && !child.isArray()){
                               Object.entries(child).forEach(([key, value]) =>{
                                       node.setAttribute(key, value)
                               })
                       } else{
                               renderSJON(child, node)
                       }
                })
                appRoot.appendChild(node)
        } else if(element.isObject()){
                Object.entries(element).forEach(([key, value]) => {
                        appRoot.setAttribute(key, value)
                })
        } else{
                appRoot.appendChild(document.createTextNode(element))
        }
}

const element =
    ["div", {style: "background: salmon"},
        ["h1", "Hello World"],
        ["h2", {style: "text-align:right"}, "from our library"] ]
let appRoot = document.getElementById("app")

renderSJDON(element, appRoot)

function render (tree, elem) {
        while (elem.firstChild) {
                elem.removeChild(elem.firstChild)
        } elem.appendChild(tree)
}