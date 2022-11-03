import * as THREE from './node_modules/three/build/three.module.js';
import * as GLOBALS from './globals.js';

const _VS = `
uniform float pointMultiplier;
attribute float size;
attribute float angle;
attribute vec4 colour;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;
  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _FS = `
uniform sampler2D diffuseTexture;
varying vec4 vColour;
varying vec2 vAngle;
void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;

//this is a class the defines a partical emitter that is constantly emmitting particals when on and the particals positions are defined in world space
//posisiton = the position in world quardinates of the partical emitter
//direction = the direction of partical emitter (the centeral vector where the particals are created)
//angel = the angel (in degrees) of the arch or paticals (0 degrees means the particals are emitted in a strait line, 
//        360 means that the particals are emitted in a shpeare arount the emmiter)
//maxParticals = the number of particals that can exist at the same time 
//color = the color of the particals emitted (overridden by texture)
//size = the max size of the particals being emitted
class ParticalEmitter {
    constructor(position = new THREE.Vector3(0,0,0), direction = new THREE.Vector3(1,0,0), angel = 20, maxParticals = 100, color = 0x00ffffff, size = 1)
    {

        const uniforms = {
            diffuseTextrue: { value: new THREE.TextureLoader().load('./textures/fire.jpg')}, //Photo by Vijay Vinoth from Pexels: https://www.pexels.com/photo/red-flame-digital-wallpaper-1546070/ 
            pointMultiplier: { value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))}
        
        };

        this._material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: _VS,
            fragmentShader: _FS,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: false,
            vertexColors: true
        });

        this._particles = [];

        this.position = new THREE.Vector3();
        this.position.copy(position); // this is the postition of the partical generator (will need to move with the ship)
        this.direction = new THREE.Vector3();
        this.direction.copy(direction);
        this.angel = angel/180 * Math.PI; // this is the angel of the arch of the particals from 0 to 360 (0: the particals are shot out in a strait line, 180: particals are shot out in every direction) 

        this.maxParticals = maxParticals; // this is the maximum number of particals that will be generated 
        this.particalLocation = new Array(maxParticals * 3); //this will hold the location of each partical (inital position should be this.postion)
        
        this.size = size; //this is the size of the particals
        this.color = color; // this is the color of the particals
        
        for (let element of this.particalLocation) {
            element = 0;
        }

        this.particalVelocity = new Array(maxParticals); // this will hold the velocity of each partical (should be the velocity of the ship pluse some random velocity moving away from the ship)
        for (let i = 0; i < maxParticals; i++) {
            this.particalVelocity[i] = new THREE.Vector3();
        }

        this._particalSize = new Array();
        for (let i = 0; i < this.maxParticals; i++)
        {
            let ratio = i / this.maxParticals;
            this._particalSize[i] = Math.sin(ratio * Math.PI) * this.size;
        }

        this._particalColor = new Array();
        for (let i = 0; i < this.maxParticals/2; i++)
        {
            let ratio = i / this.maxParticals;
            this._particalColor[i * 4] = Math.sin(ratio * Math.PI); //red
            this._particalColor[i * 4 + 1] = Math.sin(ratio * Math.PI) * 0.75; //green
            this._particalColor[i * 4 + 2] = 0; //blue
            this._particalColor[i * 4 + 3] = Math.sin(ratio * Math.PI); //alpha
        }
        for (let i = this.maxParticals/2; i < this.maxParticals; i++)
        {
            let ratio = i / this.maxParticals;
            this._particalColor[i * 4] = 1.0; //red
            this._particalColor[i * 4 + 1] = 1.0 - Math.abs(Math.cos(ratio * Math.PI)) * 0.25 ; //green
            this._particalColor[i * 4 + 2] = Math.abs(Math.cos(ratio * Math.PI)); //blue
            this._particalColor[i * 4 + 3] = 1.0; //Math.sin(ratio * Math.PI) * 0.75; //alpha
        }

        this._angel = new Array();
        for (let i = 0; i < this.maxParticals; i++)
        {
            let ratio = i / this.maxParticals;
            this._angel[i] = Math.PI * 2 * ratio;
        }

        
        this._geometry = new THREE.BufferGeometry();
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.particalLocation, 3));
        this._geometry.setAttribute('size', new THREE.Float32BufferAttribute(this._particalSize, 1));
        this._geometry.setAttribute('colour', new THREE.Float32BufferAttribute(this._particalColor, 4));
        this._geometry.setAttribute('angle', new THREE.Float32BufferAttribute(this._angel, 1));
        this.points = new THREE.Points(this._geometry, this._material);

        //scene.add(this.points);
    }

    update(delta, initalVelocity = new THREE.Vector3(0,0,0),  rate = 1, emitterON = true, direction = null) { //this will update the particals

        if (direction !== null)
        {
            this.direction.copy(direction);
        }

        var dot = GLOBALS.RIGHT.dot(this.direction);
        var axis;
        var angel;
        if (dot >= 1) //in theory the dot product should be between [-1, 1] but rounding errors
        {
            axis = new THREE.Vector3(0, 1, 0);
            angel = 0; //if the dot product is >= 1 is pointed in the correct direction;
        }
        else if (dot <= -1)
        {
            axis = new THREE.Vector3(0, 1, 0);
            angel = Math.PI;
        }
        else
        {
            axis = new THREE.Vector3().crossVectors(GLOBALS.RIGHT, direction);
            angel = Math.acos(dot);
        }
        axis.normalize();
        
        for (let i = 0; i < this.maxParticals; i++)
        {
            this.particalLocation[i*3] += this.particalVelocity[i].x * delta;
            this.particalLocation[i*3 + 1] += this.particalVelocity[i].y * delta;
            this.particalLocation[i*3 + 2] += this.particalVelocity[i].z * delta;
        }
        
        for (let j = 0; j < (rate * delta) + 1 && j < this.maxParticals; j++)
        {
            for (let i = 0; i < 3 && i < this.maxParticals; i++)
            {
                this.particalLocation.shift()
            }

            if (emitterON)
            {
                this.particalLocation.push(this.position.x, this.position.y, this.position.z);
                this.particalVelocity.shift();

                var randAngel1 = (Math.random() - 0.5) * this.angel;
                var randAngel2 = Math.random() * Math.PI * 2;
                var randVelocity = new THREE.Vector3(Math.cos(randAngel1), 0, Math.sin(randAngel1));
                randVelocity.applyAxisAngle(GLOBALS.RIGHT, randAngel2);
                randVelocity.applyAxisAngle(axis, angel);
                randVelocity.multiplyScalar(Math.random() * 5 + 0.5);
                //console.log(randVelocity.lengthSq());

                if (initalVelocity.length() < 0.005)
                {
                    this.particalVelocity.push(new THREE.Vector3(0, 0, 0));
                }
                else
                {
                    var topush = new THREE.Vector3();
                    topush.copy(initalVelocity);
                    topush.add(randVelocity);
                    this.particalVelocity.push(topush); //give a random vector that is pointed away from the ship 
                } 
            }
            else{
                this.particalLocation.push(0, 1000, 0);
                this.particalVelocity.shift();
                this.particalVelocity.push(new THREE.Vector3(0, 0, 0));
            }

            
        }

        // add the new geomentry to the this.points
        this._geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.particalLocation, 3));
        this._geometry.attributes.position.needsUpdate = true;

    }

}




export{ ParticalEmitter };
