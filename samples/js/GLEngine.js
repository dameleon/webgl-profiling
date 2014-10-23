/// <reference path="./d.ts/gl-matrix/gl-matrix.d.ts" />
var GLEngine = (function () {
    function GLEngine(canvasId, width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById(canvasId);
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        }
        catch (e) {
            console.error(e);
        }
        this.initialize();
    }
    GLEngine.prototype.initialize = function () {
        var gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    GLEngine.prototype.bindNewVBO = function (vertices) {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    };
    GLEngine.prototype.bindNewIBO = function (vertices) {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array, gl.STATIC_DRAW);
        return buffer;
    };
    GLEngine.prototype.createVBO = function (vertices) {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    };
    GLEngine.prototype.setAttribute = function (program, name, stride) {
        var gl = this.gl;
        var location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
        return location;
    };
    GLEngine.prototype.setProgramWithShaders = function () {
        var shaders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            shaders[_i - 0] = arguments[_i];
        }
        var gl = this.gl;
        var program = gl.createProgram();
        for (var i = 0, iz = shaders.length; i < iz; i++) {
            gl.attachShader(program, shaders[i]);
        }
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        }
        else {
            console.error(gl.getProgramInfoLog(program));
        }
    };
    GLEngine.prototype.getShader = function (shaderTargetId) {
        var gl = this.gl;
        var shaderScript = document.getElementById(shaderTargetId);
        var source, shader;
        if (!shaderScript) {
            console.warn('shader script not found');
            return;
        }
        source = shaderScript.textContent;
        switch (shaderScript.type) {
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            default:
                return;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    return GLEngine;
})();
