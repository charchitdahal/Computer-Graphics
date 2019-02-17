
var gl;
var vertices;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    var vertices1 = new Float32Array([0, -1, 0, 1, 1, -1]); // one triangle
    var vertices2 = new Float32Array([0,-1,-0.8,-0.8,-1,0,-0.8,0.8,0,1,0.8,0.8,1,0,0.8,-0.8]); // points or lines, 8
    var vertices3 = new Float32Array([-1,-1,-0.6,1,0.6,-1,1,1]); // triangle strip, 4
    var vertices4 = new Float32Array([0,0,0.2,1,0.4,0.9,0.8,0.3,0.5,0]); // triangle fan, 5
    var vertices5 = new Float32Array([-1, -1, 0, 1, 1, -1]);
    var vertices = vertices5;

    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function sie(){



    
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    //gl.drawArrays( gl.VERTICES, 0, 8 ); // vertices2
    
    //gl.drawArrays( gl.LINES, 0, 8 ); // vertices2
    //gl.drawArrays( gl.LINE_STRIP, 0, 8 ); // vertices2
    //gl.drawArrays( gl.LINE_LOOP, 0, 8 ); // vertices2

    gl.drawArrays( gl.TRIANGLES, 0, 3); // vertices1

    //gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4); // vertices3
    //gl.drawArrays( gl.TRIANGLE_FAN, 0, 4); // vertices4
    
}
