"use strict";

var canvas;
var gl;
var program;

// point array and color array
var pointsArray = [];
var colorsArray = [];

const green = vec3(0.5,0.7,1.0);
const white = vec3(1.0,1.0,1.0);

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
    // Your code goes here:
    var nx = 500;
    var ny = 500;
    var u,v;

    var lower_left_corner = vec3(-1, -1, -1);
    var horizontal = vec3(2, 0, 0);
    var vertical = vec3(0, 2, 0);
    var origin = vec3(0,0,-1)
    
    for (var j = ny-1; j >= 0; j--) {
        for (var i = 0; i < nx; i++) {

            u = (i / nx);
            v = (j / ny); 
            
            u = u * 2 -1
            v = v * 2 -1

            var a = scale(u,horizontal)
            var b = scale(v,vertical)
            var c = add(a,b)
            var d = add(lower_left_corner,c)
            var r = new ray(origin, d)
            
            var col = colors(r)    

            pointsArray.push(vec2(u,v))
            colorsArray.push(col)


}
}}

function colors(r){

    var unit_direction = normalize(r.direction());

    var t = 0.5 * (unit_direction[1] +1)

    var col = mix(vec3(1.0,1.0,1.0), vec3(0.5,0.7,1.0), t)

    return col
   
}


var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}
