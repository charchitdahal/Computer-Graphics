"use strict";

var canvas;
var gl;

var points = [];

var nRows = 4;
var nColumns = 4;

// connect to html
var colorFlagLoc;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;


// ortho projection 
var near = -1;
var far = 1;
var left = 0; 
var bottom = -1;
// Your code goes here:
var right = nColumns - 1    ; // !!! Please use a formula to change the value of right based on nColumns.
var ytop = nRows * 2; // / !!! Please use a formula to change the value of ytop based on nRows.


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


    // connect
    colorFlagLoc = gl.getUniformLocation(program, "colorFlag");
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // button 
    document.getElementById( "row_btn" ).onclick = function () {
        nRows = document.getElementById('row_input').value;
        // Your code goes here:
        // !!! Do not forget to use Number(nRows) to convert nRows from string to number.
        ytop = Number(nRows) * 2; // / !!! Please use a formula to change the value of ytop based on nRows.
    };
    document.getElementById( "column_btn" ).onclick = function () {
        nColumns = document.getElementById('column_input').value;
        // Your code goes here:
        // !!! Do not forget to use Number(nColumns) to convert nColumns from string to number.
        right = Number(nColumns) - 1; //!!! Please use a formula to change the value of right based on nColumns.
    };

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    var Tx = translate(0, 0, 0)
    var Ty = translate(0, 0, 0)
    var S = scalem(1, -1, 1)

    for (var i = 0; i < nRows; i++) {
        for (var j = 0; j < nColumns; j++) {

            modelViewMatrix = mat4()

            //even
            if ((i + j) % 2 == 0) {
                Tx = (translate(j, 0, 0))
                Ty=(translate(0,i*2,0))
                modelViewMatrix = mult(Tx, modelViewMatrix)
                modelViewMatrix=mult(Ty,modelViewMatrix)   
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.uniform1i(colorFlagLoc, 0);
                gl.drawArrays( gl.TRIANGLES, 0, points.length );
            }
            //odd
            else {
                Tx = translate(j, 0, 0)
                Ty=(translate(0,i*2,0))
                modelViewMatrix = mult(Tx, modelViewMatrix)
                modelViewMatrix=mult(S,modelViewMatrix)  
                modelViewMatrix=mult(Ty,modelViewMatrix)   
                gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
                gl.uniform1i(colorFlagLoc, 1);
                gl.drawArrays( gl.TRIANGLES, 0, points.length );

            }           
        }
    }
    requestAnimFrame( render );
    
}
