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
    // Your code goes here:
    var nx = 500; 
    var ny = 500;
    var r, g, b;
    var u = 0;
    var v = 0;
    
    console.log(nx);
    console.log(ny);

    for (var j = ny-1; j >= 0; j--) {
        for (var i = 0; i < nx; i++) {
            r = u = (i / nx);
            g = v = (j / ny);
            b = 0.2; 
            
            u = u * 2 -1
            v = v * 2 -1

        colorsArray.push(vec3(r, g, b))
        pointsArray.push(vec2(u,v))


        }
        
    }
   
}


var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, pointsArray.length );
}
