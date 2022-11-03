import * as THREE from './node_modules/three/build/three.module.js';

//this is a class that defingns a logo cloud, it is a sphere of logos (sprites) that will spin
// logos = an array of logos to be shown in the logo cloud (it is best if the logos are from png files as they can have transparancy)
// radius = the radus of the logo cloud
// widthSegments = defignes the sphere
// hightSegments = defignes the spherematersp
// speed = defignes the speed of rotation
// position = the position of the center of the sphere
class LogoSpere {
    constructor(logos = [], radius = 1, widthSegments = 1, heightSegments = 1, speed = 1 , position = new THREE.Vector3(0,0,0)) {
       
        this._speed = speed / 60.0 * 2 * Math.PI; //speed will be in RPM this._speed will need to be in radians per second

        this._sphere = new Points_Sphere(widthSegments, heightSegments, radius); //this sphere will not work create my own ?
        

        this.length = this._sphere.points.length;

        this._logos = new Array(this.length); //create an array that will be the same length as the number of points in the geometry

        for (let i = 0; i < this.length; i++)
        {
            this._logos[i] = logos[i % logos.length]; //if the number of logos are less then the number of points then the logos will repeat
        }

        this._materials = new Array(this.length);

        for (let i = 0; i < this.length; i++)
        {
            this._materials[i] = new THREE.SpriteMaterial( {map: this._logos[i]})
        }

        this.sprites = new Array(this.length);
        this.object = new THREE.Object3D();
        this.object.translateX(position.x);
        this.object.translateY(position.y);
        this.object.translateZ(position.z);

        for (let i = 0; i < this.length; i++)
        {
            this.sprites[i] = new THREE.Sprite(this._materials[i]);
            this.sprites[i].position.set(this._sphere.points[i].x, this._sphere.points[i].y, this._sphere.points[i].z);
            this.object.add(this.sprites[i]);
        } //make it so the sprites are a part of a parent 3dObject !!!

    }

    update(delta) //updates the sphere causing it to rotate
    {
        for (let i = 0; i < this.length; i++)
        {
            this.object.rotateZ(-delta * this._speed);
            this.object.rotateX(delta * this._speed);
            this.object.rotateY(delta * this._speed);
        }
    }

    
}

class Points_Sphere { //not sure if this needs to be a class but it will remain a class in case I wish to expand on the functionality
    constructor(heightSegments, widthSegments, radius = 1) {
        this.points = new Array();

        if (heightSegments < 1)
            this.heightSegments = 1;
        else 
            this.heightSegments = heightSegments;

        if (widthSegments < 1)
            this.widthSegments = 1;
        else 
            this.widthSegments = widthSegments;

        this.radius = radius;


        var new_point, x, y, z, theta, rho;
        for (let i = 0; i <= this.heightSegments; i++)
        {
            theta = Math.PI * i / this.heightSegments;

            if (i == 0 || i == this.heightSegments) //push the polles of the sphere only once
            {
                x = 0;
                y = 0;
                z = this.radius * Math.cos(theta); //this should compute to 0 or 1 depending on the i value
                new_point = new THREE.Vector3(x, y, z);
                this.points.push(new_point);
            }
            else 
            {
                for (let j = 0; j < this.widthSegments; j++)
                {
                    rho = 2 * Math.PI * j / this.widthSegments;
                    x = this.radius * Math.sin(theta) * Math.cos(rho);
                    y = this.radius * Math.sin(theta) * Math.sin(rho);
                    z = this.radius * Math.cos(theta);

                    new_point = new THREE.Vector3(x, y, z);
                    this.points.push(new_point);
                }
            }
        }
    }
}

export{ LogoSpere };