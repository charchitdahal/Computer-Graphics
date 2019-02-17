
var gl, canvas;
var program;

var points = []; //Store the points for the fern
var number_points = 100000; // Number of points

var pattern_type = 0;

var projectionMatrix, projectionMatrix;
var left = -5;
var right = 5;
var bottom = 0;
var ytop = 10;
var near = -1;
var far = 1;

// basic colors
const black = vec4(0.0, 0.0, 0.0, 1.0);
const red = vec4(1.0, 0.0, 0.0, 1.0);
const blue = vec4(0.0,0.0,1.0,1.0);
const green = vec4(0.0,0.5,0.0,1.0);
const magenta = vec4(1.0, 0.0, 1.0, 1.0);
const yellow = vec4(1.0, 1.0, 0.0, 1.0);
const orange = vec4(1.0,165/255,0.0,1.0);
const white = vec4(1.0, 1.0, 1.0, 1.0);
const gray = vec4(0.2, 0.2, 0.2, 1.0 );

window.onload = function init() {
	// Retrieve <canvas> element
	canvas = document.getElementById("gl-canvas");

	//Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL( canvas );
	if (!gl) {
		console.log('Fill to get the rendering context for WebGL');
		return;
	};

	//Generate points
	addpoints(pattern_type);

	//Configure WebGL
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//Initialize shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	// Load the data into the GPU
	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

    //Get the storage
    colorLoc = gl.getUniformLocation(program, "color_index");	
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	var menu1 = document.getElementById("menu1");
    menu1.addEventListener("change", function(){
        switch (menu1.selectedIndex){
			case 0:
				points = [];
                pattern_type = 0;
                init();
				break;
			case 1:
				points = [];
                pattern_type = 1;
                init();
                break;	
        }
	})

	var menu2 = document.getElementById("menu2");
    menu1.addEventListener("change", function(){
        switch (menu2.selectedIndex){
			case 0:
				init();
				break;
			case 1:
				points = [];
                pattern_type = 0;
                init();
                break;	
        }
	})

    //Draw the initial fern
    render();
}

// Generate points
function addpoints(pattern_type){
	var a, b, c, d, e, f

	if 

	
}

//Draw the initial fern
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	//Draw the fern
	
	requestAnimationFrame(render);
}

