"use strict";

// Charchit Dahal

var render, canvas, gl;

var points =[];
var start = vec2(0,-1);
var end = vec2(0,-0.7);

var NumTimesToSubdivide = 8;
var shrink = 0.9;
var theta = Math.PI/20;

// push first two vertices 
function draw_first_line(){
    points.push(start);
    points.push(end);
}

// call this function to rotate direction by theta 
// return a new normalized direction, which length is 1
function rotateVector(direction, theta){
    var rotateM = mat2(Math.cos(theta), -Math.sin(theta), Math.sin(theta), Math.cos(theta));
    return normalize(mult(rotateM, direction))
}

// recursively call itself to push all vertices 
function addpoints(start, end, depth){
    // Your code goes here:
    if (depth == 0){
        // draw_first_line();
        points.push(start);
        points.push(end);
    }
    else if(depth > 0){
        var direction = subtract(end, start);
        var rotateBC = rotateVector(direction, (-theta));
        
        var roateBD = rotateVector(direction, theta);

        var scaleBC = scale(length(direction), rotateBC);
        var scaleBD = scale(length(direction), roateBD);

        var shrinkBC = scale(shrink, scaleBC);
        var shrinkDB = scale(shrink, scaleBD);

        var c = add(end,shrinkBC);
        var d = add(end,shrinkDB);
        
        // draw_first_line();
        points.push(start);
        points.push(end);

        addpoints(end,c, depth-1);
        addpoints(end,d, depth-1);

    }
    
}

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    // black background
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    // white background
    // gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    draw_first_line();
    addpoints(start, end, NumTimesToSubdivide);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("shrink" ).onclick = function () {
        shrink = document.getElementById('input1').value;
        points = [];
        init();
    };
    document.getElementById( "theta" ).onclick = function () {
        theta = document.getElementById('input2').value;
        theta = radians(theta);
        points = [];
        init();
    };

    document.getElementById("NumTimesToSubdivide" ).onclick = function () {
        NumTimesToSubdivide = document.getElementById('input3').value;
        points = [];
        init();
    };

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.LINES, 0, points.length );
}
