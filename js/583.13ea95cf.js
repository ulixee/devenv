(self["webpackChunk_ulixee_website"]=self["webpackChunk_ulixee_website"]||[]).push([[583],{7327:(e,t,n)=>{"use strict";var r=n(2109),o=n(2092).filter,a=n(1194),c=a("filter");r({target:"Array",proto:!0,forced:!c},{filter:function(e){return o(this,e,arguments.length>1?arguments[1]:void 0)}})},6699:(e,t,n)=>{"use strict";var r=n(2109),o=n(1318).includes,a=n(1223);r({target:"Array",proto:!0},{includes:function(e){return o(this,e,arguments.length>1?arguments[1]:void 0)}}),a("includes")},3321:(e,t,n)=>{var r=n(2109),o=n(9781),a=n(6048).f;r({target:"Object",stat:!0,forced:Object.defineProperties!==a,sham:!o},{defineProperties:a})},5003:(e,t,n)=>{var r=n(2109),o=n(7293),a=n(5656),c=n(1236).f,i=n(9781),s=o((function(){c(1)})),l=!i||s;r({target:"Object",stat:!0,forced:l,sham:!i},{getOwnPropertyDescriptor:function(e,t){return c(a(e),t)}})},9337:(e,t,n)=>{var r=n(2109),o=n(9781),a=n(3887),c=n(5656),i=n(1236),s=n(6135);r({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(e){var t,n,r=c(e),o=i.f,l=a(r),u={},p=0;while(l.length>p)n=o(r,t=l[p++]),void 0!==n&&s(u,t,n);return u}})},7941:(e,t,n)=>{var r=n(2109),o=n(7908),a=n(1956),c=n(7293),i=c((function(){a(1)}));r({target:"Object",stat:!0,forced:i},{keys:function(e){return a(o(e))}})},4747:(e,t,n)=>{var r=n(7854),o=n(8324),a=n(8509),c=n(8533),i=n(8880),s=function(e){if(e&&e.forEach!==c)try{i(e,"forEach",c)}catch(t){e.forEach=c}};for(var l in o)o[l]&&s(r[l]&&r[l].prototype);s(a)},6328:(e,t,n)=>{"use strict";n.d(t,{Z:()=>u});n(7941),n(2526),n(7327),n(1539),n(5003),n(9554),n(4747),n(9337),n(3321),n(9070);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}n(6699);var c=n(821),i=n(8080);const s=c.defineComponent({props:{code:{type:String},inline:{type:Boolean,default:!1},language:{type:String,default:"markup"},useUlixeeTheme:{type:Boolean,default:!0}},setup:function(e,t){var n=t.slots,r=t.attrs,o=c.h,s=n&&n["default"]&&n["default"]()||[],l=e.inline,u=e.language,p=i.p.languages[u],d=e.code||(s.length>0?s[0].children:""),f="language-".concat(u," normalize-whitespace");if(["javascript","typescript"].includes(u)&&(f+=" line-numbers"),e.useUlixeeTheme&&(f+=" ulixeeTheme"),l)return function(){return o("code",a(a({},r),{},{class:[r["class"],f],innerHTML:i.p.highlight(d,p)}))};var h=i.p.highlight(d,p);return function(){return o("pre",a(a({},r),{},{class:[r["class"],f]}),[o("code",{class:f,innerHTML:h})])}},mounted:function(){i.p.highlightAll()}}),l=s,u=l},7583:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>b});var r=n(821),o=function(e){return(0,r.pushScopeId)("data-v-e27563e6"),e=e(),(0,r.popScopeId)(),e},a=o((function(){return(0,r.createElementVNode)("h1",{class:"text-7xl font-light mb-3"},"\n      Developer Desktop\n    ",-1)})),c=o((function(){return(0,r.createElementVNode)("p",{class:"w-8/12"},"Ulixee Developer Desktop is a native app for Mac, Windows, and Linux that includes everything you need to get started.\n      It has a beautiful user interface and a convenient menu bar item without sacrificing the command line.",-1)})),i={class:"mt-2"},s={class:"DESKTOP-BUTTON"},l={class:"DESKTOP-BUTTON"},u={class:"DESKTOP-BUTTON"},p=o((function(){return(0,r.createElementVNode)("h2",{class:"font-bold text-xl mt-10"},"Install It à La Carte",-1)})),d=o((function(){return(0,r.createElementVNode)("p",{class:"w-8/12"},"You can install most of the Developer Desktop tools as individual npm packages. You won't get the tight OS integrations and UI enhacements, but hey, at least you have options.",-1)}));function f(e,t,o,f,h,g){var m=(0,r.resolveComponent)("inline-svg"),v=(0,r.resolveComponent)("Prism"),b=(0,r.resolveComponent)("MainLayout");return(0,r.openBlock)(),(0,r.createBlock)(b,{class:"DeveloperDesktop"},{default:(0,r.withCtx)((function(){return[a,(0,r.createTextVNode)(),c,(0,r.createTextVNode)(),(0,r.createElementVNode)("div",i,[(0,r.createElementVNode)("button",s,[(0,r.createVNode)(m,{src:n(5385),height:"25",class:"inline-block relative -top-[2px]"},null,8,["src"]),(0,r.createTextVNode)("\n        Ulixee for Mac\n      ")]),(0,r.createTextVNode)(),(0,r.createElementVNode)("button",l,[(0,r.createVNode)(m,{src:n(3659),height:"25",class:"inline-block mr-1"},null,8,["src"]),(0,r.createTextVNode)("\n        Ulixee for Windows\n      ")]),(0,r.createTextVNode)(),(0,r.createElementVNode)("button",u,[(0,r.createVNode)(m,{src:n(928),height:"25",class:"inline-block relative -top-[1px]"},null,8,["src"]),(0,r.createTextVNode)("\n        Ulixee for Linux\n      ")])]),(0,r.createTextVNode)(),p,(0,r.createTextVNode)(),d,(0,r.createTextVNode)(),(0,r.createVNode)(v,{language:"bash",class:"w-7/12"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("\n      npm install @ulixee/cloud\n    ")]})),_:1}),(0,r.createTextVNode)(),(0,r.createVNode)(v,{language:"bash",class:"w-7/12"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("\n      npm install @ulixee/chromealive\n    ")]})),_:1})]})),_:1})}var h=n(6328);const g=r.defineComponent({components:{Prism:h.Z}});var m=n(3744);const v=(0,m.Z)(g,[["render",f],["__scopeId","data-v-e27563e6"]]),b=v},928:(e,t,n)=>{"use strict";e.exports=n.p+"img/linux.430a02fa.svg"},5385:(e,t,n)=>{"use strict";e.exports=n.p+"img/mac.9477fea3.svg"},3659:(e,t,n)=>{"use strict";e.exports=n.p+"img/windows.501b23f2.svg"}}]);
//# sourceMappingURL=583.13ea95cf.js.map