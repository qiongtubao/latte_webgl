attribute vec4     a_position;
attribute vec2     a_texCoord;
varying vec2       v_texCoord;
varying vec4       v_ClipPos;
uniform mat4       u_mvpMatrix;
uniform mat4       u_ClipMatrix;
void main(){    
  gl_Position = u_mvpMatrix * a_position;
  v_ClipPos = u_ClipMatrix * a_position;
  v_texCoord = a_texCoord ;
}