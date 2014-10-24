/// <reference path="./d.ts/gl-matrix/gl-matrix.d.ts" />

module GL {

    var requestAnimFrame: (callback:() => void) => void = (function () {
        return window.requestAnimationFrame ||
            (<any>window).webkitRequestAnimationFrame ||
            (<any>window).mozRequestAnimationFrame ||
            (<any>window).oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60, new Date().getTime());
            };
    })();

    export class Engine {
        private canvas:HTMLCanvasElement;
        private gl:WebGLRenderingContext;

        constructor(canvasId:string, private width:number, private height:number) {
            this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);

            try {
                this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
            } catch (e) {
                console.error(e);
            }
            this.reset();
        }

        reset() {
            var gl = this.gl;

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        bindNewVBO(vertices:number[]):WebGLBuffer {
            var gl = this.gl;
            var buffer:WebGLBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            return buffer;
        }

        bindNewIBO(vertices:number[]):WebGLBuffer {
            var gl = this.gl;
            var buffer:WebGLBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(vertices), gl.STATIC_DRAW);
            return buffer;
        }

        createVBO(vertices:number[]):WebGLBuffer {
            var gl = this.gl;
            var buffer:WebGLBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            return buffer;
        }

        setAttribute(program:WebGLProgram, name:string, stride:number):number {
            var gl = this.gl;
            var location = gl.getAttribLocation(program, name);

            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, stride, gl.FLOAT, false, 0, 0);
            return location;
        }

        setProgramWithShaders(...shaders:WebGLShader[]):WebGLProgram {
            var gl = this.gl;
            var program = gl.createProgram();

            for (var i = 0, iz = shaders.length; i < iz; i++) {
                gl.attachShader(program, shaders[i]);
            }
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.useProgram(program);
                return program;
            } else {
                console.error(gl.getProgramInfoLog(program));
            }
        }

        getShader(shaderTargetId:string):WebGLShader {
            var gl = this.gl;
            var shaderScript = <HTMLScriptElement>document.getElementById(shaderTargetId);
            var source:string, shader:WebGLShader;

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
        }
    }

    interface IAnimationCallback {
        (duration:number, currentTime:number, startTime:number): void;
    }

    export class Animation {
        private startedAt:number;
        private isAnimated:boolean = false;
        private listeners:IAnimationCallback[] = [];
        private now:Function = Date.now;
        constructor(callback?:IAnimationCallback) {
            if (callback) {
                this.addListener(callback);
            }
        }
        play() {
            this.isAnimated = true;
            this.startedAt = this.now();
            this._exec();
        }
        stop() {
            this.startedAt = null;
            this.isAnimated = false;
        }
        addListener(callback:IAnimationCallback) {
            this.listeners.push(callback);
        }
        removeListener(callback:IAnimationCallback) {
            var listeners = this.listeners;
            var index = listeners.indexOf(callback);

            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
        private _exec() {
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
            requestAnimationFrame(() => { this._exec(); });
        }
    }

}