"use strict";

var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 0;

var CTM = mat4(); // identity matrix
var CTMLoc;

// Define three global transformations for three small triangles in one subdivision. 
// Your code goes here:
var down = scalem(0.5,0.5,1)
var moveUp = translate(0,1,1);
var moveLeft = translate(-1,-1,0);
var moveRight = translate(1,-1,0);

//alert(T)

var T = [moveUp,moveLeft,moveRight];

// alert(T)


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    points = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    CTMLoc = gl.getUniformLocation(program, "matrix");

    document.getElementById( "btn" ).onclick = function () {
        NumTimesToSubdivide = document.getElementById('input').value;
    };

    render();
};

function triangle(path)
{
    // Draw three triangles.
    // Your code goes here:
    
    
    for (var i=0; i<3; i++) {    
        var ctm = CTM; 
        
        for (var j=0; j<path[i].length; j++) {
            ctm = mult(down, ctm)
            ctm = mult(T[path[i][j]], ctm);
        }
 
        //console.log(ctm);
        //alert(ctm);

        gl.uniformMatrix4fv(CTMLoc, false, flatten(ctm));
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
        
    }

    console.log(path[0]);
    console.log(path[1]);
    console.log(path[2]);
}

function divideTriangle(path, count)
{
    // check for end of recursion
    if ( count == 0 ) {
        triangle(path);
    }
    else {
        count--;
        // Change path and recursively call divideTriangle
        // Your code goes here:

        divideTriangle([path[0].slice().concat("0"), path[1].slice().concat("0"), path[2].slice().concat("0")], count);
        divideTriangle([path[0].slice().concat("1"), path[1].slice().concat("1"), path[2].slice().concat("1")], count);
        divideTriangle([path[0].slice().concat("2"), path[1].slice().concat("2"), path[2].slice().concat("2")], count);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    var path = [[],[],[]];
    divideTriangle(path, NumTimesToSubdivide);

    //requestAnimFrame( render );
}
