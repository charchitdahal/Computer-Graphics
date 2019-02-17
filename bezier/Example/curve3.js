"use strict";

var render, canvas, gl;

var NumTimesToSubdivide = 1;

var index = 0;

var points =[];

var divideCurve = function( c, l , r) {

// divides c into left (l) and right ( r ) curve data

   var mid = mix(c[1], c[2], 0.5);

   l[0] = vec2(c[0]);
   l[1] = mix(c[0], c[1], 0.5 );
   l[2] = mix(l[1], mid, 0.5 );


   r[3] = vec2(c[3]);
   r[2] = mix(c[2], c[3], 0.5 );
   r[1] = mix( mid, r[2], 0.5 );

   r[0] = mix(l[2], r[1], 0.5 );
   l[3] = vec2(r[0]);

   return;
}



var divide = function (p, count ) {
    // p is vertices

   if ( count > 0 ) {
        var l = [];
        var r = [];
		
		

        // call divideCurve to divide p into left and right
        // recursively call divide 
        // your code goes here:
		divideCurve(p, l, r);     
		divide( l, count -1);
		divide( r, count -1);


    }
    else {
        // push points at the base case
        // your code goes here:
		points.push(p[0]);
		points.push(p[1]);
		points.push(p[2]);
		points.push(p[3]);


    }
}

var vertices = [vec2(-1,-1),
    vec2(-0.5,1),
    vec2(0.5,1),
    vec2(1,-1)];

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


    divide( vertices, NumTimesToSubdivide );


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
