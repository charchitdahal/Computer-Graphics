var canvas;
var gl;

var points = [];
var hexa = [];

// You should change the number of points accordingly based on your design
var NumberOfPoints_Circle = 360; // replace {} by a number
var NumberOfPoints_Hexagram = 13; // replace {} by a number

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Call GeneratePoints to push points into points[]
    GeneratePoints(); 

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

    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.drawArrays(gl.LINE_STRIP, starting_index, number of points)
    // draw outer circle
    gl.drawArrays(gl.LINE_STRIP, 0, NumberOfPoints_Circle + 1); // replace {} by a number
    // draw inner hexagram
    gl.drawArrays(gl.LINE_STRIP, NumberOfPoints_Circle + 1, NumberOfPoints_Hexagram); // replace {} by a number

}

// generate points
function GeneratePoints(){

    var inner_radius = 0.5;    // Radius of the inner circle
    var outer_radius = 1.0;    // Radius of the outer circle

    var angle = NumberOfPoints_Circle / 2;

    // Push all points into points[]
    // You can use vec2(x,y) to hold each point
    // Your code goes here:
    // Help from https://stackoverflow.com/questions/32780958/drawing-a-circle-with-triangles-webgl
   
    for (var i=0; i<NumberOfPoints_Circle + 1; i++){
        points.push(vec2( (outer_radius * Math.cos(i * Math.PI / angle)), 
        (outer_radius * Math.sin(i * Math.PI/angle))));
    } 

      for (var i=0; i<NumberOfPoints_Circle; i++){
        hexa.push(vec2( (inner_radius * Math.cos(i * Math.PI / angle)), 
        (inner_radius * Math.sin(i * Math.PI/angle))));
    } 
      
    for (var i =0; i<13; i++) {
        if (i == 12){
            points.push(vec2(hexa[0*30], hexa[0*30]));

        } else if((i*30) % 60 == 0){
            points.push(vec2(hexa[i*30], hexa[i*30]));
        }
        else {
            points.push(vec2(points[i*30], points[i*30]));
        }
        }
    


    

}