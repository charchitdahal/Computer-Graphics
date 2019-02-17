"use strict";

var canvas, gl;
// number of evaluations along each curve

var numDivisions = 12;

var index = 0;

var points = [];

var bezier = function(u) {
    var b = [];
    var a = 1-u;
    b.push(u*u*u);
    b.push(3*a*u*u);
    b.push(3*a*a*u);
    b.push(a*a*a);

    return b;
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

    var h = 1.0/numDivisions;

    var data = new Array(numDivisions);

    var p = new Array(2);
    for( var i=0; i<2; i++){
        p[i] = new Array(vertices.length);
        for (var j=0; j<vertices.length; j++)
            p[i][j] = vertices[j][i]
    }

    for(var i=0; i<=numDivisions; i++){
        data[i] = vec2(0,0);
        var u = i*h;
        for(var ii=0; ii<2; ii++) {
            data[i][ii] = data[i][ii] + dot( bezier(u), p[ii]);
        }
    }
    
    for(var i=0; i<=numDivisions; i++){ 
            points.push(data[i]);
    }

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

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //console.log(points);
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
    //requestAnimFrame(render);
}
