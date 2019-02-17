"use strict";

var render, canvas, gl;

var vertices = [vec2(-1,-1),
    vec2(-0.5,1),
    vec2(0.5,1),
    vec2(1,-1)];

var NumTimesToSubdivide = vertices.length - 1;

var NumPoints = 5;

var index = 0;

var points =[];

var divideCurve = function( c, next, t) {

// divides c into left (l) and right ( r ) curve data

    for (var i=0; i<c.length-1; i++){
        next[i] = mix(c[i], c[i+1], t);
    }

   return;
}

var divide = function (p, count, t) {


   if ( count > 0 ) {
        var next_p = [];

        divideCurve( p, next_p, t );

        divide( next_p, count - 1, t );
    }
    else {
        points.push(p[0]);
    }
    return;
}

var addpoints = function(vertices, NumPoints){

    var h = 1.0/(NumPoints-1);
    for (var i =0; i< NumPoints; i++){
        var ratio = i*h;
        divide(vertices, NumTimesToSubdivide, ratio);
    }

}

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


    addpoints( vertices, NumPoints );


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //console.log(points)
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
