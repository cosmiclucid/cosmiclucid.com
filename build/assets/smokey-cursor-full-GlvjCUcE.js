import{r as De,j as ie,u as at}from"./index-CLcXB_Co.js";function ut(){return{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:{r:0,g:0,b:0}}}const X={r:.6,g:.32,b:1.05};function st(m){let g=m.r*.6599999999999999+X.r*.34,T=m.g*(1-.34)+X.g*.34,h=m.b*(1-.34)+X.b*.34;const I=1.08,M=Math.max(g,T,h);if(M>I){const F=I/M;g*=F,T*=F,h*=F}const V=Math.max(g,T,h),H=Math.min(g,T,h);V-H<.18&&(g+=(X.r-g)*.28,T+=(X.g-T)*.28,h+=(X.b-h)*.28),m.r=g,m.g=T,m.b=h}function ct({simulationResolution:m=128,dyeResolution:z=1440,captureResolution:g=512,densityDissipation:T=3.5,velocityDissipation:h=2,pressure:I=.1,pressureIterations:M=20,curl:V=3,splatRadius:H=.2,splatForce:F=6e3,enableShading:oe=!0,colorUpdateSpeed:ne=10,backgroundColor:ye={r:.5,g:0,b:0},transparent:we=!0,className:_e="",disabled:ae=!1,intensity:ft=1,followMouse:lt=!0,autoColors:vt=!0}){const ue=De.useRef(null);if(De.useEffect(()=>{if(ae)return;const f=ue.current;if(!f)return;let w=[ut()],l={SIM_RESOLUTION:m,DYE_RESOLUTION:z,DENSITY_DISSIPATION:T,VELOCITY_DISSIPATION:h,PRESSURE:I,PRESSURE_ITERATIONS:M,CURL:V,SPLAT_RADIUS:H,SPLAT_FORCE:F,SHADING:oe,COLOR_UPDATE_SPEED:ne};const{gl:t,ext:D}=Ae(f);if(!t||!D)return;D.supportLinearFiltering||(l.DYE_RESOLUTION=256,l.SHADING=!1);function Ae(e){const i={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let r=e.getContext("webgl2",i);if(r||(r=e.getContext("webgl",i)||e.getContext("experimental-webgl",i)),!r)throw new Error("Unable to initialize WebGL.");const o="drawBuffers"in r;let n=!1,a=null;o?(r.getExtension("EXT_color_buffer_float"),n=!!r.getExtension("OES_texture_float_linear")):(a=r.getExtension("OES_texture_half_float"),n=!!r.getExtension("OES_texture_half_float_linear")),r.clearColor(0,0,0,1);const s=o?r.HALF_FLOAT:a&&a.HALF_FLOAT_OES||0;let S,P,G;return o?(S=b(r,r.RGBA16F,r.RGBA,s),P=b(r,r.RG16F,r.RG,s),G=b(r,r.R16F,r.RED,s)):(S=b(r,r.RGBA,r.RGBA,s),P=b(r,r.RGBA,r.RGBA,s),G=b(r,r.RGBA,r.RGBA,s)),{gl:r,ext:{formatRGBA:S,formatRG:P,formatR:G,halfFloatTexType:s,supportLinearFiltering:n}}}function b(e,i,r,o){if(!Fe(e,i,r,o)){if("drawBuffers"in e){const n=e;switch(i){case n.R16F:return b(n,n.RG16F,n.RG,o);case n.RG16F:return b(n,n.RGBA16F,n.RGBA,o);default:return null}}return null}return{internalFormat:i,format:r}}function Fe(e,i,r,o){const n=e.createTexture();if(!n)return!1;e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,4,4,0,r,o,null);const a=e.createFramebuffer();return a?(e.bindFramebuffer(e.FRAMEBUFFER,a),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE):!1}function Le(e){if(!e.length)return 0;let i=0;for(let r=0;r<e.length;r++)i=(i<<5)-i+e.charCodeAt(r),i|=0;return i}function Ue(e,i){if(!i)return e;let r="";for(const o of i)r+=`#define ${o}
`;return r+e}function R(e,i,r=null){const o=Ue(i,r),n=t.createShader(e);return n?(t.shaderSource(n,o),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)||console.trace(t.getShaderInfoLog(n)),n):null}function se(e,i){if(!e||!i)return null;const r=t.createProgram();return r?(t.attachShader(r,e),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)||console.trace(t.getProgramInfoLog(r)),r):null}function ce(e){let i={};const r=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<r;o++){const n=t.getActiveUniform(e,o);n&&(i[n.name]=t.getUniformLocation(e,n.name))}return i}class _{program;uniforms;constructor(i,r){this.program=se(i,r),this.uniforms=this.program?ce(this.program):{}}bind(){this.program&&t.useProgram(this.program)}}class Pe{vertexShader;fragmentShaderSource;programs;activeProgram;uniforms;constructor(i,r){this.vertexShader=i,this.fragmentShaderSource=r,this.programs={},this.activeProgram=null,this.uniforms={}}setKeywords(i){let r=0;for(const n of i)r+=Le(n);let o=this.programs[r];if(o==null){const n=R(t.FRAGMENT_SHADER,this.fragmentShaderSource,i);o=se(this.vertexShader,n),this.programs[r]=o}o!==this.activeProgram&&(o&&(this.uniforms=ce(o)),this.activeProgram=o)}bind(){this.activeProgram&&t.useProgram(this.activeProgram)}}const y=R(t.VERTEX_SHADER,`
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
    `),Be=R(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `),Ce=R(t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),Xe=`
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
    `,ze=R(t.FRAGMENT_SHADER,`
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
    `),Ie=R(t.FRAGMENT_SHADER,`
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
    `,D.supportLinearFiltering?null:["MANUAL_FILTERING"]),Me=R(t.FRAGMENT_SHADER,`
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
    `),Ne=R(t.FRAGMENT_SHADER,`
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
    `),Oe=R(t.FRAGMENT_SHADER,`
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
    `),Ye=R(t.FRAGMENT_SHADER,`
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
    `),Ge=R(t.FRAGMENT_SHADER,`
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
    `),E=(()=>{const e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW);const i=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(0),(r,o=!1)=>{t&&(r?(t.viewport(0,0,r.width,r.height),t.bindFramebuffer(t.FRAMEBUFFER,r.fbo)):(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)),o&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0))}})();let x,u,k,K,A;const q=new _(y,Be),N=new _(y,Ce),v=new _(y,ze),c=new _(y,Ie),O=new _(y,Me),Y=new _(y,Ne),p=new _(y,Oe),L=new _(y,Ye),U=new _(y,Ge),B=new Pe(y,Xe);function C(e,i,r,o,n,a){t.activeTexture(t.TEXTURE0);const s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,e,i,0,o,n,null);const S=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,S),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,s,0),t.viewport(0,0,e,i),t.clear(t.COLOR_BUFFER_BIT);const P=1/e,G=1/i;return{texture:s,fbo:S,width:e,height:i,texelSizeX:P,texelSizeY:G,attach(Se){return t.activeTexture(t.TEXTURE0+Se),t.bindTexture(t.TEXTURE_2D,s),Se}}}function $(e,i,r,o,n,a){const s=C(e,i,r,o,n,a),S=C(e,i,r,o,n,a);return{width:e,height:i,texelSizeX:s.texelSizeX,texelSizeY:s.texelSizeY,read:s,write:S,swap(){const P=this.read;this.read=this.write,this.write=P}}}function Ve(e,i,r,o,n,a,s){const S=C(i,r,o,n,a,s);return q.bind(),q.uniforms.uTexture&&t.uniform1i(q.uniforms.uTexture,e.attach(0)),E(S,!1),S}function fe(e,i,r,o,n,a,s){return e.width===i&&e.height===r||(e.read=Ve(e.read,i,r,o,n,a,s),e.write=C(i,r,o,n,a,s),e.width=i,e.height=r,e.texelSizeX=1/i,e.texelSizeY=1/r),e}function le(){const e=ve(l.SIM_RESOLUTION),i=ve(l.DYE_RESOLUTION),r=D.halfFloatTexType,o=D.formatRGBA,n=D.formatRG,a=D.formatR,s=D.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),x?x=fe(x,i.width,i.height,o.internalFormat,o.format,r,s):x=$(i.width,i.height,o.internalFormat,o.format,r,s),u?u=fe(u,e.width,e.height,n.internalFormat,n.format,r,s):u=$(e.width,e.height,n.internalFormat,n.format,r,s),k=C(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),K=C(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST),A=$(e.width,e.height,a.internalFormat,a.format,r,t.NEAREST)}function He(){const e=[];l.SHADING&&e.push("SHADING"),B.setKeywords(e)}function ve(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight,o=i/r;let n=o<1?1/o:o;const a=Math.round(e),s=Math.round(e*n);return i>r?{width:s,height:a}:{width:a,height:s}}function d(e,i=!0){const r=window.devicePixelRatio||1,o=e*r;return i?Math.floor(o):o}He(),le();let me=Date.now(),W=0,J=null;function Q(){const e=We();je()&&le(),ke(e),Ke(),qe(e),$e(null),J=requestAnimationFrame(Q)}function We(){const e=Date.now();let i=(e-me)/1e3;return i=Math.min(i,.016666),me=e,i}function je(){const e=d(f.clientWidth),i=d(f.clientHeight);return f.width!==e||f.height!==i?(f.width=e,f.height=i,!0):!1}function ke(e){W+=e*l.COLOR_UPDATE_SPEED,W>=1&&(W=ot(W,0,1),w.forEach(i=>{i.color=j()}))}function Ke(){for(const e of w)e.moved&&(e.moved=!1,Qe(e))}function qe(e){t.disable(t.BLEND),Y.bind(),Y.uniforms.texelSize&&t.uniform2f(Y.uniforms.texelSize,u.texelSizeX,u.texelSizeY),Y.uniforms.uVelocity&&t.uniform1i(Y.uniforms.uVelocity,u.read.attach(0)),E(K),p.bind(),p.uniforms.texelSize&&t.uniform2f(p.uniforms.texelSize,u.texelSizeX,u.texelSizeY),p.uniforms.uVelocity&&t.uniform1i(p.uniforms.uVelocity,u.read.attach(0)),p.uniforms.uCurl&&t.uniform1i(p.uniforms.uCurl,K.attach(1)),p.uniforms.curl&&t.uniform1f(p.uniforms.curl,l.CURL),p.uniforms.dt&&t.uniform1f(p.uniforms.dt,e),E(u.write),u.swap(),O.bind(),O.uniforms.texelSize&&t.uniform2f(O.uniforms.texelSize,u.texelSizeX,u.texelSizeY),O.uniforms.uVelocity&&t.uniform1i(O.uniforms.uVelocity,u.read.attach(0)),E(k),N.bind(),N.uniforms.uTexture&&t.uniform1i(N.uniforms.uTexture,A.read.attach(0)),N.uniforms.value&&t.uniform1f(N.uniforms.value,l.PRESSURE),E(A.write),A.swap(),L.bind(),L.uniforms.texelSize&&t.uniform2f(L.uniforms.texelSize,u.texelSizeX,u.texelSizeY),L.uniforms.uDivergence&&t.uniform1i(L.uniforms.uDivergence,k.attach(0));for(let r=0;r<l.PRESSURE_ITERATIONS;r++)L.uniforms.uPressure&&t.uniform1i(L.uniforms.uPressure,A.read.attach(1)),E(A.write),A.swap();U.bind(),U.uniforms.texelSize&&t.uniform2f(U.uniforms.texelSize,u.texelSizeX,u.texelSizeY),U.uniforms.uPressure&&t.uniform1i(U.uniforms.uPressure,A.read.attach(0)),U.uniforms.uVelocity&&t.uniform1i(U.uniforms.uVelocity,u.read.attach(1)),E(u.write),u.swap(),c.bind(),c.uniforms.texelSize&&t.uniform2f(c.uniforms.texelSize,u.texelSizeX,u.texelSizeY),!D.supportLinearFiltering&&c.uniforms.dyeTexelSize&&t.uniform2f(c.uniforms.dyeTexelSize,u.texelSizeX,u.texelSizeY);const i=u.read.attach(0);c.uniforms.uVelocity&&t.uniform1i(c.uniforms.uVelocity,i),c.uniforms.uSource&&t.uniform1i(c.uniforms.uSource,i),c.uniforms.dt&&t.uniform1f(c.uniforms.dt,e),c.uniforms.dissipation&&t.uniform1f(c.uniforms.dissipation,l.VELOCITY_DISSIPATION),E(u.write),u.swap(),!D.supportLinearFiltering&&c.uniforms.dyeTexelSize&&t.uniform2f(c.uniforms.dyeTexelSize,x.texelSizeX,x.texelSizeY),c.uniforms.uVelocity&&t.uniform1i(c.uniforms.uVelocity,u.read.attach(0)),c.uniforms.uSource&&t.uniform1i(c.uniforms.uSource,x.read.attach(1)),c.uniforms.dissipation&&t.uniform1f(c.uniforms.dissipation,l.DENSITY_DISSIPATION),E(x.write),x.swap()}function $e(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),Je(e)}function Je(e){const i=t.drawingBufferWidth,r=t.drawingBufferHeight;B.bind(),l.SHADING&&B.uniforms.texelSize&&t.uniform2f(B.uniforms.texelSize,1/i,1/r),B.uniforms.uTexture&&t.uniform1i(B.uniforms.uTexture,x.read.attach(0)),E(e,!1)}function Qe(e){const i=e.deltaX*l.SPLAT_FORCE,r=e.deltaY*l.SPLAT_FORCE;de(e.texcoordX,e.texcoordY,i,r,e.color)}function Ze(e){const i=j(),r=1.6;i.r*=r,i.g*=r,i.b*=r,st(i);const o=6*(Math.random()-.5),n=14*(Math.random()-.5);de(e.texcoordX,e.texcoordY,o,n,i,.35)}function de(e,i,r,o,n,a=1){v.bind(),v.uniforms.uTarget&&t.uniform1i(v.uniforms.uTarget,u.read.attach(0)),v.uniforms.aspectRatio&&t.uniform1f(v.uniforms.aspectRatio,f.width/f.height),v.uniforms.point&&t.uniform2f(v.uniforms.point,e,i),v.uniforms.color&&t.uniform3f(v.uniforms.color,r,o,0),v.uniforms.radius&&t.uniform1f(v.uniforms.radius,et(l.SPLAT_RADIUS*a/100)),E(u.write),u.swap(),v.uniforms.uTarget&&t.uniform1i(v.uniforms.uTarget,x.read.attach(0)),v.uniforms.color&&t.uniform3f(v.uniforms.color,n.r,n.g,n.b),E(x.write),x.swap()}function et(e){const i=f.width/f.height;return i>1&&(e*=i),e}function Z(e,i,r,o){e.id=i,e.down=!0,e.moved=!1,e.texcoordX=r/f.width,e.texcoordY=1-o/f.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=j()}function ee(e,i,r,o){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=i/f.width,e.texcoordY=1-r/f.height,e.deltaX=rt(e.texcoordX-e.prevTexcoordX),e.deltaY=it(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=o}function tt(e){e.down=!1}function rt(e){const i=f.width/f.height;return i<1&&(e*=i),e}function it(e){const i=f.width/f.height;return i>1&&(e/=i),e}function j(){const e=[{color:{r:.35,g:.55,b:1},weight:5},{color:{r:.75,g:.35,b:.98},weight:4},{color:{r:.2,g:.9,b:.95},weight:2},{color:{r:1,g:.45,b:.7},weight:1},{color:{r:1,g:.82,b:.4},weight:1},{color:{r:.58,g:.52,b:.92},weight:1}],i=e.reduce((o,n)=>o+n.weight,0);let r=Math.random()*i;for(const o of e)if(r-=o.weight,r<=0)return o.color;return e[0].color}function ot(e,i,r){const o=r-i;return(e-i)%o+i}const nt=16;let he=0;const xe=e=>((...i)=>{const r=performance.now();r-he<nt||(he=r,e(...i))}),ge=e=>{const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1);Z(i,-1,r,o),Ze(i)};function te(e){const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1),n=j();Q(),ee(i,r,o,n),document.body.removeEventListener("mousemove",te)}document.body.addEventListener("mousemove",te);const Te=xe(e=>{const i=w[0],r=d(e.clientX,!1),o=d(e.clientY,!1),n=i.color;ee(i,r,o,n)});function re(e){const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);Q(),Z(r,i[o].identifier,n,a)}document.body.removeEventListener("touchstart",re)}document.body.addEventListener("touchstart",re);const Ee=e=>{const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);Z(r,i[o].identifier,n,a)}},Re=xe(e=>{const i=e.targetTouches,r=w[0];for(let o=0;o<i.length;o++){const n=d(i[o].clientX,!1),a=d(i[o].clientY,!1);ee(r,n,a,r.color)}}),pe=e=>{const i=e.changedTouches,r=w[0];for(let o=0;o<i.length;o++)tt(r)};return window.addEventListener("mousedown",ge),window.addEventListener("mousemove",Te),window.addEventListener("touchstart",Ee,!1),window.addEventListener("touchmove",Re,!1),window.addEventListener("touchend",pe),()=>{J&&cancelAnimationFrame(J),window.removeEventListener("mousedown",ge),window.removeEventListener("mousemove",Te),window.removeEventListener("touchstart",Ee),window.removeEventListener("touchmove",Re),window.removeEventListener("touchend",pe),document.body.removeEventListener("mousemove",te),document.body.removeEventListener("touchstart",re)}},[m,z,g,T,h,I,M,V,H,F,oe,ne,ye,we]),ae)return null;const be=["fixed inset-0 pointer-events-none cursor-none",_e].filter(Boolean).join(" ");return ie.jsx("div",{className:be,children:ie.jsx("canvas",{ref:ue,id:"fluid",className:"w-full h-full block"})})}function ht(m){const{isMobile:z,isSmallScreen:g,prefersReducedMotion:T}=at(),h=T||z||m.disabled;return h?null:ie.jsx(ct,{...m,simulationResolution:Math.min(m.simulationResolution??128,g?64:128),dyeResolution:Math.min(m.dyeResolution??1440,g?720:1024),disabled:h})}export{ht as default};
