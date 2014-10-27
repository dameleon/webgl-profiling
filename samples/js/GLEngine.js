/// <reference path="./d.ts/gl-matrix/gl-matrix.d.ts" />
var GL;
(function (GL) {
    var requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60, new Date().getTime());
        };
    })();
    var Engine = (function () {
        function Engine(canvasId, width, height) {
            this.width = width;
            this.height = height;
            var gl;
            this.canvas = document.getElementById(canvasId);
            try {
                gl = this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            }
            catch (e) {
                console.error(e);
            }
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.reset();
        }
        Engine.prototype.reset = function () {
            var gl = this.gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };
        Engine.prototype.loadTexture = function (url, callback) {
            var gl = this.gl;
            var image = new Image();
            image.onload = function () {
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                callback(null, tex);
            };
            image.onerror = function (e) {
                callback(e, null);
            };
            image.src = url;
        };
        Engine.prototype.bindNewVBO = function (vertices) {
            var gl = this.gl;
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            return buffer;
        };
        Engine.prototype.bindNewIBO = function (vertices) {
            var gl = this.gl;
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(vertices), gl.STATIC_DRAW);
            return buffer;
        };
        Engine.prototype.createVBO = function (vertices) {
            var gl = this.gl;
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            return buffer;
        };
        Engine.prototype.setAttribute = function (program, name, stride) {
            var gl = this.gl;
            var location = gl.getAttribLocation(program, name);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
            return location;
        };
        Engine.prototype.setProgramWithShaders = function () {
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
        Engine.prototype.getShader = function (shaderTargetId) {
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
        return Engine;
    })();
    GL.Engine = Engine;
    var Animation = (function () {
        function Animation(callback) {
            this.isAnimated = false;
            this.listeners = [];
            this.now = Date.now;
            if (callback) {
                this.addListener(callback);
            }
        }
        Animation.prototype.play = function () {
            this.isAnimated = true;
            this.startedAt = this.now();
            this._exec();
        };
        Animation.prototype.stop = function () {
            this.startedAt = null;
            this.isAnimated = false;
        };
        Animation.prototype.addListener = function (callback) {
            this.listeners.push(callback);
        };
        Animation.prototype.removeListener = function (callback) {
            var listeners = this.listeners;
            var index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
        Animation.prototype._exec = function () {
            var _this = this;
            if (!this.isAnimated) {
                return;
            }
            var listeners = this.listeners;
            var startedAt = this.startedAt;
            var now = this.now();
            var duration = now - this.startedAt;
            for (var i = 0, callback; callback = listeners[i]; i++) {
                callback(duration, now, startedAt);
            }
            requestAnimationFrame(function () {
                _this._exec();
            });
        };
        return Animation;
    })();
    GL.Animation = Animation;
})(GL || (GL = {}));
