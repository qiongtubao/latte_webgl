precision mediump float;
varying vec2       v_texCoord;
varying vec4       v_ClipPos;
uniform sampler2D  s_texture0;
uniform vec4       u_channelFlag;
uniform vec4       u_baseColor;
uniform bool       u_maskFlag;
void main(){    
    vec4 smpColor;     
    if(u_maskFlag){        
      float isInside =  step(u_baseColor.x, v_ClipPos.x/v_ClipPos.w)  * step(u_baseColor.y, v_ClipPos.y/v_ClipPos.w)  * step(v_ClipPos.x/v_ClipPos.w, u_baseColor.z) * step(v_ClipPos.y/v_ClipPos.w, u_baseColor.w);
      smpColor = u_channelFlag * texture2D(s_texture0 , v_texCoord).a * isInside;    
    }else{        
        smpColor = texture2D(s_texture0 , v_texCoord) * u_baseColor;    
    }    
    gl_FragColor = smpColor;
}