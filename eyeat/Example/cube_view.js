"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var mvMatrix, pMatrix;
var modelView, projection;

var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;

var near = 1;
var far = -1;
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var eye;

// In today's class, you do not need to change anything in init().
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    render();
}

// build six faces
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    quad( 6, 5, 1, 2 );
}

// vertices and colors 
function quad(a, b, c, d)
{
    var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5,  0.5,  0.5, 1.0 ),
        vec4(  0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5,  0.5, -0.5, 1.0 ),
        vec4(  0.5, -0.5, -0.5, 1.0 )
    ];

    var vertexColors = [
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );

        //for interpolated colored faces
        //colors.push( vertexColors[indices[i]] );

        //for solid colored faces
        colors.push(vertexColors[a]);

    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mvMatrix = mat4(); // Initialization of model matrix
    // mvMatrix = mult(scalem(2,2,2), mvMatrix);

    // Textbook, Figure 5.14
    // mvMatrix = mult(rotateY(-90),mvMatrix);
    // mvMatrix = mult(translate(0,0,0.001),mvMatrix);

    // Textbook, Figure 5.15
    // mvMatrix = mult(mvMatrix, rotateY(35.26));
    // mvMatrix = mult(mvMatrix, rotateX(45));
    // mvMatrix = mult(translate(0,0,-1.7), mvMatrix);

    // Identify position of eye using spherical coordinate system
    // phi is azimuth, theta is elevation 
    // eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta), radius*Math.cos(phi));
    // eye at positive z 
    // eye = vec3(0,0,1);
    // eye at positive x 
     eye = vec3(1,0,0);
    // at is origin. up is the up direction of camera, which is positive y (0,1,0）here.
    mvMatrix = lookAt(eye, at , up);

    pMatrix = mat4(); // Initialization of view matrix 
    // near is distance from near plane to camera
    // far is distance from far plane to camera
    // the sign of near and far are decided by the orientation of camera (eye - at)
    pMatrix = ortho(left, right, bottom, ytop, near, far);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    requestAnimFrame(render);
}