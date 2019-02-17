"use strict";

//Charchit Dahal

var render, canvas, gl;

var NumTimesToSubdivide = 5;

var points =[];

var divideCurve = function( c, l , r) {
// divides c into l (l) and r ( r ) curve data
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
   if ( count > 0 ) {
        var l = [];
        var r = [];
        divideCurve( p, l, r );

        divide( l, count - 1 );
        divide( r, count - 1 );
    }
    else {
        points.push(p[0]);
        points.push(p[3]);
    }
    return;
}

var d = 0.5;
var number_points_on_circle = 4;
var vertices = [];

function generate_vertices(d, number_points_on_circle){
    // Generate all vertices, right -> p -> left, and push all vertices in vertices[]
    // Your code goes here:
    var sine,coss,l,r,p,q,angle,dq;

    for (var j = 0; j<number_points_on_circle; j++){
        angle = (2 * Math.PI*j) / number_points_on_circle

        sine = Math.sin(angle)
        coss = Math.cos(angle)

        p = vec2(coss, sine)
        q = vec2(-(sine), coss)

        dq = scale(d,q)
        //left = p + d * q
        l = add(p,dq)
        //right = p - d * q
        r = subtract(p,dq)

        vertices.push(r)
        vertices.push(p)
        vertices.push(l)
        
    }
}

function addpoints(){
    // Call divide(vertices.slice(start, end), NumTimesToSubdivide) to draw Bezier curves one by one.
    // Your code goes here:
    for(var i = 0; i<number_points_on_circle; i++){

        if(i!= (number_points_on_circle -1))
        {
            var start = i*3+1
            var end = i*3+5
            
            //Call divide(vertices.slice(start, end), NumTimesToSubdivide)
            divide(vertices.slice(start,end), NumTimesToSubdivide)
        }

        else
        {
            var v1 = vertices[i*3+1]
            var v2 = vertices[i*3+2]
            var v3 = vertices[0]
            var v4 = vertices[1]

            var vertx = [v1, v2, v3, v4]
            divide(vertx, NumTimesToSubdivide)
        }

        }
    }

onload = function init()  {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    generate_vertices(d, number_points_on_circle);
    addpoints();

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("d" ).onclick = function () {
        d = document.getElementById('input1').value;
        points = [];
        vertices = [];
        init();
    };
    document.getElementById( "number" ).onclick = function () {
        number_points_on_circle = document.getElementById('input2').value;
        points = [];
        vertices = [];
        init();
    };

    render();
}

render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays( gl.LINE_STRIP, 0, points.length );
}
