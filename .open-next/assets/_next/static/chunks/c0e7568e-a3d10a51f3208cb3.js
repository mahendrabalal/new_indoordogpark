"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6654],{68686:(e,t,o)=>{let r,n;o.d(t,{$n:()=>tg,$w:()=>oe,A3:()=>z,AM:()=>oN,B3:()=>y,BJ:()=>oD,CA:()=>e6,Cy:()=>tF,D0:()=>H,DP:()=>Y,DZ:()=>tG,Dr:()=>rE,EY:()=>tn,EZ:()=>t7,Ex:()=>ta,GB:()=>L,GD:()=>og,GE:()=>te,GG:()=>V,JU:()=>eU,M4:()=>X,Ml:()=>$,NP:()=>D,Nj:()=>rj,PR:()=>tw,Pm:()=>tj,Q3:()=>W,QY:()=>A,Qx:()=>x,Sc:()=>tH,U1:()=>T,W1:()=>rS,WE:()=>N,WP:()=>oh,Wd:()=>os,XS:()=>on,Xy:()=>tE,Z4:()=>od,ZL:()=>om,Zp:()=>tv,aY:()=>tC,az:()=>to,bz:()=>B,cF:()=>tS,cV:()=>tX,cZ:()=>G,dO:()=>oq,dU:()=>ot,eu:()=>e3,fs:()=>o0,g5:()=>tf,gK:()=>eV,jt:()=>tN,ks:()=>rr,l6:()=>oO,l_:()=>eD,m_:()=>rh,mc:()=>tB,nY:()=>E,oz:()=>r_,q4:()=>_,qW:()=>rb,rX:()=>rC,sU:()=>k,sb:()=>C,so:()=>tl,sx:()=>oW,u4:()=>t8,vE:()=>rf,wb:()=>rW,wj:()=>ok,xA:()=>tD,y$:()=>tu,zd:()=>R});var i=o(57502),a=o(95155),d=o(84100),l=o(12115),c=o(76942),s=o(58152),u=o(25050),f=o(67785),p=o(47226),h=o(9683),m=o(9673),g=o(80642),b=o(19144),v=o(47650),w=o(87953);let y=i.B3,x=(0,i.me)(),$=[],k={},S={initial:{scale:.97,willChange:"transform"},hidden:{opacity:0},visible:{opacity:1,transition:{when:"beforeChildren",duration:.1}},scaleIn:{scale:1},scaleOut:{scale:.97}},j={hidden:{opacity:0},visible:{opacity:1}},I={type:"spring",visualDuration:.2,bounce:.25};function R(e){return E(e)||N(e)}function C(e){return e instanceof Node&&e.nodeType===Node.ELEMENT_NODE}function E(e){return C(e)&&"A"===e.nodeName}function z(e){return C(e)&&"INPUT"===e.nodeName}function N(e){return C(e)&&"BUTTON"===e.nodeName}function _(e){return C(e)&&"SELECT"===e.nodeName}function A(e){return C(e)&&"TEXTAREA"===e.nodeName}function W(e,t){return e.contains(t)||e===t}function H(e){return 0===e?0:`${e/16}rem`}function T(e,t,o){return(t?.map(o)||[]).map((t,o)=>0===o?t:{[`@media screen and (min-width: ${e[o-1]}px)`]:t})}function L(e,t){return void 0===e?t||$:Array.isArray(e)?e:[e]}function M(e,t,o=$){if(!Array.isArray(o))throw Error("the property must be array of numbers");if(0===o.length)return null;let{media:r,space:n}=(0,i.JW)(e);return T(r,o,e=>{var o;return o=H(n[e]),t.reduce((e,t)=>(e[t]=o,e),{})})}function F(e,t){let{$size:o,$weight:r}=t,{font:n,media:a}=(0,i.JW)(t.theme),{family:d,sizes:l,weights:c}=n[e],s=r&&c[r]||c.regular,u=l[2],f={position:"relative",fontFamily:d,fontWeight:`${s}`,padding:"1px 0",margin:0,"&:before":{content:'""',display:"block",height:0},"&:after":{content:'""',display:"block",height:0},"& > code, & > span":{display:"block"},"&:not([hidden])":{display:"block"}};return o?[f,...T(a,o,e=>(function(e){let{ascenderHeight:t,descenderHeight:o,fontSize:r,iconSize:n,letterSpacing:i,lineHeight:a}=e,d=t+o,l=a-d,c=2*Math.floor(1.125*r/2)+1;return{fontSize:H(r),lineHeight:`calc(${a} / ${r})`,letterSpacing:H(i),transform:`translateY(${H(o)})`,"&:before":{marginTop:`calc(${H(0-d)} - 1px)`},"&:after":{marginBottom:"-1px"},"& svg:not([data-sanity-icon])":{fontSize:`calc(${c} / 16 * 1rem)`,margin:H((l-c)/2)},"& [data-sanity-icon]":{fontSize:`calc(${n} / 16 * 1rem)`,margin:H((l-n)/2)}}})(l[e]||u))]:(F.warned||(console.warn("No size specified for responsive font",{fontKey:e,$size:o,props:t,base:f}),F.warned=!0),[f])}function J(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$align,e=>({textAlign:e}))}let O=function(){if("u">typeof globalThis)return globalThis;if("u">typeof window)return window;if("u">typeof self)return self;if("u">typeof global)return global;throw Error("@sanity/ui: could not locate global scope")}();function B(e,t){let o=Symbol.for(e);if(typeof document>"u"){let o=(0,l.createContext)(t);return o.displayName=e,o}return O[o]=O[o]||(0,l.createContext)(t),O[o]}let P=B("@sanity/ui/context/theme",null);function D(e){let t,o,r,n,s=(0,d.c)(15),u=(0,l.useContext)(P),{children:f}=e,p=e.scheme??(u?.scheme||"light"),h=e.theme??(u?.theme||null),m=e.tone??(u?.tone||"default");e:{let e;if(!h){t=null;break e}s[0]!==h||s[1]!==p||s[2]!==m?(e={version:0,theme:h,scheme:p,tone:m},s[0]=h,s[1]=p,s[2]=m,s[3]=e):e=s[3],t=e}let g=t;t:{let e;if(!h){o=null;break t}s[4]!==h||s[5]!==p||s[6]!==m?(e=(0,i.sR)(h,p,m),s[4]=h,s[5]=p,s[6]=m,s[7]=e):e=s[7],o=e}let b=o;if(!b){let e;return s[8]===Symbol.for("react.memo_cache_sentinel")?(e=(0,a.jsx)("pre",{children:'ThemeProvider: no "theme" property provided'}),s[8]=e):e=s[8],e}return s[9]!==f||s[10]!==b?(r=(0,a.jsx)(c.NP,{theme:b,children:f}),s[9]=f,s[10]=b,s[11]=r):r=s[11],s[12]!==r||s[13]!==g?(n=(0,a.jsx)(P.Provider,{value:g,children:r}),s[12]=r,s[13]=g,s[14]=n):n=s[14],n}function V(){let e=(0,l.useContext)(P);if(!e)throw Error("useRootTheme(): missing context value");return e}function G(e){let t,o=(0,d.c)(5),{children:r,scheme:n,tone:i}=e,l=V(),c=n||l.scheme;return o[0]!==r||o[1]!==l.theme||o[2]!==c||o[3]!==i?(t=(0,a.jsx)(D,{scheme:c,theme:l.theme,tone:i,children:r}),o[0]=r,o[1]=l.theme,o[2]=c,o[3]=i,o[4]=t):t=o[4],t}function Y(){return(0,c.DP)()}function X(){let e,t=(0,d.c)(2),o=(0,c.DP)();return t[0]!==o?(e=(0,i.JW)(o),t[0]=o,t[1]=e):e=t[1],e}function U(e){let{card:t,media:o}=(0,i.JW)(e.theme),r=`${t.border?.width??1}px solid var(--card-border-color)`;return T(o,e.$border,e=>e?{"&&":{border:r}}:{"&&":{border:0}})}function q(e){let{card:t,media:o}=(0,i.JW)(e.theme),r=`${t.border?.width??1}px solid var(--card-border-color)`;return T(o,e.$borderTop,e=>e?{"&&":{borderTop:r}}:{"&&":{borderTop:0}})}function K(e){let{card:t,media:o}=(0,i.JW)(e.theme),r=`${t.border?.width??1}px solid var(--card-border-color)`;return T(o,e.$borderRight,e=>e?{"&&":{borderRight:r}}:{"&&":{borderRight:0}})}function Z(e){let{card:t,media:o}=(0,i.JW)(e.theme),r=`${t.border?.width??1}px solid var(--card-border-color)`;return T(o,e.$borderBottom,e=>e?{"&&":{borderBottom:r}}:{"&&":{borderBottom:0}})}function Q(e){let{card:t,media:o}=(0,i.JW)(e.theme),r=`${t.border?.width??1}px solid var(--card-border-color)`;return T(o,e.$borderLeft,e=>e?{"&&":{borderLeft:r}}:{"&&":{borderLeft:0}})}D.displayName="ThemeProvider",G.displayName="ThemeColorProvider";let ee={'&[data-as="ul"],&[data-as="ol"]':{listStyle:"none"}},et={content:"content-box",border:"border-box"},eo={stretch:"stretch",fill:"100%"};function er(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$display,e=>({"&:not([hidden])":{display:e}}))}function en(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$sizing,e=>({boxSizing:et[e]}))}function ei(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$height,e=>({height:eo[e]}))}function ea(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$overflow,e=>({overflow:e}))}let ed={minWidth:0,minHeight:0};function el(){return[ed,ec]}function ec(e){let{media:t}=(0,i.JW)(e.theme);return e.$flex?T(t,e.$flex,e=>({flex:`${e}`})):$}let es={"&&:not([hidden])":{display:"flex"}};function eu(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$align,e=>({alignItems:e}))}function ef(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$gap,e=>({gap:e?H(o[e]):void 0}))}function ep(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$wrap,e=>({flexWrap:e}))}function eh(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$justify,e=>({justifyContent:e}))}function em(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$direction,e=>({flexDirection:e}))}function eg(e){return`inset 0 0 0 ${e.width}px ${e.color}`}function eb(e){let{base:t,border:o,focusRing:r}=e,n=r.offset+r.width,i=0-r.offset,a=t?t.bg:"var(--card-bg-color)";return[i>0&&`inset 0 0 0 ${i}px var(--card-focus-ring-color)`,o&&eg(o),i<0&&`0 0 0 ${0-i}px ${a}`,n>0&&`0 0 0 ${n}px var(--card-focus-ring-color)`].filter(Boolean).join(",")}let ev={auto:"auto",full:"1 / -1"},ew={auto:"auto",full:"1 / -1"};function ey(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$row,e=>"number"==typeof e?{gridRow:`span ${e} / span ${e}`}:{gridRow:ev[e]})}function ex(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$rowStart,e=>({gridRowStart:`${e}`}))}function e$(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$rowEnd,e=>({gridRowEnd:`${e}`}))}function ek(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$column,e=>"number"==typeof e?{gridColumn:`span ${e} / span ${e}`}:{gridColumn:ew[e]})}function eS(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$columnStart,e=>({gridColumnStart:`${e}`}))}function ej(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$columnEnd,e=>({gridColumnEnd:`${e}`}))}let eI={"&&:not([hidden])":{display:"grid"},'&[data-as="ul"],&[data-as="ol"]':{listStyle:"none"}},eR={auto:"auto",min:"min-content",max:"max-content",fr:"minmax(0, 1fr)"},eC={auto:"auto",min:"min-content",max:"max-content",fr:"minmax(0, 1fr)"};function eE(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$autoFlow,e=>({gridAutoFlow:e}))}function ez(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$autoRows,e=>({gridAutoRows:e&&eC[e]}))}function eN(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$autoCols,e=>({gridAutoColumns:e&&eR[e]}))}function e_(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$columns,e=>({gridTemplateColumns:e&&`repeat(${e},minmax(0,1fr));`}))}function eA(e){let{media:t}=(0,i.JW)(e.theme);return T(t,e.$rows,e=>({gridTemplateRows:e&&`repeat(${e},minmax(0,1fr));`}))}function eW(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$gap,e=>({gridGap:e?H(o[e]):void 0}))}function eH(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$gapX,e=>({columnGap:e?H(o[e]):void 0}))}function eT(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$gapY,e=>({rowGap:e?H(o[e]):void 0}))}function eL(e){let{$fontSize:t,$iconLeft:o,$iconRight:r,$padding:n,$space:a}=e,{font:d,media:l,space:c}=(0,i.JW)(e.theme),s=Math.max(n.length,a.length,t.length),u=[],f=[],p=[];for(let e=0;e<s;e+=1)p[e]=void 0===t[e]?p[e-1]:t[e],u[e]=void 0===n[e]?u[e-1]:n[e],f[e]=void 0===a[e]?f[e-1]:a[e];return T(l,u,(e,t)=>{let n=d.text.sizes[p[t]]||d.text.sizes[2],i=n.lineHeight-n.ascenderHeight-n.descenderHeight,a=c[u[t]],l=c[f[t]],s={paddingTop:H(a-n.ascenderHeight),paddingRight:H(a),paddingBottom:H(a-n.descenderHeight),paddingLeft:H(a)};return r&&(s.paddingRight=H(a+i+l)),o&&(s.paddingLeft=H(a+i+l)),s})}function eM(e){return eL({...e,$iconRight:!0})}let eF=(0,c.AH)`
  &:not([hidden]) {
    display: flex;
  }

  align-items: center;
`;function eJ(){return eF}function eO(e){let{$scheme:t,$tone:o,$weight:r}=e,{color:n,font:a}=(0,i.JW)(e.theme);return(0,c.AH)`
    appearance: none;
    background: none;
    border: 0;
    border-radius: 0;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-family: ${a.text.family};
    font-weight: ${r&&a.text.weights[r]||a.text.weights.regular};
    margin: 0;
    position: relative;
    z-index: 1;
    display: block;

    /* NOTE: This is a hack to disable Chrome’s autofill styles */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-text-fill-color: var(--input-fg-color) !important;
      transition: background-color 5000s;
      transition-delay: 86400s /* 24h */;
    }

    /* &:is(textarea) */
    &[data-as='textarea'] {
      resize: none;
    }

    color: var(--input-fg-color);

    &::placeholder {
      color: var(--input-placeholder-color);
    }

    &[data-scheme='${t}'][data-tone='${o}'] {
      --input-fg-color: ${n.input.default.enabled.fg};
      --input-placeholder-color: ${n.input.default.enabled.placeholder};

      /* enabled */
      &:not(:invalid):not(:disabled):not(:read-only) {
        --input-fg-color: ${n.input.default.enabled.fg};
        --input-placeholder-color: ${n.input.default.enabled.placeholder};
      }

      /* disabled */
      &:not(:invalid):disabled {
        --input-fg-color: ${n.input.default.disabled.fg};
        --input-placeholder-color: ${n.input.default.disabled.placeholder};
      }

      /* invalid */
      &:invalid {
        --input-fg-color: ${n.input.invalid.enabled.fg};
        --input-placeholder-color: ${n.input.invalid.enabled.placeholder};
      }

      /* readOnly */
      &:read-only {
        --input-fg-color: ${n.input.default.readOnly.fg};
        --input-placeholder-color: ${n.input.default.readOnly.placeholder};
      }
    }
  `}function eB(e){let{font:t,media:o}=(0,i.JW)(e.theme);return T(o,e.$fontSize,e=>{let o=t.text.sizes[e]||t.text.sizes[2];return{fontSize:H(o.fontSize),lineHeight:`${o.lineHeight/o.fontSize}`}})}function eP(e){let{$hasPrefix:t,$hasSuffix:o,$scheme:r,$tone:n,$unstableDisableFocusRing:a}=e,{color:d,input:l}=(0,i.JW)(e.theme);return(0,c.AH)`
    --input-box-shadow: none;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    pointer-events: none;
    z-index: 0;

    background-color: var(--card-bg-color);
    box-shadow: var(--input-box-shadow);

    border-top-left-radius: ${t?0:void 0};
    border-bottom-left-radius: ${t?0:void 0};
    border-top-right-radius: ${o?0:void 0};
    border-bottom-right-radius: ${o?0:void 0};

    &[data-scheme='${r}'][data-tone='${n}'] {
      --card-bg-color: ${d.input.default.enabled.bg};
      --card-fg-color: ${d.input.default.enabled.fg};

      /* enabled */
      *:not(:disabled) + &[data-border] {
        --input-box-shadow: ${eg({color:d.input.default.enabled.border,width:l.border.width})};
      }

      /* invalid */
      *:not(:disabled):invalid + & {
        --card-bg-color: ${d.input.invalid.enabled.bg};
        --card-fg-color: ${d.input.invalid.enabled.fg};

        &[data-border] {
          --input-box-shadow: ${eg({color:d.input.invalid.enabled.border,width:l.border.width})};
        }
      }

      /* focused */
      *:not(:disabled):focus + & {
        &[data-border] {
          --input-box-shadow: ${a?void 0:eb({border:{color:d.input.default.enabled.border,width:l.border.width},focusRing:l.text.focusRing})};
        }

        &:not([data-border]) {
          --input-box-shadow: ${a?void 0:eb({focusRing:l.text.focusRing})};
        }
      }

      /* disabled */
      *:not(:invalid):disabled + & {
        --card-bg-color: ${d.input.default.disabled.bg} !important;
        --card-fg-color: ${d.input.default.disabled.fg} !important;
        --card-icon-color: ${d.input.default.disabled.fg} !important;

        &[data-border] {
          --input-box-shadow: ${eg({color:d.input.default.disabled.border,width:l.border.width})};
        }
      }

      *:invalid:disabled + & {
        --card-bg-color: ${d.input.invalid.disabled.bg} !important;
        --card-fg-color: ${d.input.invalid.disabled.fg} !important;
        --card-icon-color: ${d.input.invalid.disabled.fg} !important;

        &[data-border] {
          --input-box-shadow: ${eg({color:d.input.invalid.disabled.border,width:l.border.width})};
        }
      }

      /* readOnly */
      *:not(:invalid):read-only + & {
        --card-bg-color: ${d.input.default.readOnly.bg} !important;
        --card-fg-color: ${d.input.default.readOnly.fg} !important;
      }

      *:invalid:read-only + & {
        --card-bg-color: ${d.input.invalid.readOnly.bg} !important;
        --card-fg-color: ${d.input.invalid.readOnly.fg} !important;
      }

      /* hovered */
      @media (hover: hover) {
        *:not(:disabled):not(:read-only):not(:invalid):hover + & {
          --card-bg-color: ${d.input.default.hovered.bg};
          --card-fg-color: ${d.input.default.hovered.fg};
        }

        *:invalid:not(:disabled):not(:read-only):hover + & {
          --card-bg-color: ${d.input.invalid.hovered.bg};
          --card-fg-color: ${d.input.invalid.hovered.fg};
        }

        *:not(:disabled):not(:read-only):not(:invalid):not(:focus):hover + &[data-border] {
          --input-box-shadow: ${eg({color:d.input.default.hovered.border,width:l.border.width})};
        }

        *:invalid:not(:disabled):not(:read-only):not(:focus):hover + &[data-border] {
          --input-box-shadow: ${eg({color:d.input.invalid.hovered.border,width:l.border.width})};
        }
      }
    }
  `}function eD(e){let{theme:t}=e;return[M(t,["padding"],e.$padding),M(t,["paddingLeft","paddingRight"],e.$paddingX),M(t,["paddingTop","paddingBottom"],e.$paddingY),M(t,["paddingTop"],e.$paddingTop),M(t,["paddingRight"],e.$paddingRight),M(t,["paddingBottom"],e.$paddingBottom),M(t,["paddingLeft"],e.$paddingLeft)].filter(Boolean)}function eV(e){let{media:t,radius:o}=(0,i.JW)(e.theme);return T(t,e.$radius,e=>{let t=0;return"number"==typeof e&&(t=H(o[e])),"full"===e&&(t="9999px"),{borderRadius:t}})}function eG(e,t){return`${e.map(H).join(" ")} ${t}`}let eY=c.I4.span.withConfig({displayName:"SpanWithTextOverflow",componentId:"sc-ol2i3b-0"})`display:block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;overflow:clip;`,eX=c.I4.div.withConfig({displayName:"StyledLabel",componentId:"sc-1luap7z-0"})(function(e){return F("label",e)},J,function(e){let{$accent:t,$muted:o}=e,{font:r}=(0,i.JW)(e.theme);return(0,c.AH)`
    text-transform: uppercase;

    ${t&&(0,c.AH)`
      color: var(--card-accent-fg-color);
    `}

    ${o&&(0,c.AH)`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${r.code.family};
      border-radius: 1px;
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `}),eU=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m=(0,d.c)(26);m[0]!==e?({accent:o,align:r,children:n,muted:l,size:c,textOverflow:s,weight:u,...i}=e,m[0]=e,m[1]=o,m[2]=r,m[3]=n,m[4]=i,m[5]=l,m[6]=c,m[7]=s,m[8]=u):(o=m[1],r=m[2],n=m[3],i=m[4],l=m[5],c=m[6],s=m[7],u=m[8]);let g=void 0!==l&&l,b=void 0===c?2:c,v=n;if("ellipsis"===s){let e;m[9]!==v?(e=(0,a.jsx)(eY,{children:v}),m[9]=v,m[10]=e):e=m[10],v=e}else{let e;m[11]!==v?(e=(0,a.jsx)("span",{children:v}),m[11]=v,m[12]=e):e=m[12],v=e}return m[13]!==r?(f=L(r),m[13]=r,m[14]=f):f=m[14],m[15]!==b?(p=L(b),m[15]=b,m[16]=p):p=m[16],m[17]!==o||m[18]!==v||m[19]!==g||m[20]!==t||m[21]!==i||m[22]!==f||m[23]!==p||m[24]!==u?(h=(0,a.jsx)(eX,{"data-ui":"Label",...i,$accent:o,$align:f,$muted:g,$size:p,$weight:u,ref:t,children:v}),m[17]=o,m[18]=v,m[19]=g,m[20]=t,m[21]=i,m[22]=f,m[23]=p,m[24]=u,m[25]=h):h=m[25],h});eU.displayName="ForwardRef(Label)";let eq=c.I4.div.withConfig({displayName:"StyledAvatar",componentId:"sc-1rj7kl0-0"})(function(e){let{avatar:t,media:o}=(0,i.JW)(e.theme);return T(o,e.$size,e=>{let o=t.sizes[e]||t.sizes[0];return{width:H(o.size),height:H(o.size),borderRadius:H(o.size/2),"&>svg":{width:H(o.size),height:H(o.size),borderRadius:H(o.size/2)}}})},function(e){let{$color:t}=e,{avatar:o}=(0,i.JW)(e.theme);return{"--avatar-bg-color":`var(--card-avatar-${t}-bg-color)`,"--avatar-fg-color":`var(--card-avatar-${t}-fg-color)`,backgroundColor:"var(--avatar-bg-color)",position:"relative",boxSizing:"border-box",userSelect:"none",boxShadow:"0 0 0 1px var(--card-bg-color)",'&[data-status="inactive"]':{opacity:"0.5"},"&>svg":{"&:not([hidden])":{display:"block"}},'&[data-as="button"]':{WebkitFontSmoothing:"inherit",appearance:"none",margin:0,padding:0,border:0,font:"inherit",color:"inherit",outline:"none","&:focus":{boxShadow:eb({focusRing:o.focusRing})},"&:focus:not(:focus-visible)":{boxShadow:"none"}}}}),eK=c.I4.div.withConfig({displayName:"Arrow",componentId:"sc-1rj7kl0-1"})(function(){return{position:"absolute",boxSizing:"border-box",zIndex:"0",opacity:"0",transition:"all 0.2s linear",transform:"rotate(-90deg) translate3d(0, 6px, 0)",left:0,right:0,top:0,bottom:0,"& > svg":{width:"11px",height:"7px",position:"absolute",top:"-5px",left:"50%",transform:"translateX(-6px)","&:not([hidden])":{display:"block"}},"[data-arrow-position='inside'] > &":{transform:"rotate(-90deg) translate3d(0, 6px, 0)",opacity:"0"},"[data-arrow-position='top'] > &":{opacity:"1",transform:"rotate(0deg)"},"[data-arrow-position='bottom'] > &":{opacity:"1",transform:"rotate(-180deg)"}}}),eZ=c.I4.ellipse.withConfig({displayName:"BgStroke",componentId:"sc-1rj7kl0-2"})(function(){return{strokeWidth:"4px",stroke:"var(--card-bg-color)"}}),eQ=c.I4.ellipse.withConfig({displayName:"Stroke",componentId:"sc-1rj7kl0-3"})(function(){return{strokeWidth:"2px",stroke:"var(--avatar-bg-color)",'[data-status="editing"] &':{strokeDasharray:"2 4",strokeLinecap:"round"}}}),e1=c.I4.div.withConfig({displayName:"Initials",componentId:"sc-1rj7kl0-4"})(function(){return{width:"100%",height:"100%",color:"var(--avatar-fg-color)",alignItems:"center",justifyContent:"center",textTransform:"uppercase",textAlign:"center",borderRadius:"50%","&:not([hidden])":{display:"flex"}}}),e0=(0,c.I4)(eU).withConfig({displayName:"InitialsLabel",componentId:"sc-1rj7kl0-5"})({color:"inherit"}),e2=c.I4.svg.withConfig({displayName:"AvatarImage",componentId:"sc-1rj7kl0-6"})(function(){return{position:"relative"}}),e3=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,u,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I=(0,d.c)(46);I[0]!==e?({__unstable_hideInnerStroke:o,as:i,color:h,src:p,title:b,initials:c,onImageLoadError:u,arrowPosition:n,animateArrowFrom:r,status:m,size:g,...f}=e,I[0]=e,I[1]=o,I[2]=r,I[3]=n,I[4]=i,I[5]=c,I[6]=u,I[7]=f,I[8]=p,I[9]=h,I[10]=m,I[11]=g,I[12]=b):(o=I[1],r=I[2],n=I[3],i=I[4],c=I[5],u=I[6],f=I[7],p=I[8],h=I[9],m=I[10],g=I[11],b=I[12]);let R=void 0===h?"gray":h,C=void 0===m?"online":m,E=void 0===g?1:g,{avatar:z}=X(),N=s.isValidElementType(i)?i:"div",_=L(E),A=(z.sizes[_[0]]||z.sizes[0]).size,W=A/2,H=(0,l.useId)(),[T,M]=(0,l.useState)(r||n||"inside"),[F,J]=(0,l.useState)(!1),O=`avatar-image-${H}`;I[13]!==T||I[14]!==n?(v=()=>{if(T===n)return;let e=requestAnimationFrame(()=>M(n));return()=>cancelAnimationFrame(e)},w=[T,n],I[13]=T,I[14]=n,I[15]=v,I[16]=w):(v=I[15],w=I[16]),(0,l.useEffect)(v,w),I[17]!==p?(y=()=>{p&&J(!1)},x=[p],I[17]=p,I[18]=y,I[19]=x):(y=I[18],x=I[19]),(0,l.useEffect)(y,x),I[20]!==u?($=()=>{J(!0),u&&u(Error("Avatar: the image failed to load"))},I[20]=u,I[21]=$):$=I[21];let B=$,P="string"==typeof N?N:void 0;I[22]!==R?(k=(0,a.jsx)(eK,{children:(0,a.jsx)("svg",{width:"11",height:"7",viewBox:"0 0 11 7",fill:"none",children:(0,a.jsx)("path",{d:"M6.67948 1.50115L11 7L0 7L4.32052 1.50115C4.92109 0.736796 6.07891 0.736795 6.67948 1.50115Z",fill:R})})}),I[22]=R,I[23]=k):k=I[23],I[24]!==o||I[25]!==W||I[26]!==A||I[27]!==B||I[28]!==F||I[29]!==O||I[30]!==p?(S=!F&&p&&(0,a.jsxs)(e2,{viewBox:`0 0 ${A} ${A}`,fill:"none",children:[(0,a.jsx)("defs",{children:(0,a.jsx)("pattern",{id:O,patternContentUnits:"objectBoundingBox",width:"1",height:"1",children:(0,a.jsx)("image",{href:p,width:"1",height:"1",onError:B})})}),(0,a.jsx)("circle",{cx:W,cy:W,r:W,fill:`url(#${O})`}),!o&&(0,a.jsx)(eZ,{cx:W,cy:W,rx:W,ry:W,vectorEffect:"non-scaling-stroke"}),(0,a.jsx)(eQ,{cx:W,cy:W,rx:W,ry:W,vectorEffect:"non-scaling-stroke"})]}),I[24]=o,I[25]=W,I[26]=A,I[27]=B,I[28]=F,I[29]=O,I[30]=p,I[31]=S):S=I[31];let D=(F||!p)&&c&&(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(e1,{children:(0,a.jsx)(e0,{forwardedAs:"span",size:_.map(e4),weight:"medium",children:c})})});return I[32]!==eq||I[33]!==T||I[34]!==N||I[35]!==R||I[36]!==t||I[37]!==f||I[38]!==_||I[39]!==C||I[40]!==k||I[41]!==S||I[42]!==D||I[43]!==P||I[44]!==b?(j=(0,a.jsxs)(eq,{as:N,"data-as":P,"data-ui":"Avatar",...f,$color:R,$size:_,"aria-label":b,"data-arrow-position":T,"data-status":C,ref:t,title:b,children:[k,S,D]}),I[32]=eq,I[33]=T,I[34]=N,I[35]=R,I[36]=t,I[37]=f,I[38]=_,I[39]=C,I[40]=k,I[41]=S,I[42]=D,I[43]=P,I[44]=b,I[45]=j):j=I[45],j});function e4(e){return 1===e?1:2===e?3:5*(3===e)}e3.displayName="ForwardRef(Avatar)";let e5=c.I4.div.withConfig({displayName:"StyledAvatarCounter",componentId:"sc-1ydx86y-0"})(function(e){let{avatar:t,media:o}=(0,i.JW)(e.theme);return T(o,e.$size,e=>{let o=t.sizes[e];return o?{borderRadius:H(o.size/2),minWidth:H(o.size),height:H(o.size)}:k})},function(e){let{space:t}=(0,i.JW)(e.theme);return(0,c.AH)`
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    user-select: none;
    color: inherit;
    color: var(--card-fg-color);
    background: var(--card-bg-color);
    box-shadow:
      0 0 0 1px var(--card-bg-color),
      inset 0 0 0 1px var(--card-hairline-hard-color);
    padding: 0 ${H(t[2])};

    &:not([hidden]) {
      display: flex;
    }
  `}),e6=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p=(0,d.c)(20),{count:h,size:m}=e,g=void 0===m?1:m;if(p[0]!==t||p[1]!==g){let e=L(g);r=e5,l=e,c="AvatarCounter",s=t,o=eU,n="span",i=e.map(e7),p[0]=t,p[1]=g,p[2]=o,p[3]=r,p[4]=n,p[5]=i,p[6]=l,p[7]=c,p[8]=s}else o=p[2],r=p[3],n=p[4],i=p[5],l=p[6],c=p[7],s=p[8];return p[9]!==o||p[10]!==h||p[11]!==n||p[12]!==i?(u=(0,a.jsx)(o,{as:n,size:i,weight:"medium",children:h}),p[9]=o,p[10]=h,p[11]=n,p[12]=i,p[13]=u):u=p[13],p[14]!==r||p[15]!==l||p[16]!==c||p[17]!==s||p[18]!==u?(f=(0,a.jsx)(r,{$size:l,"data-ui":c,ref:s,children:u}),p[14]=r,p[15]=l,p[16]=c,p[17]=s,p[18]=u,p[19]=f):f=p[19],f});function e7(e){return 1===e?1:2===e?3:5*(3===e)}e6.displayName="ForwardRef(AvatarCounter)";let e8=(0,c.AH)`
  white-space: nowrap;

  & > div {
    vertical-align: top;

    &:not([hidden]) {
      display: inline-block;
    }
  }
`,e9=c.I4.div.withConfig({displayName:"StyledAvatarStack",componentId:"sc-cysmbb-0"})(function(e){let{avatar:t,media:o}=(0,i.JW)(e.theme);return T(o,e.$size,e=>{let o=t.sizes[e];return o?{"& > div + div":{marginLeft:H(o.distance)}}:k})},function(){return e8}),te=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v=(0,d.c)(38);v[0]!==e?({children:o,maxLength:n,size:i,...r}=e,v[0]=e,v[1]=o,v[2]=r,v[3]=n,v[4]=i):(o=v[1],r=v[2],n=v[3],i=v[4]);let w=void 0===n?4:n,y=void 0===i?1:i;if(v[5]!==o||v[6]!==w||v[7]!==t||v[8]!==r||v[9]!==y){let e,n,i=l.Children.toArray(o).filter(l.isValidElement),d=Math.max(w,0);v[18]!==y?(e=L(y),v[18]=y,v[19]=e):e=v[19];let b=e,x=i.length,$=x-(d-1),k=$>1?i.slice($,x):i;c=e9,s="AvatarStack",u=r,f=t,p=b,v[20]!==x||v[21]!==b?(h=0===x&&(0,a.jsx)("div",{children:(0,a.jsx)(e6,{count:x,size:b})}),v[20]=x,v[21]=b,v[22]=h):h=v[22],v[23]!==$||v[24]!==x||v[25]!==b?(m=0!==x&&$>1&&(0,a.jsx)("div",{children:(0,a.jsx)(e6,{count:$,size:b})}),v[23]=$,v[24]=x,v[25]=b,v[26]=m):m=v[26],v[27]!==b?(n=(e,t)=>(0,a.jsx)("div",{children:(0,l.cloneElement)(e,{size:b})},String(t)),v[27]=b,v[28]=n):n=v[28],g=k.map(n),v[5]=o,v[6]=w,v[7]=t,v[8]=r,v[9]=y,v[10]=c,v[11]=s,v[12]=u,v[13]=f,v[14]=p,v[15]=h,v[16]=m,v[17]=g}else c=v[10],s=v[11],u=v[12],f=v[13],p=v[14],h=v[15],m=v[16],g=v[17];return v[29]!==c||v[30]!==s||v[31]!==u||v[32]!==f||v[33]!==p||v[34]!==h||v[35]!==m||v[36]!==g?(b=(0,a.jsxs)(c,{"data-ui":s,...u,ref:f,$size:p,children:[h,m,g]}),v[29]=c,v[30]=s,v[31]=u,v[32]=f,v[33]=p,v[34]=h,v[35]=m,v[36]=g,v[37]=b):b=v[37],b});te.displayName="ForwardRef(AvatarStack)";let tt=c.I4.div.withConfig({displayName:"StyledBox",componentId:"sc-1hhky9f-0"})(function(){return ee},el,function(){return[en,ei,ea,er]},function(){return[ey,ex,e$,ek,eS,ej]},function(e){let{theme:t}=e;return[M(t,["margin"],e.$margin),M(t,["marginLeft","marginRight"],e.$marginX),M(t,["marginTop","marginBottom"],e.$marginY),M(t,["marginTop"],e.$marginTop),M(t,["marginRight"],e.$marginRight),M(t,["marginBottom"],e.$marginBottom),M(t,["marginLeft"],e.$marginLeft)].filter(Boolean)},eD),to=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P,D,V,G,Y,X,U,q,K,Z,Q,ee,et,eo,er,en=(0,d.c)(109);en[0]!==e?({as:R,column:o,columnStart:n,columnEnd:r,display:C,flex:i,height:l,margin:E,marginX:p,marginY:h,marginTop:f,marginRight:u,marginBottom:c,marginLeft:s,overflow:m,padding:z,paddingX:y,paddingY:x,paddingTop:w,paddingRight:v,paddingBottom:g,paddingLeft:b,row:k,rowStart:j,rowEnd:S,sizing:I,...$}=e,en[0]=e,en[1]=o,en[2]=r,en[3]=n,en[4]=i,en[5]=l,en[6]=c,en[7]=s,en[8]=u,en[9]=f,en[10]=p,en[11]=h,en[12]=m,en[13]=g,en[14]=b,en[15]=v,en[16]=w,en[17]=y,en[18]=x,en[19]=$,en[20]=k,en[21]=S,en[22]=j,en[23]=I,en[24]=R,en[25]=C,en[26]=E,en[27]=z):(o=en[1],r=en[2],n=en[3],i=en[4],l=en[5],c=en[6],s=en[7],u=en[8],f=en[9],p=en[10],h=en[11],m=en[12],g=en[13],b=en[14],v=en[15],w=en[16],y=en[17],x=en[18],$=en[19],k=en[20],S=en[21],j=en[22],I=en[23],R=en[24],C=en[25],E=en[26],z=en[27]);let ei=void 0===R?"div":R,ea=void 0===C?"block":C,ed=void 0===E?0:E,el=void 0===z?0:z,ec="string"==typeof ei?ei:void 0;return en[28]!==o?(N=L(o),en[28]=o,en[29]=N):N=en[29],en[30]!==n?(_=L(n),en[30]=n,en[31]=_):_=en[31],en[32]!==r?(A=L(r),en[32]=r,en[33]=A):A=en[33],en[34]!==ea?(W=L(ea),en[34]=ea,en[35]=W):W=en[35],en[36]!==i?(H=L(i),en[36]=i,en[37]=H):H=en[37],en[38]!==l?(T=L(l),en[38]=l,en[39]=T):T=en[39],en[40]!==ed?(M=L(ed),en[40]=ed,en[41]=M):M=en[41],en[42]!==p?(F=L(p),en[42]=p,en[43]=F):F=en[43],en[44]!==h?(J=L(h),en[44]=h,en[45]=J):J=en[45],en[46]!==f?(O=L(f),en[46]=f,en[47]=O):O=en[47],en[48]!==u?(B=L(u),en[48]=u,en[49]=B):B=en[49],en[50]!==c?(P=L(c),en[50]=c,en[51]=P):P=en[51],en[52]!==s?(D=L(s),en[52]=s,en[53]=D):D=en[53],en[54]!==m?(V=L(m),en[54]=m,en[55]=V):V=en[55],en[56]!==el?(G=L(el),en[56]=el,en[57]=G):G=en[57],en[58]!==y?(Y=L(y),en[58]=y,en[59]=Y):Y=en[59],en[60]!==x?(X=L(x),en[60]=x,en[61]=X):X=en[61],en[62]!==w?(U=L(w),en[62]=w,en[63]=U):U=en[63],en[64]!==v?(q=L(v),en[64]=v,en[65]=q):q=en[65],en[66]!==g?(K=L(g),en[66]=g,en[67]=K):K=en[67],en[68]!==b?(Z=L(b),en[68]=b,en[69]=Z):Z=en[69],en[70]!==k?(Q=L(k),en[70]=k,en[71]=Q):Q=en[71],en[72]!==j?(ee=L(j),en[72]=j,en[73]=ee):ee=en[73],en[74]!==S?(et=L(S),en[74]=S,en[75]=et):et=en[75],en[76]!==I?(eo=L(I),en[76]=I,en[77]=eo):eo=en[77],en[78]!==ei||en[79]!==e.children||en[80]!==t||en[81]!==$||en[82]!==T||en[83]!==M||en[84]!==F||en[85]!==J||en[86]!==O||en[87]!==B||en[88]!==P||en[89]!==D||en[90]!==V||en[91]!==G||en[92]!==Y||en[93]!==X||en[94]!==U||en[95]!==q||en[96]!==K||en[97]!==Z||en[98]!==Q||en[99]!==ee||en[100]!==et||en[101]!==eo||en[102]!==ec||en[103]!==N||en[104]!==_||en[105]!==A||en[106]!==W||en[107]!==H?(er=(0,a.jsx)(tt,{"data-as":ec,"data-ui":"Box",...$,$column:N,$columnStart:_,$columnEnd:A,$display:W,$flex:H,$height:T,$margin:M,$marginX:F,$marginY:J,$marginTop:O,$marginRight:B,$marginBottom:P,$marginLeft:D,$overflow:V,$padding:G,$paddingX:Y,$paddingY:X,$paddingTop:U,$paddingRight:q,$paddingBottom:K,$paddingLeft:Z,$row:Q,$rowStart:ee,$rowEnd:et,$sizing:eo,as:ei,ref:t,children:e.children}),en[78]=ei,en[79]=e.children,en[80]=t,en[81]=$,en[82]=T,en[83]=M,en[84]=F,en[85]=J,en[86]=O,en[87]=B,en[88]=P,en[89]=D,en[90]=V,en[91]=G,en[92]=Y,en[93]=X,en[94]=U,en[95]=q,en[96]=K,en[97]=Z,en[98]=Q,en[99]=ee,en[100]=et,en[101]=eo,en[102]=ec,en[103]=N,en[104]=_,en[105]=A,en[106]=W,en[107]=H,en[108]=er):er=en[108],er});to.displayName="ForwardRef(Box)";let tr=c.I4.div.withConfig({displayName:"StyledText",componentId:"sc-11ov82j-0"})(function(e){return F("text",e)},J,function(e){let{$accent:t,$muted:o}=e,{font:r}=(0,i.JW)(e.theme);return(0,c.AH)`
    color: var(--card-fg-color);

    ${t&&(0,c.AH)`
      color: var(--card-accent-fg-color);
    `}

    ${o&&(0,c.AH)`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${r.code.family};
      border-radius: 1px;
      background-color: var(--card-code-bg-color);
      color: var(--card-code-fg-color);
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
      color: var(--card-link-color);
      outline: none;

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }

      &:focus {
        box-shadow:
          0 0 0 1px var(--card-bg-color),
          0 0 0 3px var(--card-focus-ring-color);
      }

      &:focus:not(:focus-visible) {
        box-shadow: none;
      }
    }

    & strong {
      font-weight: ${r.text.weights.bold};
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
      color: var(--card-icon-color);

      & path {
        vector-effect: non-scaling-stroke !important;
      }
    }
  `}),tn=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g=(0,d.c)(26);g[0]!==e?({accent:i,align:o,children:r,muted:l,size:c,textOverflow:s,weight:u,...n}=e,g[0]=e,g[1]=o,g[2]=r,g[3]=n,g[4]=i,g[5]=l,g[6]=c,g[7]=s,g[8]=u):(o=g[1],r=g[2],n=g[3],i=g[4],l=g[5],c=g[6],s=g[7],u=g[8]);let b=void 0!==i&&i,v=void 0!==l&&l,w=void 0===c?2:c,y=r;if("ellipsis"===s){let e;g[9]!==y?(e=(0,a.jsx)(eY,{children:y}),g[9]=y,g[10]=e):e=g[10],y=e}return g[11]!==o?(f=L(o),g[11]=o,g[12]=f):f=g[12],g[13]!==w?(p=L(w),g[13]=w,g[14]=p):p=g[14],g[15]!==y?(h=(0,a.jsx)("span",{children:y}),g[15]=y,g[16]=h):h=g[16],g[17]!==b||g[18]!==v||g[19]!==t||g[20]!==n||g[21]!==f||g[22]!==p||g[23]!==h||g[24]!==u?(m=(0,a.jsx)(tr,{"data-ui":"Text",...n,$accent:b,$align:f,$muted:v,ref:t,$size:p,$weight:u,children:h}),g[17]=b,g[18]=v,g[19]=t,g[20]=n,g[21]=f,g[22]=p,g[23]=h,g[24]=u,g[25]=m):m=g[25],m});tn.displayName="ForwardRef(Text)";let ti=(0,c.I4)(to).withConfig({displayName:"StyledBadge",componentId:"sc-5u140l-0"})(eV,function(e){let{$tone:t}=e;return{"--card-bg-color":`var(--card-badge-${t}-bg-color)`,"--card-fg-color":`var(--card-badge-${t}-fg-color)`,backgroundColor:"var(--card-bg-color)",cursor:"default","&:not([hidden])":{display:"inline-block",verticalAlign:"top"}}}),ta=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h=(0,d.c)(21);if(h[0]!==e){let{children:t,fontSize:a,mode:d,padding:s,radius:u,tone:f,...p}=e;o=t,n=a,i=s,l=u,c=f,r=p,h[0]=e,h[1]=o,h[2]=r,h[3]=n,h[4]=i,h[5]=l,h[6]=c}else o=h[1],r=h[2],n=h[3],i=h[4],l=h[5],c=h[6];let m=void 0===n?1:n,g=void 0===i?1:i,b=void 0===l?"full":l,v=void 0===c?"default":c;return h[7]!==b?(s=L(b),h[7]=b,h[8]=s):s=h[8],h[9]!==g?(u=L(g),h[9]=g,h[10]=u):u=h[10],h[11]!==o||h[12]!==m?(f=(0,a.jsx)(tn,{size:m,children:o}),h[11]=o,h[12]=m,h[13]=f):f=h[13],h[14]!==t||h[15]!==r||h[16]!==s||h[17]!==u||h[18]!==f||h[19]!==v?(p=(0,a.jsx)(ti,{"data-ui":"Badge",...r,$tone:v,$radius:s,padding:u,ref:t,children:f}),h[14]=t,h[15]=r,h[16]=s,h[17]=u,h[18]=f,h[19]=v,h[20]=p):p=h[20],p});ta.displayName="ForwardRef(Badge)";let td=(0,c.I4)(to).withConfig({displayName:"StyledFlex",componentId:"sc-oxesg3-0"})(el,function(){return[es,eu,ef,ep,eh,em]}),tl=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g,b=(0,d.c)(27);b[0]!==e?({align:o,as:r,direction:c,gap:n,justify:i,wrap:s,...l}=e,b[0]=e,b[1]=o,b[2]=r,b[3]=n,b[4]=i,b[5]=l,b[6]=c,b[7]=s):(o=b[1],r=b[2],n=b[3],i=b[4],l=b[5],c=b[6],s=b[7]);let v=void 0===c?"row":c;return b[8]!==o?(u=L(o),b[8]=o,b[9]=u):u=b[9],b[10]!==v?(f=L(v),b[10]=v,b[11]=f):f=b[11],b[12]!==n?(p=L(n),b[12]=n,b[13]=p):p=b[13],b[14]!==i?(h=L(i),b[14]=i,b[15]=h):h=b[15],b[16]!==s?(m=L(s),b[16]=s,b[17]=m):m=b[17],b[18]!==r||b[19]!==t||b[20]!==l||b[21]!==u||b[22]!==f||b[23]!==p||b[24]!==h||b[25]!==m?(g=(0,a.jsx)(td,{"data-ui":"Flex",...l,$align:u,$direction:f,$gap:p,$justify:h,$wrap:m,forwardedAs:r,ref:t}),b[18]=r,b[19]=t,b[20]=l,b[21]=u,b[22]=f,b[23]=p,b[24]=h,b[25]=m,b[26]=g):g=b[26],g});tl.displayName="ForwardRef(Flex)";let tc=(0,c.i7)`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`,ts=(0,c.I4)(tn).withConfig({displayName:"StyledSpinner",componentId:"sc-124hnd0-0"})`& > span > svg{animation:${tc} 500ms linear infinite;}`,tu=(0,l.forwardRef)(function(e,t){let o,r,n=(0,d.c)(4);return n[0]===Symbol.for("react.memo_cache_sentinel")?(o=(0,a.jsx)(f.Nl1,{}),n[0]=o):o=n[0],n[1]!==e||n[2]!==t?(r=(0,a.jsx)(ts,{"data-ui":"Spinner",...e,ref:t,children:o}),n[1]=e,n[2]=t,n[3]=r):r=n[3],r});function tf(e,t,o=!1){return{"--card-backdrop-color":e.backdrop,"--card-focus-ring-color":e.focusRing,"--card-shadow-outline-color":e.shadow.outline,"--card-shadow-umbra-color":e.shadow.umbra,"--card-shadow-penumbra-color":e.shadow.penumbra,"--card-shadow-ambient-color":e.shadow.ambient,"--card-accent-fg-color":t.accent.fg,"--card-avatar-gray-bg-color":t.avatar.gray.bg,"--card-avatar-gray-fg-color":t.avatar.gray.fg,"--card-avatar-blue-bg-color":t.avatar.blue.bg,"--card-avatar-blue-fg-color":t.avatar.blue.fg,"--card-avatar-purple-bg-color":t.avatar.purple.bg,"--card-avatar-purple-fg-color":t.avatar.purple.fg,"--card-avatar-magenta-bg-color":t.avatar.magenta.bg,"--card-avatar-magenta-fg-color":t.avatar.magenta.fg,"--card-avatar-red-bg-color":t.avatar.red.bg,"--card-avatar-red-fg-color":t.avatar.red.fg,"--card-avatar-orange-bg-color":t.avatar.orange.bg,"--card-avatar-orange-fg-color":t.avatar.orange.fg,"--card-avatar-yellow-bg-color":t.avatar.yellow.bg,"--card-avatar-yellow-fg-color":t.avatar.yellow.fg,"--card-avatar-green-bg-color":t.avatar.green.bg,"--card-avatar-green-fg-color":t.avatar.green.fg,"--card-avatar-cyan-bg-color":t.avatar.cyan.bg,"--card-avatar-cyan-fg-color":t.avatar.cyan.fg,"--card-bg-color":t.bg,"--card-bg-image":o?`repeating-conic-gradient(${t.bg} 0% 25%, ${t.muted.bg} 0% 50%)`:void 0,"--card-border-color":t.border,"--card-badge-default-bg-color":t.badge.default.bg,"--card-badge-default-dot-color":t.badge.default.dot,"--card-badge-default-fg-color":t.badge.default.fg,"--card-badge-default-icon-color":t.badge.default.icon,"--card-badge-neutral-bg-color":t.badge.neutral?.bg,"--card-badge-neutral-dot-color":t.badge.neutral?.dot,"--card-badge-neutral-fg-color":t.badge.neutral?.fg,"--card-badge-neutral-icon-color":t.badge.neutral?.icon,"--card-badge-primary-bg-color":t.badge.primary.bg,"--card-badge-primary-dot-color":t.badge.primary.dot,"--card-badge-primary-fg-color":t.badge.primary.fg,"--card-badge-primary-icon-color":t.badge.primary.icon,"--card-badge-suggest-bg-color":t.badge.suggest?.bg,"--card-badge-suggest-dot-color":t.badge.suggest?.dot,"--card-badge-suggest-fg-color":t.badge.suggest?.fg,"--card-badge-suggest-icon-color":t.badge.suggest?.icon,"--card-badge-positive-bg-color":t.badge.positive.bg,"--card-badge-positive-dot-color":t.badge.positive.dot,"--card-badge-positive-fg-color":t.badge.positive.fg,"--card-badge-positive-icon-color":t.badge.positive.icon,"--card-badge-caution-bg-color":t.badge.caution.bg,"--card-badge-caution-dot-color":t.badge.caution.dot,"--card-badge-caution-fg-color":t.badge.caution.fg,"--card-badge-caution-icon-color":t.badge.caution.icon,"--card-badge-critical-bg-color":t.badge.critical.bg,"--card-badge-critical-dot-color":t.badge.critical.dot,"--card-badge-critical-fg-color":t.badge.critical.fg,"--card-badge-critical-icon-color":t.badge.critical.icon,"--card-code-bg-color":t.code.bg,"--card-code-fg-color":t.code.fg,"--card-fg-color":t.fg,"--card-icon-color":t.icon,"--card-kbd-bg-color":t.kbd.bg,"--card-kbd-border-color":t.kbd.border,"--card-kbd-fg-color":t.kbd.fg,"--card-link-fg-color":t.link.fg,"--card-muted-bg-color":t.muted.bg,"--card-muted-fg-color":t.muted.fg,"--card-skeleton-color-from":t.skeleton.from,"--card-skeleton-color-to":t.skeleton.to,"--card-bg2-color":t.muted.bg,"--card-link-color":t.link.fg,"--card-hairline-soft-color":t.border,"--card-hairline-hard-color":t.border}}function tp(...e){return e.filter(Boolean).join(",")}tu.displayName="ForwardRef(Spinner)";let th=c.I4.button.withConfig({displayName:"StyledButton",componentId:"sc-aaekt4-0"})(eV,function(e){let{$width:t}=e,{style:o}=(0,i.JW)(e.theme);return(0,c.AH)`
    ${o?.button};

    -webkit-font-smoothing: inherit;
    appearance: none;
    display: inline-flex;
    align-items: center;
    font: inherit;
    border: 0;
    outline: none;
    user-select: none;
    text-decoration: none;
    border: 0;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    white-space: nowrap;
    text-align: left;
    position: relative;
    vertical-align: top;

    ${"fill"===t&&(0,c.AH)`
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    `}

    & > span {
      display: block;
      flex: 1;
      min-width: 0;
      border-radius: inherit;
    }

    &::-moz-focus-inner {
      border: 0;
      padding: 0;
    }
  `},function(e){let{$mode:t}=e,{button:o,color:r,style:n}=(0,i.JW)(e.theme),a="ghost"===e.$mode,d=r.button[t]||r.button.default,l=d[e.$tone]||d.default,c={width:o.border.width,color:"var(--card-border-color)"},s;return[tf(r,l.enabled),{backgroundColor:"var(--card-bg-color)",color:"var(--card-fg-color)",boxShadow:eg(c),'&:disabled, &[data-disabled="true"]':tf(r,l.disabled),"&:not([data-disabled='true'])":{boxShadow:tp(eg(c),a?s:void 0),"&:focus":{boxShadow:eb({base:r,border:{width:2,color:r.bg},focusRing:o.focusRing})},"&:focus:not(:focus-visible)":{boxShadow:tp(eg(c),a?s:void 0)},"@media (hover: hover)":{"&:hover":tf(r,l.hovered),"&:active":tf(r,l.pressed),"&[data-hovered]":tf(r,l.hovered)},"&[data-selected]":tf(r,l.pressed)}},n?.button?.root].filter(Boolean)}),tm=c.I4.div.withConfig({displayName:"LoadingBox",componentId:"sc-aaekt4-1"})`position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:var(--card-bg-color);border-radius:inherit;z-index:1;box-shadow:inherit;`,tg=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P,D,V,G,Y,U=(0,d.c)(86);U[0]!==e?({children:n,disabled:i,fontSize:w,icon:o,iconRight:r,justify:y,loading:c,mode:x,padding:$,paddingX:m,paddingY:g,paddingTop:h,paddingBottom:s,paddingLeft:f,paddingRight:p,radius:k,selected:v,space:S,text:C,textAlign:E,textWeight:z,tone:j,type:I,muted:R,width:N,...b}=e,U[0]=e,U[1]=o,U[2]=r,U[3]=n,U[4]=i,U[5]=c,U[6]=s,U[7]=f,U[8]=p,U[9]=h,U[10]=m,U[11]=g,U[12]=b,U[13]=v,U[14]=w,U[15]=y,U[16]=x,U[17]=$,U[18]=k,U[19]=S,U[20]=j,U[21]=I,U[22]=R,U[23]=C,U[24]=E,U[25]=z,U[26]=N):(o=U[1],r=U[2],n=U[3],i=U[4],c=U[5],s=U[6],f=U[7],p=U[8],h=U[9],m=U[10],g=U[11],b=U[12],v=U[13],w=U[14],y=U[15],x=U[16],$=U[17],k=U[18],S=U[19],j=U[20],I=U[21],R=U[22],C=U[23],E=U[24],z=U[25],N=U[26]);let q=void 0===w?1:w,K=void 0===y?"center":y,Z=void 0===x?"default":x,Q=void 0===$?3:$,ee=void 0===k?2:k,et=void 0===S?3:S,eo=void 0===j?"default":j,er=void 0===I?"button":I,en=void 0!==R&&R,{button:ei}=X();U[27]!==K?(_=L(K),U[27]=K,U[28]=_):_=U[28];let ea=_;U[29]!==Q?(A=L(Q),U[29]=Q,U[30]=A):A=U[30];let ed=A;U[31]!==m?(W=L(m),U[31]=m,U[32]=W):W=U[32];let el=W;U[33]!==g?(H=L(g),U[33]=g,U[34]=H):H=U[34];let ec=H;U[35]!==h?(T=L(h),U[35]=h,U[36]=T):T=U[36];let es=T;U[37]!==s?(M=L(s),U[37]=s,U[38]=M):M=U[38];let eu=M;U[39]!==f?(F=L(f),U[39]=f,U[40]=F):F=U[40];let ef=F;U[41]!==p?(J=L(p),U[41]=p,U[42]=J):J=U[42];let ep=J;U[43]!==ee?(O=L(ee),U[43]=ee,U[44]=O):O=U[44];let eh=O;U[45]!==et?(B=L(et),U[45]=et,U[46]=B):B=U[46];let em=B;U[47]!==ed||U[48]!==eu||U[49]!==ef||U[50]!==ep||U[51]!==es||U[52]!==el||U[53]!==ec?(P={padding:ed,paddingX:el,paddingY:ec,paddingTop:es,paddingBottom:eu,paddingLeft:ef,paddingRight:ep},U[47]=ed,U[48]=eu,U[49]=ef,U[50]=ep,U[51]=es,U[52]=el,U[53]=ec,U[54]=P):P=U[54];let eg=P,eb=!!(c||i),ev=v?"":void 0,ew=!!(c||i);return U[55]!==c?(D=!!c&&(0,a.jsx)(tm,{children:(0,a.jsx)(tu,{})}),U[55]=c,U[56]=D):D=U[56],U[57]!==o||U[58]!==r||U[59]!==eg||U[60]!==ei||U[61]!==q||U[62]!==ea||U[63]!==en||U[64]!==em||U[65]!==C||U[66]!==E||U[67]!==z?(V=(o||C||r)&&(0,a.jsx)(to,{as:"span",...eg,children:(0,a.jsxs)(tl,{as:"span",justify:ea,gap:em,children:[o&&(0,a.jsxs)(tn,{size:q,children:[(0,l.isValidElement)(o)&&o,(0,u.isValidElementType)(o)&&(0,a.jsx)(o,{})]}),C&&(0,a.jsx)(to,{children:(0,a.jsx)(tn,{muted:en,align:E,size:q,textOverflow:"ellipsis",weight:z??ei.textWeight,children:C})}),r&&(0,a.jsxs)(tn,{size:q,children:[(0,l.isValidElement)(r)&&r,(0,u.isValidElementType)(r)&&(0,a.jsx)(r,{})]})]})}),U[57]=o,U[58]=r,U[59]=eg,U[60]=ei,U[61]=q,U[62]=ea,U[63]=en,U[64]=em,U[65]=C,U[66]=E,U[67]=z,U[68]=V):V=U[68],U[69]!==eg||U[70]!==n?(G=n&&(0,a.jsx)(to,{as:"span",...eg,children:n}),U[69]=eg,U[70]=n,U[71]=G):G=U[71],U[72]!==Z||U[73]!==eh||U[74]!==t||U[75]!==b||U[76]!==eb||U[77]!==ev||U[78]!==ew||U[79]!==D||U[80]!==V||U[81]!==G||U[82]!==eo||U[83]!==er||U[84]!==N?(Y=(0,a.jsxs)(th,{"data-ui":"Button",...b,$mode:Z,$radius:eh,$tone:eo,"data-disabled":eb,"data-selected":ev,disabled:ew,ref:t,type:er,$width:N,children:[D,V,G]}),U[72]=Z,U[73]=eh,U[74]=t,U[75]=b,U[76]=eb,U[77]=ev,U[78]=ew,U[79]=D,U[80]=V,U[81]=G,U[82]=eo,U[83]=er,U[84]=N,U[85]=Y):Y=U[85],Y});tg.displayName="ForwardRef(Button)";let tb=(0,c.I4)(to).withConfig({displayName:"StyledCard",componentId:"sc-osnro2-0"})(function(){return[U,q,K,Z,Q]},eV,function(e){let{card:t,media:o,shadow:r}=(0,i.JW)(e.theme);return T(o,e.$shadow,e=>(function(e,t=1){if(!e)return k;let o=`0 0 0 ${H(t)} var(--card-shadow-outline-color)`,r=eG(e.umbra,"var(--card-shadow-umbra-color)"),n=eG(e.penumbra,"var(--card-shadow-penumbra-color)"),i=eG(e.ambient,"var(--card-shadow-ambient-color)");return{boxShadow:`${o}, ${r}, ${n}, ${i}`}})(r[e],t.shadow.outline))},function(e){return[function(e){let{$checkered:t}=e,{space:o}=(0,i.JW)(e.theme);return(0,c.AH)`
    ${t&&(0,c.AH)`
      background-size: ${o[3]}px ${o[3]}px;
      background-position: 50% 50%;
      background-image: var(--card-bg-image);
    `}

    &[data-as='button'] {
      -webkit-font-smoothing: inherit;
      appearance: none;
      outline: none;
      font: inherit;
      text-align: inherit;
      border: 0;
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    }

    /* &:is(a) */
    &[data-as='a'] {
      outline: none;
      text-decoration: none;
    }

    /* &:is(pre) */
    &[data-as='pre'] {
      font: inherit;
    }
  `}(e),function(e){let{$checkered:t,$focusRing:o,$muted:r}=e,{card:n,color:a,style:d}=(0,i.JW)(e.theme),l={width:n.border.width,color:"var(--card-border-color)"};return(0,c.AH)`
    color-scheme: ${a._dark?"dark":"light"};

    ${tf(a,a,t)}

    background-color: ${r?"var(--card-muted-bg-color)":"var(--card-bg-color)"};
    color: var(--card-fg-color);

    /* &:is(button) */
    &[data-as='button'] {
      --card-focus-ring-box-shadow: none;

      cursor: default;
      box-shadow: var(--card-focus-ring-box-shadow);

      &:disabled {
        ${tf(a,a.selectable.default.disabled,t)}
      }

      &:not(:disabled) {
        &[data-pressed] {
          ${tf(a,a.selectable.default.pressed,t)}
        }

        &[data-selected] {
          ${tf(a,a.selectable.default.selected,t)}
        }

        @media (hover: hover) {
          &:not([data-pressed]):not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${tf(a,a.selectable.default.hovered,t)}
            }

            &:active {
              ${tf(a,a.selectable.default.pressed,t)}
            }
          }
        }

        &:focus-visible {
          --card-focus-ring-box-shadow: ${o?eb({base:a,border:l,focusRing:n.focusRing}):void 0};
        }
      }
    }

    /* &:is(a) */
    &[data-as='a'] {
      cursor: pointer;
      box-shadow: var(--card-focus-ring-box-shadow);

      &[data-disabled] {
        ${tf(a,a.selectable.default.disabled,t)}
      }

      &:not([data-disabled]) {
        &[data-pressed] {
          ${tf(a,a.selectable.default.pressed,t)}
        }

        &[data-selected] {
          ${tf(a,a.selectable.default.selected,t)}
        }

        @media (hover: hover) {
          &:not([data-pressed]):not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${tf(a,a.selectable.default.hovered,t)}
            }

            &:active {
              ${tf(a,a.selectable.default.pressed,t)}
            }
          }
        }

        &:focus-visible {
          --card-focus-ring-box-shadow: ${o?eb({base:a,border:l,focusRing:n.focusRing}):void 0};
        }
      }
    }

    ${d?.card?.root}
  `}(e)]}),tv=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C,E,z=(0,d.c)(56);z[0]!==e?({__unstable_checkered:b,__unstable_focusRing:v,as:o,border:r,borderTop:c,borderRight:l,borderBottom:n,borderLeft:i,muted:s,pressed:f,radius:w,scheme:h,selected:m,shadow:g,tone:y,...p}=e,z[0]=e,z[1]=o,z[2]=r,z[3]=n,z[4]=i,z[5]=l,z[6]=c,z[7]=s,z[8]=f,z[9]=p,z[10]=h,z[11]=m,z[12]=g,z[13]=b,z[14]=v,z[15]=w,z[16]=y):(o=z[1],r=z[2],n=z[3],i=z[4],l=z[5],c=z[6],s=z[7],f=z[8],p=z[9],h=z[10],m=z[11],g=z[12],b=z[13],v=z[14],w=z[15],y=z[16]);let N=void 0!==b&&b,_=void 0!==v&&v,A=void 0===w?0:w,W=void 0===y?"default":y,H=(0,u.isValidElementType)(o)?o:"div",T=V(),M="inherit"===W?T.tone:W,F="string"==typeof H?H:void 0,J=T.scheme;z[17]!==r?(x=L(r),z[17]=r,z[18]=x):x=z[18],z[19]!==c?($=L(c),z[19]=c,z[20]=$):$=z[20],z[21]!==l?(k=L(l),z[21]=l,z[22]=k):k=z[22],z[23]!==n?(S=L(n),z[23]=n,z[24]=S):S=z[24],z[25]!==i?(j=L(i),z[25]=i,z[26]=j):j=z[26],z[27]!==A?(I=L(A),z[27]=A,z[28]=I):I=z[28],z[29]!==g?(R=L(g),z[29]=g,z[30]=R):R=z[30];let O=N?"":void 0,B=f?"":void 0,P=m?"":void 0;return z[31]!==H||z[32]!==N||z[33]!==_||z[34]!==s||z[35]!==t||z[36]!==p||z[37]!==T.scheme||z[38]!==m||z[39]!==j||z[40]!==I||z[41]!==R||z[42]!==O||z[43]!==B||z[44]!==P||z[45]!==F||z[46]!==x||z[47]!==$||z[48]!==k||z[49]!==S||z[50]!==M?(C=(0,a.jsx)(tb,{"data-as":F,"data-scheme":J,"data-ui":"Card","data-tone":M,...p,$border:x,$borderTop:$,$borderRight:k,$borderBottom:S,$borderLeft:j,$checkered:N,$focusRing:_,$muted:s,$radius:I,$shadow:R,$tone:M,"data-checkered":O,"data-pressed":B,"data-selected":P,forwardedAs:H,ref:t,selected:m}),z[31]=H,z[32]=N,z[33]=_,z[34]=s,z[35]=t,z[36]=p,z[37]=T.scheme,z[38]=m,z[39]=j,z[40]=I,z[41]=R,z[42]=O,z[43]=B,z[44]=P,z[45]=F,z[46]=x,z[47]=$,z[48]=k,z[49]=S,z[50]=M,z[51]=C):C=z[51],z[52]!==h||z[53]!==C||z[54]!==M?(E=(0,a.jsx)(G,{scheme:h,tone:M,children:C}),z[52]=h,z[53]=C,z[54]=M,z[55]=E):E=z[55],E});function tw(e,t,o){let r,n,i,a=(0,d.c)(9),c=void 0===t?ty:t;a[0]!==o||a[1]!==c||a[2]!==e?(r=t=>{if(!e)return;let r=t.target;if(!(r instanceof Node))return;let n=o?.();if(!n||n.contains(r)){for(let e of c().flat())if(e&&(r===e||e.contains(r)))return;e(t)}},a[0]=o,a[1]=c,a[2]=e,a[3]=r):r=a[3];let s=(0,w.J)(r),u=!!e;a[4]!==u||a[5]!==s?(n=()=>{if(!u)return;let e=e=>s(e);return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},a[4]=u,a[5]=s,a[6]=n):n=a[6],a[7]!==u?(i=[u],a[7]=u,a[8]=i):i=a[8],(0,l.useEffect)(n,i),(0,l.useDebugValue)(e?"MouseDown On":"MouseDown Off")}function ty(){return $}function tx(e,t){let o,r,n=(0,d.c)(4);n[0]!==t||n[1]!==e?(o=()=>{e.current?.setCustomValidity(t||"")},r=[t,e],n[0]=t,n[1]=e,n[2]=o,n[3]=r):(o=n[2],r=n[3]),(0,l.useEffect)(o,r)}tv.displayName="ForwardRef(Card)";let t$="u">typeof document&&"u">typeof window&&window.ResizeObserver?window.ResizeObserver:b.tb,tk=(r=new WeakMap,n=new WeakMap,{subscribe(e,t){let o=n.get(e)||[],i=r.get(e);return n.has(e)||(n.set(e,o),i=({subscribe(e,t){let o=new t$(([e])=>{t({_contentRect:e.contentRect,border:{width:e.borderBoxSize[0].inlineSize,height:e.borderBoxSize[0].blockSize},content:{width:e.contentRect.width,height:e.contentRect.height}})});return o.observe(e),()=>{o.unobserve(e),o.disconnect()}}}).subscribe(e,e=>{for(let t of o)t(e)})),o.push(t),()=>{let e=o.indexOf(t);e>-1&&o.splice(e,1),0===o.length&&i&&i()}}});function tS(e){let t,o,r=(0,d.c)(3),[n,i]=(0,l.useState)(null);return r[0]!==e?(t=()=>{if(e)return tk.subscribe(e,i)},o=[e],r[0]=e,r[1]=t,r[2]=o):(t=r[1],o=r[2]),(0,l.useEffect)(t,o),n}function tj(e,t){let o,r,n,i=(0,d.c)(7);i[0]!==e?(o=t=>e(t),i[0]=e,i[1]=o):o=i[1];let a=(0,w.J)(o);i[2]!==a||i[3]!==t?(r=()=>{let e=e=>a(e);return window.addEventListener("keydown",e,t),()=>window.removeEventListener("keydown",e,t)},i[2]=a,i[3]=t,i[4]=r):r=i[4],i[5]!==t?(n=[t],i[5]=t,i[6]=n):n=i[6],(0,l.useEffect)(r,n)}function tI(e,t){let o,r,n=(0,d.c)(4);return(0,l.useDebugValue)(e),n[0]!==e?(o=t=>{let o=window.matchMedia(e);return o.addEventListener("change",t),()=>o.removeEventListener("change",t)},n[0]=e,n[1]=o):o=n[1],n[2]!==e?(r=()=>window.matchMedia(e).matches,n[2]=e,n[3]=r):r=n[3],(0,l.useSyncExternalStore)(o,r,t)}function tR(){return 0}function tC(){let e,t,o,r,n=(0,d.c)(2),{media:i}=X();n[0]!==i?(o=i.length,r=()=>{if(!t){t=[];for(let r=o;r>-1;r-=1){var e;let o=0===(e=r)?`screen and (max-width: ${i[e]-1}px)`:e===i.length?`screen and (min-width: ${i[e-1]}px)`:`screen and (min-width: ${i[e-1]}px) and (max-width: ${i[e]-1}px)`;t.push({index:r,mq:window.matchMedia(o)})}}return t},e={getSnapshot:()=>{for(let{index:e,mq:t}of r())if(t.matches)return e;return 0},subscribe:e=>{let t=[];for(let{mq:o}of r()){let r=()=>{o.matches&&e()};o.addEventListener("change",r),t.push(()=>o.removeEventListener("change",r))}return()=>{for(let e of t)e()}}},n[0]=i,n[1]=e):e=n[1];let a=e;return(0,l.useSyncExternalStore)(a.subscribe,a.getSnapshot,tR)}function tE(e){return tI("(prefers-color-scheme: dark)",void 0===e?tz:e)}function tz(){return!1}function tN(e){return tI("(prefers-reduced-motion: reduce)",void 0===e?t_:e)}function t_(){return!1}let tA=c.I4.div.withConfig({displayName:"StyledCheckbox",componentId:"sc-1l5mt2l-0"})(function(){return(0,c.AH)`
    position: relative;
    display: inline-block;
  `}),tW=c.I4.input.withConfig({displayName:"Input",componentId:"sc-1l5mt2l-1"})(function(e){let{color:t,input:o,radius:r}=(0,i.JW)(e.theme),{focusRing:n}=o.checkbox;return(0,c.AH)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
    z-index: 1;
    padding: 0;
    margin: 0;

    & + span {
      position: relative;
      display: block;
      height: ${H(o.checkbox.size)};
      width: ${H(o.checkbox.size)};
      box-sizing: border-box;
      box-shadow: ${eg({color:t.input.default.enabled.border,width:o.border.width})};
      border-radius: ${H(r[2])};
      line-height: 1;
      background-color: ${t.input.default.enabled.bg};

      & > svg {
        display: block;
        position: absolute;
        opacity: 0;
        height: 100%;
        width: 100%;

        & > path {
          vector-effect: non-scaling-stroke;
          stroke-width: 1.5px !important;
        }
      }
    }

    &:checked + span {
      background: ${t.input.default.enabled.fg};
      box-shadow: ${eg({color:t.input.default.enabled.fg,width:o.border.width})};
      color: ${t.input.default.enabled.bg};
    }

    /* focus */
    &:not(:disabled):focus:focus-visible + span {
      box-shadow: ${eb({focusRing:n})};
    }

    /* focus when checked - uses a different offset */
    &:not(:disabled):focus:focus-visible&:checked + span {
      box-shadow: ${eb({focusRing:{width:1,offset:1}})};
    }

    &[data-error] + span {
      background-color: ${t.input.invalid.enabled.border};
      box-shadow: ${eg({width:o.border.width,color:t.input.invalid.enabled.muted.bg})};
      color: ${t.input.default.disabled.fg};
    }
    &[data-error]&:checked + span {
      background-color: ${t.input.invalid.enabled.muted.bg};
      color: ${t.input.default.enabled.bg};
    }
    &[data-error]&:checked&:not(:disabled):focus:focus-visible + span {
      box-shadow: ${eb({border:{width:o.border.width,color:t.input.invalid.readOnly.muted.bg},focusRing:{width:1,offset:1}})};
    }

    &:disabled + span {
      background-color: ${t.input.default.disabled.bg};
      box-shadow: ${eg({width:o.border.width,color:t.input.default.disabled.border})};
      color: ${t.input.default.disabled.fg};
    }
    &:disabled&:checked + span {
      background-color: ${t.input.default.disabled.muted.bg};
    }

    &[data-read-only] + span {
      background-color: ${t.input.default.readOnly.bg};
      box-shadow: ${eg({width:o.border.width,color:t.input.default.readOnly.border})};
      color: ${t.input.default.readOnly.fg};
    }

    &[data-read-only]&:checked + span {
      background-color: ${t.input.default.readOnly.muted.bg};
    }

    &:checked + span > svg:first-child {
      opacity: 1;
    }
    &:indeterminate + span > svg:last-child {
      opacity: 1;
    }
  `}),tH=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,p,h,m,g,b,v,w,y=(0,d.c)(25);y[0]!==e?({checked:o,className:r,disabled:i,indeterminate:c,customValidity:n,readOnly:s,style:p,...u}=e,y[0]=e,y[1]=o,y[2]=r,y[3]=n,y[4]=i,y[5]=c,y[6]=s,y[7]=u,y[8]=p):(o=y[1],r=y[2],n=y[3],i=y[4],c=y[5],s=y[6],u=y[7],p=y[8]);let x=(0,l.useRef)(null);y[9]===Symbol.for("react.memo_cache_sentinel")?(h=()=>x.current,y[9]=h):h=y[9],(0,l.useImperativeHandle)(t,h),y[10]!==c?(m=()=>{x.current&&(x.current.indeterminate=c||!1)},g=[c],y[10]=c,y[11]=m,y[12]=g):(m=y[11],g=y[12]),(0,l.useEffect)(m,g),tx(x,n);let $=!i&&s?"":void 0,k=n?"":void 0,S=i||s;return y[13]!==o||y[14]!==s||y[15]!==u||y[16]!==$||y[17]!==k||y[18]!==S?(b=(0,a.jsx)(tW,{"data-read-only":$,"data-error":k,...u,checked:o,disabled:S,type:"checkbox",readOnly:s,ref:x}),y[13]=o,y[14]=s,y[15]=u,y[16]=$,y[17]=k,y[18]=S,y[19]=b):b=y[19],y[20]===Symbol.for("react.memo_cache_sentinel")?(v=(0,a.jsxs)("span",{children:[(0,a.jsx)(f.Nrt,{}),(0,a.jsx)(f.YPx,{})]}),y[20]=v):v=y[20],y[21]!==r||y[22]!==p||y[23]!==b?(w=(0,a.jsxs)(tA,{className:r,"data-ui":"Checkbox",style:p,children:[b,v]}),y[21]=r,y[22]=p,y[23]=b,y[24]=w):w=y[24],w});function tT({theme:e}){let{color:{syntax:t}}=(0,i.JW)(e);return{"&.atrule":{color:t.atrule},"&.attr-name":{color:t.attrName},"&.attr-value":{color:t.attrValue},"&.attribute":{color:t.attribute},"&.boolean":{color:t.boolean},"&.builtin":{color:t.builtin},"&.cdata":{color:t.cdata},"&.char":{color:t.char},"&.class":{color:t.class},"&.class-name":{color:t.className},"&.comment":{color:t.comment},"&.constant":{color:t.constant},"&.deleted":{color:t.deleted},"&.doctype":{color:t.doctype},"&.entity":{color:t.entity},"&.function":{color:t.function},"&.hexcode":{color:t.hexcode},"&.id":{color:t.id},"&.important":{color:t.important},"&.inserted":{color:t.inserted},"&.keyword":{color:t.keyword},"&.number":{color:t.number},"&.operator":{color:t.operator},"&.prolog":{color:t.prolog},"&.property":{color:t.property},"&.pseudo-class":{color:t.pseudoClass},"&.pseudo-element":{color:t.pseudoElement},"&.punctuation":{color:t.punctuation},"&.regex":{color:t.regex},"&.selector":{color:t.selector},"&.string":{color:t.string},"&.symbol":{color:t.symbol},"&.tag":{color:t.tag},"&.unit":{color:t.unit},"&.url":{color:t.url},"&.variable":{color:t.variable}}}tH.displayName="ForwardRef(Checkbox)";let tL=(0,l.lazy)(()=>o.e(7472).then(o.bind(o,47472))),tM=c.I4.pre.withConfig({displayName:"StyledCode",componentId:"sc-4dymyn-0"})(function(){return(0,c.AH)`
    color: var(--card-code-fg-color);

    & code {
      font-family: inherit;

      &.refractor .token {
        ${tT}
      }
    }

    & a {
      color: inherit;
      text-decoration: underline;
      border-radius: 1px;
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `},function(e){return F("code",e)}),tF=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m=(0,d.c)(22);m[0]!==e?({children:o,language:r,size:i,weight:c,...n}=e,m[0]=e,m[1]=o,m[2]=r,m[3]=n,m[4]=i,m[5]=c):(o=m[1],r=m[2],n=m[3],i=m[4],c=m[5]);let g=void 0===i?2:i;return m[6]!==g?(s=L(g),m[6]=g,m[7]=s):s=m[7],m[8]!==o?(u=(0,a.jsx)("code",{children:o}),m[8]=o,m[9]=u):u=m[9],m[10]!==o||m[11]!==r?(f=(0,a.jsx)(tL,{language:r,value:o}),m[10]=o,m[11]=r,m[12]=f):f=m[12],m[13]!==u||m[14]!==f?(p=(0,a.jsx)(l.Suspense,{fallback:u,children:f}),m[13]=u,m[14]=f,m[15]=p):p=m[15],m[16]!==t||m[17]!==n||m[18]!==s||m[19]!==p||m[20]!==c?(h=(0,a.jsx)(tM,{"data-ui":"Code",...n,$size:s,$weight:c,ref:t,children:p}),m[16]=t,m[17]=n,m[18]=s,m[19]=p,m[20]=c,m[21]=h):h=m[21],h});tF.displayName="ForwardRef(Code)";let tJ={width:"100%",margin:"0 auto"},tO=(0,c.I4)(to).withConfig({displayName:"StyledContainer",componentId:"sc-wyroop-0"})(function(){return tJ},function(e){let{container:t,media:o}=(0,i.JW)(e.theme);return T(o,e.$width,e=>({maxWidth:"auto"===e?"none":H(t[e])}))}),tB=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c=(0,d.c)(11);c[0]!==e?({as:o,width:n,...r}=e,c[0]=e,c[1]=o,c[2]=r,c[3]=n):(o=c[1],r=c[2],n=c[3]);let s=void 0===n?2:n;return c[4]!==s?(i=L(s),c[4]=s,c[5]=i):i=c[5],c[6]!==o||c[7]!==t||c[8]!==r||c[9]!==i?(l=(0,a.jsx)(tO,{"data-ui":"Container",...r,$width:i,forwardedAs:o,ref:t}),c[6]=o,c[7]=t,c[8]=r,c[9]=i,c[10]=l):l=c[10],l});tB.displayName="ForwardRef(Container)";let tP=(0,c.I4)(to).withConfig({displayName:"StyledGrid",componentId:"sc-v8t8oz-0"})(function(){return[eI,eE,ez,eN,e_,eA,eW,eH,eT]}),tD=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,S=(0,d.c)(42);S[0]!==e?({as:o,autoRows:i,autoCols:r,autoFlow:n,columns:c,gap:s,gapX:u,gapY:f,rows:h,children:l,...p}=e,S[0]=e,S[1]=o,S[2]=r,S[3]=n,S[4]=i,S[5]=l,S[6]=c,S[7]=s,S[8]=u,S[9]=f,S[10]=p,S[11]=h):(o=S[1],r=S[2],n=S[3],i=S[4],l=S[5],c=S[6],s=S[7],u=S[8],f=S[9],p=S[10],h=S[11]);let j="string"==typeof o?o:void 0;return S[12]!==i?(m=L(i),S[12]=i,S[13]=m):m=S[13],S[14]!==r?(g=L(r),S[14]=r,S[15]=g):g=S[15],S[16]!==n?(b=L(n),S[16]=n,S[17]=b):b=S[17],S[18]!==c?(v=L(c),S[18]=c,S[19]=v):v=S[19],S[20]!==s?(w=L(s),S[20]=s,S[21]=w):w=S[21],S[22]!==u?(y=L(u),S[22]=u,S[23]=y):y=S[23],S[24]!==f?(x=L(f),S[24]=f,S[25]=x):x=S[25],S[26]!==h?($=L(h),S[26]=h,S[27]=$):$=S[27],S[28]!==o||S[29]!==l||S[30]!==t||S[31]!==p||S[32]!==j||S[33]!==m||S[34]!==g||S[35]!==b||S[36]!==v||S[37]!==w||S[38]!==y||S[39]!==x||S[40]!==$?(k=(0,a.jsx)(tP,{"data-as":j,"data-ui":"Grid",...p,$autoRows:m,$autoCols:g,$autoFlow:b,$columns:v,$gap:w,$gapX:y,$gapY:x,$rows:$,forwardedAs:o,ref:t,children:l}),S[28]=o,S[29]=l,S[30]=t,S[31]=p,S[32]=j,S[33]=m,S[34]=g,S[35]=b,S[36]=v,S[37]=w,S[38]=y,S[39]=x,S[40]=$,S[41]=k):k=S[41],k});tD.displayName="ForwardRef(Grid)";let tV=c.I4.div.withConfig({displayName:"StyledHeading",componentId:"sc-137lwim-0"})(function(e){let{$accent:t,$muted:o}=e,{font:r}=(0,i.JW)(e.theme);return(0,c.AH)`
    ${t&&(0,c.AH)`
      color: var(--card-accent-fg-color);
    `}

    ${o&&(0,c.AH)`
      color: var(--card-muted-fg-color);
    `}

    & code {
      font-family: ${r.code.family};
      border-radius: 1px;
    }

    & a {
      text-decoration: none;
      border-radius: 1px;
      color: var(--card-link-color);
      outline: none;

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }

      &:focus {
        box-shadow:
          0 0 0 1px var(--card-bg-color),
          0 0 0 3px var(--card-focus-ring-color);
      }

      &:focus:not(:focus-visible) {
        box-shadow: none;
      }
    }

    & strong {
      font-weight: ${r.heading.weights.bold};
    }

    & svg {
      /* Certain popular CSS libraries changes the defaults for SVG display */
      /* Make sure SVGs are rendered as inline elements */
      display: inline;
    }

    & [data-sanity-icon] {
      vertical-align: baseline;
    }
  `},J,function(e){return F("heading",e)}),tG=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g=(0,d.c)(26);g[0]!==e?({accent:i,align:o,children:r,muted:l,size:c,textOverflow:s,weight:u,...n}=e,g[0]=e,g[1]=o,g[2]=r,g[3]=n,g[4]=i,g[5]=l,g[6]=c,g[7]=s,g[8]=u):(o=g[1],r=g[2],n=g[3],i=g[4],l=g[5],c=g[6],s=g[7],u=g[8]);let b=void 0!==i&&i,v=void 0!==l&&l,w=void 0===c?2:c,y=r;if("ellipsis"===s){let e;g[9]!==y?(e=(0,a.jsx)(eY,{children:y}),g[9]=y,g[10]=e):e=g[10],y=e}return g[11]!==o?(f=L(o),g[11]=o,g[12]=f):f=g[12],g[13]!==w?(p=L(w),g[13]=w,g[14]=p):p=g[14],g[15]!==y?(h=(0,a.jsx)("span",{children:y}),g[15]=y,g[16]=h):h=g[16],g[17]!==b||g[18]!==v||g[19]!==t||g[20]!==n||g[21]!==f||g[22]!==p||g[23]!==h||g[24]!==u?(m=(0,a.jsx)(tV,{"data-ui":"Heading",...n,$accent:b,$align:f,$muted:v,$size:p,$weight:u,ref:t,children:h}),g[17]=b,g[18]=v,g[19]=t,g[20]=n,g[21]=f,g[22]=p,g[23]=h,g[24]=u,g[25]=m):m=g[25],m});tG.displayName="ForwardRef(Heading)";let tY=(0,c.I4)(to).withConfig({displayName:"StyledInline",componentId:"sc-1pkiy6j-0"})(function(){return{lineHeight:"0","&&:not([hidden])":{display:"block"},"& > div":{display:"inline-block",verticalAlign:"middle"}}},function(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$space,e=>{let t=H(.5===e?o[1]/2:o[e]);return{margin:`-${t} 0 0 -${t}`,"& > div":{padding:`${t} 0 0 ${t}`}}})}),tX=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f=(0,d.c)(15);f[0]!==e?({as:o,children:r,space:i,...n}=e,f[0]=e,f[1]=o,f[2]=r,f[3]=n,f[4]=i):(o=f[1],r=f[2],n=f[3],i=f[4]),f[5]!==r?(c=l.Children.map(r,tU),f[5]=r,f[6]=c):c=f[6];let p=c;return f[7]!==i?(s=L(i),f[7]=i,f[8]=s):s=f[8],f[9]!==o||f[10]!==p||f[11]!==n||f[12]!==s||f[13]!==t?(u=(0,a.jsx)(tY,{"data-ui":"Inline",...n,$space:s,forwardedAs:o,ref:t,children:p}),f[9]=o,f[10]=p,f[11]=n,f[12]=s,f[13]=t,f[14]=u):u=f[14],u});function tU(e){return e&&(0,a.jsx)("div",{children:e})}tX.displayName="ForwardRef(Inline)";let tq=c.I4.kbd.withConfig({displayName:"StyledKBD",componentId:"sc-1w7yd8w-0"})(eV,function(){return(0,c.AH)`
    --card-bg-color: var(--card-kbd-bg-color);
    --card-border-color: var(--card-kbd-border-color);
    --card-fg-color: var(--card-kbd-fg-color);

    box-shadow: inset 0 0 0 1px var(--card-border-color);
    background: var(--card-bg-color);
    font: inherit;

    vertical-align: top;

    &:not([hidden]) {
      display: inline-block;
    }
  `}),tK=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p=(0,d.c)(19);p[0]!==e?({children:o,fontSize:n,padding:i,radius:l,...r}=e,p[0]=e,p[1]=o,p[2]=r,p[3]=n,p[4]=i,p[5]=l):(o=p[1],r=p[2],n=p[3],i=p[4],l=p[5]);let h=void 0===n?0:n,m=void 0===i?1:i,g=void 0===l?2:l;return p[6]!==g?(c=L(g),p[6]=g,p[7]=c):c=p[7],p[8]!==o||p[9]!==h?(s=(0,a.jsx)(tn,{as:"span",size:h,weight:"semibold",children:o}),p[8]=o,p[9]=h,p[10]=s):s=p[10],p[11]!==m||p[12]!==s?(u=(0,a.jsx)(to,{as:"span",padding:m,children:s}),p[11]=m,p[12]=s,p[13]=u):u=p[13],p[14]!==t||p[15]!==r||p[16]!==c||p[17]!==u?(f=(0,a.jsx)(tq,{"data-ui":"KBD",...r,$radius:c,ref:t,children:u}),p[14]=t,p[15]=r,p[16]=c,p[17]=u,p[18]=f):f=p[18],f});tK.displayName="ForwardRef(KBD)";let tZ={name:"@sanity/ui/origin",fn({middlewareData:e,placement:t,rects:o}){let[r]=t.split("-"),n=o.floating.width,i=o.floating.height,a=e.shift?.x||0,d=e.shift?.y||0;if(n<=0||i<=0)return{};let{originX:l,originY:c}=["bottom","top"].includes(r)?{originX:tQ(.5-a/n,0,1),originY:+("bottom"!==r)}:{originX:+("left"===r),originY:tQ(.5-d/i,0,1)};return{data:{originX:l,originY:c}}}};function tQ(e,t,o){return Math.min(Math.max(e,t),o)}function t1(e,t,o){let r=t.x-e.x,n=t.y-e.y;return t0(e,t,Math.min(1,o/Math.sqrt(r*r+n*n)))}function t0(e,t,o){return{x:e.x+(t.x-e.x)*o,y:e.y+(t.y-e.y)*o}}let t2=c.I4.div.withConfig({displayName:"StyledArrow",componentId:"sc-12vzy6c-0"})(({$w:e})=>(0,c.AH)`
    position: absolute;
    width: ${e}px;
    height: ${e}px;

    :empty + & {
      display: none;
    }

    & > svg {
      display: block;
      line-height: 0;
      transform-origin: ${e/2}px ${e/2}px;
    }

    [data-placement^='top'] > & {
      bottom: -${e}px;

      & > svg {
        transform: rotate(0);
      }
    }

    [data-placement^='right'] > & {
      left: -${e}px;

      & > svg {
        transform: rotate(90deg);
      }
    }

    [data-placement^='left'] > & {
      right: -${e}px;

      & > svg {
        transform: rotate(-90deg);
      }
    }

    [data-placement^='bottom'] > & {
      top: -${e}px;

      & > svg {
        transform: rotate(180deg);
      }
    }
  `),t3=c.I4.path.withConfig({displayName:"StrokePath",componentId:"sc-12vzy6c-1"})`stroke:var(--card-shadow-outline-color);`,t4=c.I4.path.withConfig({displayName:"ShapePath",componentId:"sc-12vzy6c-2"})`fill:var(--card-bg-color);`,t5=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h=(0,d.c)(29);h[0]!==e?({width:i,height:o,radius:n,...r}=e,h[0]=e,h[1]=o,h[2]=r,h[3]=n,h[4]=i):(o=h[1],r=h[2],n=h[3],i=h[4]);let m=void 0===n?0:n,{card:g}=X(),b=g.shadow.outline,v=i/2;h[5]!==v||h[6]!==o||h[7]!==m||h[8]!==i?(l=(function(e){let t=e.length,o=[];for(let r=0;r<t;r+=1){let t=e[r],n=e[r-1],i=e[r+1];if(n&&t.radius){let e=t1(t,n,t.radius),r=t1(t,i,t.radius),a=t0(e,t,.5),d=t0(t,r,.5);o.push({type:"point",...e}),o.push({type:"curve",curveEnd:r,startControl:a,endControl:d})}else o.push({type:"point",...t})}return o})([{x:0,y:0},{x:m,y:0,radius:m},{x:v,y:o-1,radius:m},{x:i-m,y:0,radius:m},{x:i,y:0}]).map((e,t)=>"point"===e.type?`${0===t?"M":"L"} ${e.x} ${e.y}`:"curve"===e.type?`C ${e.startControl.x} ${e.startControl.y} ${e.endControl.x} ${e.endControl.y} ${e.curveEnd.x} ${e.curveEnd.y}`:"").join(" "),h[5]=v,h[6]=o,h[7]=m,h[8]=i,h[9]=l):l=h[9];let w=l,y=`${w}`,x=`${w} M ${i} -1 M 0 -1 Z`,$=`0 0 ${i} ${i}`;h[10]!==b||h[11]!==i?(c=(0,a.jsx)("mask",{id:"stroke-mask",children:(0,a.jsx)("rect",{x:0,y:b,width:i,height:i,fill:"white"})}),h[10]=b,h[11]=i,h[12]=c):c=h[12];let k=2*b;return h[13]!==y||h[14]!==k?(s=(0,a.jsx)(t3,{d:y,mask:"url(#stroke-mask)",strokeWidth:k}),h[13]=y,h[14]=k,h[15]=s):s=h[15],h[16]!==x?(u=(0,a.jsx)(t4,{d:x}),h[16]=x,h[17]=u):u=h[17],h[18]!==$||h[19]!==c||h[20]!==s||h[21]!==u||h[22]!==i?(f=(0,a.jsxs)("svg",{width:i,height:i,viewBox:$,children:[c,s,u]}),h[18]=$,h[19]=c,h[20]=s,h[21]=u,h[22]=i,h[23]=f):f=h[23],h[24]!==t||h[25]!==r||h[26]!==f||h[27]!==i?(p=(0,a.jsx)(t2,{...r,$w:i,ref:t,children:f}),h[24]=t,h[25]=r,h[26]=f,h[27]=i,h[28]=p):p=h[28],p});t5.displayName="ForwardRef(Arrow)";let t6=B("@sanity/ui/context/boundaryElement",null);function t7(e){let t,o,r=(0,d.c)(5),{children:n,element:i}=e;r[0]!==i?(t={version:0,element:i},r[0]=i,r[1]=t):t=r[1];let l=t;return r[2]!==n||r[3]!==l?(o=(0,a.jsx)(t6.Provider,{value:l,children:n}),r[2]=n,r[3]=l,r[4]=o):o=r[4],o}function t8(e){return!!(e&&"object"==typeof e&&!Array.isArray(e))}t7.displayName="BoundaryElementProvider";let t9={version:0,element:null};function oe(){let e=(0,l.useContext)(t6);if(e&&(!t8(e)||0!==e.version))throw Error("useBoundaryElement(): the context value is not compatible");return e||t9}let ot=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p=(0,d.c)(18),h=X();p[0]!==e?({children:r,media:o,...n}=e,p[0]=e,p[1]=o,p[2]=r,p[3]=n):(o=p[1],r=p[2],n=p[3]);let m=o??h.media,[g,b]=(0,l.useState)(null),v=tS(g)?.border.width??window.innerWidth;if(p[4]!==m||p[5]!==v){let e=function(e,t){let o=[];for(let r=0;r<e.length;r+=1)e[r]>t&&o.push(r);return o}(m,v);i=e.length?e.join(" "):void 0,p[4]=m,p[5]=v,p[6]=i}else i=p[6];let w=i;if(p[7]!==m||p[8]!==v){let e=function(e,t){let o=[];for(let r=0;r<e.length;r+=1)e[r]<=t&&o.push(r);return o}(m,v);c=e.length?e.join(" "):void 0,p[7]=m,p[8]=v,p[9]=c}else c=p[9];let y=c;return p[10]!==g?(s=()=>g,u=[g],p[10]=g,p[11]=s,p[12]=u):(s=p[11],u=p[12]),(0,l.useImperativeHandle)(t,s,u),p[13]!==r||p[14]!==w||p[15]!==y||p[16]!==n?(f=(0,a.jsx)("div",{"data-ui":"ElementQuery",...n,"data-eq-max":w,"data-eq-min":y,ref:b,children:r}),p[13]=r,p[14]=w,p[15]=y,p[16]=n,p[17]=f):f=p[17],f});function oo(e){if(!t8(e)||0!==e.version)throw Error("the context value is not compatible");if(!e)throw Error("components using `useLayer()` should be wrapped in a <LayerProvider>.");if(0===e.version)return e;throw Error("could not get layer context")}ot.displayName="ForwardRef(ElementQuery)";let or=B("@sanity/ui/context/layer",null);function on(e){let t,o,r,n,i,c,s,u,f=(0,d.c)(21),{children:p,zOffset:h}=e,m=void 0===h?0:h,g=(0,l.useContext)(or);f[0]!==g?(t=g&&oo(g),f[0]=g,f[1]=t):t=f[1];let b=t,v=b?.registerChild,w=(b?.level??0)+1;f[2]!==m?(o=L(m),f[2]=m,f[3]=o):o=f[3];let y=o,x=y.length-1,$=Math.min(tC(),x),k=b?b.zIndex+y[$]:y[$];f[4]===Symbol.for("react.memo_cache_sentinel")?(r={},f[4]=r):r=f[4];let[,S]=(0,l.useState)(r),[j,I]=(0,l.useState)(0),R=0===j;f[5]!==v||f[6]!==S?(n=e=>{let t=v?.(e);return void 0!==e?S(t=>{let o=t[e]??0,r={...t,[e]:o+1};return I(Object.keys(r).length),r}):I(oa),()=>{void 0!==e?S(t=>{let o={...t};return 1===o[e]?(delete o[e],I(Object.keys(o).length)):o[e]=o[e]-1,o}):I(oi),t?.()}},f[5]=v,f[6]=S,f[7]=n):n=f[7];let C=n;f[8]!==w||f[9]!==v?(i=()=>v?.(w),c=[w,v],f[8]=w,f[9]=v,f[10]=i,f[11]=c):(i=f[10],c=f[11]),(0,l.useEffect)(i,c),f[12]!==R||f[13]!==w||f[14]!==C||f[15]!==j||f[16]!==k?(s={version:0,isTopLayer:R,level:w,registerChild:C,size:j,zIndex:k},f[12]=R,f[13]=w,f[14]=C,f[15]=j,f[16]=k,f[17]=s):s=f[17];let E=s;return f[18]!==p||f[19]!==E?(u=(0,a.jsx)(or.Provider,{value:E,children:p}),f[18]=p,f[19]=E,f[20]=u):u=f[20],u}function oi(e){return e-1}function oa(e){return e+1}function od(){let e=(0,d.c)(2),t=(0,l.useContext)(or);if(!t)throw Error("useLayer(): missing context value");try{let o;return e[0]!==t?(o=oo(t),e[0]=t,e[1]=o):o=e[1],o}catch(e){throw e instanceof Error?Error(`useLayer(): ${e.message}`):Error(`useLayer(): ${e}`)}}on.displayName="LayerProvider";let ol=c.I4.div.withConfig({displayName:"StyledLayer",componentId:"sc-16kojrv-0"})({position:"relative"}),oc=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g=(0,d.c)(22);g[0]!==e?({children:o,onActivate:r,onFocus:n,style:c,...i}=e,g[0]=e,g[1]=o,g[2]=r,g[3]=n,g[4]=i,g[5]=c):(o=g[1],r=g[2],n=g[3],i=g[4],c=g[5]);let b=void 0===c?k:c,{zIndex:v,isTopLayer:w}=od(),y=(0,l.useRef)(null),x=(0,l.useRef)(null),$=(0,l.useRef)(w);g[6]===Symbol.for("react.memo_cache_sentinel")?(s=()=>x.current,g[6]=s):s=g[6],(0,l.useImperativeHandle)(t,s),g[7]!==w||g[8]!==r?(u=()=>{$.current!==w&&w&&r?.({activeElement:y.current}),$.current=w},f=[w,r],g[7]=w,g[8]=r,g[9]=u,g[10]=f):(u=g[9],f=g[10]),(0,l.useEffect)(u,f),g[11]!==w||g[12]!==n?(p=e=>{n?.(e);let t=x.current,o=document.activeElement;!w||!t||!o||C(o)&&W(t,o)&&(y.current=o)},g[11]=w,g[12]=n,g[13]=p):p=g[13];let S=p;return g[14]!==b||g[15]!==v?(h={...b,zIndex:v},g[14]=b,g[15]=v,g[16]=h):h=g[16],g[17]!==o||g[18]!==S||g[19]!==i||g[20]!==h?(m=(0,a.jsx)(ol,{...i,"data-ui":"Layer",onFocus:S,ref:x,style:h,children:o}),g[17]=o,g[18]=S,g[19]=i,g[20]=h,g[21]=m):m=g[21],m}),os=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c=(0,d.c)(11);c[0]!==e?({children:o,zOffset:n,...r}=e,c[0]=e,c[1]=o,c[2]=r,c[3]=n):(o=c[1],r=c[2],n=c[3]);let s=void 0===n?1:n;return c[4]!==o||c[5]!==t||c[6]!==r?(i=(0,a.jsx)(oc,{...r,ref:t,children:o}),c[4]=o,c[5]=t,c[6]=r,c[7]=i):i=c[7],c[8]!==i||c[9]!==s?(l=(0,a.jsx)(on,{zOffset:s,children:i}),c[8]=i,c[9]=s,c[10]=l):l=c[10],l});os.displayName="ForwardRef(Layer)";let ou="@sanity/ui/context/portal",of=Symbol.for(`${ou}/element`);O[of]=null;let op=B(ou,{version:0,boundaryElement:null,get element(){return typeof document>"u"?null:(O[of]||(O[of]=document.createElement("div"),O[of].setAttribute("data-portal",""),document.body.appendChild(O[of])),O[of])}});function oh(){let e=(0,l.useContext)(op);if(!e)throw Error("usePortal(): missing context value");if(!t8(e)||0!==e.version)throw Error("usePortal(): the context value is not compatible");return e}function om(e){let t,o=(0,d.c)(3),{children:r,__unstable_name:n}=e,i=oh(),a=(n?i.elements&&i.elements[n]:i.element)||i.elements?.default;return a?(o[0]!==r||o[1]!==a?(t=(0,v.createPortal)(r,a),o[0]=r,o[1]=a,o[2]=t):t=o[2],t):null}function og(e){let t,o,r=(0,d.c)(7),{boundaryElement:n,children:i,element:c,__unstable_elements:s}=e,u=(0,l.useSyncExternalStore)(ow,ov,ob),f=n||null,p=c||u;r[0]!==s||r[1]!==f||r[2]!==p?(t={version:0,boundaryElement:f,element:p,elements:s},r[0]=s,r[1]=f,r[2]=p,r[3]=t):t=r[3];let h=t;return r[4]!==i||r[5]!==h?(o=(0,a.jsx)(op.Provider,{value:h,children:i}),r[4]=i,r[5]=h,r[6]=o):o=r[6],o}function ob(){return null}function ov(){return document.body}om.displayName="Portal",og.displayName="PortalProvider";let ow=()=>()=>{},oy=c.I4.div.withConfig({displayName:"StyledSrOnly",componentId:"sc-mubr0c-0"})`display:block;width:0;height:0;position:absolute;overflow:hidden;overflow:clip;`;(0,l.forwardRef)(function(e,t){let o,r=(0,d.c)(4),{as:n,children:i}=e;return r[0]!==n||r[1]!==i||r[2]!==t?(o=(0,a.jsx)(oy,{"aria-hidden":!0,as:n,"data-ui":"SrOnly",ref:t,children:i}),r[0]=n,r[1]=i,r[2]=t,r[3]=o):o=r[3],o}).displayName="ForwardRef(SrOnly)";let ox=c.I4.div.withConfig({displayName:"StyledVirtualList",componentId:"sc-dlqsj4-0"})`position:relative;`,o$=c.I4.div.withConfig({displayName:"ItemWrapper",componentId:"sc-dlqsj4-1"})`position:absolute;left:0;right:0;`,ok=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,S=(0,d.c)(44);S[0]!==e?({as:c,gap:s,getItemKey:o,items:u,onChange:r,renderItem:n,...i}=e,S[0]=e,S[1]=o,S[2]=r,S[3]=n,S[4]=i,S[5]=c,S[6]=s,S[7]=u):(o=S[1],r=S[2],n=S[3],i=S[4],c=S[5],s=S[6],u=S[7]);let j=void 0===c?"div":c,I=void 0===s?0:s;S[8]!==u?(f=void 0===u?[]:u,S[8]=u,S[9]=f):f=S[9];let R=f,{space:C}=X(),E=(0,l.useRef)(null),z=(0,l.useRef)(null),[N,_]=(0,l.useState)(0),[A,W]=(0,l.useState)(0),[H,T]=(0,l.useState)(-1);S[10]===Symbol.for("react.memo_cache_sentinel")?(p=()=>E.current,S[10]=p):p=S[10],(0,l.useImperativeHandle)(t,p),S[11]===Symbol.for("react.memo_cache_sentinel")?(h=()=>{if(!z.current)return;let e=z.current.firstChild;e instanceof HTMLElement&&T(e.offsetHeight)},S[11]=h):h=S[11],S[12]!==n?(m=[n],S[12]=n,S[13]=m):m=S[13],(0,l.useEffect)(h,m),S[14]===Symbol.for("react.memo_cache_sentinel")?(g=()=>{if(!E.current)return;let e=function(e){let t=e;for(;t&&!function(e){if(!(e instanceof Element))return!1;let t=window.getComputedStyle(e);return t.overflowX.includes("auto")||t.overflowX.includes("scroll")||t.overflowY.includes("auto")||t.overflowY.includes("scroll")}(t);)t=t.parentNode;return t}(E.current.parentNode);if(e){if(!(e instanceof HTMLElement))return;let t=()=>{_(e.scrollTop)};e.addEventListener("scroll",t,{passive:!0});let o=new t$(e=>{W(e[0].contentRect.height)});return o.observe(e),t(),()=>{e.removeEventListener("scroll",t),o.unobserve(e),o.disconnect()}}let t=()=>{_(window.scrollY)},o=()=>{W(window.innerHeight)};return window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",o),W(window.innerHeight),t(),()=>{window.removeEventListener("scroll",t),window.removeEventListener("resize",o)}},b=[],S[14]=g,S[15]=b):(g=S[14],b=S[15]),(0,l.useEffect)(g,b);let L=R.length,M=H?L*(H+C[I])-C[I]:0,F=M?Math.max(Math.floor(N/M*L)-2,0):0,J=M?Math.ceil((N+A)/M*L)+1:0;S[16]!==F||S[17]!==I||S[18]!==H||S[19]!==r||S[20]!==A||S[21]!==N||S[22]!==C||S[23]!==J?(w=()=>{r&&r({fromIndex:F,gap:C[I],itemHeight:H,scrollHeight:A,scrollTop:N,toIndex:J})},v=[F,I,H,r,A,N,C,J],S[16]=F,S[17]=I,S[18]=H,S[19]=r,S[20]=A,S[21]=N,S[22]=C,S[23]=J,S[24]=v,S[25]=w):(v=S[24],w=S[25]),(0,l.useEffect)(w,v),S[26]!==F||S[27]!==I||S[28]!==o||S[29]!==H||S[30]!==R||S[31]!==n||S[32]!==C||S[33]!==J?(y={fromIndex:F,gap:I,itemHeight:H,space:C,toIndex:J,getItemKey:o,items:R,renderItem:n},S[26]=F,S[27]=I,S[28]=o,S[29]=H,S[30]=R,S[31]=n,S[32]=C,S[33]=J,S[34]=y):y=S[34];let O=function(e){let t,o=(0,d.c)(21),{fromIndex:r,gap:n,getItemKey:i,itemHeight:l,items:c,renderItem:s,space:u,toIndex:f}=e;if(!s||0===c.length)return null;if(-1===l){let e,t;return o[0]!==c[0]||o[1]!==s?(e=s(c[0]),o[0]=c[0],o[1]=s,o[2]=e):e=o[2],o[3]!==e?(t=[(0,a.jsx)(o$,{children:e},0)],o[3]=e,o[4]=t):t=o[4],t}if(o[5]!==r||o[6]!==n||o[7]!==i||o[8]!==l||o[9]!==c||o[10]!==s||o[11]!==u||o[12]!==f){let e;o[14]!==r||o[15]!==n||o[16]!==i||o[17]!==l||o[18]!==s||o[19]!==u?(e=(e,t)=>{let o=r+t,d=s(e),c=i?i(e,o):o;return(0,a.jsx)(o$,{style:{top:o*(l+u[n])},children:d},c)},o[14]=r,o[15]=n,o[16]=i,o[17]=l,o[18]=s,o[19]=u,o[20]=e):e=o[20],t=c.slice(r,f).map(e),o[5]=r,o[6]=n,o[7]=i,o[8]=l,o[9]=c,o[10]=s,o[11]=u,o[12]=f,o[13]=t}else t=o[13];return t}(y);return S[35]!==M?(x={height:M},S[35]=M,S[36]=x):x=S[36],S[37]!==O||S[38]!==x?($=(0,a.jsx)("div",{ref:z,style:x,children:O}),S[37]=O,S[38]=x,S[39]=$):$=S[39],S[40]!==j||S[41]!==i||S[42]!==$?(k=(0,a.jsx)(ox,{as:j,"data-ui":"VirtualList",...i,ref:E,children:$}),S[40]=j,S[41]=i,S[42]=$,S[43]=k):k=S[43],k});function oS(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,o=t&&"isReactWarning"in t&&t.isReactWarning;return o?e.ref:(o=(t=Object.getOwnPropertyDescriptor(e,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?e.props.ref:e.props.ref||e.ref}ok.displayName="ForwardRef(VirtualList)";let oj=[0,0,0,0],oI={top:["bottom","left","right"],"top-start":["bottom-start","left-start","right-start"],"top-end":["bottom-end","left-end","right-end"],bottom:["top","left","right"],"bottom-start":["top-start","left-start","right-start"],"bottom-end":["top-end","left-end","right-end"],left:["right","top","bottom"],"left-start":["right-start","top-start","bottom-start"],"left-end":["right-end","top-end","bottom-end"],right:["left","top","bottom"],"right-start":["left-start","top-start","bottom-start"],"right-end":["left-end","top-end","bottom-end"]},oR=(0,c.I4)(m.P.create(tv)).withConfig({displayName:"MotionCard",componentId:"sc-ihg31s-0"})`&:not([hidden]){display:flex;}flex-direction:column;width:max-content;min-width:min-content;will-change:transform;`,oC=(0,c.I4)(m.P.create(tl)).withConfig({displayName:"MotionFlex",componentId:"sc-ihg31s-1"})`will-change:opacity;`,oE=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,R,C,E,z,N,_,A,W,H,T,L,M=(0,d.c)(66);M[0]!==e?({__unstable_margins:s,animate:o,arrow:r,arrowRef:n,arrowX:i,arrowY:l,children:c,padding:h,placement:m,originX:u,originY:f,overflow:p,radius:g,scheme:v,shadow:w,strategy:y,style:x,tone:$,width:k,x:R,y:C,...b}=e,M[0]=e,M[1]=o,M[2]=r,M[3]=n,M[4]=i,M[5]=l,M[6]=c,M[7]=s,M[8]=u,M[9]=f,M[10]=p,M[11]=h,M[12]=m,M[13]=g,M[14]=b,M[15]=v,M[16]=w,M[17]=y,M[18]=x,M[19]=$,M[20]=k,M[21]=R,M[22]=C):(o=M[1],r=M[2],n=M[3],i=M[4],l=M[5],c=M[6],s=M[7],u=M[8],f=M[9],p=M[10],h=M[11],m=M[12],g=M[13],b=M[14],v=M[15],w=M[16],y=M[17],x=M[18],$=M[19],k=M[20],R=M[21],C=M[22]);let{zIndex:F}=od(),J=s||oj,O=(R??0)+J[3],B=(C??0)+J[0],P=o?"transform":void 0;M[23]!==u||M[24]!==f||M[25]!==y||M[26]!==x||M[27]!==P||M[28]!==k||M[29]!==O||M[30]!==B||M[31]!==F?(E={left:O,originX:u,originY:f,position:y,top:B,width:k,zIndex:F,willChange:P,...x},M[23]=u,M[24]=f,M[25]=y,M[26]=x,M[27]=P,M[28]=k,M[29]=O,M[30]=B,M[31]=F,M[32]=E):E=M[32];let D=E,V=null!==i?i:void 0,G=null!==l?l:void 0;M[33]!==V||M[34]!==G?(z={left:V,top:G,right:void 0,bottom:void 0},M[33]=V,M[34]=G,M[35]=z):z=M[35];let Y=z,X=b;return M[36]!==o?(N=o?["hidden","initial"]:void 0,M[36]=o,M[37]=N):N=M[37],M[38]!==o?(_=o?["visible","scaleIn"]:void 0,M[38]=o,M[39]=_):_=M[39],M[40]!==o?(A=o?["hidden","scaleOut"]:void 0,M[40]=o,M[41]=A):A=M[41],M[42]!==c||M[43]!==h?(W=(0,a.jsx)(tl,{direction:"column",flex:1,padding:h,children:c}),M[42]=c,M[43]=h,M[44]=W):W=M[44],M[45]!==p||M[46]!==W?(H=(0,a.jsx)(oC,{"data-ui":"Popover__wrapper",direction:"column",flex:1,overflow:p,variants:j,transition:I,children:W}),M[45]=p,M[46]=W,M[47]=H):H=M[47],M[48]!==r||M[49]!==n||M[50]!==Y?(T=r&&(0,a.jsx)(t5,{ref:n,style:Y,width:19,height:8,radius:2}),M[48]=r,M[49]=n,M[50]=Y,M[51]=T):T=M[51],M[52]!==m||M[53]!==g||M[54]!==t||M[55]!==D||M[56]!==v||M[57]!==w||M[58]!==H||M[59]!==T||M[60]!==X||M[61]!==N||M[62]!==_||M[63]!==A||M[64]!==$?(L=(0,a.jsxs)(oR,{"data-ui":"Popover",...X,"data-placement":m,radius:g,ref:t,scheme:v,shadow:w,sizing:"border",style:D,tone:$,variants:S,transition:I,initial:N,animate:_,exit:A,children:[H,T]}),M[52]=m,M[53]=g,M[54]=t,M[55]=D,M[56]=v,M[57]=w,M[58]=H,M[59]=T,M[60]=X,M[61]=N,M[62]=_,M[63]=A,M[64]=$,M[65]=L):L=M[65],L});oE.displayName="ForwardRef(PopoverCard)";let oz=()=>{let e,t=(0,d.c)(2),{zIndex:o}=od();return t[0]!==o?(e=(0,a.jsx)("div",{style:{height:"100vh",inset:0,position:"fixed",width:"100vw",zIndex:o}}),t[0]=o,t[1]=e):e=t[1],e},oN=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,m,b,v,w,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P,D,V,G,Y,U,q,K,Z,Q,ee,et,eo,er,en,ei,ea,ed,el,ec,es,eu,ef,ep=(0,d.c)(126),{container:eh,layer:em}=X(),eg=oe();if(ep[0]!==e){let{__unstable_margins:t,animate:a,arrow:d,boundaryElement:l,children:p,constrainSize:h,content:g,disabled:L,fallbackPlacements:M,matchReferenceWidth:F,floatingBoundary:J,modal:O,onActivate:B,open:P,overflow:D,padding:V,placement:G,placementStrategy:Y,portal:X,preventOverflow:U,radius:q,referenceBoundary:K,referenceElement:Z,scheme:Q,shadow:ee,tone:et,width:eo,zOffset:er,updateRef:en,...ei}=e;S=t,j=a,C=d,o=l,s=p,E=h,u=g,f=L,r=M,m=F,n=J,b=O,v=P,z=D,w=V,N=G,_=Y,y=X,A=U,W=q,i=K,x=Z,k=Q,H=ee,I=et,R=eo,c=er,T=en,$=ei,ep[0]=e,ep[1]=o,ep[2]=r,ep[3]=n,ep[4]=i,ep[5]=c,ep[6]=s,ep[7]=u,ep[8]=f,ep[9]=m,ep[10]=b,ep[11]=v,ep[12]=w,ep[13]=y,ep[14]=x,ep[15]=$,ep[16]=k,ep[17]=S,ep[18]=j,ep[19]=I,ep[20]=R,ep[21]=C,ep[22]=E,ep[23]=z,ep[24]=N,ep[25]=_,ep[26]=A,ep[27]=W,ep[28]=H,ep[29]=T}else o=ep[1],r=ep[2],n=ep[3],i=ep[4],c=ep[5],s=ep[6],u=ep[7],f=ep[8],m=ep[9],b=ep[10],v=ep[11],w=ep[12],y=ep[13],x=ep[14],$=ep[15],k=ep[16],S=ep[17],j=ep[18],I=ep[19],R=ep[20],C=ep[21],E=ep[22],z=ep[23],N=ep[24],_=ep[25],A=ep[26],W=ep[27],H=ep[28],T=ep[29];let eb=void 0===S?oj:S,ev=void 0!==j&&j,ew=void 0!==C&&C,ey=void 0!==E&&E,ex=void 0===z?"hidden":z,e$=void 0===N?"bottom":N,ek=void 0===_?"flip":_,eS=void 0===A||A,ej=void 0===W?3:W,eI=void 0===H?3:H,eR=void 0===I?"inherit":I,eC=void 0===R?"auto":R,eE=o??eg?.element,ez=r??oI[e.placement??"bottom"],eN=n??e.boundaryElement??eg.element,e_=i??e.boundaryElement??eg.element,eA=c??em.popover.zOffset,eW=!tN()&&ev,eH=tS(eE)?.border;ep[30]!==w?(M=L(w),ep[30]=w,ep[31]=M):M=ep[31];let eT=M;ep[32]!==ej?(F=L(ej),ep[32]=ej,ep[33]=F):F=ep[33];let eL=F;ep[34]!==eI?(J=L(eI),ep[34]=eI,ep[35]=J):J=ep[35];let eM=J,eF=L(eC);ep[36]!==eA?(O=L(eA),ep[36]=eA,ep[37]=O):O=ep[37];let eJ=O,eO=(0,l.useRef)(null),eB=(0,l.useRef)(null);ep[38]===Symbol.for("react.memo_cache_sentinel")?(B=()=>eO.current,ep[38]=B):B=ep[38],(0,l.useImperativeHandle)(t,B);let eP=tC(),eD=ey||eS?eH?.width:void 0,eV=function(e){let{container:t,mediaIndex:o,width:r}=e,n=r[o],i=void 0===n?r[r.length-1]:n;return"number"==typeof i?t[i]:void 0}({container:eh,mediaIndex:eP,width:eF}),eG=(0,l.useRef)(eV);ep[39]!==eV?(P=()=>{eG.current=eV},D=[eV],ep[39]=eV,ep[40]=P,ep[41]=D):(P=ep[40],D=ep[41]),(0,l.useEffect)(P,D),ep[42]!==eD||ep[43]!==eV?(V=function(e){let{boundaryWidth:t,currentWidth:o}=e;if(void 0!==o||void 0!==t)return Math.min(o??1/0,(t||1/0)-8)}({boundaryWidth:eD,currentWidth:eV}),ep[42]=eD,ep[43]=eV,ep[44]=V):V=ep[44];let eY=V,eX=(0,l.useRef)(eY);ep[45]!==eY?(G=()=>{eX.current=eY},Y=[eY],ep[45]=eY,ep[46]=G,ep[47]=Y):(G=ep[46],Y=ep[47]),(0,l.useEffect)(G,Y);let eU=(0,l.useRef)(void 0);ep[48]!==m||ep[49]!==eY||ep[50]!==v||ep[51]!==eV?(U=()=>{let e=eO.current;if(!v||!e)return;let t=eU.current;m?void 0!==t&&(e.style.width=`${t}px`):void 0!==eV&&(e.style.width=`${eV}px`),"number"==typeof eY&&(e.style.maxWidth=`${eY}px`)},q=[eV,m,eY,v],ep[48]=m,ep[49]=eY,ep[50]=v,ep[51]=eV,ep[52]=U,ep[53]=q):(U=ep[52],q=ep[53]),(0,l.useEffect)(U,q);let[eq,eK]=(0,l.useState)(void 0);ep[54]!==eW||ep[55]!==ew||ep[56]!==ey||ep[57]!==ez||ep[58]!==eN||ep[59]!==eb||ep[60]!==m||ep[61]!==e$||ep[62]!==ek||ep[63]!==eS||ep[64]!==e_?(K={animate:eW,arrowProp:ew,arrowRef:eB,constrainSize:ey,fallbackPlacements:ez,floatingBoundary:eN,margins:eb,matchReferenceWidth:m,maxWidthRef:eX,placementProp:e$,placementStrategy:ek,preventOverflow:eS,referenceBoundary:e_,referenceWidthRef:eU,rootBoundary:"viewport",setReferenceWidth:eK,widthRef:eG},ep[54]=eW,ep[55]=ew,ep[56]=ey,ep[57]=ez,ep[58]=eN,ep[59]=eb,ep[60]=m,ep[61]=e$,ep[62]=ek,ep[63]=eS,ep[64]=e_,ep[65]=K):K=ep[65];let eZ=function(e){let t,o=(0,d.c)(42),{animate:r,arrowProp:n,arrowRef:i,constrainSize:a,fallbackPlacements:l,floatingBoundary:c,margins:s,matchReferenceWidth:u,maxWidthRef:f,placementProp:m,placementStrategy:g,preventOverflow:b,referenceBoundary:v,referenceWidthRef:w,rootBoundary:y,setReferenceWidth:x,widthRef:$}=e;if(o[0]!==r||o[1]!==n||o[2]!==i||o[3]!==a||o[4]!==l||o[5]!==c||o[6]!==s||o[7]!==u||o[8]!==f||o[9]!==m||o[10]!==g||o[11]!==b||o[12]!==v||o[13]!==w||o[14]!==y||o[15]!==x||o[16]!==$){let e,d;if(t=[],a||b)if("autoPlacement"===g){let e;o[18]!==l||o[19]!==m?(e=(0,h.RK)({allowedPlacements:[m].concat(l)}),o[18]=l,o[19]=m,o[20]=e):e=o[20],t.push(e)}else{let e,r=c||void 0;o[21]!==l||o[22]!==y||o[23]!==r?(e=(0,h.UU)({boundary:r,fallbackPlacements:l,padding:4,rootBoundary:y}),o[21]=l,o[22]=y,o[23]=r,o[24]=e):e=o[24],t.push(e)}if(o[25]===Symbol.for("react.memo_cache_sentinel")?(e=(0,h.cY)({mainAxis:4}),o[25]=e):e=o[25],t.push(e),a||u){let e,r=c||void 0;o[26]!==a||o[27]!==s||o[28]!==u||o[29]!==f||o[30]!==w||o[31]!==x||o[32]!==r||o[33]!==$?(e=function(e){let{constrainSize:t,margins:o,matchReferenceWidth:r,maxWidthRef:n,padding:i=0,referenceWidthRef:a,setReferenceWidth:d,widthRef:l}=e;return{name:"@sanity/ui/size",async fn(c){let{elements:s,placement:u,platform:f,rects:h}=c,{floating:m,reference:g}=h,b=await (0,p.__)(c,{altBoundary:!0,boundary:e.boundaryElement||void 0,elementContext:"floating",padding:i,rootBoundary:"viewport"}),v=1/0,w=1/0,y=m.width,x=m.height;u.includes("top")&&(v=y-(b.left+b.right),w=x-b.top),u.includes("right")&&(v=y-b.right,w=x-(b.top+b.bottom)),u.includes("bottom")&&(v=y-(b.left+b.right),w=x-b.bottom),u.includes("left")&&(v=y-b.left,w=x-(b.top+b.bottom));let $=v-o[1]-o[3],k=w-o[0]-o[2],S=g.width-o[1]-o[3];a.current=S,d(S),r?s.floating.style.width=`${S}px`:void 0!==l.current&&(s.floating.style.width=`${l.current}px`),t&&(s.floating.style.maxWidth=`${Math.min($,n.current??1/0)}px`,s.floating.style.maxHeight=`${k}px`);let j=await f.getDimensions(s.floating),I=j.height;return y!==j.width||x!==I?{reset:{rects:!0}}:{}}}}({boundaryElement:r,constrainSize:a,margins:s,matchReferenceWidth:u,maxWidthRef:f,padding:4,referenceWidthRef:w,setReferenceWidth:x,widthRef:$}),o[26]=a,o[27]=s,o[28]=u,o[29]=f,o[30]=w,o[31]=x,o[32]=r,o[33]=$,o[34]=e):e=o[34],t.push(e)}if(b){let e,r=c||void 0;o[35]!==y||o[36]!==r?(e=(0,h.BN)({boundary:r,rootBoundary:y,padding:4}),o[35]=y,o[36]=r,o[37]=e):e=o[37],t.push(e)}if(n){let e;o[38]!==i?(e=(0,h.UE)({element:i,padding:4}),o[38]=i,o[39]=e):e=o[39],t.push(e)}r&&t.push(tZ);let k=v||void 0;o[40]!==k?(d=(0,h.jD)({boundary:k,padding:4,strategy:"referenceHidden"}),o[40]=k,o[41]=d):d=o[41],t.push(d),o[0]=r,o[1]=n,o[2]=i,o[3]=a,o[4]=l,o[5]=c,o[6]=s,o[7]=u,o[8]=f,o[9]=m,o[10]=g,o[11]=b,o[12]=v,o[13]=w,o[14]=y,o[15]=x,o[16]=$,o[17]=t}else t=o[17];return t}(K);ep[66]!==x?(Z=x?{reference:x}:void 0,ep[66]=x,ep[67]=Z):Z=ep[67],ep[68]!==eZ||ep[69]!==e$||ep[70]!==Z?(Q={middleware:eZ,placement:e$,whileElementsMounted:p.ll,elements:Z},ep[68]=eZ,ep[69]=e$,ep[70]=Z,ep[71]=Q):Q=ep[71];let{x:eQ,y:e1,middlewareData:e0,placement:e2,refs:e3,strategy:e4,update:e5}=(0,h.we)(Q),e6=e0.hide?.referenceHidden,e7=e0.arrow?.x,e8=e0.arrow?.y,e9=e0["@sanity/ui/origin"]?.originX,te=e0["@sanity/ui/origin"]?.originY;ep[72]===Symbol.for("react.memo_cache_sentinel")?(ee=e=>{eB.current=e},ep[72]=ee):ee=ep[72];let tt=ee;ep[73]!==e3?(et=e=>{eO.current=e,e3.setFloating(e)},ep[73]=e3,ep[74]=et):et=ep[74];let to=et;ep[75]!==s?(eo=s?oS(s):null,ep[75]=s,ep[76]=eo):eo=ep[76],ep[77]!==e3.reference.current?(er=()=>e3.reference.current,ep[77]=e3.reference.current,ep[78]=er):er=ep[78],(0,l.useImperativeHandle)(eo,er);e:{let e;if(x){en=s;break e}if(!s){en=null;break e}ep[79]!==s||ep[80]!==e3.setReference?(e=(0,l.cloneElement)(s,{ref:e3.setReference}),ep[79]=s,ep[80]=e3.setReference,ep[81]=e):e=ep[81],en=e}let tr=en;if(ep[82]!==e5?(ei=()=>e5,ea=[e5],ep[82]=e5,ep[83]=ei,ep[84]=ea):(ei=ep[83],ea=ep[84]),(0,l.useImperativeHandle)(T,ei,ea),f){let e;return ep[85]!==s?(e=s||(0,a.jsx)(a.Fragment,{}),ep[85]=s,ep[86]=e):e=ep[86],e}ep[87]!==b?(ed=b&&(0,a.jsx)(oz,{}),ep[87]=b,ep[88]=ed):ed=ep[88];let tn=m?eq:eV;ep[89]!==eW||ep[90]!==ew||ep[91]!==e7||ep[92]!==e8||ep[93]!==u||ep[94]!==eb||ep[95]!==e9||ep[96]!==te||ep[97]!==ex||ep[98]!==eT||ep[99]!==e2||ep[100]!==eL||ep[101]!==e6||ep[102]!==$||ep[103]!==k||ep[104]!==to||ep[105]!==eM||ep[106]!==e4||ep[107]!==tn||ep[108]!==eR||ep[109]!==eQ||ep[110]!==e1?(el=(0,a.jsx)(oE,{...$,__unstable_margins:eb,animate:eW,arrow:ew,arrowRef:tt,arrowX:e7,arrowY:e8,hidden:e6,overflow:ex,padding:eT,placement:e2,radius:eL,ref:to,scheme:k,shadow:eM,originX:e9,originY:te,strategy:e4,tone:eR,width:tn,x:eQ,y:e1,children:u}),ep[89]=eW,ep[90]=ew,ep[91]=e7,ep[92]=e8,ep[93]=u,ep[94]=eb,ep[95]=e9,ep[96]=te,ep[97]=ex,ep[98]=eT,ep[99]=e2,ep[100]=eL,ep[101]=e6,ep[102]=$,ep[103]=k,ep[104]=to,ep[105]=eM,ep[106]=e4,ep[107]=tn,ep[108]=eR,ep[109]=eQ,ep[110]=e1,ep[111]=el):el=ep[111],ep[112]!==ed||ep[113]!==el||ep[114]!==eJ?(ec=(0,a.jsxs)(on,{zOffset:eJ,children:[ed,el]}),ep[112]=ed,ep[113]=el,ep[114]=eJ,ep[115]=ec):ec=ep[115];let ti=ec;ep[116]!==v||ep[117]!==ti||ep[118]!==y?(es=v&&(y?(0,a.jsx)(om,{__unstable_name:"string"==typeof y?y:void 0,children:ti}):ti),ep[116]=v,ep[117]=ti,ep[118]=y,ep[119]=es):es=ep[119];let ta=es;return ep[120]!==eW||ep[121]!==ta?(eu=eW?(0,a.jsx)(g.N,{children:ta}):ta,ep[120]=eW,ep[121]=ta,ep[122]=eu):eu=ep[122],ep[123]!==tr||ep[124]!==eu?(ef=(0,a.jsxs)(a.Fragment,{children:[eu,tr]}),ep[123]=tr,ep[124]=eu,ep[125]=ef):ef=ep[125],ef});oN.displayName="ForwardRef(Popover)";let o_=c.I4.div.withConfig({displayName:"StyledRadio",componentId:"sc-ccrwkf-0"})(function(){return(0,c.AH)`
    position: relative;

    &:not([hidden]) {
      display: inline-block;
    }

    &[data-read-only] {
      outline: 1px solid red;
    }
  `}),oA=c.I4.input.withConfig({displayName:"Input",componentId:"sc-ccrwkf-1"})(function(e){let{color:t,input:o}=(0,i.JW)(e.theme),r=(o.radio.size-o.radio.markSize)/2;return(0,c.AH)`
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    outline: none;
    z-index: 1;
    padding: 0;
    margin: 0;
    border-radius: ${H(o.radio.size/2)};
    border: none;

    /* enabled */
    & + span {
      display: block;
      position: relative;
      height: ${H(o.radio.size)};
      width: ${H(o.radio.size)};
      border-radius: ${H(o.radio.size/2)};
      background: ${t.input.default.enabled.bg};
      box-shadow: ${eg({color:t.input.default.enabled.border,width:o.border.width})};

      &::after {
        content: '';
        position: absolute;
        top: ${H(r)};
        left: ${H(r)};
        height: ${H(o.radio.markSize)};
        width: ${H(o.radio.markSize)};
        border-radius: ${H(o.radio.markSize/2)};
        background: ${t.input.default.enabled.fg};
        opacity: 0;
      }
    }

    /* focused */
    &:not(:disabled):focus + span {
      box-shadow: ${eb({border:{width:o.border.width,color:t.input.default.enabled.border},focusRing:o.radio.focusRing})};
    }

    &:not(:disabled):focus:not(:focus-visible) + span {
      box-shadow: ${eg({color:t.input.default.enabled.border,width:o.border.width})};
    }

    &:checked + span::after {
      opacity: 1;
    }

    /* customValidity */
    &[data-error] + span {
      background-color: ${t.input.invalid.enabled.border};
      box-shadow: ${eg({width:o.border.width,color:t.input.invalid.enabled.muted.bg})};
      &::after {
        background: ${t.input.invalid.enabled.muted.bg};
      }
    }

    /* read only */
    &[data-read-only] + span {
      box-shadow: 0 0 0 1px ${t.input.default.readOnly.border};
      background: ${t.input.default.readOnly.bg};

      &::after {
        background: ${t.input.default.readOnly.border};
      }
    }

    /* disabled */
    &:not([data-read-only]):disabled + span {
      box-shadow: 0 0 0 1px ${t.input.default.disabled.border};
      background: ${t.input.default.disabled.bg};

      &::after {
        background: ${t.input.default.disabled.border};
      }
    }
  `}),oW=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m=(0,d.c)(19);m[0]!==e?({className:o,disabled:n,style:s,customValidity:r,readOnly:i,...c}=e,m[0]=e,m[1]=o,m[2]=r,m[3]=n,m[4]=i,m[5]=c,m[6]=s):(o=m[1],r=m[2],n=m[3],i=m[4],c=m[5],s=m[6]);let g=(0,l.useRef)(null);m[7]===Symbol.for("react.memo_cache_sentinel")?(u=()=>g.current,m[7]=u):u=m[7],(0,l.useImperativeHandle)(t,u),tx(g,r);let b=!n&&i?"":void 0,v=r?"":void 0,w=n||i;return m[8]!==i||m[9]!==c||m[10]!==b||m[11]!==v||m[12]!==w?(f=(0,a.jsx)(oA,{"data-read-only":b,"data-error":v,...c,disabled:w,readOnly:i,ref:g,type:"radio"}),m[8]=i,m[9]=c,m[10]=b,m[11]=v,m[12]=w,m[13]=f):f=m[13],m[14]===Symbol.for("react.memo_cache_sentinel")?(p=(0,a.jsx)("span",{}),m[14]=p):p=m[14],m[15]!==o||m[16]!==s||m[17]!==f?(h=(0,a.jsxs)(o_,{className:o,"data-ui":"Radio",style:s,children:[f,p]}),m[15]=o,m[16]=s,m[17]=f,m[18]=h):h=m[18],h});function oH(e){let{font:t}=(0,i.JW)(e.theme);return(0,c.AH)`
    -webkit-font-smoothing: antialiased;
    appearance: none;
    border: 0;
    font-family: ${t.text.family};
    color: inherit;
    width: 100%;
    outline: none;
    margin: 0;

    &:disabled {
      opacity: 1;
    }
  `}function oT(e){let{color:t,input:o}=(0,i.JW)(e.theme);return(0,c.AH)`
    /* enabled */
    background-color: ${t.input.default.enabled.bg};
    color: ${t.input.default.enabled.fg};
    box-shadow: ${eg({color:t.input.default.enabled.border,width:o.border.width})};

    /* hovered */
    @media (hover: hover) {
      &:not(:disabled):hover {
        background-color: ${t.input.default.hovered.bg};
        color: ${t.input.default.hovered.fg};
        box-shadow: ${eg({color:t.input.default.hovered.border,width:o.border.width})};
      }
    }

    /* focused */
    &:not(:disabled):focus {
      box-shadow: ${eb({border:{width:o.border.width,color:t.input.default.enabled.border},focusRing:o.select.focusRing})};
    }

    /* read-only */
    &[data-read-only] {
      background-color: ${t.input.default.readOnly.bg};
      color: ${t.input.default.readOnly.fg};
      box-shadow: ${eg({color:t.input.default.readOnly.border,width:o.border.width})};
    }

    /* disabled */
    &:not([data-read-only]):disabled {
      background-color: ${t.input.default.disabled.bg};
      color: ${t.input.default.disabled.fg};
      box-shadow: ${eg({color:t.input.default.disabled.border,width:o.border.width})};
    }
  `}function oL(e){let{$fontSize:t}=e,{font:o,media:r}=(0,i.JW)(e.theme);return T(r,t,e=>{var t;return{fontSize:H((t=o.text.sizes[e]||o.text.sizes[2]).fontSize),lineHeight:`${H(t.lineHeight)}`}})}oW.displayName="ForwardRef(Radio)";let oM=c.I4.div.withConfig({displayName:"StyledSelect",componentId:"sc-5mxno7-0"})(function(){return(0,c.AH)`
    position: relative;
    width: -moz-available;
    width: -webkit-fill-available;
    width: stretch;

    &:not([hidden]) {
      display: inline-block;
    }
  `}),oF=c.I4.select.withConfig({displayName:"Input",componentId:"sc-5mxno7-1"})(function(){return[eV,oH,oT,oL,eM]}),oJ=(0,c.I4)(to).withConfig({displayName:"IconBox",componentId:"sc-5mxno7-2"})(function(e){let{color:t}=(0,i.JW)(e.theme);return(0,c.AH)`
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;

    /* enabled */
    --card-fg-color: ${t.input.default.enabled.fg};

    /* hover */
    @media (hover: hover) {
      select:not(disabled):not(:read-only):hover + && {
        --card-fg-color: ${t.input.default.hovered.fg};
      }
    }

    /* disabled */
    select:disabled + && {
      --card-fg-color: ${t.input.default.disabled.fg};
    }

    /* read-only */
    select[data-read-only] + && {
      --card-fg-color: ${t.input.default.readOnly.fg};
    }
  `}),oO=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,p,h,m,g,b,v,w,y,x,$,k,S,j=(0,d.c)(37);j[0]!==e?({children:o,customValidity:r,disabled:n,fontSize:s,padding:u,radius:p,readOnly:i,space:h,...c}=e,j[0]=e,j[1]=o,j[2]=r,j[3]=n,j[4]=i,j[5]=c,j[6]=s,j[7]=u,j[8]=p,j[9]=h):(o=j[1],r=j[2],n=j[3],i=j[4],c=j[5],s=j[6],u=j[7],p=j[8],h=j[9]);let I=void 0===s?2:s,R=void 0===u?3:u,C=void 0===p?2:p,E=void 0===h?3:h,z=(0,l.useRef)(null);j[10]===Symbol.for("react.memo_cache_sentinel")?(m=()=>z.current,j[10]=m):m=j[10],(0,l.useImperativeHandle)(t,m),tx(z,r);let N=!n&&i?"":void 0;j[11]!==I?(g=L(I),j[11]=I,j[12]=g):g=j[12],j[13]!==R?(b=L(R),j[13]=R,j[14]=b):b=j[14],j[15]!==C?(v=L(C),j[15]=C,j[16]=v):v=j[16],j[17]!==E?(w=L(E),j[17]=E,j[18]=w):w=j[18];let _=n||i;return j[19]!==o||j[20]!==c||j[21]!==_||j[22]!==N||j[23]!==g||j[24]!==b||j[25]!==v||j[26]!==w?(y=(0,a.jsx)(oF,{"data-read-only":N,"data-ui":"Select",...c,$fontSize:g,$padding:b,$radius:v,$space:w,disabled:_,ref:z,children:o}),j[19]=o,j[20]=c,j[21]=_,j[22]=N,j[23]=g,j[24]=b,j[25]=v,j[26]=w,j[27]=y):y=j[27],j[28]===Symbol.for("react.memo_cache_sentinel")?(x=(0,a.jsx)(f.D3D,{}),j[28]=x):x=j[28],j[29]!==I?($=(0,a.jsx)(tn,{size:I,children:x}),j[29]=I,j[30]=$):$=j[30],j[31]!==R||j[32]!==$?(k=(0,a.jsx)(oJ,{padding:R,children:$}),j[31]=R,j[32]=$,j[33]=k):k=j[33],j[34]!==y||j[35]!==k?(S=(0,a.jsxs)(oM,{"data-ui":"Select",children:[y,k]}),j[34]=y,j[35]=k,j[36]=S):S=j[36],S});oO.displayName="ForwardRef(Select)";let oB={"&&:not([hidden])":{display:"grid"},'&[data-as="ul"],&[data-as="ol"]':{listStyle:"none"},gridTemplateColumns:"minmax(0, 1fr)",gridAutoRows:"min-content"},oP=(0,c.I4)(to).withConfig({displayName:"StyledStack",componentId:"sc-8dpfq2-0"})(function(){return oB},function(e){let{media:t,space:o}=(0,i.JW)(e.theme);return T(t,e.$space,e=>({gridGap:H(o[e])}))}),oD=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c=(0,d.c)(12);c[0]!==e?({as:o,space:n,...r}=e,c[0]=e,c[1]=o,c[2]=r,c[3]=n):(o=c[1],r=c[2],n=c[3]);let s="string"==typeof o?o:void 0;return c[4]!==n?(i=L(n),c[4]=n,c[5]=i):i=c[5],c[6]!==o||c[7]!==t||c[8]!==r||c[9]!==s||c[10]!==i?(l=(0,a.jsx)(oP,{"data-as":s,"data-ui":"Stack",...r,$space:i,forwardedAs:o,ref:t}),c[6]=o,c[7]=t,c[8]=r,c[9]=s,c[10]=i,c[11]=l):l=c[11],l});oD.displayName="ForwardRef(Stack)";let oV=c.I4.span.withConfig({displayName:"StyledSwitch",componentId:"sc-dw1foe-0"})(function(){return(0,c.AH)`
    position: relative;
    &:not([hidden]) {
      display: inline-block;
    }
  `}),oG=c.I4.input.withConfig({displayName:"Input",componentId:"sc-dw1foe-1"})(function(){return(0,c.AH)`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    outline: none;
    padding: 0;
    margin: 0;

    /* Place the input element above the representation element */
    z-index: 1;
  `}),oY=c.I4.span.withConfig({displayName:"Representation",componentId:"sc-dw1foe-2"})(function(e){let{color:t,input:o}=(0,i.JW)(e.theme);return(0,c.AH)`
    --switch-bg-color: ${t.input.default.enabled.border};
    --switch-fg-color: ${t.input.default.enabled.bg};
    --switch-box-shadow: none;

    &:not([hidden]) {
      display: block;
    }
    position: relative;
    width: ${H(o.switch.width)};
    height: ${H(o.switch.height)};
    border-radius: ${H(o.switch.height/2)};

    /* Make sure it’s not possible to interact with the wrapper element */
    pointer-events: none;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      box-shadow: var(--switch-box-shadow);
      border-radius: inherit;
    }

    /* Focus styles */
    input:focus + && {
      --switch-box-shadow: ${eb({focusRing:o.switch.focusRing})};
    }

    input:focus:not(:focus-visible) + && {
      --switch-box-shadow: none;
    }

    input:checked + && {
      --switch-bg-color: ${t.input.default.enabled.fg};
      --switch-fg-color: ${t.input.default.enabled.bg};
    }

    @media (hover: hover) {
      input:not(:disabled):hover + && {
        --switch-bg-color: ${t.input.default.hovered.border};
        --switch-fg-color: ${t.input.default.hovered.bg};
      }

      input:not(:disabled):checked:hover + && {
        --switch-bg-color: ${t.input.default.enabled.fg};
        --switch-fg-color: ${t.input.default.enabled.bg};
      }
    }

    input:not([data-read-only]):disabled + && {
      --switch-bg-color: ${t.input.default.disabled.border};
      --switch-fg-color: ${t.input.default.disabled.bg};
    }

    input[data-read-only]:disabled + && {
      --switch-bg-color: ${t.input.default.readOnly.border};
      --switch-fg-color: ${t.input.default.readOnly.bg};
    }

    input:checked[data-read-only]:disabled + && {
      --switch-bg-color: ${t.input.default.readOnly.fg};
      --switch-fg-color: ${t.input.default.readOnly.bg};
    }
  `}),oX=c.I4.span.withConfig({displayName:"Track",componentId:"sc-dw1foe-3"})(function(e){let{input:t}=(0,i.JW)(e.theme);return(0,c.AH)`
    &:not([hidden]) {
      display: block;
    }
    background-color: var(--switch-bg-color);
    position: absolute;
    left: 0;
    top: 0;
    width: ${H(t.switch.width)};
    height: ${H(t.switch.height)};
    border-radius: ${H(t.switch.height/2)};
  `}),oU=c.I4.span.withConfig({displayName:"Thumb",componentId:"sc-dw1foe-4"})(function(e){let{$indeterminate:t}=e,{input:o}=(0,i.JW)(e.theme),r=o.switch.width,n=o.switch.height,a=o.switch.padding,d=n-2*o.switch.padding,l=r-2*a-d,s=r/2-d/2-a,u=!0!==t&&!0===e.$checked;return(0,c.AH)`
    &:not([hidden]) {
      display: block;
    }
    position: absolute;
    left: ${H(a)};
    top: ${H(a)};
    height: ${H(d)};
    width: ${H(d)};
    border-radius: ${H(d/2)};
    transition-property: transform;
    transition-duration: ${o.switch.transitionDurationMs}ms;
    transition-timing-function: ${o.switch.transitionTimingFunction};
    background: var(--switch-fg-color);
    transform: translate3d(0, 0, 0);
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);

    ${u&&(0,c.AH)`
      transform: translate3d(${l}px, 0, 0);
    `}

    ${t&&(0,c.AH)`
      transform: translate3d(${s}px, 0, 0);
    `}
  `}),oq=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v,w=(0,d.c)(26);w[0]!==e?({checked:o,className:r,disabled:n,indeterminate:i,readOnly:c,style:u,...s}=e,w[0]=e,w[1]=o,w[2]=r,w[3]=n,w[4]=i,w[5]=c,w[6]=s,w[7]=u):(o=w[1],r=w[2],n=w[3],i=w[4],c=w[5],s=w[6],u=w[7]);let y=(0,l.useRef)(null);w[8]===Symbol.for("react.memo_cache_sentinel")?(f=()=>y.current,w[8]=f):f=w[8],(0,l.useImperativeHandle)(t,f),w[9]!==i?(p=()=>{y.current&&(y.current.indeterminate=i||!1)},h=[i],w[9]=i,w[10]=p,w[11]=h):(p=w[10],h=w[11]),(0,l.useEffect)(p,h);let x=!n&&c?"":void 0,$=!0!==i&&o,k=n||c;return w[12]!==s||w[13]!==x||w[14]!==$||w[15]!==k?(m=(0,a.jsx)(oG,{"data-read-only":x,...s,checked:$,disabled:k,type:"checkbox",ref:y}),w[12]=s,w[13]=x,w[14]=$,w[15]=k,w[16]=m):m=w[16],w[17]===Symbol.for("react.memo_cache_sentinel")?(g=(0,a.jsx)(oX,{}),w[17]=g):g=w[17],w[18]!==o||w[19]!==i?(b=(0,a.jsxs)(oY,{"aria-hidden":!0,"data-name":"representation",children:[g,(0,a.jsx)(oU,{$checked:o,$indeterminate:i})]}),w[18]=o,w[19]=i,w[20]=b):b=w[20],w[21]!==r||w[22]!==u||w[23]!==m||w[24]!==b?(v=(0,a.jsxs)(oV,{className:r,"data-ui":"Switch",style:u,children:[m,b]}),w[21]=r,w[22]=u,w[23]=m,w[24]=b,w[25]=v):v=w[25],v});oq.displayName="ForwardRef(Switch)";let oK=c.I4.span.withConfig({displayName:"StyledTextArea",componentId:"sc-1d6h1o8-0"})(eJ),oZ=c.I4.span.withConfig({displayName:"InputRoot",componentId:"sc-1d6h1o8-1"})`flex:1;min-width:0;display:block;position:relative;`,oQ=c.I4.textarea.withConfig({displayName:"Input",componentId:"sc-1d6h1o8-2"})(eL,eO,eB),o1=c.I4.div.withConfig({displayName:"Presentation",componentId:"sc-1d6h1o8-3"})(eV,eP),o0=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v,w,y,x,$=(0,d.c)(35);$[0]!==e?({border:i,customValidity:r,disabled:c,fontSize:s,padding:u,radius:f,weight:p,__unstable_disableFocusRing:o,...n}=e,$[0]=e,$[1]=o,$[2]=r,$[3]=n,$[4]=i,$[5]=c,$[6]=s,$[7]=u,$[8]=f,$[9]=p):(o=$[1],r=$[2],n=$[3],i=$[4],c=$[5],s=$[6],u=$[7],f=$[8],p=$[9]);let k=void 0===i||i,S=void 0!==c&&c,j=void 0===s?2:s,I=void 0===u?3:u,R=void 0===f?2:f,C=(0,l.useRef)(null),E=V();$[10]===Symbol.for("react.memo_cache_sentinel")?(h=()=>C.current,$[10]=h):h=$[10],(0,l.useImperativeHandle)(t,h),tx(C,r);let z=E.scheme,N=E.tone;$[11]!==j?(m=L(j),$[11]=j,$[12]=m):m=$[12],$[13]!==I?(g=L(I),$[13]=I,$[14]=g):g=$[14];let _=E.scheme;$[15]===Symbol.for("react.memo_cache_sentinel")?(b=L(0),$[15]=b):b=$[15],$[16]!==S||$[17]!==n||$[18]!==E.scheme||$[19]!==E.tone||$[20]!==m||$[21]!==g||$[22]!==p?(v=(0,a.jsx)(oQ,{"data-as":"textarea","data-scheme":z,"data-tone":N,...n,$fontSize:m,$padding:g,$scheme:_,$space:b,$tone:E.tone,$weight:p,disabled:S,ref:C}),$[16]=S,$[17]=n,$[18]=E.scheme,$[19]=E.tone,$[20]=m,$[21]=g,$[22]=p,$[23]=v):v=$[23],$[24]!==R?(w=L(R),$[24]=R,$[25]=w):w=$[25];let A=k?"":void 0;return $[26]!==o||$[27]!==E.scheme||$[28]!==E.tone||$[29]!==w||$[30]!==A?(y=(0,a.jsx)(o1,{$radius:w,$unstableDisableFocusRing:o,$scheme:E.scheme,$tone:E.tone,"data-border":A,"data-scheme":E.scheme,"data-tone":E.tone}),$[26]=o,$[27]=E.scheme,$[28]=E.tone,$[29]=w,$[30]=A,$[31]=y):y=$[31],$[32]!==v||$[33]!==y?(x=(0,a.jsx)(oK,{"data-ui":"TextArea",children:(0,a.jsxs)(oZ,{children:[v,y]})}),$[32]=v,$[33]=y,$[34]=x):x=$[34],x});o0.displayName="ForwardRef(TextArea)";let o2={zIndex:2},o3=(0,c.I4)(tv).attrs({forwardedAs:"span"}).withConfig({displayName:"StyledTextInput",componentId:"sc-h62wco-0"})(eJ),o4=c.I4.span.withConfig({displayName:"InputRoot",componentId:"sc-h62wco-1"})`flex:1;min-width:0;display:block;position:relative;`,o5=(0,c.I4)(tv).attrs({forwardedAs:"span"}).withConfig({displayName:"Prefix",componentId:"sc-h62wco-2"})`border-top-right-radius:0;border-bottom-right-radius:0;& > span{display:block;margin:-1px;}`,o6=(0,c.I4)(tv).attrs({forwardedAs:"span"}).withConfig({displayName:"Suffix",componentId:"sc-h62wco-3"})`border-top-left-radius:0;border-bottom-left-radius:0;& > span{display:block;margin:-1px;}`,o7=c.I4.input.withConfig({displayName:"Input",componentId:"sc-h62wco-4"})(eL,eO,eB),o8=c.I4.span.withConfig({displayName:"Presentation",componentId:"sc-h62wco-5"})(eV,eP),o9=(0,c.I4)(to).withConfig({displayName:"LeftBox",componentId:"sc-h62wco-6"})`position:absolute;top:0;left:0;`,re=(0,c.I4)(to).withConfig({displayName:"RightBox",componentId:"sc-h62wco-7"})`position:absolute;top:0;right:0;`,rt=(0,c.I4)(tv).withConfig({displayName:"RightCard",componentId:"sc-h62wco-8"})`background-color:transparent;position:absolute;top:0;right:0;`,ro=(0,c.I4)(tg).withConfig({displayName:"TextInputClearButton",componentId:"sc-h62wco-9"})({"&:not([hidden])":{display:"block"}}),rr=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,p,h,m,g,b,v,w,y,x,$,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P,D=(0,d.c)(92);D[0]!==e?({__unstable_disableFocusRing:n,border:b,clearButton:i,disabled:v,fontSize:w,icon:o,iconRight:r,onClear:s,padding:y,prefix:p,radius:x,readOnly:h,space:$,suffix:g,customValidity:c,type:S,weight:j,...m}=e,D[0]=e,D[1]=o,D[2]=r,D[3]=n,D[4]=i,D[5]=c,D[6]=s,D[7]=p,D[8]=h,D[9]=m,D[10]=g,D[11]=b,D[12]=v,D[13]=w,D[14]=y,D[15]=x,D[16]=$,D[17]=S,D[18]=j):(o=D[1],r=D[2],n=D[3],i=D[4],c=D[5],s=D[6],p=D[7],h=D[8],m=D[9],g=D[10],b=D[11],v=D[12],w=D[13],y=D[14],x=D[15],$=D[16],S=D[17],j=D[18]);let G=void 0===b||b,Y=void 0!==v&&v,X=void 0===w?2:w,U=void 0===y?3:y,q=void 0===x?2:x,K=void 0===$?3:$,Z=void 0===S?"text":S,Q=(0,l.useRef)(null),ee=V();D[19]!==X?(I=L(X),D[19]=X,D[20]=I):I=D[20];let et=I;D[21]!==U?(R=L(U),D[21]=U,D[22]=R):R=D[22];let eo=R;D[23]!==q?(C=L(q),D[23]=q,D[24]=C):C=D[24];let er=C;D[25]!==K?(E=L(K),D[25]=K,D[26]=E):E=D[26];let en=E,ei=!!i,ea=!!o,ed=!!r,el=!!g,ec=!!p;D[27]===Symbol.for("react.memo_cache_sentinel")?(z=()=>Q.current,D[27]=z):z=D[27],(0,l.useImperativeHandle)(t,z),tx(Q,c),D[28]!==s?(N=e=>{e.preventDefault(),e.stopPropagation(),s&&s(),Q.current?.focus()},D[28]=s,D[29]=N):N=D[29];let es=N;D[30]!==p||D[31]!==er?(_=p&&(0,a.jsx)(o5,{borderTop:!0,borderLeft:!0,borderBottom:!0,radius:er,sizing:"border",tone:"inherit",children:(0,a.jsx)("span",{children:p})}),D[30]=p,D[31]=er,D[32]=_):_=D[32];let eu=_,ef=G?"":void 0;D[33]!==o||D[34]!==et||D[35]!==eo?(A=o&&(0,a.jsx)(o9,{padding:eo,children:(0,a.jsxs)(tn,{size:et,children:[(0,l.isValidElement)(o)&&o,(0,u.isValidElementType)(o)&&(0,a.jsx)(o,{})]})}),D[33]=o,D[34]=et,D[35]=eo,D[36]=A):A=D[36],D[37]!==ei||D[38]!==r||D[39]!==et||D[40]!==eo?(W=!ei&&r&&(0,a.jsx)(re,{padding:eo,children:(0,a.jsxs)(tn,{size:et,children:[(0,l.isValidElement)(r)&&r,(0,u.isValidElementType)(r)&&(0,a.jsx)(r,{})]})}),D[37]=ei,D[38]=r,D[39]=et,D[40]=eo,D[41]=W):W=D[41],D[42]!==ec||D[43]!==el||D[44]!==n||D[45]!==er||D[46]!==ee.scheme||D[47]!==ee.tone||D[48]!==ef||D[49]!==A||D[50]!==W?(H=(0,a.jsxs)(o8,{$hasPrefix:ec,$unstableDisableFocusRing:n,$hasSuffix:el,$radius:er,$scheme:ee.scheme,$tone:ee.tone,"data-border":ef,"data-scheme":ee.scheme,"data-tone":ee.tone,children:[A,W]}),D[42]=ec,D[43]=el,D[44]=n,D[45]=er,D[46]=ee.scheme,D[47]=ee.tone,D[48]=ef,D[49]=A,D[50]=W,D[51]=H):H=D[51];let ep=H;D[52]!==eo?(T=eo.map(ri),D[52]=eo,D[53]=T):T=D[53];let eh=T;D[54]!==eo?(M=eo.map(ra),D[54]=eo,D[55]=M):M=D[55];let em=M,eg="object"==typeof i?i:k;D[56]!==i||D[57]!==eh||D[58]!==em||D[59]!==eg||D[60]!==c||D[61]!==Y||D[62]!==et||D[63]!==es||D[64]!==er||D[65]!==h?(F=!Y&&!h&&i&&(0,a.jsx)(rt,{forwardedAs:"span",padding:eh,style:o2,tone:c?"critical":"inherit",children:(0,a.jsx)(ro,{"aria-label":"Clear","data-qa":"clear-button",fontSize:et,icon:f.USm,mode:"bleed",padding:em,radius:er,...eg,onClick:es,onMouseDown:rn})}),D[56]=i,D[57]=eh,D[58]=em,D[59]=eg,D[60]=c,D[61]=Y,D[62]=et,D[63]=es,D[64]=er,D[65]=h,D[66]=F):F=D[66];let eb=F;D[67]!==er||D[68]!==g?(J=g&&(0,a.jsx)(o6,{borderTop:!0,borderRight:!0,borderBottom:!0,radius:er,sizing:"border",tone:"inherit",children:(0,a.jsx)("span",{children:g})}),D[67]=er,D[68]=g,D[69]=J):J=D[69];let ev=J,ew=ed||ei;return D[70]!==ea||D[71]!==Y||D[72]!==et||D[73]!==eo||D[74]!==h||D[75]!==m||D[76]!==ee.scheme||D[77]!==ee.tone||D[78]!==en||D[79]!==ew||D[80]!==Z||D[81]!==j?(O=(0,a.jsx)(o7,{"data-as":"input","data-scheme":ee.scheme,"data-tone":ee.tone,...m,$fontSize:et,$iconLeft:ea,$iconRight:ew,$padding:eo,$scheme:ee.scheme,$space:en,$tone:ee.tone,$weight:j,disabled:Y,readOnly:h,ref:Q,type:Z}),D[70]=ea,D[71]=Y,D[72]=et,D[73]=eo,D[74]=h,D[75]=m,D[76]=ee.scheme,D[77]=ee.tone,D[78]=en,D[79]=ew,D[80]=Z,D[81]=j,D[82]=O):O=D[82],D[83]!==eb||D[84]!==ep||D[85]!==O?(B=(0,a.jsxs)(o4,{children:[O,ep,eb]}),D[83]=eb,D[84]=ep,D[85]=O,D[86]=B):B=D[86],D[87]!==eu||D[88]!==ee.tone||D[89]!==ev||D[90]!==B?(P=(0,a.jsxs)(o3,{"data-ui":"TextInput",tone:ee.tone,children:[eu,B,ev]}),D[87]=eu,D[88]=ee.tone,D[89]=ev,D[90]=B,D[91]=P):P=D[91],P});function rn(e){e.preventDefault(),e.stopPropagation()}function ri(e){return 0===e?0:1===e||2===e?1:e-2}function ra(e){return 0===e||1===e?0:2===e?1:e-1}function rd(e){let t,o,r=(0,d.c)(3),[n,i]=(0,l.useState)(e),a=(0,l.useRef)(void 0);r[0]===Symbol.for("react.memo_cache_sentinel")?(t=(e,t)=>{let o=()=>{i(e)};if(a.current&&(clearTimeout(a.current),a.current=void 0),!t)return o();a.current=setTimeout(o,t)},r[0]=t):t=r[0];let c=t;return r[1]!==n?(o=[n,c],r[1]=n,r[2]=o):o=r[2],o}rr.displayName="ForwardRef(TextInput)";let rl={top:["top-end","top-start","bottom","left","right"],"top-start":["top","top-end","bottom-start","left-start","right-start"],"top-end":["top","top-start","bottom-end","left-end","right-end"],bottom:["bottom-end","bottom-start","top","left","right"],"bottom-start":["bottom","bottom-end","top-start","left-start","right-start"],"bottom-end":["bottom","bottom-start","top-end","left-end","right-end"],left:["left-end","left-start","right","top","bottom"],"left-start":["left","left-end","right-start","top-start","bottom-start"],"left-end":["left","left-start","right-end","top-end","bottom-end"],right:["right-end","right-start","left","top","bottom"],"right-start":["right","right-end","left-start","top-start","bottom-start"],"right-end":["right","right-start","left-end","top-end","bottom-end"]},rc=(0,c.I4)(m.P.create(tv)).withConfig({displayName:"MotionCard",componentId:"sc-1xn138w-0"})`will-change:transform;`,rs=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,j,R,C=(0,d.c)(48);C[0]!==e?({animate:o,arrow:r,arrowRef:n,arrowX:i,arrowY:l,children:c,originX:s,originY:u,padding:f,placement:p,radius:h,scheme:g,shadow:b,style:v,...m}=e,C[0]=e,C[1]=o,C[2]=r,C[3]=n,C[4]=i,C[5]=l,C[6]=c,C[7]=s,C[8]=u,C[9]=f,C[10]=p,C[11]=h,C[12]=m,C[13]=g,C[14]=b,C[15]=v):(o=C[1],r=C[2],n=C[3],i=C[4],l=C[5],c=C[6],s=C[7],u=C[8],f=C[9],p=C[10],h=C[11],m=C[12],g=C[13],b=C[14],v=C[15]);let E=o?"transform":void 0;C[16]!==s||C[17]!==u||C[18]!==v||C[19]!==E?(w={originX:s,originY:u,willChange:E,...v},C[16]=s,C[17]=u,C[18]=v,C[19]=E,C[20]=w):w=C[20];let z=w,N=null!==i?i:void 0,_=null!==l?l:void 0;C[21]!==N||C[22]!==_?(y={left:N,top:_,right:void 0,bottom:void 0},C[21]=N,C[22]=_,C[23]=y):y=C[23];let A=y,W=m;return C[24]!==o?(x=o?["hidden","initial"]:void 0,C[24]=o,C[25]=x):x=C[25],C[26]!==o?($=o?["visible","scaleIn"]:void 0,C[26]=o,C[27]=$):$=C[27],C[28]!==o?(k=o?["hidden","scaleOut"]:void 0,C[28]=o,C[29]=k):k=C[29],C[30]!==r||C[31]!==n||C[32]!==A?(j=r&&(0,a.jsx)(t5,{ref:n,style:A,width:15,height:6,radius:2}),C[30]=r,C[31]=n,C[32]=A,C[33]=j):j=C[33],C[34]!==c||C[35]!==f||C[36]!==p||C[37]!==h||C[38]!==t||C[39]!==z||C[40]!==g||C[41]!==b||C[42]!==W||C[43]!==x||C[44]!==$||C[45]!==k||C[46]!==j?(R=(0,a.jsxs)(rc,{"data-ui":"Tooltip__card",...W,"data-placement":p,padding:f,radius:h,ref:t,scheme:g,shadow:b,style:z,variants:S,transition:I,initial:x,animate:$,exit:k,children:[c,j]}),C[34]=c,C[35]=f,C[36]=p,C[37]=h,C[38]=t,C[39]=z,C[40]=g,C[41]=b,C[42]=W,C[43]=x,C[44]=$,C[45]=k,C[46]=j,C[47]=R):R=C[47],R});rs.displayName="ForwardRef(TooltipCard)";let ru=B("@sanity/ui/context/tooltipDelayGroup",null);function rf(e){let t,o,r=(0,d.c)(9),{children:n,delay:i}=e,[l,c]=rd(!1),[s,u]=rd(null),f="number"==typeof i?i:i?.open||0,p="number"==typeof i?i:i?.close||0,h=l?1:f;r[0]!==p||r[1]!==s||r[2]!==c||r[3]!==u||r[4]!==h?(t={setIsGroupActive:c,openTooltipId:s,setOpenTooltipId:u,openDelay:h,closeDelay:p},r[0]=p,r[1]=s,r[2]=c,r[3]=u,r[4]=h,r[5]=t):t=r[5];let m=t;return r[6]!==n||r[7]!==m?(o=(0,a.jsx)(ru.Provider,{value:m,children:n}),r[6]=n,r[7]=m,r[8]=o):o=r[8],o}rf.displayName="TooltipDelayGroupProvider";let rp=(0,c.I4)(os).withConfig({displayName:"StyledTooltip",componentId:"sc-13f2zvh-0"})`pointer-events:none;`,rh=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,m,b,v,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P,D,V,G,Y,U,q,K,Z,Q,ee,et,eo,er,en,ei,ea,ed=(0,d.c)(137),el=oe(),{layer:ec}=X();ed[0]!==e?({animate:v,arrow:y,boundaryElement:o,children:i,content:c,disabled:u,fallbackPlacements:r,padding:x,placement:$,portal:f,radius:k,scheme:b,shadow:S,zOffset:n,delay:s,...m}=e,ed[0]=e,ed[1]=o,ed[2]=r,ed[3]=n,ed[4]=i,ed[5]=c,ed[6]=s,ed[7]=u,ed[8]=f,ed[9]=m,ed[10]=b,ed[11]=v,ed[12]=y,ed[13]=x,ed[14]=$,ed[15]=k,ed[16]=S):(o=ed[1],r=ed[2],n=ed[3],i=ed[4],c=ed[5],s=ed[6],u=ed[7],f=ed[8],m=ed[9],b=ed[10],v=ed[11],y=ed[12],x=ed[13],$=ed[14],k=ed[15],S=ed[16]);let es=void 0!==v&&v,eu=void 0!==y&&y,ef=void 0===x?2:x,ep=void 0===$?"bottom":$,eh=void 0===k?2:k,em=void 0===S?2:S,eg=o??el?.element,eb=r??rl[e.placement??"bottom"],ev=n??ec.tooltip.zOffset,ew=!tN()&&es;ed[17]!==eb?(j=L(eb),ed[17]=eb,ed[18]=j):j=ed[18];let ey=j,ex=(0,l.useRef)(null),[e$,ek]=(0,l.useState)(null),eS=(0,l.useRef)(null),[ej,eI]=(0,l.useState)(0);ed[19]===Symbol.for("react.memo_cache_sentinel")?(I=()=>ex.current,ed[19]=I):I=ed[19],(0,l.useImperativeHandle)(t,I);let eR=oh(),eC="string"==typeof f?eR.elements?.[f]||null:eR.element;ed[20]!==ew||ed[21]!==eu||ed[22]!==eg||ed[23]!==ey?(R={animate:ew,arrowProp:eu,arrowRef:eS,boundaryElement:eg,fallbackPlacements:ey,rootBoundary:"viewport"},ed[20]=ew,ed[21]=eu,ed[22]=eg,ed[23]=ey,ed[24]=R):R=ed[24];let eE=function(e){let t,o=(0,d.c)(17),{animate:r,arrowProp:n,arrowRef:i,boundaryElement:a,fallbackPlacements:l,rootBoundary:c}=e;if(o[0]!==r||o[1]!==n||o[2]!==i||o[3]!==a||o[4]!==l||o[5]!==c){let e,d,s;t=[];let u=a||void 0;o[7]!==l||o[8]!==c||o[9]!==u?(e=(0,h.UU)({boundary:u,fallbackPlacements:l,padding:4,rootBoundary:c}),o[7]=l,o[8]=c,o[9]=u,o[10]=e):e=o[10],t.push(e),o[11]===Symbol.for("react.memo_cache_sentinel")?(d=(0,h.cY)({mainAxis:4}),o[11]=d):d=o[11],t.push(d);let f=a||void 0;if(o[12]!==c||o[13]!==f?(s=(0,h.BN)({boundary:f,rootBoundary:c,padding:4}),o[12]=c,o[13]=f,o[14]=s):s=o[14],t.push(s),n){let e;o[15]!==i?(e=(0,h.UE)({element:i,padding:4}),o[15]=i,o[16]=e):e=o[16],t.push(e)}r&&t.push(tZ),o[0]=r,o[1]=n,o[2]=i,o[3]=a,o[4]=l,o[5]=c,o[6]=t}else t=o[6];return t}(R);ed[25]!==e$?(C={reference:e$},ed[25]=e$,ed[26]=C):C=ed[26],ed[27]!==eE||ed[28]!==ep||ed[29]!==C?(E={middleware:eE,placement:ep,whileElementsMounted:p.ll,elements:C},ed[27]=eE,ed[28]=ep,ed[29]=C,ed[30]=E):E=ed[30];let{floatingStyles:ez,placement:eN,middlewareData:e_,refs:eA,update:eW}=(0,h.we)(E),eH=e_.arrow?.x,eT=e_.arrow?.y,eL=e_["@sanity/ui/origin"]?.originX,eM=e_["@sanity/ui/origin"]?.originY,eF=(0,l.useId)(),[eJ,eO]=rd(!1),eB=(0,l.useContext)(ru);ed[31]!==eB?(z=eB||{},ed[31]=eB,ed[32]=z):z=ed[32];let{setIsGroupActive:eP,setOpenTooltipId:eD}=z,eV=eJ||eB?.openTooltipId===eF,eG=null!==eB,eY="number"==typeof s?s:s?.open||0,eX="number"==typeof s?s:s?.close||0,eU=eG?eB.openDelay:eY,eq=eG?eB.closeDelay:eX;ed[33]!==eq||ed[34]!==eG||ed[35]!==eU||ed[36]!==eP||ed[37]!==eO||ed[38]!==eD||ed[39]!==eF?(N=(e,t)=>{if(eG)if(e){let o=t?0:eU;eP?.(e,o),eD?.(eF,o)}else{let o=eq>200?eq:200;eP?.(e,o),eD?.(null,t?0:eq)}else eO(e,t?0:e?eU:eq)},ed[33]=eq,ed[34]=eG,ed[35]=eU,ed[36]=eP,ed[37]=eO,ed[38]=eD,ed[39]=eF,ed[40]=N):N=ed[40];let eK=N;ed[41]!==i?.props||ed[42]!==eK?(_=e=>{eK(!1),i?.props?.onBlur?.(e)},ed[41]=i?.props,ed[42]=eK,ed[43]=_):_=ed[43];let eZ=_;ed[44]!==i?.props||ed[45]!==eK?(A=e=>{eK(!1,!0),i?.props.onClick?.(e)},ed[44]=i?.props,ed[45]=eK,ed[46]=A):A=ed[46];let eQ=A;ed[47]!==i?.props||ed[48]!==eK?(W=e=>{eK(!1,!0),i?.props.onContextMenu?.(e)},ed[47]=i?.props,ed[48]=eK,ed[49]=W):W=ed[49];let e1=W;ed[50]!==i?.props||ed[51]!==eK?(H=e=>{eK(!0),i?.props?.onFocus?.(e)},ed[50]=i?.props,ed[51]=eK,ed[52]=H):H=ed[52];let e0=H;ed[53]!==i?.props||ed[54]!==eK?(T=e=>{eK(!0),i?.props?.onMouseEnter?.(e)},ed[53]=i?.props,ed[54]=eK,ed[55]=T):T=ed[55];let e2=T;ed[56]!==i?.props||ed[57]!==eK?(M=e=>{eK(!1),i?.props?.onMouseLeave?.(e)},ed[56]=i?.props,ed[57]=eK,ed[58]=M):M=ed[58];let e3=M;ed[59]!==eK||ed[60]!==eG||ed[61]!==e$||ed[62]!==eV?(F={handleIsOpenChange:eK,referenceElement:e$,showTooltip:eV,isInsideGroup:eG},ed[59]=eK,ed[60]=eG,ed[61]=e$,ed[62]=eV,ed[63]=F):F=ed[63],function(e){let t,o,r,n=(0,d.c)(10),{handleIsOpenChange:i,referenceElement:a,showTooltip:c,isInsideGroup:s}=e;n[0]!==i||n[1]!==a?(t=(e,t)=>{a&&(a===e||e instanceof Node&&a.contains(e)||(i(!1),t()))},n[0]=i,n[1]=a,n[2]=t):t=n[2];let u=(0,w.J)(t);n[3]!==s||n[4]!==u||n[5]!==c?(o=()=>{if(!c||s)return;let e=t=>{u(t.target,()=>window.removeEventListener("mousemove",e))};return window.addEventListener("mousemove",e),()=>window.removeEventListener("mousemove",e)},n[3]=s,n[4]=u,n[5]=c,n[6]=o):o=n[6],n[7]!==s||n[8]!==c?(r=[s,c],n[7]=s,n[8]=c,n[9]=r):r=n[9],(0,l.useEffect)(o,r)}(F),ed[64]!==u||ed[65]!==eK||ed[66]!==eV?(J=()=>{u&&eV&&eK(!1)},O=[u,eK,eV],ed[64]=u,ed[65]=eK,ed[66]=eV,ed[67]=J,ed[68]=O):(J=ed[67],O=ed[68]),(0,l.useEffect)(J,O),ed[69]!==c||ed[70]!==eK||ed[71]!==eV?(B=()=>{!c&&eV&&eK(!1)},P=[c,eK,eV],ed[69]=c,ed[70]=eK,ed[71]=eV,ed[72]=B,ed[73]=P):(B=ed[72],P=ed[73]),(0,l.useEffect)(B,P),ed[74]!==eK||ed[75]!==eV?(D=()=>{if(!eV)return;let e=function(e){"Escape"===e.key&&eK(!1,!0)};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}},V=[eK,eV],ed[74]=eK,ed[75]=eV,ed[76]=D,ed[77]=V):(D=ed[76],V=ed[77]),(0,l.useEffect)(D,V),ed[78]!==eg||ed[79]!==eC?.offsetWidth?(G=()=>{eI(Math.min(...eg?[eg.offsetWidth]:[],eC?.offsetWidth||document.body.offsetWidth)-8)},ed[78]=eg,ed[79]=eC?.offsetWidth,ed[80]=G):G=ed[80],ed[81]!==eg||ed[82]!==eC?(Y=[eg,eC],ed[81]=eg,ed[82]=eC,ed[83]=Y):Y=ed[83],(0,l.useLayoutEffect)(G,Y),ed[84]!==eW?(U=e=>{eS.current=e,eW()},ed[84]=eW,ed[85]=U):U=ed[85];let e4=U;ed[86]!==eA?(q=e=>{ex.current=e,eA.setFloating(e)},ed[86]=eA,ed[87]=q):q=ed[87];let e5=q;e:{let e;if(!i){K=null;break e}ed[88]!==i||ed[89]!==eZ||ed[90]!==eQ||ed[91]!==e1||ed[92]!==e0||ed[93]!==e2||ed[94]!==e3?(e=(0,l.cloneElement)(i,{onBlur:eZ,onFocus:e0,onMouseEnter:e2,onMouseLeave:e3,onClick:eQ,onContextMenu:e1,ref:ek}),ed[88]=i,ed[89]=eZ,ed[90]=eQ,ed[91]=e1,ed[92]=e0,ed[93]=e2,ed[94]=e3,ed[95]=e):e=ed[95],K=e}let e6=K;if(ed[96]!==i?(Z=i?oS(i):null,ed[96]=i,ed[97]=Z):Z=ed[97],ed[98]!==e$?(Q=()=>e$,ee=[e$],ed[98]=e$,ed[99]=Q,ed[100]=ee):(Q=ed[99],ee=ed[100]),(0,l.useImperativeHandle)(Z,Q,ee),!e6){let e;return ed[101]===Symbol.for("react.memo_cache_sentinel")?(e=(0,a.jsx)(a.Fragment,{}),ed[101]=e):e=ed[101],e}if(u)return e6;let e7=ej>0?`${ej}px`:void 0;ed[102]!==ez||ed[103]!==e7?(et={...ez,maxWidth:e7},ed[102]=ez,ed[103]=e7,ed[104]=et):et=ed[104],ed[105]!==ew||ed[106]!==eu||ed[107]!==eH||ed[108]!==eT||ed[109]!==c||ed[110]!==eL||ed[111]!==eM||ed[112]!==ef||ed[113]!==eN||ed[114]!==eh||ed[115]!==m||ed[116]!==b||ed[117]!==e4||ed[118]!==e5||ed[119]!==em?(eo=(0,a.jsx)(rs,{...m,animate:ew,arrow:eu,arrowRef:e4,arrowX:eH,arrowY:eT,originX:eL,originY:eM,padding:ef,placement:eN,radius:eh,ref:e5,scheme:b,shadow:em,children:c}),ed[105]=ew,ed[106]=eu,ed[107]=eH,ed[108]=eT,ed[109]=c,ed[110]=eL,ed[111]=eM,ed[112]=ef,ed[113]=eN,ed[114]=eh,ed[115]=m,ed[116]=b,ed[117]=e4,ed[118]=e5,ed[119]=em,ed[120]=eo):eo=ed[120],ed[121]!==m||ed[122]!==e5||ed[123]!==et||ed[124]!==eo||ed[125]!==ev?(er=(0,a.jsx)(rp,{"data-ui":"Tooltip",...m,ref:e5,style:et,zOffset:ev,children:eo}),ed[121]=m,ed[122]=e5,ed[123]=et,ed[124]=eo,ed[125]=ev,ed[126]=er):er=ed[126];let e8=er;ed[127]!==f||ed[128]!==eV||ed[129]!==e8?(en=eV&&(f?(0,a.jsx)(om,{__unstable_name:"string"==typeof f?f:void 0,children:e8}):e8),ed[127]=f,ed[128]=eV,ed[129]=e8,ed[130]=en):en=ed[130];let e9=en;return ed[131]!==ew||ed[132]!==e9?(ei=ew?(0,a.jsx)(g.N,{children:e9}):e9,ed[131]=ew,ed[132]=e9,ed[133]=ei):ei=ed[133],ed[134]!==e6||ed[135]!==ei?(ea=(0,a.jsxs)(a.Fragment,{children:[ei,e6]}),ed[134]=e6,ed[135]=ei,ed[136]=ea):ea=ed[136],ea});rh.displayName="ForwardRef(Tooltip)";let rm=c.I4.kbd.withConfig({displayName:"StyledHotkeys",componentId:"sc-b37mge-0"})`font:inherit;padding:1px;&:not([hidden]){display:block;}`,rg=(0,c.I4)(tK).withConfig({displayName:"Key",componentId:"sc-b37mge-1"})`&:not([hidden]){display:block;}`,rb=(0,l.forwardRef)(function(e,t){let o,r,n,i,l,c,s,u,f,p,h=(0,d.c)(26);h[0]!==e?({fontSize:o,keys:r,padding:n,radius:i,space:c,...l}=e,h[0]=e,h[1]=o,h[2]=r,h[3]=n,h[4]=i,h[5]=l,h[6]=c):(o=h[1],r=h[2],n=h[3],i=h[4],l=h[5],c=h[6]);let m=void 0===c?.5:c;h[7]!==m?(s=L(m),h[7]=m,h[8]=s):s=h[8];let g=s;if(!r||0===r.length){let e;return h[9]===Symbol.for("react.memo_cache_sentinel")?(e=(0,a.jsx)(a.Fragment,{}),h[9]=e):e=h[9],e}if(h[10]!==o||h[11]!==r||h[12]!==n||h[13]!==i){let e;h[15]!==o||h[16]!==n||h[17]!==i?(e=(e,t)=>(0,a.jsx)(rg,{fontSize:o,padding:n,radius:i,children:e},t),h[15]=o,h[16]=n,h[17]=i,h[18]=e):e=h[18],u=r.map(e),h[10]=o,h[11]=r,h[12]=n,h[13]=i,h[14]=u}else u=h[14];return h[19]!==g||h[20]!==u?(f=(0,a.jsx)(tX,{as:"span",space:g,children:u}),h[19]=g,h[20]=u,h[21]=f):f=h[21],h[22]!==t||h[23]!==l||h[24]!==f?(p=(0,a.jsx)(rm,{"data-ui":"Hotkeys",...l,ref:t,children:f}),h[22]=t,h[23]=l,h[24]=f,h[25]=p):p=h[25],p});rb.displayName="ForwardRef(Hotkeys)";let rv=B("@sanity/ui/context/menu",null);function rw(e){return E(e)&&"true"!==e.getAttribute("data-disabled")||N(e)&&!e.disabled}function ry(e){return e.filter(rw)}let rx=[];function r$(){}let rk=(0,c.I4)(to).withConfig({displayName:"StyledMenu",componentId:"sc-xt0tnv-0"})`outline:none;overflow:auto;`,rS=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C=(0,d.c)(49);if(C[0]!==e){let{children:t,focusFirst:a,focusLast:d,onClickOutside:l,onEscape:b,onItemClick:v,onItemSelect:w,onKeyDown:y,originElement:x,padding:$,registerElement:k,shouldFocus:S,space:j,...I}=e;r=t,n=l,i=b,c=v,s=w,u=y,f=x,m=$,p=k,o=S,g=j,h=I,C[0]=e,C[1]=o,C[2]=r,C[3]=n,C[4]=i,C[5]=c,C[6]=s,C[7]=u,C[8]=f,C[9]=p,C[10]=h,C[11]=m,C[12]=g}else o=C[1],r=C[2],n=C[3],i=C[4],c=C[5],s=C[6],u=C[7],f=C[8],p=C[9],h=C[10],m=C[11],g=C[12];let E=void 0===m?1:m,z=void 0===g?1:g,N=o??(e.focusFirst&&"first"||e.focusLast&&"last"||null),_=(0,l.useRef)(null);C[13]===Symbol.for("react.memo_cache_sentinel")?(b=()=>_.current,C[13]=b):b=C[13],(0,l.useImperativeHandle)(t,b);let{isTopLayer:A}=od();C[14]!==u||C[15]!==f||C[16]!==N?(v={onKeyDown:u,originElement:f,shouldFocus:N,rootElementRef:_},C[14]=u,C[15]=f,C[16]=N,C[17]=v):v=C[17];let{activeElement:W,activeIndex:H,handleItemMouseEnter:T,handleItemMouseLeave:L,handleKeyDown:M,mount:F}=function(e){let t,o,r,n,i,a,c,s,u,f=(0,d.c)(21),{onKeyDown:p,originElement:h,shouldFocus:m,rootElementRef:g}=e;f[0]===Symbol.for("react.memo_cache_sentinel")?(t=[],f[0]=t):t=f[0];let b=(0,l.useRef)(t),[v,w]=(0,l.useState)(-1),y=(0,l.useRef)(v),[x,$]=(0,l.useState)(null);f[1]===Symbol.for("react.memo_cache_sentinel")?(o=e=>{w(e),y.current=e,$(b.current[e]||null)},f[1]=o):o=f[1];let k=o;f[2]!==g?(r=(e,t)=>e?(-1===b.current.indexOf(e)&&(b.current.push(e),function(e,t){if(!e)return;let o=new WeakMap;for(let r of t)o.set(r,function(e,t){let o=[],r=t;for(;r!==e;){let t=r.parentElement;if(!t)break;let n=Array.from(t.childNodes).indexOf(r);if(o.unshift(n),t===e)break;r=t}return o}(e,r));t.sort((e,t)=>{let r=o.get(e)||rx,n=o.get(t)||rx,i=Math.max(r.length,n.length);for(let e=0;e<i;e+=1){let t=r[e]||-1,o=n[e]||-1;if(t!==o)return t-o}return 0})}(g.current,b.current)),t&&k(b.current.indexOf(e)),()=>{let t=b.current.indexOf(e);t>-1&&b.current.splice(t,1)}):r$,f[2]=g,f[3]=r):r=f[3];let S=r;f[4]!==p||f[5]!==h?(n=e=>{if("Tab"===e.key){h&&h.focus();return}if("Home"===e.key){e.preventDefault(),e.stopPropagation();let t=ry(b.current)[0];if(!t)return;k(b.current.indexOf(t));return}if("End"===e.key){e.preventDefault(),e.stopPropagation();let t=ry(b.current),o=t[t.length-1];if(!o)return;k(b.current.indexOf(o));return}if("ArrowUp"===e.key){e.preventDefault(),e.stopPropagation();let t=ry(b.current),o=t.length;if(0===o)return;let r=b.current[y.current],n=t.indexOf(r),i=t[n=(n-1+o)%o];k(b.current.indexOf(i));return}if("ArrowDown"===e.key){e.preventDefault(),e.stopPropagation();let t=ry(b.current),o=t.length;if(0===o)return;let r=b.current[y.current],n=t.indexOf(r),i=t[n=(n+1)%o];k(b.current.indexOf(i));return}p&&p(e)},f[4]=p,f[5]=h,f[6]=n):n=f[6];let j=n;f[7]===Symbol.for("react.memo_cache_sentinel")?(i=e=>{let t=e.currentTarget;k(b.current.indexOf(t))},f[7]=i):i=f[7];let I=i;f[8]!==g?(a=()=>{k(-2),g.current?.focus()},f[8]=g,f[9]=a):a=f[9];let R=a;return f[10]!==v||f[11]!==g||f[12]!==m?(c=()=>{if(!g.current)return;let e=requestAnimationFrame(()=>{if(-1===v){if("first"===m){let e=ry(b.current)[0];e&&k(b.current.indexOf(e))}if("last"===m){let e=ry(b.current),t=e[e.length-1];t&&k(b.current.indexOf(t))}return}(b.current[v]||null)?.focus()});return()=>cancelAnimationFrame(e)},s=[v,g,k,m],f[10]=v,f[11]=g,f[12]=m,f[13]=c,f[14]=s):(c=f[13],s=f[14]),(0,l.useEffect)(c,s),f[15]!==x||f[16]!==v||f[17]!==R||f[18]!==j||f[19]!==S?(u={activeElement:x,activeIndex:v,handleItemMouseEnter:I,handleItemMouseLeave:R,handleKeyDown:j,mount:S},f[15]=x,f[16]=v,f[17]=R,f[18]=j,f[19]=S,f[20]=u):u=f[20],u}(v),J=(0,l.useRef)(null);C[18]!==p?(w=e=>{J.current&&(J.current(),J.current=null),_.current=e,_.current&&p&&(J.current=p(_.current))},C[18]=p,C[19]=w):w=C[19];let O=w;C[20]!==H||C[21]!==s?(y=()=>{s&&s(H)},x=[H,s],C[20]=H,C[21]=s,C[22]=y,C[23]=x):(y=C[22],x=C[23]),(0,l.useEffect)(y,x),C[24]===Symbol.for("react.memo_cache_sentinel")?($=()=>[_.current],C[24]=$):$=C[24],tw(A&&n,$),C[25]!==A||C[26]!==i?(k=e=>{A&&"Escape"===e.key&&(e.stopPropagation(),i&&i())},C[25]=A,C[26]=i,C[27]=k):k=C[27],tj(k),C[28]!==W||C[29]!==T||C[30]!==L||C[31]!==F||C[32]!==n||C[33]!==i||C[34]!==c||C[35]!==p?(S={version:2,activeElement:W,mount:F,onClickOutside:n,onEscape:i,onItemClick:c,onItemMouseEnter:T,onItemMouseLeave:L,registerElement:p},C[28]=W,C[29]=T,C[30]=L,C[31]=F,C[32]=n,C[33]=i,C[34]=c,C[35]=p,C[36]=S):S=C[36];let B=S;return C[37]!==r||C[38]!==z?(j=(0,a.jsx)(oD,{space:z,children:r}),C[37]=r,C[38]=z,C[39]=j):j=C[39],C[40]!==M||C[41]!==O||C[42]!==E||C[43]!==h||C[44]!==j?(I=(0,a.jsx)(rk,{"data-ui":"Menu",...h,onKeyDown:M,padding:E,ref:O,role:"menu",tabIndex:-1,children:j}),C[40]=M,C[41]=O,C[42]=E,C[43]=h,C[44]=j,C[45]=I):I=C[45],C[46]!==I||C[47]!==B?(R=(0,a.jsx)(rv.Provider,{value:B,children:I}),C[46]=I,C[47]=B,C[48]=R):R=C[48],R});rS.displayName="ForwardRef(Menu)";let rj=c.I4.hr.withConfig({displayName:"MenuDivider",componentId:"sc-uhoxwu-0"})`height:1px;border:0;background:var(--card-hairline-soft-color);margin:0;`;rj.displayName="MenuDivider";let rI=(0,c.I4)(to).withConfig({displayName:"Selectable",componentId:"sc-1w01ang-0"})(eV,function(){return(0,c.AH)`
    background-color: inherit;
    color: inherit;

    &[data-as='button'] {
      -webkit-font-smoothing: inherit;
      appearance: none;
      outline: none;
      font: inherit;
      text-align: inherit;
      border: 0;
      width: -moz-available;
      width: -webkit-fill-available;
      width: stretch;
    }

    /* &:is(a) */
    &[data-as='a'] {
      text-decoration: none;
    }
  `},function(e){let{$tone:t}=e,{color:o,style:r}=(0,i.JW)(e.theme),n=o.selectable[t];return(0,c.AH)`
    ${tf(o,n.enabled)}

    background-color: var(--card-bg-color);
    color: var(--card-fg-color);
    outline: none;

    /* &:is(button) */
    &[data-as='button'] {
      &:disabled {
        ${tf(o,n.disabled)}
      }

      &:not(:disabled) {
        &[aria-pressed='true'] {
          ${tf(o,n.pressed)}
        }

        &[data-selected],
        &[aria-selected='true'] > & {
          ${tf(o,n.selected)}
        }

        @media (hover: hover) {
          &:not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${tf(o,n.hovered)}
            }

            &:active {
              ${tf(o,n.pressed)}
            }
          }
        }
      }
    }

    /* &:is(a) */
    &[data-as='a'] {
      &[data-disabled] {
        ${tf(o,n.disabled)}
      }

      &:not([data-disabled]) {
        &[data-pressed] {
          ${tf(o,n.pressed)}
        }

        &[data-selected] {
          ${tf(o,n.selected)}
        }

        @media (hover: hover) {
          &:not([data-selected]) {
            &[data-hovered],
            &:hover {
              ${tf(o,n.hovered)}
            }
            &:active {
              ${tf(o,n.pressed)}
            }
          }
        }
      }
    }

    ${r?.card?.root}
  `});function rR(){let e=(0,l.useContext)(rv);if(!e)throw Error("useMenu(): missing context value");if(!t8(e)||2!==e.version)throw Error("useMenu(): the context value is not compatible");return e}function rC(e){let t,o,r,n,i,c,s,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O,B,P=(0,d.c)(81);P[0]!==e?({as:s,children:o,fontSize:p,icon:t,menu:r,onClick:n,padding:h,popover:i,radius:m,space:g,text:v,tone:b,...c}=e,P[0]=e,P[1]=t,P[2]=o,P[3]=r,P[4]=n,P[5]=i,P[6]=c,P[7]=s,P[8]=p,P[9]=h,P[10]=m,P[11]=g,P[12]=b,P[13]=v):(t=P[1],o=P[2],r=P[3],n=P[4],i=P[5],c=P[6],s=P[7],p=P[8],h=P[9],m=P[10],g=P[11],b=P[12],v=P[13]);let D=void 0===s?"button":s,G=void 0===p?1:p,Y=void 0===h?3:h,X=void 0===m?2:m,U=void 0===g?3:g,q=void 0===b?"default":b,K=rR(),{scheme:Z}=V(),{activeElement:Q,mount:ee,onClickOutside:et,onEscape:eo,onItemClick:er,onItemMouseEnter:en,registerElement:ei}=K,ea=en??K.onItemMouseEnter,[ed,el]=(0,l.useState)(null),[ec,es]=(0,l.useState)(!1),[eu,ef]=(0,l.useState)(null),ep=!!Q&&Q===ed,[eh,em]=(0,l.useState)(!1);P[14]!==ea?(w=e=>{em(!1),ea(e),es(!0)},P[14]=ea,P[15]=w):w=P[15];let eg=w;P[16]!==ed?(y=e=>{"ArrowLeft"===e.key&&(e.stopPropagation(),es(!1),requestAnimationFrame(()=>{ed?.focus()}))},P[16]=ed,P[17]=y):y=P[17];let eb=y;P[18]!==n?(x=e=>{n?.(e),ef("first"),es(!0)},P[18]=n,P[19]=x):x=P[19];let ev=x;P[20]!==er?($=()=>{es(!1),er?.()},P[20]=er,P[21]=$):$=P[21];let ew=$;P[22]===Symbol.for("react.memo_cache_sentinel")?(k=()=>em(!0),P[22]=k):k=P[22];let ey=k;P[23]!==ee||P[24]!==ed?(S=()=>ee(ed),j=[ee,ed],P[23]=ee,P[24]=ed,P[25]=S,P[26]=j):(S=P[25],j=P[26]),(0,l.useEffect)(S,j),P[27]!==ep?(I=()=>{ep||es(!1)},R=[ep],P[27]=ep,P[28]=I,P[29]=R):(I=P[28],R=P[29]),(0,l.useEffect)(I,R),P[30]!==ec?(C=()=>{ec||em(!1)},E=[ec],P[30]=ec,P[31]=C,P[32]=E):(C=P[31],E=P[32]),(0,l.useEffect)(C,E),P[33]!==eu?(z=()=>{if(!eu)return;let e=requestAnimationFrame(()=>ef(null));return()=>cancelAnimationFrame(e)},N=[eu],P[33]=eu,P[34]=z,P[35]=N):(z=P[34],N=P[35]),(0,l.useEffect)(z,N),P[36]!==o||P[37]!==ew||P[38]!==eb||P[39]!==r||P[40]!==et||P[41]!==eo||P[42]!==ei||P[43]!==eu?(_=(0,a.jsx)(rS,{...r,onClickOutside:et,onEscape:eo,onItemClick:ew,onKeyDown:eb,onMouseEnter:ey,registerElement:ei,shouldFocus:eu,children:o}),P[36]=o,P[37]=ew,P[38]=eb,P[39]=r,P[40]=et,P[41]=eo,P[42]=ei,P[43]=eu,P[44]=_):_=P[44];let ex=_;P[45]===Symbol.for("react.memo_cache_sentinel")?(A=e=>{let t=e.currentTarget;if(document.activeElement===t&&"ArrowRight"===e.key){ef("first"),es(!0),em(!0);return}},P[45]=A):A=P[45];let e$=A,ek="button"===D?eh:void 0,eS="button"!==D?eh:void 0,ej=!eh&&ep?"":void 0;P[46]!==X?(W=L(X),P[46]=X,P[47]=W):W=P[47];let eI="button"===D?"button":void 0;return P[48]!==t||P[49]!==G?(H=t&&(0,a.jsxs)(tn,{size:G,children:[(0,l.isValidElement)(t)&&t,(0,u.isValidElementType)(t)&&(0,a.jsx)(t,{})]}),P[48]=t,P[49]=G,P[50]=H):H=P[50],P[51]!==G||P[52]!==v?(T=(0,a.jsx)(to,{flex:1,children:(0,a.jsx)(tn,{size:G,textOverflow:"ellipsis",weight:"medium",children:v})}),P[51]=G,P[52]=v,P[53]=T):T=P[53],P[54]===Symbol.for("react.memo_cache_sentinel")?(M=(0,a.jsx)(f.vKP,{}),P[54]=M):M=P[54],P[55]!==G?(F=(0,a.jsx)(tn,{size:G,children:M}),P[55]=G,P[56]=F):F=P[56],P[57]!==Y||P[58]!==U||P[59]!==H||P[60]!==T||P[61]!==F?(J=(0,a.jsxs)(tl,{gap:U,padding:Y,children:[H,T,F]}),P[57]=Y,P[58]=U,P[59]=H,P[60]=T,P[61]=F,P[62]=J):J=P[62],P[63]!==D||P[64]!==ev||P[65]!==eg||P[66]!==c||P[67]!==Z||P[68]!==ek||P[69]!==eS||P[70]!==ej||P[71]!==W||P[72]!==eI||P[73]!==J||P[74]!==q?(O=(0,a.jsx)(rI,{"data-as":D,"data-ui":"MenuGroup",forwardedAs:D,...c,"aria-pressed":ek,"data-pressed":eS,"data-selected":ej,$radius:W,$tone:q,$scheme:Z,onClick:ev,onKeyDown:e$,onMouseEnter:eg,ref:el,tabIndex:-1,type:eI,children:J}),P[63]=D,P[64]=ev,P[65]=eg,P[66]=c,P[67]=Z,P[68]=ek,P[69]=eS,P[70]=ej,P[71]=W,P[72]=eI,P[73]=J,P[74]=q,P[75]=O):O=P[75],P[76]!==ex||P[77]!==ec||P[78]!==i||P[79]!==O?(B=(0,a.jsx)(oN,{...i,content:ex,"data-ui":"MenuGroup__popover",open:ec,children:O}),P[76]=ex,P[77]=ec,P[78]=i,P[79]=O,P[80]=B):B=P[80],B}rI.displayName="Selectable",rC.displayName="MenuGroup";let rE=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,f,p,h,m,g,b,v,w,y,x,$,k,S,j,I,R,C,E,z,N,_,A,W,H,T,M,F,J,O=(0,d.c)(75);O[0]!==e?({as:x,children:n,disabled:i,fontSize:$,hotkeys:c,icon:o,iconRight:r,onClick:s,padding:k,paddingX:g,paddingY:b,paddingTop:m,paddingRight:h,paddingBottom:f,paddingLeft:p,pressed:v,radius:S,selected:y,space:j,text:R,tone:I,...w}=e,O[0]=e,O[1]=o,O[2]=r,O[3]=n,O[4]=i,O[5]=c,O[6]=s,O[7]=f,O[8]=p,O[9]=h,O[10]=m,O[11]=g,O[12]=b,O[13]=v,O[14]=w,O[15]=y,O[16]=x,O[17]=$,O[18]=k,O[19]=S,O[20]=j,O[21]=I,O[22]=R):(o=O[1],r=O[2],n=O[3],i=O[4],c=O[5],s=O[6],f=O[7],p=O[8],h=O[9],m=O[10],g=O[11],b=O[12],v=O[13],w=O[14],y=O[15],x=O[16],$=O[17],k=O[18],S=O[19],j=O[20],I=O[21],R=O[22]);let B=void 0===x?"button":x,P=void 0===$?1:$,D=void 0===k?3:k,G=void 0===S?2:S,Y=void 0===j?3:j,X=void 0===I?"default":I,{scheme:U}=V(),q=rR(),{activeElement:K,mount:Z,onItemClick:Q,onItemMouseEnter:ee,onItemMouseLeave:et}=q,eo=ee??q.onItemMouseEnter,er=et??q.onItemMouseLeave,[en,ei]=(0,l.useState)(null),ea=!!K&&K===en,ed=(0,l.useRef)(null);O[23]===Symbol.for("react.memo_cache_sentinel")?(C=()=>ed.current,O[23]=C):C=O[23],(0,l.useImperativeHandle)(t,C),O[24]!==Z||O[25]!==en||O[26]!==y?(E=()=>Z(en,y),z=[Z,en,y],O[24]=Z,O[25]=en,O[26]=y,O[27]=E,O[28]=z):(E=O[27],z=O[28]),(0,l.useEffect)(E,z),O[29]!==i||O[30]!==s||O[31]!==Q?(N=e=>{i||(s&&s(e),Q&&Q())},O[29]=i,O[30]=s,O[31]=Q,O[32]=N):N=O[32];let el=N;O[33]!==D||O[34]!==f||O[35]!==p||O[36]!==h||O[37]!==m||O[38]!==g||O[39]!==b?(_={padding:D,paddingX:g,paddingY:b,paddingTop:m,paddingRight:h,paddingBottom:f,paddingLeft:p},O[33]=D,O[34]=f,O[35]=p,O[36]=h,O[37]=m,O[38]=g,O[39]=b,O[40]=_):_=O[40];let ec=_;O[41]!==P?(A=L(P).map(rz),O[41]=P,O[42]=A):A=O[42];let es=A;O[43]===Symbol.for("react.memo_cache_sentinel")?(W=e=>{ed.current=e,ei(e)},O[43]=W):W=O[43];let eu=W,ef="button"!==B&&v?"":void 0,ep=ea?"":void 0,eh=i?"":void 0;O[44]!==G?(H=L(G),O[44]=G,O[45]=H):H=O[45],O[46]===Symbol.for("react.memo_cache_sentinel")?(T=L(0),O[46]=T):T=O[46];let em=i?"default":X,eg="button"===B?"button":void 0;return O[47]!==o||O[48]!==r||O[49]!==P||O[50]!==c||O[51]!==es||O[52]!==ec||O[53]!==Y||O[54]!==R?(M=(o||R||r)&&(0,a.jsxs)(tl,{as:"span",gap:Y,align:"center",...ec,children:[o&&(0,a.jsxs)(tn,{size:P,children:[(0,l.isValidElement)(o)&&o,(0,u.isValidElementType)(o)&&(0,a.jsx)(o,{})]}),R&&(0,a.jsx)(to,{flex:1,children:(0,a.jsx)(tn,{size:P,textOverflow:"ellipsis",weight:"medium",children:R})}),c&&(0,a.jsx)(rb,{fontSize:es,keys:c,style:{marginTop:-4,marginBottom:-4}}),r&&(0,a.jsxs)(tn,{size:P,children:[(0,l.isValidElement)(r)&&r,(0,u.isValidElementType)(r)&&(0,a.jsx)(r,{})]})]}),O[47]=o,O[48]=r,O[49]=P,O[50]=c,O[51]=es,O[52]=ec,O[53]=Y,O[54]=R,O[55]=M):M=O[55],O[56]!==n||O[57]!==ec?(F=n&&(0,a.jsx)(to,{as:"span",...ec,children:n}),O[56]=n,O[57]=ec,O[58]=F):F=O[58],O[59]!==B||O[60]!==i||O[61]!==el||O[62]!==eo||O[63]!==er||O[64]!==w||O[65]!==U||O[66]!==ef||O[67]!==ep||O[68]!==eh||O[69]!==H||O[70]!==em||O[71]!==eg||O[72]!==M||O[73]!==F?(J=(0,a.jsxs)(rI,{"data-ui":"MenuItem",role:"menuitem",...w,"data-pressed":ef,"data-selected":ep,"data-disabled":eh,forwardedAs:B,$radius:H,$padding:T,$tone:em,$scheme:U,disabled:i,onClick:el,onMouseEnter:eo,onMouseLeave:er,ref:eu,tabIndex:-1,type:eg,children:[M,F]}),O[59]=B,O[60]=i,O[61]=el,O[62]=eo,O[63]=er,O[64]=w,O[65]=U,O[66]=ef,O[67]=ep,O[68]=eh,O[69]=H,O[70]=em,O[71]=eg,O[72]=M,O[73]=F,O[74]=J):J=O[74],J});function rz(e){return e-1}rE.displayName="ForwardRef(MenuItem)";let rN=(0,c.I4)(tg).withConfig({displayName:"CustomButton",componentId:"sc-1kns779-0"})`max-width:100%;`,r_=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s,u,f,p,h,m,g,b,v,w,y,x=(0,d.c)(30);x[0]!==e?({icon:r,id:n,focused:o,fontSize:p,label:i,onClick:c,onFocus:s,padding:h,selected:f,...u}=e,x[0]=e,x[1]=o,x[2]=r,x[3]=n,x[4]=i,x[5]=c,x[6]=s,x[7]=u,x[8]=f,x[9]=p,x[10]=h):(o=x[1],r=x[2],n=x[3],i=x[4],c=x[5],s=x[6],u=x[7],f=x[8],p=x[9],h=x[10]);let $=void 0===p?1:p,k=void 0===h?2:h,S=(0,l.useRef)(null),j=(0,l.useRef)(!1);x[11]===Symbol.for("react.memo_cache_sentinel")?(m=()=>S.current,x[11]=m):m=x[11],(0,l.useImperativeHandle)(t,m),x[12]===Symbol.for("react.memo_cache_sentinel")?(g=()=>{j.current=!1},x[12]=g):g=x[12];let I=g;x[13]!==s?(b=e=>{j.current=!0,s&&s(e)},x[13]=s,x[14]=b):b=x[14];let R=b;x[15]!==o?(v=()=>{o&&!j.current&&(S.current&&S.current.focus(),j.current=!0)},w=[o],x[15]=o,x[16]=v,x[17]=w):(v=x[16],w=x[17]),(0,l.useEffect)(v,w);let C=f?"true":"false",E=f?0:-1;return x[18]!==$||x[19]!==R||x[20]!==r||x[21]!==n||x[22]!==i||x[23]!==c||x[24]!==k||x[25]!==u||x[26]!==f||x[27]!==C||x[28]!==E?(y=(0,a.jsx)(rN,{"data-ui":"Tab",...u,"aria-selected":C,fontSize:$,icon:r,id:n,mode:"bleed",onClick:c,onBlur:I,onFocus:R,padding:k,ref:S,role:"tab",selected:f,tabIndex:E,text:i,type:"button"}),x[18]=$,x[19]=R,x[20]=r,x[21]=n,x[22]=i,x[23]=c,x[24]=k,x[25]=u,x[26]=f,x[27]=C,x[28]=E,x[29]=y):y=x[29],y});r_.displayName="ForwardRef(Tab)";let rA=(0,c.I4)(tX).withConfig({displayName:"CustomInline",componentId:"sc-5cm04m-0"})`& > div{display:inline-block;vertical-align:middle;max-width:100%;box-sizing:border-box;}`,rW=(0,l.forwardRef)(function(e,t){let o,r,n,i,c,s=(0,d.c)(15);s[0]!==e?({children:o,...r}=e,s[0]=e,s[1]=o,s[2]=r):(o=s[1],r=s[2]);let[u,f]=(0,l.useState)(-1);if(s[3]!==o||s[4]!==u){let e,t=l.Children.toArray(o).filter(l.isValidElement);s[6]!==u?(e=(e,t)=>(0,l.cloneElement)(e,{focused:u===t,key:t,onFocus:()=>f(t)}),s[6]=u,s[7]=e):e=s[7],n=t.map(e),s[3]=o,s[4]=u,s[5]=n}else n=s[5];let p=n,h=p.length;s[8]!==h?(i=e=>{"ArrowLeft"===e.key&&f(e=>(e+h-1)%h),"ArrowRight"===e.key&&f(e=>(e+1)%h)},s[8]=h,s[9]=i):i=s[9];let m=i;return s[10]!==m||s[11]!==t||s[12]!==r||s[13]!==p?(c=(0,a.jsx)(rA,{"data-ui":"TabList",...r,onKeyDown:m,ref:t,role:"tablist",children:p}),s[10]=m,s[11]=t,s[12]=r,s[13]=p,s[14]=c):c=s[14],c});rW.displayName="ForwardRef(TabList)"}}]);