import * as THREE from './node_modules/three/build/three.module.js';
import * as PARTICALS from './particals.js';
import * as GLOBALS from './globals.js';

import { LogoSpere } from './logo_sphere.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { Player } from './player.js';
import { I_Object } from './interactive_object.js';

const scene = new THREE.Scene();

//--------------------- clock ---------------------
const clock = new THREE.Clock();

//------------- camera ---------------------------
var aspect = window.innerWidth/window.innerHeight;
const displayHight = 8;
const camera_ortho = new THREE.OrthographicCamera(-displayHight * aspect, displayHight * aspect, displayHight, -displayHight, 0.1, 200);
const camera = new THREE.PerspectiveCamera(10, aspect, 0.1, 1000);

//set up the renderer and add the canvas to the html doc
const renderer = new THREE.WebGLRenderer();
renderer.setSize( 1920, 1080, false );
document.body.appendChild( renderer.domElement );

// -------------------- LIGHTING ----------------------------
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(1, 2, 0);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

//---------------- load in 3D models -------------------------- (these need flags)
const loading_flags = new Array(); //this will hold flags for every item that needs to be loaded prior to init

//load the ship that the player will control
var ship;
loading_flags[0] = false;
const loader = new GLTFLoader();
loader.load('ship.glb', function(gltf) {
    ship = gltf.scene;
    ship.position.y = 1;
    ship.scale.setScalar(0.25);
    scene.add(ship);

    loading_flags[0] = true;

}, undefined, function(error) {
    console.error(error);
});

//load the text model for about technologies
var text_tech_3d;
loading_flags[1] = false;
loader.load('Text_Tech.glb', function(gltf) {
    text_tech_3d = gltf.scene;
    text_tech_3d.lookAt(new THREE.Vector3(1, -1, 1));
    text_tech_3d.position.set(GLOBALS.about_tech_pos.x, GLOBALS.about_tech_pos.y, GLOBALS.about_tech_pos.z);
    scene.add(text_tech_3d);

    loading_flags[1] = true;
});

var text_about_me;
loading_flags[2] = false;
loader.load('Text_Me.glb', function(gltf) {
    text_about_me = gltf.scene;
    text_about_me.lookAt(new THREE.Vector3(1, -1, 1));
    text_about_me.position.set(GLOBALS.about_me_pos.x, GLOBALS.about_me_pos.y, GLOBALS.about_me_pos.z);
    scene.add(text_about_me);

    loading_flags[2] = true;
});

var text_about_projects;
loading_flags[3] = false;
loader.load('Text_Projects.glb', function(gltf) {
    text_about_projects = gltf.scene;
    text_about_projects.lookAt(new THREE.Vector3(1, -1, 1));
    text_about_projects.position.set(GLOBALS.about_projects_pos.x, GLOBALS.about_projects_pos.y, GLOBALS.about_projects_pos.z);
    scene.add(text_about_projects);

    loading_flags[3] = true;
});

var text_about_this;
loading_flags[4] = false;
loader.load('Text_This.glb', function(gltf) {
    text_about_this = gltf.scene;
    text_about_this.lookAt(new THREE.Vector3(1, -1, 1));
    text_about_this.position.set(GLOBALS.about_this_pos.x, GLOBALS.about_this_pos.y, GLOBALS.about_this_pos.z);
    scene.add(text_about_this);

    loading_flags[4] = true;
});




//---------------- load textures ------------- (these do not need flags)
const textureLoader = new THREE.TextureLoader();

const spaceTexture = textureLoader.load('./textures/space.jpg'); // Photo by Frank Cone: https://www.pexels.com/photo/starry-sky-3279307/

var backgroundWidth = 192 / 10.0;
var backgroundHight = 288 / 10.0;


const backgroundGeo = new THREE.PlaneGeometry( backgroundWidth, backgroundHight);
const backgroundMat = new THREE.MeshStandardMaterial( {map: spaceTexture, depthTest: false} ); //i beleve this is a refrenc to the spaceTexture so this will cange when the texture is loaded
const background = new THREE.Mesh(backgroundGeo, backgroundMat);
scene.add(background);



//load logos for logo cloud
const logos = new Array(10);

for (let i = 0; i < GLOBALS.LOGO_COUNT; i++)
{
    let fileName = './logos/';
    fileName = fileName.concat( i.toString() );
    fileName = fileName.concat('.png');
    logos[i] = textureLoader.load(fileName);
}



//---------------- 3d geomety data structures ---------------------
const wStars = {
    vertices: [],
    size: 0.2,
    material: new THREE.PointsMaterial( { color: 0xffffff, size: 0.5} ),
    geometry: new THREE.BufferGeometry()
};

const grid = { 
    vertices:[], 
    material: new THREE.LineBasicMaterial({color: 0x005555, linewidth: 1, opacity: 0.2}), //is the opacity working?
    geometry: new THREE.BufferGeometry()
};

const logo_cloud = new LogoSpere(logos, 4, 3, 4, 0.5, GLOBALS.about_tech_pos);


//------------------------------- player and other objects -------------------------
const player = new Player(); //must initalize before use 

const interactive_objects = new Array(); //this will be filled with interactive objects in initInteractives()
var interaction_flag = false; //this flag will be used to indicate if the player is interacting with an object


//------------------------------- initialize the scene ---------------------------------
window.onload = function loader() {

    var loaded = true;

    var total = loading_flags.length;
    var loaded_count = total;
    var percent;

    for (let i = 0; i < loading_flags.length; i++)
    {
        if ( loading_flags[i] === false )
        {
            loaded = false;
            loaded_count--;
        }
    }

    percent = loaded_count / total * 100;
    console.log(percent + "%");

    var loading_bar = document.getElementById("loading_bar_2");
    loading_bar.style.width = percent + "%";

    if (!loaded)
    {
        setTimeout(loader, 200);
    }
    else
    {
        setTimeout(loaded_animation, 300); //this will give time for other animations to compleate 
        setTimeout(init, 300);
    }    

    
}

function loaded_animation() {
    var loading_screen = document.getElementById("loading_screen");
        loading_screen.classList.add("loaded");
}

//initalizes the game
function init ()
{
    //load default ui
    initUI();
    


    //position camera
    initCameraPos();
    initBackground();

    //position the partical emitter
    var shipDirection = new THREE.Vector3();
    ship.getWorldDirection(shipDirection);
    //shipDirection.negate();
    ship.emitter = new PARTICALS.ParticalEmitter(ship.position, shipDirection, 60, 100, 0x00ffffff, 3);
    scene.add(ship.emitter.points);

    //setup player object that will control the ship and the camera
    player.init(camera, GLOBALS.playerStartPos, ship);


    //generate Stars

    for ( let i = 0; i < 1000; i ++ ) {

        let x = THREE.MathUtils.randFloatSpread( 500 );
        let y = THREE.MathUtils.randFloatSpread( 10 ) - 50; // this make sure that the Stars are in the background
        let z = THREE.MathUtils.randFloatSpread( 500 );

        wStars.vertices.push( x, y, z );

    }

    wStars.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( wStars.vertices, 3 ) );


    wStars.scene = new THREE.Points( wStars.geometry, wStars.material );
    scene.add( wStars.scene );

    //generate grid
    for( let x = GLOBALS.minX; x <= GLOBALS.maxX; x+=5.0)
    {
        grid.vertices.push( x, 0.0, GLOBALS.minZ );
        grid.vertices.push( x, 0.0, GLOBALS.maxZ );
        
    }

    for (let z = GLOBALS.minZ; z <= GLOBALS.maxZ; z+=5.0)
    {
        grid.vertices.push( GLOBALS.minX, 0.0, z);
        grid.vertices.push( GLOBALS.maxX, 0.0, z);
    }

    scene.add(logo_cloud.object);

    //add the interactive objects
    initInteractives();
    
    grid.geometry.setAttribute('position', new THREE.Float32BufferAttribute( grid.vertices, 3))
    const gridLines = new THREE.LineSegments(grid.geometry, grid.material);
    scene.add(gridLines);

    //set up user interactions
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener("resize", resizeWindow);

    animate();

}

function initUI() {
    //display controls and ability to look at default website
    let container = document.getElementById("UI");
    
    let player_UI = document.createElement("div");
    player_UI.id = "player_UI";
    container.replaceChildren(player_UI);

    let instruction_text = document.createElement("div");
    instruction_text.id = "instruction_text";
    instruction_text.innerText = 'Use [W], [A], [S], [D] keys to move the rocket ship. \nNote: this is a work in progress and many elements are not fully working or are in the process of being made. \nThis site dose not yet woke with mobile devices, and is best viewed in Crome or Firefox.';
    player_UI.appendChild(instruction_text);

    let interaction_text = document.createElement("div");
    interaction_text.id = "interaction_text";
    player_UI.appendChild(interaction_text);

}

function initInteractives() { //this will fill an array of interactive objects 
    //allowing the user to open textboxes when they are close to objects 
    //in the game.


    //about technologies and experiance
    interactive_objects.push( new I_Object(text_tech_3d, "./text_files/about_tech.htm", "About Technologies and Experience") );

    //about me
    interactive_objects.push( new I_Object( text_about_me, "./text_files/about_me.htm", "About Me" ));

    //about projects
    interactive_objects.push( new I_Object( text_about_projects, "./text_files/about_projects.htm", "My Projects" ));

    //about this webpage
    interactive_objects.push( new I_Object( text_about_this, "./text_files/about_this.htm", "About This Web App" ));

}

function initCameraPos()
{

    camera.position.x = ship.position.x + GLOBALS.cameraStartPos.x;
    camera.position.y = ship.position.y + GLOBALS.cameraStartPos.y;
    camera.position.z = ship.position.z + GLOBALS.cameraStartPos.z;

    camera.lookAt(ship.position);

    
}

function initBackground()
{
    
    camera.getWorldDirection(background.position);
    background.position.multiplyScalar(100);
    background.scale.set(aspect, aspect, aspect); 
    background.position.add(camera.position);
    background.lookAt(camera.position.x, camera.position.y, camera.position.z);
    background.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2);

    if (camera.background === undefined)
        camera.background = background;

}

function resizeWindow() //need to deal with skybox and partical textures!!!!
{
    aspect = window.innerWidth/window.innerHeight;

    camera_ortho.left = -displayHight * aspect;
    camera_ortho.right = displayHight * aspect;
    camera_ortho.updateProjectionMatrix();
    
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    //renderer.setSize( window.innerWidth, window.innerHeight );

    initBackground();
}

function onKeyDown( event )
{
    if (interaction_flag) //gard clause the checks if the player has opened a text box
    {
        return;
    }

    switch(event.key)
    {
        //movement 
        case 'w':
        case 'W':
            player.moveUp = true;
            break;
        case 'a':
        case 'A':
            player.moveLeft = true;
            break;
        case 's':
        case 'S':
            player.moveDown = true;
            break
        case 'd':
        case 'D':
            player.moveRight = true;
            break;
        case ' ':
            //interact with object (if in range of an interactive object)
            var index = player.interact(interactive_objects);
            if (index != undefined)
            {
                let close_button = interactive_objects[index].interact(); //creates a text box and returns a refrence to the close button
                close_button.addEventListener("click", close_textbox);

                let position = interactive_objects[index].getPosition();
                textBoxCamera(position);

                player.ship.visible = false;

                interaction_flag = true;
            }
            break;

    }

}

function textBoxCamera(object_position) { //posision the camera so that the
    
    camera.position.set(object_position.x, object_position.y, object_position.z);
    camera.position.x += 40;
    camera.position.y += 40;
    camera.position.z += 40;

    camera.lookAt(object_position);


    //then move camera to the left by an amount that scales by the aspect ratio;
    //this means moving in the positive z and negative x directions

    camera.position.x -= aspect * 2.5;
    camera.position.z += aspect * 2.5;

    initBackground();
    
}

function close_textbox() {
    var ui = document.getElementById("UI");
    ui.replaceChildren(null); //this should replace it with the standerd ui

    //reset the camera position to center on the playe ship
    initCameraPos();
    initBackground();

    //re-initialize the user interface.
    initUI();

    player.ship.visible = true;

    interaction_flag = false;
}

function onKeyUp( event ) 
{
    switch(event.key)
    {
        case 'w':
        case 'W':
            player.moveUp = false;
            break;
        case 'a':
        case 'A':
            player.moveLeft = false;
            break;
        case 's':
        case 'S':
            player.moveDown = false;
            break
        case 'd':
        case 'D':
            player.moveRight = false;
            break;
    }
}

function update(delta) {

    player.move(delta);
    logo_cloud.update(delta);

    update_ui();

}

function update_ui() {
    //if the player is close to an abject it can interact with display a mesage 
    let interaction_text = document.getElementById("interaction_text");
    if ( interaction_text === null )
        return;
    
    let minDistance = GLOBALS.interaction_distance;
    interaction_text.innerText = "";
    for (let i = 0; i < interactive_objects.length; i++)
    {
        let distance = player.getPosition().distanceToSquared(interactive_objects[i].position);


        if (distance <= minDistance)
        {
            //add interaction text
            interaction_text.innerText = "Press [Space] to Open."
        }
    }
}

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    //deal with updates
    update(delta);

    renderer.render( scene, camera );
};