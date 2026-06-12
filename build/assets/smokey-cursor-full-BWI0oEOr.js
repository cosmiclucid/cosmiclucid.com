import{r as Ae,j as oe}from"./index-DT_Z_nsD.js";function ct(){return{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}}const z={r:.6,g:.32,b:1.05};function ft(v){let y=v.r*.6599999999999999+z.r*.34,R=v.g*(1-.34)+z.g*.34,p=v.b*(1-.34)+z.b*.34;const I=1.08,M=Math.max(y,R,p);if(M>I){const L=I/M;y*=L,R*=L,p*=L}const V=Math.max(y,R,p),H=Math.min(y,R,p);V-H<.18&&(y+=(z.r-y)*.28,R+=(z.g-R)*.28,p+=(z.b-p)*.28),v.r=y,v.g=R,v.b=p}function lt({simulationResolution:v=128,dyeResolution:k=1440,captureResolution:y=512,densityDissipation:R=3.5,velocityDissipation:p=2,pressure:I=.1,pressureIterations:M=20,curl:V=3,splatRadius:H=.2,splatForce:L=6e3,enableShading:ne=!0,colorUpdateSpeed:ae=10,backgroundColor:_e={r:.5,g:0,b:0},transparent:be=!0,className:Fe="",disabled:ue=!1,intensity:mt=1,followMouse:vt=!0,autoColors:dt=!0}){const se=Ae.useRef(null);if(Ae.useEffect(()=>{if(ue)return;const f=se.current;if(!f)return;let w=[ct()],l={SIM_RESOLUTION:v,DYE_RESOLUTION:k,DENSITY_DISSIPATION:R,VELOCITY_DISSIPATION:p,PRESSURE:I,PRESSURE_ITERATIONS:M,CURL:V,SPLAT_RADIUS:H,SPLAT_FORCE:L,SHADING:ne,COLOR_UPDATE_SPEED:ae};const{gl:t,ext:S}=Ue(f);if(!t||!S)return;S.supportLinearFiltering||(l.DYE_RESOLUTION=256,l.SHADING=!1);function Ue(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);if(r||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i)),!r)throw new Error("Unable to initialize WebGL.");const o="drawBuffers"in r;let n=!1,a=null;o?(r.getExtension("EXT_color_buffer_float"),n=!!r.getExtension("OES_texture_float_linear")):(a=r.getExtension("OES_texture_half_float"),n=!!r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const s=o?r.HALF_FLOAT:a&&a.HALF_FLOAT_OES||0;let E,B,G;return o?(E=b(r,r.RGBA16F,r.RGBA,s),B=b(r,r.RG16F,r.RG,s),G=b(r,r.R16F,r.RED,s)):(E=b(r,r.RGBA,r.RGBA,s),B=b(r,r.RGBA,r.RGBA,s),G=b(r,r.RGBA,r.RGBA,s)),{gl:r,ext:{formatRGBA:E,formatRG:B,formatR:G,halfFloatTexType:s,supportLinearFiltering:n}}}function b(e,i,r,o){if(!Pe(e,i,r,o)){if("drawBuffers"in e){const n=e;switch(i){case n.R16F:return b(n,n.RG16F,n.RG,o);case n.RG16F:return b(n,n.RGBA16F,n.RGBA,o);default:return null}}return null}return{internalFormat:i,format:r}}function Pe(e,i,r,o){const n=e.createTexture();if(!n)return!1;e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,o,null);const a=e.createFramebuffer();return a?(e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1}function Be(e){if(!e.length)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}function Ce(e,i){if(!i)return e;let r="";for(const o of i)r+=`#define ${o}
`;return r+e}function g(e,i,r=null){const o=Ce(i,r),n=t.createShader(e);return n?(t.shaderSource(n,o),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)||console.trace(t.getShaderInfoLog(n)),n):null}function ce(e,i){if(!e||!i)return null;const r=t.createProgram();return r?(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)||console.trace(t.getProgramInfoLog(r)),r):null}function fe(e){let i={};const r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<r;o++){const n=t.getActiveUniform(e,o);n&&(i[n.name]=t.getUniformLocation(e,n.name))}return i}class A{program;uniforms;constructor(i,r){this.program=ce(i,r),this.uniforms=this.program?fe(this.program):{}}bind(){this.program&&t.useProgram(this.program)}}class Xe{vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(i,r){this.vertexShader=i,this.fragmentShaderSource=r,this.programs={},this.activeProgram=null,this.uniforms={}}setKeywords(i){let r=0;for(const n of i)r+=Be(n);let o=this.programs[r];if(o==null){const n=g(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);o=ce(this.vertexShader,n),this.programs[r]=o}o!==this.activeProgram&&(o&&(this.uniforms=fe(o)),this.activeProgram=o)}bind(){this.activeProgram&&t.useProgram(this.activeProgram)}}const D=g(t.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),ze=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `),Ie=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),Me=`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          // Dim overly bright whites
          float brightness = max(c.r, max(c.g, c.b));
          float dimFactor = 0.55; // reduces intensity; adjust 0.4–0.7 as needed
          c = c * dimFactor;

          float a = brightness * 0.6; // softer opacity
          gl_FragColor = vec4(c, a);
      }
    `,Ne=g(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `),Oe=g(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,S.supportLinearFiltering?null:["MANUAL_FILTERING"]),Ye=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),Ge=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),Ve=g(t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;

          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),He=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),We=g(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),x=(()=>{const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW);const i=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(r,o=!1)=>{t&&(r?(t.viewport(0,0,r.width,r.height),t.bindFramebuffer(t.FRAMEBUFFER,r.fbo)):(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)),o&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0))}})();let h,u,K,q,F;const $=new A(D,ze),N=new A(D,Ie),m=new A(D,Ne),c=new A(D,Oe),O=new A(D,Ye),Y=new A(D,Ge),T=new A(D,Ve),U=new A(D,He),P=new A(D,We),C=new Xe(D,Me);function X(e,i,r,o,n,a){t.activeTexture(t.TEXTURE0);const s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,o,n,null);const E=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,E),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,s,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);const B=1/e,G=1/i;return{texture:s,fbo:E,width:e,height:i,texelSizeX:B,texelSizeY:G,attach(we){return t.activeTexture(t.TEXTURE0+we),t.bindTexture(t.TEXTURE_2D,s),we}}}function J(e,i,r,o,n,a){const s=X(e,i,r,o,n,a),E=X(e,i,r,o,n,a);return{width:e,height:i,texelSizeX:s.texelSizeX,texelSizeY:s.texelSizeY,read:s,write:E,swap(){const B=this.read;this.read=this.write,this.write=B}}}function je(e,i,r,o,n,a,s){const E=X(i,r,o,n,a,s);return $.bind(),$.uniforms.uTexture&&t.uniform1i($.uniforms.uTexture,e.attach(0)),x(E,!1),E}function le(e,i,r,o,n,a,s){return e.width===i&&e.height===r||(e.read=je(e.read,i,r,o,n,a,s),e.write=X(i,r,o,n,a,s),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function me(){const e=ve(l.SIM_RESOLUTION),i=ve(l.DYE_RESOLUTION),r=S.halfFloatTexType,o=S.formatRGBA,n=S.formatRG,a=S.formatR,s=S.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),h?h=le(h,i.width,i.height,o.internalFormat,o.format,r,s):h=J(i.width,i.height,o.internalFormat,o.format,r,s),u?u=le(u,e.width,e.height,n.internalFormat,n.format,r,s):u=J(e.width,e.height,n.internalFormat,n.format,r,s),K=X(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),q=X(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),F=J(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST)}function ke(){const e=[];l.SHADING&&e.push("SHADING"),C.setKeywords(e)}function ve(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight,o=i/r;let n=o<1?1/o:o;const a=Math.round(e),s=Math.round(e*n);return i>r?{width:s,height:a}:{width:a,height:s}}function d(e,i=!0){const r=window.devicePixelRatio||1,o=e*r;return i?Math.floor(o):o}ke(),me();let Q=Date.now(),W=0,_=null,de=!1;function he(){if(document.hidden){_=null;return}const e=Ke();qe()&&me(),$e(e),Je(),Qe(e),Ze(null),_=requestAnimationFrame(he)}function Z(){de=!0,_===null&&!document.hidden&&(Q=Date.now(),_=requestAnimationFrame(he))}function xe(){if(document.hidden){_!==null&&cancelAnimationFrame(_),_=null;return}de&&Z()}function Ke(){const e=Date.now();let i=(e-Q)/1e3;return i=Math.min(i,.016666),Q=e,i}function qe(){const e=d(f.clientWidth),i=d(f.clientHeight);return f.width!==e||f.height!==i?(f.width=e,f.height=i,!0):!1}function $e(e){W+=e*l.COLOR_UPDATE_SPEED,W>=1&&(W=ut(W,0,1),w.forEach(i=>{i.color=j()}))}function Je(){for(const e of w)e.moved&&(e.moved=!1,tt(e))}function Qe(e){t.disable(t.BLEND),Y.bind(),Y.uniforms.texelSize&&t.uniform2f(Y.uniforms.texelSize,u.texelSizeX,u.texelSizeY),Y.uniforms.uVelocity&&t.uniform1i(Y.uniforms.uVelocity,u.read.attach(0)),x(q),T.bind(),T.uniforms.texelSize&&t.uniform2f(T.uniforms.texelSize,u.texelSizeX,u.texelSizeY),T.uniforms.uVelocity&&t.uniform1i(T.uniforms.uVelocity,u.read.attach(0)),T.uniforms.uCurl&&t.uniform1i(T.uniforms.uCurl,q.attach(1)),T.uniforms.curl&&t.uniform1f(T.uniforms.curl,l.CURL),T.uniforms.dt&&t.uniform1f(T.uniforms.dt,e),x(u.write),u.swap(),O.bind(),O.uniforms.texelSize&&t.uniform2f(O.uniforms.texelSize,u.texelSizeX,u.texelSizeY),O.uniforms.uVelocity&&t.uniform1i(O.uniforms.uVelocity,u.read.attach(0)),x(K),N.bind(),N.uniforms.uTexture&&t.uniform1i(N.uniforms.uTexture,F.read.attach(0)),N.uniforms.value&&t.uniform1f(N.uniforms.value,l.PRESSURE),x(F.write),F.swap(),U.bind(),U.uniforms.texelSize&&t.uniform2f(U.uniforms.texelSize,u.texelSizeX,u.texelSizeY),U.uniforms.uDivergence&&t.uniform1i(U.uniforms.uDivergence,K.attach(0));for(let r=0;r<l.PRESSURE_ITERATIONS;r++)U.uniforms.uPressure&&t.uniform1i(U.uniforms.uPressure,F.read.attach(1)),x(F.write),F.swap();P.bind(),P.uniforms.texelSize&&t.uniform2f(P.uniforms.texelSize,u.texelSizeX,u.texelSizeY),P.uniforms.uPressure&&t.uniform1i(P.uniforms.uPressure,F.read.attach(0)),P.uniforms.uVelocity&&t.uniform1i(P.uniforms.uVelocity,u.read.attach(1)),x(u.write),u.swap(),c.bind(),c.uniforms.texelSize&&t.uniform2f(c.uniforms.texelSize,u.texelSizeX,u.texelSizeY),!S.supportLinearFiltering&&c.uniforms.dyeTexelSize&&t.uniform2f(c.uniforms.dyeTexelSize,u.texelSizeX,u.texelSizeY);const i=u.read.attach(0);c.uniforms.uVelocity&&t.uniform1i(c.uniforms.uVelocity,i),c.uniforms.uSource&&t.uniform1i(c.uniforms.uSource,i),c.uniforms.dt&&t.uniform1f(c.uniforms.dt,e),c.uniforms.dissipation&&t.uniform1f(c.uniforms.dissipation,l.VELOCITY_DISSIPATION),x(u.write),u.swap(),!S.supportLinearFiltering&&c.uniforms.dyeTexelSize&&t.uniform2f(c.uniforms.dyeTexelSize,h.texelSizeX,h.texelSizeY),c.uniforms.uVelocity&&t.uniform1i(c.uniforms.uVelocity,u.read.attach(0)),c.uniforms.uSource&&t.uniform1i(c.uniforms.uSource,h.read.attach(1)),c.uniforms.dissipation&&t.uniform1f(c.uniforms.dissipation,l.DENSITY_DISSIPATION),x(h.write),h.swap()}function Ze(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),et(e)}function et(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight;C.bind(),l.SHADING&&C.uniforms.texelSize&&t.uniform2f(C.uniforms.texelSize,1/i,1/r),C.uniforms.uTexture&&t.uniform1i(C.uniforms.uTexture,h.read.attach(0)),x(e,!1)}function tt(e){const i=e.deltaX*l.SPLAT_FORCE,r=e.deltaY*l.SPLAT_FORCE;ge(e.texcoordX,e.texcoordY,i,r,e.color)}function rt(e){const i=j(),r=1.6;i.r*=r,i.g*=r,i.b*=r,ft(i);const o=6*(Math.random()-.5),n=14*(Math.random()-.5);ge(e.texcoordX,e.texcoordY,o,n,i,.35)}function ge(e,i,r,o,n,a=1){m.bind(),m.uniforms.uTarget&&t.uniform1i(m.uniforms.uTarget,u.read.attach(0)),m.uniforms.aspectRatio&&t.uniform1f(m.uniforms.aspectRatio,f.width/f.height),m.uniforms.point&&t.uniform2f(m.uniforms.point,e,i),m.uniforms.color&&t.uniform3f(m.uniforms.color,r,o,0),m.uniforms.radius&&t.uniform1f(m.uniforms.radius,it(l.SPLAT_RADIUS*a/100)),x(u.write),u.swap(),m.uniforms.uTarget&&t.uniform1i(m.uniforms.uTarget,h.read.attach(0)),m.uniforms.color&&t.uniform3f(m.uniforms.color,n.r,n.g,n.b),x(h.write),h.swap()}function it(e){const i=f.width/f.height;return i>1&&(e*=i),e}function ee(e,i,r,o){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/f.width,e.texcoordY=1-o/f.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=j()}function te(e,i,r,o){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/f.width,e.texcoordY=1-r/f.height,e.deltaX=nt(e.texcoordX-e.prevTexcoordX),e.deltaY=at(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=o}function ot(e){e.down=!1}function nt(e){const i=f.width/f.height;return i<1&&(e*=i),e}function at(e){const i=f.width/f.height;return i>1&&(e/=i),e}function j(){const e=[{color:{r:.35,g:.55,b:1},weight:5},{color:{r:.75,g:.35,b:.98},weight:4},{color:{r:.2,g:.9,b:.95},weight:2},{color:{r:1,g:.45,b:.7},weight:1},{color:{r:1,g:.82,b:.4},weight:1},{color:{r:.58,g:.52,b:.92},weight:1}],i=e.reduce((o,n)=>o+n.weight,0);let r=Math.random()*i;for(const o of e)if(r-=o.weight,r<=0)return o.color;return e[0].color}function ut(e,i,r){const o=r-i;return(e-i)%o+i}const st=16;let Te=0;const Ee=e=>((...i)=>{const r=performance.now();r-Te<st||(Te=r,e(...i))}),Re=e=>{const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1);ee(i,-1,r,o),rt(i)};function re(e){const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1),n=j();Z(),te(i,r,o,n),document.body.removeEventListener("mousemove",re)}document.body.addEventListener("mousemove",re);const pe=Ee(e=>{const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1),n=i.color;te(i,r,o,n)});function ie(e){const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);Z(),ee(r,i[o].identifier,n,a)}document.body.removeEventListener("touchstart",ie)}document.body.addEventListener("touchstart",ie);const Se=e=>{const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);ee(r,i[o].identifier,n,a)}},De=Ee(e=>{const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);te(r,n,a,r.color)}}),ye=e=>{const i=e.changedTouches,r=w[0];for(let o=0;o<i.length;o++)ot(r)};return window.addEventListener("mousedown",Re),window.addEventListener("mousemove",pe),window.addEventListener("touchstart",Se,!1),window.addEventListener("touchmove",De,!1),window.addEventListener("touchend",ye),document.addEventListener("visibilitychange",xe),()=>{_&&cancelAnimationFrame(_),window.removeEventListener("mousedown",Re),window.removeEventListener("mousemove",pe),window.removeEventListener("touchstart",Se),window.removeEventListener("touchmove",De),window.removeEventListener("touchend",ye),document.removeEventListener("visibilitychange",xe),document.body.removeEventListener("mousemove",re),document.body.removeEventListener("touchstart",ie)}},[v,k,y,R,p,I,M,V,H,L,ne,ae,_e,be]),ue)return null;const Le=["fixed inset-0 pointer-events-none cursor-none",Fe].filter(Boolean).join(" ");return oe.jsx("div",{className:Le,children:oe.jsx("canvas",{ref:se,id:"fluid",className:"w-full h-full block"})})}function gt(v){return v.disabled?null:oe.jsx(lt,{...v,simulationResolution:Math.min(v.simulationResolution??128,128),dyeResolution:Math.min(v.dyeResolution??1024,1024)})}export{gt as default};
