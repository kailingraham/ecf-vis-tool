function E(){}const yt=t=>t;function gt(t,e){for(const n in e)t[n]=e[n];return t}function bt(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function st(t){return t()}function tt(){return Object.create(null)}function N(t){t.forEach(st)}function H(t){return typeof t=="function"}function Xt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let R;function Yt(t,e){return R||(R=document.createElement("a")),R.href=e,t===R.href}function $t(t){return Object.keys(t).length===0}function rt(t,...e){if(t==null)return E;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Zt(t){let e;return rt(t,n=>e=n)(),e}function te(t,e,n){t.$$.on_destroy.push(rt(e,n))}function ee(t,e,n,s){if(t){const r=it(t,e,n,s);return t[0](r)}}function it(t,e,n,s){return t[1]&&s?gt(n.ctx.slice(),t[1](s(e))):n.ctx}function ne(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],i=Math.max(e.dirty.length,r.length);for(let l=0;l<i;l+=1)o[l]=e.dirty[l]|r[l];return o}return e.dirty|r}return e.dirty}function se(t,e,n,s,r,o){if(r){const i=it(e,n,s,o);t.p(i,r)}}function re(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let s=0;s<n;s++)e[s]=-1;return e}return-1}function ie(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ce(t,e){const n={};e=new Set(e);for(const s in t)!e.has(s)&&s[0]!=="$"&&(n[s]=t[s]);return n}function le(t,e,n){return t.set(n),e}function oe(t){return t&&H(t.destroy)?t.destroy:E}function ue(t){const e=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[t,"px"]}const ct=typeof window<"u";let xt=ct?()=>window.performance.now():()=>Date.now(),U=ct?t=>requestAnimationFrame(t):E;const A=new Set;function lt(t){A.forEach(e=>{e.c(t)||(A.delete(e),e.f())}),A.size!==0&&U(lt)}function wt(t){let e;return A.size===0&&U(lt),{promise:new Promise(n=>{A.add(e={c:t,f:n})}),abort(){A.delete(e)}}}let I=!1;function kt(){I=!0}function vt(){I=!1}function Et(t,e,n,s){for(;t<e;){const r=t+(e-t>>1);n(r)<=s?t=r+1:e=r}return t}function Nt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const _=e[u];_.claim_order!==void 0&&c.push(_)}e=c}const n=new Int32Array(e.length+1),s=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,_=(r>0&&e[n[r]].claim_order<=u?r+1:Et(1,r,d=>e[n[d]].claim_order,u))-1;s[c]=n[_]+1;const f=_+1;n[f]=c,r=Math.max(f,r)}const o=[],i=[];let l=e.length-1;for(let c=n[r]+1;c!=0;c=s[c-1]){for(o.push(e[c-1]);l>=c;l--)i.push(e[l]);l--}for(;l>=0;l--)i.push(e[l]);o.reverse(),i.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<i.length;c++){for(;u<o.length&&i[c].claim_order>=o[u].claim_order;)u++;const _=u<o.length?o[u]:null;t.insertBefore(i[c],_)}}function jt(t,e){t.appendChild(e)}function ot(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function St(t){const e=at("style");return Ct(ot(t),e),e.sheet}function Ct(t,e){return jt(t.head||t,e),e.sheet}function At(t,e){if(I){for(Nt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ae(t,e,n){I&&!n?At(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ut(t){t.parentNode&&t.parentNode.removeChild(t)}function fe(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function at(t){return document.createElement(t)}function Mt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function V(t){return document.createTextNode(t)}function _e(){return V(" ")}function de(){return V("")}function he(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function me(t){return function(e){return e.preventDefault(),t.call(this,e)}}function X(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Ot(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const s in e)e[s]==null?t.removeAttribute(s):s==="style"?t.style.cssText=e[s]:s==="__value"?t.value=t[s]=e[s]:n[s]&&n[s].set?t[s]=e[s]:X(t,s,e[s])}function pe(t,e){for(const n in e)X(t,n,e[n])}function Dt(t,e){Object.keys(e).forEach(n=>{Pt(t,n,e[n])})}function Pt(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:X(t,e,n)}function ye(t){return/-/.test(t)?Dt:Ot}function qt(t){return Array.from(t.childNodes)}function Lt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function ft(t,e,n,s,r=!1){Lt(t);const o=(()=>{for(let i=t.claim_info.last_index;i<t.length;i++){const l=t[i];if(e(l)){const c=n(l);return c===void 0?t.splice(i,1):t[i]=c,r||(t.claim_info.last_index=i),l}}for(let i=t.claim_info.last_index-1;i>=0;i--){const l=t[i];if(e(l)){const c=n(l);return c===void 0?t.splice(i,1):t[i]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=i,l}}return s()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function _t(t,e,n,s){return ft(t,r=>r.nodeName===e,r=>{const o=[];for(let i=0;i<r.attributes.length;i++){const l=r.attributes[i];n[l.name]||o.push(l.name)}o.forEach(i=>r.removeAttribute(i))},()=>s(e))}function ge(t,e,n){return _t(t,e,n,at)}function be(t,e,n){return _t(t,e,n,Mt)}function Rt(t,e){return ft(t,n=>n.nodeType===3,n=>{const s=""+e;if(n.data.startsWith(s)){if(n.data.length!==s.length)return n.splitText(s.length)}else n.data=s},()=>V(e),!0)}function $e(t){return Rt(t," ")}function xe(t,e){e=""+e,t.data!==e&&(t.data=e)}function we(t,e,n,s){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}function ke(t,e,n){t.classList[n?"add":"remove"](e)}function dt(t,e,{bubbles:n=!1,cancelable:s=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,s,e),r}function ve(t,e){return new t(e)}const z=new Map;let B=0;function Tt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function zt(t,e){const n={stylesheet:St(e),rules:{}};return z.set(t,n),n}function et(t,e,n,s,r,o,i,l=0){const c=16.666/s;let u=`{
`;for(let y=0;y<=1;y+=c){const g=e+(n-e)*o(y);u+=y*100+`%{${i(g,1-g)}}
`}const _=u+`100% {${i(n,1-n)}}
}`,f=`__svelte_${Tt(_)}_${l}`,d=ot(t),{stylesheet:a,rules:h}=z.get(d)||zt(d,t);h[f]||(h[f]=!0,a.insertRule(`@keyframes ${f} ${_}`,a.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${s}ms linear ${r}ms 1 both`,B+=1,f}function Bt(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),r=n.length-s.length;r&&(t.style.animation=s.join(", "),B-=r,B||Ft())}function Ft(){U(()=>{B||(z.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&ut(e)}),z.clear())})}let P;function x(t){P=t}function O(){if(!P)throw new Error("Function called outside component initialization");return P}function Ee(t){O().$$.on_mount.push(t)}function Ne(t){O().$$.after_update.push(t)}function je(){const t=O();return(e,n,{cancelable:s=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=dt(e,n,{cancelable:s});return r.slice().forEach(i=>{i.call(t,o)}),!o.defaultPrevented}return!0}}function Se(t,e){return O().$$.context.set(t,e),e}function Ce(t){return O().$$.context.get(t)}function Ae(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(s=>s.call(this,e))}const C=[],nt=[];let M=[];const K=[],ht=Promise.resolve();let Q=!1;function mt(){Q||(Q=!0,ht.then(Y))}function Me(){return mt(),ht}function F(t){M.push(t)}function Oe(t){K.push(t)}const G=new Set;let S=0;function Y(){if(S!==0)return;const t=P;do{try{for(;S<C.length;){const e=C[S];S++,x(e),Ht(e.$$)}}catch(e){throw C.length=0,S=0,e}for(x(null),C.length=0,S=0;nt.length;)nt.pop()();for(let e=0;e<M.length;e+=1){const n=M[e];G.has(n)||(G.add(n),n())}M.length=0}while(C.length);for(;K.length;)K.pop()();Q=!1,G.clear(),x(t)}function Ht(t){if(t.fragment!==null){t.update(),N(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(F)}}function It(t){const e=[],n=[];M.forEach(s=>t.indexOf(s)===-1?e.push(s):n.push(s)),n.forEach(s=>s()),M=e}let D;function Wt(){return D||(D=Promise.resolve(),D.then(()=>{D=null})),D}function J(t,e,n){t.dispatchEvent(dt(`${e?"intro":"outro"}${n}`))}const T=new Set;let w;function Gt(){w={r:0,c:[],p:w}}function Jt(){w.r||N(w.c),w=w.p}function Z(t,e){t&&t.i&&(T.delete(t),t.i(e))}function pt(t,e,n,s){if(t&&t.o){if(T.has(t))return;T.add(t),w.c.push(()=>{T.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}else s&&s()}const Kt={duration:0};function De(t,e,n,s){const r={direction:"both"};let o=e(t,n,r),i=s?0:1,l=null,c=null,u=null;function _(){u&&Bt(t,u)}function f(a,h){const p=a.b-i;return h*=Math.abs(p),{a:i,b:a.b,d:p,duration:h,start:a.start,end:a.start+h,group:a.group}}function d(a){const{delay:h=0,duration:p=300,easing:y=yt,tick:g=E,css:k}=o||Kt,j={start:xt()+h,b:a};a||(j.group=w,w.r+=1),l||c?c=j:(k&&(_(),u=et(t,i,a,p,h,y,k)),a&&g(0,1),l=f(j,p),F(()=>J(t,a,"start")),wt(v=>{if(c&&v>c.start&&(l=f(c,p),c=null,J(t,l.b,"start"),k&&(_(),u=et(t,i,l.b,l.duration,0,y,o.css))),l){if(v>=l.end)g(i=l.b,1-i),J(t,l.b,"end"),c||(l.b?_():--l.group.r||N(l.group.c)),l=null;else if(v>=l.start){const q=v-l.start;i=l.a+l.d*y(q/l.duration),g(i,1-i)}}return!!(l||c)}))}return{run(a){H(o)?Wt().then(()=>{o=o(r),d(a)}):d(a)},end(){_(),l=c=null}}}function Pe(t,e){const n=e.token={};function s(r,o,i,l){if(e.token!==n)return;e.resolved=l;let c=e.ctx;i!==void 0&&(c=c.slice(),c[i]=l);const u=r&&(e.current=r)(c);let _=!1;e.block&&(e.blocks?e.blocks.forEach((f,d)=>{d!==o&&f&&(Gt(),pt(f,1,1,()=>{e.blocks[d]===f&&(e.blocks[d]=null)}),Jt())}):e.block.d(1),u.c(),Z(u,1),u.m(e.mount(),e.anchor),_=!0),e.block=u,e.blocks&&(e.blocks[o]=u),_&&Y()}if(bt(t)){const r=O();if(t.then(o=>{x(r),s(e.then,1,e.value,o),x(null)},o=>{if(x(r),s(e.catch,2,e.error,o),x(null),!e.hasCatch)throw o}),e.current!==e.pending)return s(e.pending,0),!0}else{if(e.current!==e.then)return s(e.then,1,e.value,t),!0;e.resolved=t}}function qe(t,e,n){const s=e.slice(),{resolved:r}=t;t.current===t.then&&(s[t.value]=r),t.current===t.catch&&(s[t.error]=r),t.block.p(s,n)}function Le(t,e){pt(t,1,1,()=>{e.delete(t.key)})}function Re(t,e,n,s,r,o,i,l,c,u,_,f){let d=t.length,a=o.length,h=d;const p={};for(;h--;)p[t[h].key]=h;const y=[],g=new Map,k=new Map,j=[];for(h=a;h--;){const m=f(r,o,h),b=n(m);let $=i.get(b);$?s&&j.push(()=>$.p(m,e)):($=u(b,m),$.c()),g.set(b,y[h]=$),b in p&&k.set(b,Math.abs(h-p[b]))}const v=new Set,q=new Set;function W(m){Z(m,1),m.m(l,_),i.set(m.key,m),_=m.first,a--}for(;d&&a;){const m=y[a-1],b=t[d-1],$=m.key,L=b.key;m===b?(_=m.first,d--,a--):g.has(L)?!i.has($)||v.has($)?W(m):q.has(L)?d--:k.get($)>k.get(L)?(q.add($),W(m)):(v.add(L),d--):(c(b,i),d--)}for(;d--;){const m=t[d];g.has(m.key)||c(m,i)}for(;a;)W(y[a-1]);return N(j),y}function Te(t,e){const n={},s={},r={$$scope:1};let o=t.length;for(;o--;){const i=t[o],l=e[o];if(l){for(const c in i)c in l||(s[c]=1);for(const c in l)r[c]||(n[c]=l[c],r[c]=1);t[o]=l}else for(const c in i)r[c]=1}for(const i in s)i in n||(n[i]=void 0);return n}function ze(t){return typeof t=="object"&&t!==null?t:{}}function Be(t,e,n){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,n(t.$$.ctx[s]))}function Fe(t){t&&t.c()}function He(t,e){t&&t.l(e)}function Qt(t,e,n,s){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,n),s||F(()=>{const i=t.$$.on_mount.map(st).filter(H);t.$$.on_destroy?t.$$.on_destroy.push(...i):N(i),t.$$.on_mount=[]}),o.forEach(F)}function Ut(t,e){const n=t.$$;n.fragment!==null&&(It(n.after_update),N(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Vt(t,e){t.$$.dirty[0]===-1&&(C.push(t),mt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ie(t,e,n,s,r,o,i,l=[-1]){const c=P;x(t);const u=t.$$={fragment:null,ctx:[],props:o,update:E,not_equal:r,bound:tt(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:tt(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};i&&i(u.root);let _=!1;if(u.ctx=n?n(t,e.props||{},(f,d,...a)=>{const h=a.length?a[0]:d;return u.ctx&&r(u.ctx[f],u.ctx[f]=h)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](h),_&&Vt(t,f)),d}):[],u.update(),_=!0,N(u.before_update),u.fragment=s?s(u.ctx):!1,e.target){if(e.hydrate){kt();const f=qt(e.target);u.fragment&&u.fragment.l(f),f.forEach(ut)}else u.fragment&&u.fragment.c();e.intro&&Z(t.$$.fragment),Qt(t,e.target,e.anchor,e.customElement),vt(),Y()}x(c)}class We{$destroy(){Ut(this,1),this.$destroy=E}$on(e,n){if(!H(n))return E;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(e){this.$$set&&!$t(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{N as $,Fe as A,He as B,Qt as C,Ut as D,Zt as E,ee as F,se as G,re as H,ne as I,Re as J,le as K,Le as L,Te as M,ze as N,Pe as O,qe as P,gt as Q,Yt as R,We as S,he as T,Me as U,Mt as V,be as W,fe as X,Ce as Y,Be as Z,Oe as _,_e as a,xt as a0,wt as a1,ke as a2,H as a3,me as a4,je as a5,rt as a6,ce as a7,Se as a8,ie as a9,ye as aa,oe as ab,F as ac,De as ad,Ae as ae,pe as af,ue as ag,yt as ah,qt as b,ge as c,Rt as d,at as e,ut as f,$e as g,ae as h,Ie as i,At as j,xe as k,te as l,de as m,E as n,pt as o,Jt as p,Z as q,Ne as r,Xt as s,V as t,Ee as u,X as v,we as w,Gt as x,nt as y,ve as z};