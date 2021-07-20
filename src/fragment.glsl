uniform sampler2D baseTexture;
uniform sampler2D contentTexture;
uniform float baseOpacity;
varying vec2 vUv;

void main() {
  vec4 base = texture2D(baseTexture, vUv);
  vec4 content = texture2D(contentTexture, vUv);
  gl_FragColor = (base * content * baseOpacity) + content * (1.0 - baseOpacity);
}
