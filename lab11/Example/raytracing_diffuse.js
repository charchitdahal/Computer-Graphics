"use strict";

var canvas;
var gl;
var program;

// point array and color array
var pointsArray = [];
var colorsArray = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // add positions and colors of points 
    main();

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // push point array and color array in buffers
        //
    //  Load shaders and initialize attribute buffers
    //
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
}

function main() {
    var nx = 500;
    var ny = 500;
    var material = new diffuse(vec3(.4, .2, .1));
    var material2 = new diffuse(vec3(1.0, 1.0, 0.0));
    var sphere1 = new sphere( vec3(0, 0, -1), 0.5 , material);
    var sphere2 = new sphere( vec3(0, -100.5, -1), 100 , material2);
    // var sphere3 = new sphere( vec3(0.5, 0, -1.6), 0.6 , material);
    var world = []
    world[0] = sphere1;
    world[1] = sphere2;
    // world[2] = sphere3;
    // console.log(world)
    // add your code here:
    var s = new sphere(vec3(0,0,-1), 0.5);
    console.log("P3\n" + nx + " " + ny + "\n255\n")

    var lower_left_corner = vec3(-1.0, -1.0, -1.0);
    var horizontal = vec3(2.0, 0.0, 0.0);
    var vertical = vec3(0.0, 2.0, 0.0)
    var origin = vec3(0.0, 0.0, 0.0)
    
    for (var j = ny - 1 ; j >= 0; j--) {
        for (var i = 0; i < nx; i ++) {
            var u = i / nx;
            var v = j / ny;
            var a = add(lower_left_corner, scale(u, horizontal))
            var b = scale(v, vertical)
            var c = add(a, b)
            var r = new ray( origin, c );

            // var p = r.point_at_parameter(2.0);
            // console.log(r)
            var col = colors(r, world, 0);

            u = u * 2 - 1
            v = v * 2 - 1

            colorsArray.push(col)

            pointsArray.push( vec2(u, v))

        }
    }
}

function colors(r, world, depth){
    // add your code here:
    var rec = new hit_record(world, world.length);
    // console.log(rec)
    var hit_anything = false;
    var t_max = Number.MAX_VALUE;
    for (var i = 0; i < world.length; i++) {
        // console.log(world[i])
        if (world[i].hit(r, 0, t_max, rec)) {
            // console.log(world[i])
            hit_anything = true;
            t_max = rec.t;

            if (depth < 50) {
                var next_ray = rec.material.get_next_ray(rec);
                var col = colors(next_ray, world, depth - 1);
                var atten = rec.material.get_attenuation();
                var a = atten[0] * col[0];
                var b = atten[1] * col[1];
                var c = atten[2] * col[2];

                atten = vec3(a, b, c);
                return atten;
            }
            else {
                return vec3(0.0, 0.0, 0.0);
            }
        }
    }

    if (hit_anything) {
        // return modified normal vector
        // console.log(rec.normal)
        return rec.normal;
    }
    else {
        // return background
        var unit_direction = r.direction;
        var t = normalize(unit_direction);
        t = 0.5 * (unit_direction[1] + 1.0);
        var d = 1.0 - t
        var a = scale( d, vec3(1.0, 1.0, 1.0));
        var b = scale(t, vec3(0.5, 0.7, 1.0));
        var c = add(a, b);
        return c;
    }



}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}