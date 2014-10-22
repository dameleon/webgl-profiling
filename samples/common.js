(function (global, docuemnt, undefined) {
    var canvas = docuemnt.getElementById('viewer');
    var gl;

    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
        console.error(e);
    }

    var fragmentShader = getShader(gl, 'shader-fs');
    var vertexShader = getShader(gl, 'shader-vs');
    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program.');
    }
    gl.useProgram(shaderProgram);
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);


    function getShader(gl, shaderTargetId) {
        var shaderScript, source, shader;

        shaderScript = document.getElementById(shaderTargetId);
        if (!shaderScript) {
            return null;
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
                return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    function GLEngine(canvasId) {
        this.canvas = document.getElementById(canvasId);
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        } catch (e) {
            console.error(e);
            return this;
        }
    }

    GLEngile.prototype = {
        constructor: GLEngine,
        setShader: function(shaderTargetId) {
            var gl = this.gl;
            var shaderScript = document.getElementById(shaderTargetId);
            var source, shader;

            if (!shaderScript) {
                console.warn('shader script not found');
            }
            source = shaderScript.textContent;
            switch (shaderScript.type) {
                case 'x-shader/x-fragment':
                    shader =
            }

        }
    };


})(window, document, void 0);
