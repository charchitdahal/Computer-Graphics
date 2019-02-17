"use strict";

// sphere subdivision

var render, canvas, gl, program;

// model view matrix for rotation
var modelView = [];
var delta = 0.5;
var axis =0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = [0, 0, 0];

var flag = true;

// points array
var points =[];

// parameters
var NumTimesToSubdivide = 0;
var numPatchesRows = 4; // How many patches on each row?
var numPatchesColumns = 4; // How many patches on each column?
var numPatches = 16;  // Total number of patches. 
var indices = new Array(numPatches); // index of vertices for each patch
var vertices = []; // Locations of all vertices
var nRows = 13; // How many vertices on each row?
var nColumns = 12; // How many vertices on each columns? 

var generatePatches = function(){
    var r = 1.0;
    // Your code goes here:





}


// reset all necessary parameters
function reset(){
    // Please find formulas for numPatches, nRows, nColumns
    // Please reset indices, vertices, points
    // Your code goes here:




    delta = delta*0.9;
    init();
}

var divideCurve = function( c, r , l) {

// divides c into left (l) and right ( r ) curve data

   var mid = mix(c[1], c[2], 0.5);

   l[0] = vec4(c[0]);
   l[1] = mix(c[0], c[1], 0.5 );
   l[2] = mix(l[1], mid, 0.5 );


   r[3] = vec4(c[3]);
   r[2] = mix(c[2], c[3], 0.5 );
   r[1] = mix( mid, r[2], 0.5 );

   r[0] = mix(l[2], r[1], 0.5 );
   l[3] = vec4(r[0]);

   return;
}

//----------------------------------------------------------------------------


var drawPatch = function(p) {

    // Draw the quad (as two triangles) bounded by the corners of the
    //   Bezier patch

    points.push(p[0][0]);
    points.push(p[0][3]);
    points.push(p[3][3]);
    points.push(p[0][0]);
    points.push(p[3][3]);
    points.push(p[3][0]);
    return;
}

//----------------------------------------------------------------------------


var dividePatch = function (p, count ) {


   if ( count > 0 ) {


    var a = mat4();
    var b = mat4();
    var t = mat4();
    var q = mat4();
    var r = mat4();
    var s = mat4();

	// subdivide curves in u direction, transpose results, divide
	// in u direction again (equivalent to subdivision in v)

        for ( var k = 0; k < 4; ++k ) {

                var pp = p[k];
                var aa = vec4();
                var bb = vec4();

                divideCurve( pp, aa, bb );

                a[k] = vec4(aa);
                b[k] = vec4(bb);
              }

        a = transpose( a );
        b = transpose( b );


        for ( var k = 0; k < 4; ++k ) {
                var pp = vec4(a[k]);
                var aa = vec4();
                var bb = vec4();

                divideCurve( pp, aa, bb );

                 q[k] = vec4(aa);
                 r[k] = vec4(bb);
        }


        for ( var k = 0; k < 4; ++k ) {
                var pp = vec4(b[k]);
                var aa = vec4();
                var bb = vec4();

                divideCurve( pp, aa, bb );

                 s[k] = vec4(aa);
                 t[k] = vec4(bb);
        }


	// recursive division of 4 resulting patches

        dividePatch( q, count - 1 );
        dividePatch( r, count - 1 );
        dividePatch( s, count - 1 );
        dividePatch( t, count - 1 );
    }
    else {
        drawPatch( p );
    }
    return;
}
//

function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    generatePatches();

    var patch1 = new Array(numPatches);
    for(var i=0; i<numPatches; i++) 
        patch1[i] = new Array(16);

    for(var i=0; i<numPatches; i++)
        for(var j=0; j<16; j++) {
            patch1[i][j] = vec4([vertices[indices[i][j]][0],
                                 vertices[indices[i][j]][2],
                                 vertices[indices[i][j]][1], 1.0]);
    }

    for ( var n = 0; n < numPatches; n++ ) {
        // duplicate each patch
        var patch = new Array(4);
        for(var k = 0; k<4; k++) 
            patch[k] = new Array(4);

        for(var i=0; i<4; i++) 
            for(var j=0; j<4; j++) 
                patch[i][j] = patch1[n][4*i+j];

        // Subdivide the patch
        dividePatch( patch, NumTimesToSubdivide );

    }

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    document.getElementById( "btn1" ).onclick = function () {
        NumTimesToSubdivide = Number(document.getElementById('input1').value);
        reset();
    };
    document.getElementById( "btn2" ).onclick = function () {
        numPatchesRows = Number(document.getElementById('input2').value);
        reset();
    };
    document.getElementById( "btn3" ).onclick = function () {
        numPatchesColumns = Number(document.getElementById('input3').value);
        reset();
    };

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += delta;

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "ModelView"), false, flatten(modelView) );

    for(var i=0; i<points.length; i+=3) gl.drawArrays( gl.LINE_LOOP, i, 3 );

    requestAnimFrame(render);
}
