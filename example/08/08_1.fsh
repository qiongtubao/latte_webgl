precision mediump float ;
varying vec2       v_texCoord;
varying vec4       v_ClipPos;
uniform sampler2D  s_texture0;
uniform sampler2D  s_texture1;
uniform vec4       u_channelFlag;
uniform vec4       u_baseColor ;
void main(){    
  vec4 col_formask = texture2D(s_texture0, v_texCoord) * u_baseColor;    
  vec4 clipMask = texture2D(s_texture1, v_ClipPos.xy / v_ClipPos.w) * u_channelFlag;
  float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;    
  col_formask = col_formask * maskVal;    
  gl_FragColor = col_formask;
}