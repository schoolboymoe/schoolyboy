/* ==========================================================================
   NOVA hero shader : dependency-free raw WebGL.
   GLSL ported from the Three.js WebGLShader reference, recoloured from RGB
   neon to brand gold, and dropped one third down so the light band sits below
   the NOVA wordmark. No Three.js needed; this is a single full-screen quad.
   Degrades silently (canvas stays transparent, .hero__bg shows) if WebGL is
   missing, and renders a single static frame under prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vert = 'attribute vec3 position; void main(){ gl_Position = vec4(position, 1.0); }';
  var frag = [
    'precision highp float;',
    'uniform vec2 resolution;',
    'uniform float time;',
    'uniform float xScale;',
    'uniform float yScale;',
    'uniform float distortion;',
    'void main(){',
    '  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);',
    '  p.y += 0.26;',                         // sink the band toward the lower third
    '  float d = length(p) * distortion;',
    '  float rx = p.x * (1.0 + d);',
    '  float gx = p.x;',
    '  float bx = p.x * (1.0 - d);',
    '  float i1 = 0.034 / abs(p.y + sin((rx + time) * xScale) * yScale);',
    '  float i2 = 0.034 / abs(p.y + sin((gx + time) * xScale) * yScale);',
    '  float i3 = 0.034 / abs(p.y + sin((bx + time) * xScale) * yScale);',
    '  vec3 hot  = vec3(0.96, 0.86, 0.55);',  // cream-gold core
    '  vec3 gold = vec3(0.79, 0.64, 0.29);',  // #c9a44a
    '  vec3 deep = vec3(0.45, 0.32, 0.10);',  // bronze
    '  vec3 col = hot * i2 + gold * i1 * 0.7 + deep * i3 * 0.7;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { return null; }
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, vert), fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,0,  1,-1,0,  -1,1,0,
     1,-1,0, -1, 1,0,   1,1,0
  ]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'resolution');
  var uTime = gl.getUniformLocation(prog, 'time');
  gl.uniform1f(gl.getUniformLocation(prog, 'xScale'), 1.0);
  gl.uniform1f(gl.getUniformLocation(prog, 'yScale'), 0.5);
  gl.uniform1f(gl.getUniformLocation(prog, 'distortion'), 0.06);

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.floor(canvas.clientWidth * dpr);
    var h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }

  var t = 0, raf = null, visible = true;
  function frame() {
    resize();
    t += 0.01;
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    raf = visible ? requestAnimationFrame(frame) : null;
  }

  window.addEventListener('resize', resize, { passive: true });

  if (reduce) { t = 2.0; resize(); gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 6); return; }

  // Pause the loop when the hero scrolls out of view (battery / GPU friendly).
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }, { threshold: 0 }).observe(canvas);
  }
  raf = requestAnimationFrame(frame);
})();
