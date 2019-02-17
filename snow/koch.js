"use strict";

var gl;
var points;

var vertices = [
    vec2( -1, -1),
    vec2(  1, -1)
];

var points = [];

var depth = 2;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    if(depth == 0 ){
        points.push(vertices[0]);
        points.push(vertices[1]);
    }
    else 
        addpoints(vertices[0],vertices[1], depth);

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

    gl.uniform1f( gl.getUniformLocation(program, "depth"), depth);
    document.getElementById( "button_depth" ).onclick = function () {
        depth = document.getElementById('depth').value;
        gl.uniform1f( gl.getUniformLocation(program, "depth"), depth);
        points=[];
        init();
    };

    render();
};

function addpoints(p,q,depth){
    if (depth > 0 ){

        var a = vec2(2*p[0]/3+q[0]/3, 2*p[1]/3+q[1]/3);
        var b = vec2(p[0]/3+2*q[0]/3, p[1]/3+2*q[1]/3);
        var c1 = subtract(q,p);
        var c2 = vec2(-c1[1]/Math.sqrt(12), c1[0]/Math.sqrt(12));
        var c3 = scale(1/2, add(a,b));
        var c = vec2(c3[0]+c2[0],c3[1]+c2[1]);

        if (depth==1){
            points.push(p);
            points.push(a);
            points.push(c);
            points.push(b);
            points.push(q);
        }

        addpoints(p,a,depth-1);
        addpoints(a,c,depth-1);
        addpoints(c,b,depth-1);
        addpoints(b,q,depth-1);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
