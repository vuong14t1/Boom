/**
 * Created by Tomorow on 6/10/2016.
 */

var Filter = {
    programs:{},

    _getSprite: function(node){
        if(node == null){
            ZLog.error("grayShader node == null");
            return node;
        }

        if(node instanceof cc.Sprite || node instanceof cc.LabelBMFont){
            var sprite = node;
        }
        else if(node instanceof ccui.Button){
            if(node.isScale9Enabled()){
                ZLog.error("grayShader isScale9Enabled == true");
            }

            sprite = node.getVirtualRenderer().getSprite();
        }
        else if(node instanceof ccui.Scale9Sprite){
            sprite = node.getSprite();
        }

        return sprite;
    },

    normalShader: function(node){
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["normalShader"];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/normal.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                //program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                Filter.programs["normalShader"] = program;
                gl.useProgram(program.getProgram());
            }
            sprite.setShaderProgram(program);
        }

        return sprite;
    },
    /**
     *
     * @param node
     */
    grayShader: function (node) {
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["grayShader"];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/gray.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                //program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                Filter.programs["grayShader"] = program;
                gl.useProgram(program.getProgram());
            }
            sprite.setShaderProgram(program);
        }

        return sprite;
    },

    /**
     *
     * @param node
     * @param degree
     */
    sepiaShader: function (node, degree) {
        if(degree === undefined) degree = 0.4;
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["sepiaShader" + degree];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/sepia.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["sepiaShader" + degree] = program;
            }
            sprite.setShaderProgram(program);

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformFloat("u_degree", degree);
        }

        return sprite;
    },

    /**
     *
     * @param node
     * @param brightness
     */
    brightnessShader: function (node, brightness) {
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["brightnessShader" + brightness];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/brightness.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["brightnessShader" + brightness] = program;
            }
            sprite.setShaderProgram(program);

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformFloat("u_brightness", brightness);
        }

        return sprite;
    },

    bloomShader: function(node, blurSize, intensity){
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["bloomShader" + blurSize + "_" + intensity];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/bloom.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["bloomShader" + blurSize + "_" + intensity] = program;
            }
            sprite.setShaderProgram(program);

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformFloat("blurSize", blurSize);
            programState.setUniformFloat("intensity", intensity);
        }

        return sprite;
    },

    rgbShader: function(node, color){
        if(color == null) color = {};
        if(color.r == null) color.r = 1;
        if(color.g == null) color.g = 1;
        if(color.b == null) color.b = 1;

        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["rgbShader" + JSON.stringify(color)];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/rgb.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["rgbShader" + JSON.stringify(color)] = program;
            }
            sprite.setShaderProgram(program);

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformFloat("u_redAdj", color.r);
            programState.setUniformFloat("u_greenAdj", color.g);
            programState.setUniformFloat("u_blueAdj", color.b);
        }

        return sprite;
    },

    motionBlurShader: function(node, blurSize, blurAngle){
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["motionBlurShader" + blurSize + "_" + blurAngle];
            if(program == null){
                program = new cc.GLProgram("res/shaders/motion_blur.vsh", "res/shaders/motion_blur.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["motionBlurShader" + blurSize + "_" + blurAngle] = program;
            }
            sprite.setShaderProgram(program);

            // calculate offset
            var spriteSize = sprite.getContentSize();
            var aspectRatio = spriteSize.height / spriteSize.width;

            var _texelOffsetX = blurSize*Math.cos(blurAngle*3.14 / 180.0) / spriteSize.width;
            var _texelOffsetY = blurSize*Math.sin(blurAngle*3.14 / 180.0) / spriteSize.width;

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformVec2("u_directionalTexelStep", {x: _texelOffsetX, y: _texelOffsetY});
        }

        return sprite;
    },

    saturationShader: function(node, saturation){
        var sprite = this._getSprite(node);

        if(sprite != null){
            var program = Filter.programs["saturationShader" + saturation];
            if(program == null){
                program = new cc.GLProgram("res/shaders/generic.vsh", "res/shaders/saturation.fsh");
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();

                gl.useProgram(program.getProgram());
                Filter.programs["saturationShader" + saturation] = program;
            }
            sprite.setShaderProgram(program);

            // update uniform after set shader to sprite, use GLProgramState
            var programState = sprite.getGLProgramState();
            programState.setUniformFloat("u_saturation", saturation);
        }

        return sprite;
    },
};