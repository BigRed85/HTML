import * as THREE from './node_modules/three/build/three.module.js'
import * as GLOBALS from "./globals.js"

//this is a class that will alow the player to interact with objects in the game world
//when the object in intreacted with it will position the camera in a static position 
//  and bring up a text box containing the given text 
// it takes in an Object3d and a 
class I_Object {
    constructor(object = new THREE.Object3D(), text_file = new String()) {
        this.object = object;
        this.text_file = text_file;
        this.position = object.position;
        this._container = document.getElementById("UI");
    }

    getPosition() {
      return this.position;
    }

    interact() {
        //this will create a text box that will contain the string that was given and returns a refrence to the close button so the game syste mmay add an event litener to it 
        let textbox = document.createElement("div");
        textbox.classList.add("textbox");
        
        let close_button = document.createElement("button");
        close_button.classList.add("close_button");
        close_button.innerHTML = "&#10006;"
        textbox.appendChild(close_button);

        let content = document.createElement("div");
        content.classList.add("content");
        textbox.appendChild(content);

        this._load_text();

        this._container.replaceChildren(textbox);

        return close_button;
    }

    _load_text() { //this was annoying 
        let text_loader = new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest();
            req.open('GET', this.text_file);
            req.onload = function() {
              if (req.status == 200) {
                resolve(req.response);
              } else {
                reject("error loading: " + this.text_file);
              }
            }.bind(this);
            req.send();
        }.bind(this));

        text_loader.then(display, error_display);
    }

    
}

//this is a helper function that will display the text
function display(html) {
    let content = document.getElementsByClassName("content")[0];

    content.innerHTML = html;
}

function error_display(error)
{
  console.log(error);
}

export { I_Object }