"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var points = [];
var colors = [];

var CTM = mat4(); // current transformation matrix
var CTMLoc;

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

    CTM = mat4();
    CTMLoc = gl.getUniformLocation(program, "r");
    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));

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

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // transformations in MV.js
    var angle = 45;
    var scale_v = [0.5, 0.5, 0.5];
    var translate_v = [0.4, 0.0, 0.0];

    // translate
    //CTM = mult(translate(translate_v[0], translate_v[1], translate_v[2]), CTM);
    
    //scale
    //CTM = mult(scalem([scale_v[0], scale_v[1], scale_v[2]]), CTM);

    // rotate along X
    //CTM = mult(rotateX(angle), CTM);

    // concatenation
    // scale, rotateX, rotateY
    // CTM = mult(scalem([scale_v[0], scale_v[1], scale_v[2]]), CTM);
    // CTM = mult(rotateX(angle), CTM);
    // CTM = mult(rotateY(angle), CTM); 

    //==========================
    // order of transformations
    // swap following two lines, any different?

    //CTM = mult(translate(-0.5, 0, 0), CTM);
    //CTM = mult(rotateZ(90), CTM);

    //==========================
    // general transformation

    var p = [4.0, 5.0, 6.0];
    var d = [1.0, 2.0, 3.0];
    var angle = 5;

    //CTM = rotation_along_axis_about_origin(angle, d[0], d[1], d[2]);
    //CTM = rotation_alongZ_about_a_fixed_point(angle, p[0], p[1], p[2]);
    //CTM = rotation_along_axis_about_a_fixed_point(angle, d[0], d[1], d[2], p[0], p[1], p[2]);

    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function rotation_alongZ_about_a_fixed_point(thetaZ, px, py, pz)
{
    var R = mat4();
    R = mult(translate(-px,-py, -pz), R);
    R = mult(rotateZ(thetaZ), R);
    R = mult(translate(px, py, pz), R);    
    return R;
}

function rotation_along_axis_about_origin(angle, dx, dy, dz)
{
    var R = mat4();
    var direction = direction_angle(dx, dy, dz);
    var thetaX = direction[0];
    var thetaY = direction[1];
    
    R = mult(rotateX(thetaX), R);
    R = mult(rotateY(thetaY), R);
    R = mult(rotateZ(angle), R);
    R = mult(rotateY(-thetaY), R);
    R = mult(rotateX(-thetaX), R);

    return R;
}

// return thetaX and thetaY
function direction_angle(dx, dy, dz)
{
    var thetaX = Math.acos(dz/Math.sqrt(dy*dy+dz*dz)); 
    var thetaY = Math.acos(Math.sqrt((dy*dy+dz*dz)/(dx*dx+dy*dy+dz*dz)));
    return [thetaX, thetaY]; 
}

function rotation_along_axis_about_a_fixed_point(angle, dx, dy, dz, px, py, pz)
{
    var R = mat4();
    R = mult(translate(-px,-py, -pz), R);
    R = mult(rotation_along_axis_about_origin(angle, dx, dy, dz), R);
    R = mult(translate(px, py, pz), R); 
    return R;
}