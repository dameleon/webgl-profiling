class GLEngine {
    private canvas:HTMLCanvasElement;
    private gl:WebGLRenderingContext;

    constructor(canvasId:string, private width:number, private height:number) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);

        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        } catch (e) {
            console.error(e);
        }
        this.initialize();
    }

    initialize() {
        var gl = this.gl;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    createVBO(vertices:number[]):WebGLBuffer {
        var gl = this.gl;
        var buffer:WebGLBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    setProgramWithShaders(...shaders: WebGLShader[]):WebGLProgram {
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

    setShaderWithIdList(idList: string[]) {
        var gl = this.gl;
        var program = gl.createProgram();

        idList.forEach(function(id) {
            var shader = this.getShader(id);

            if (!shader) {
                return;
            }
            gl.attachShader(program, shader);
        }, this);
        gl.bindAttribLocation(program, 0, 'vertex');
        gl.linkProgram(program);
        gl.useProgram(program);
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