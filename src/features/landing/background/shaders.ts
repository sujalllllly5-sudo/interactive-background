/* [WEBGL:SHADERS] Dot-grid vertex and fragment shaders with mouse repulsion. */

export const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    vec2 mouseSt = uMouse;
    mouseSt.x *= uResolution.x / uResolution.y;

    vec3 bgColor = vec3(0.94, 0.925, 0.9);
    vec2 glowOrigin = vec2(-0.18, 0.94);
    vec2 glowVector = st - glowOrigin;
    float glowDistance = length(glowVector);
    float glow = exp(-glowDistance * 2.5) * 0.18;
    float direction = dot(normalize(glowVector), normalize(vec2(0.92, -0.38)));
    float softAccent = smoothstep(0.58, 0.95, direction) * smoothstep(1.3, 0.18, glowDistance) * 0.07;
    float ambientLight = glow + softAccent;
    float breath = sin(uTime * 0.5) * 0.05 + 0.95;
    float redMask = clamp(ambientLight * breath, 0.0, 0.14);
    vec3 silhouetteRed = vec3(0.68, 0.018, 0.028);
    vec3 finalColor = mix(bgColor, silhouetteRed, redMask);

    float gridScale = 42.0;
    vec2 gridCoord = vUv * gridScale;
    vec2 cellId = floor(gridCoord);
    vec2 cellCenter = (cellId + 0.5) / gridScale;
    cellCenter.x *= uResolution.x / uResolution.y;

    float distToMouse = distance(cellCenter, mouseSt);
    vec2 repulsionOffset = vec2(0.0);
    float radius = 0.25;
    if (distToMouse < radius) {
      float force = smoothstep(radius, 0.0, distToMouse);
      vec2 pushDir = normalize(cellCenter - mouseSt);
      repulsionOffset = pushDir * force * 0.08;
    }

    vec2 displacedUv = (vUv - repulsionOffset) * gridScale;
    vec2 gridUv = fract(displacedUv) - 0.5;
    float dotDistance = length(gridUv);
    float dotMask = smoothstep(0.065, 0.012, dotDistance);
    vec3 dotColor = vec3(0.34, 0.012, 0.022);
    finalColor = mix(finalColor, dotColor, dotMask * 0.62);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
