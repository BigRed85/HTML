import * as GLOBALS from './globals.js';
import * as THREE from './node_modules/three/build/three.module.js'
import { I_Object } from './interactive_object.js'

class Player {
    constructor(camera = null, position = null, ship = null) {
        this.init(camera, position, ship);
    }

    init(camera, position, ship) {
        this.camera = camera;
        this.position = position;
        this.ship = ship;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.accel = GLOBALS.playerAccel;
        this.maxVel = GLOBALS.maxVel;

        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
    }

    move(delta) {
        var accel;
        var oldVelocity = new THREE.Vector3();
        oldVelocity.copy(this.velocity);

        if (this.moveUp)
        {
            accel = new THREE.Vector3(-1, 0, -1).multiplyScalar(GLOBALS.playerAccel * delta);
            this.velocity.add(accel);
        }
        if (this.moveDown)
        {
            accel = new THREE.Vector3(1, 0, 1).multiplyScalar(GLOBALS.playerAccel * delta);
            this.velocity.add(accel);
        }
        if (this.moveLeft)
        {
            accel = new THREE.Vector3(-1, 0, 1).multiplyScalar(GLOBALS.playerAccel * delta);
            this.velocity.add(accel);
        }
        if (this.moveRight)
        {
            accel = new THREE.Vector3(1, 0, -1).multiplyScalar(GLOBALS.playerAccel * delta);
            this.velocity.add(accel);
        }
        

        //slow down if ther is no player imput
        if (!this.moveDown && !this.moveUp && !this.moveLeft && !this.moveRight)
        {
            this.velocity.multiplyScalar(0.99);
        }

        this.velocity.clampLength(0, GLOBALS.maxVel);

        if (this.velocity.length() < 0.001) //to avoid rounding errors
        {
            this.velocity.set(0, 0, 0);
        }

        //check if the player is on the boarder
        if (this.ship.position.x >= GLOBALS.maxX - 1 && this.velocity.x > 0)
        {
            this.velocity.x = 0;
        } 
        else if (this.ship.position.x <= GLOBALS.minX + 1 && this.velocity.x < 0)
        {
            this.velocity.x = 0;
        }

        if (this.ship.position.z >= GLOBALS.maxZ - 1 && this.velocity.z > 0)
        {
            this.velocity.z = 0;
        }
        else if (this.ship.position.z <= GLOBALS.minZ + 1 && this.velocity.z < 0)
        {
            this.velocity.z = 0;
        }

        var playerVelocityDelta = new THREE.Vector3();
        playerVelocityDelta.copy(this.velocity);
        playerVelocityDelta.multiplyScalar(delta);

        this.ship.position.add(playerVelocityDelta);
        this.camera.position.add(playerVelocityDelta);
        this.camera.background.position.add(playerVelocityDelta); //??????

       

        this.turn(delta);

        var shipDirection = new THREE.Vector3(); //this shoud be in turn?
        this.ship.getWorldDirection(shipDirection);
        shipDirection.negate();

        this.ship.emitter.position.add(playerVelocityDelta);

        if (this.velocity.lengthSq() < oldVelocity.lengthSq() * 0.999 || this.velocity.lengthSq() == 0)
        {
            this.ship.emitter.update(delta, playerVelocityDelta, 10, false, shipDirection);
        }
        else
        {
            this.ship.emitter.update(delta, playerVelocityDelta, 20, true, shipDirection);
        }

    }

    turn(delta) {
        var shipDirection = new THREE.Vector3();
        this.ship.getWorldDirection(shipDirection);

        shipDirection.normalize();
        var playerVelocityNorm = new THREE.Vector3().copy(this.velocity);
        playerVelocityNorm.normalize();
        var dotPrduct = shipDirection.dot(playerVelocityNorm);
        var axis;
        var angel;
        if (dotPrduct >= 1) //in theory the dot product should be between [-1, 1] but rounding errors
        {
            return; //if the dot product is >= 1 the ship is pointed in the correct direction;
        }
        else if (dotPrduct <= -1)
        {
            axis = new THREE.Vector3(0, 1, 0);
            angel = Math.PI;
        }
        else
        {
            axis = new THREE.Vector3().crossVectors(shipDirection, playerVelocityNorm);
            angel = Math.acos(dotPrduct);
        }
        
    
        if (axis.lengthSq() == 0 || angel < Math.PI/90)
        {
            return;
        }
        axis.normalize();

        if (angel > Math.PI * delta)
        {
            angel = Math.PI * delta;
        }

        //rotate the ship
        this.ship.rotateOnAxis(axis, angel);
    }

    roll() {
        //will cause the ship to do a roll
    }

    //finds the closest interactable then if it is close enough returns the index so that the 
    interact(array_of_interactables) {

        if (array_of_interactables.length == 0)
            return undefined;
        
        var minDistance = Infinity;
        var index;

        for (let i = 0; i < array_of_interactables.length; i++) //find the object that is closest to the player 
        {
            if(!array_of_interactables instanceof I_Object)
            {
                console.error("Objects in array not of class I_Object:", ...array_of_interactables);
            }
            var position = array_of_interactables[i].position;

            var distance = this.ship.position.distanceToSquared(position);

            if (distance < minDistance)
            {
                minDistance = distance;
                index = i;
            }
        }

        //check if the player is close enogh to interact with the closest object
        if (minDistance <= GLOBALS.interaction_distance)
        {
            this.velocity.set(0, 0, 0); //stop all movment
            this.moveDown = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            
            return index; //return the index of the item it wishs to interact with
        }
        else
        {
            return undefined;
        }
    }

    getPosition() {
        return this.ship.position;
    }

}

export { Player };