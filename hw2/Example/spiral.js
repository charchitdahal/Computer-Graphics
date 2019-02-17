

var gl, program;

var points = [];

var modelViewMatrixLoc;
var modelViewMatrix=mat4();
var indexLoc;

var SpiralPoints = 1500;
var RosePoints = 180;

function main() {

    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    GeneratePoints();
    
    //  Configure WebGL
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    indexLoc = gl.getUniformLocation(program, "index");

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

// Generate points for the rose and the spiral track
function GeneratePoints() {
    // Generate and push points to points[] for rose
    // Your code goes here:
    var x, y;
    var point1 = 0.15;
    var j = 3;
    var start = vec2(0,0)

    points.push(start)

    for (let i = 0; i<RosePoints; i++) {
        x = point1*Math.cos(j*i*Math.PI/180)*Math.cos(i*Math.PI/180)
        y = point1*Math.cos(j*i*Math.PI/180)*Math.sin(i*Math.PI/180)
        let rose = scale(0.7,vec2(x,y))
        points.push(rose)
    }
    
    // Generate and push 1500 points to points[] for spiral

    var point2 = 0.04;

    for (let i=0; i<SpiralPoints; i++) {
        x = point2*i*Math.cos(i*Math.PI/180)
        y = point2*i*Math.sin(i*Math.PI/180)
        let spiral = scale(0.015,vec2(x,y))
        points.push(spiral)
    }

}

var i=0;

function DrawRoseAndSpiral() {

    modelViewMatrix=mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 0); // set color of spiral as red
    // Call gl.drawArrays( gl.LINE_STRIP, ..) for spiral 

    gl.drawArrays( gl.LINE_STRIP, RosePoints+1, SpiralPoints)

    // Create modelViewMatrix for moving rose
    // Do not forget to reset rose to start after reaching to the end of spiral
    
    modelViewMatrix = mat4()
        
    i++ 
    if (i==SpiralPoints)
        i=0
        
    modelViewMatrix = translate(points[RosePoints+1+i][0], points[RosePoints+1+i][1], 0 )
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniform1i(indexLoc, 1); // set color of rose as black 
    // Call gl.drawArrays( gl.TRIANGLE_FAN, ..) for rose 
  
    gl.drawArrays( gl.TRIANGLE_FAN, 0, RosePoints+1 )

}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT );

    DrawRoseAndSpiral();

    requestAnimationFrame(render);

}