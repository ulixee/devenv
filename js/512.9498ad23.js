"use strict";(self["webpackChunk_ulixee_website"]=self["webpackChunk_ulixee_website"]||[]).push([[512],{1692:(e,t,o)=>{o.d(t,{Z:()=>s});var r=o(821),n={class:"Dependencies my-5"},a={class:"bg-gray-200 font-mono"};function c(e,t){return(0,r.openBlock)(),(0,r.createElementBlock)("div",n,[(0,r.createTextVNode)("\n    Dependencies:\n    "),(0,r.createElementVNode)("div",a,[(0,r.renderSlot)(e.$slots,"default")])])}var l=o(3744);const i={},d=(0,l.Z)(i,[["render",c]]),s=d},7363:(e,t,o)=>{o.r(t),o.d(t,{default:()=>f});var r=o(821),n=(0,r.createElementVNode)("h2",{class:"font-bold mt-8"},"Add Datastore to package.json",-1),a=(0,r.createElementVNode)("p",null,"\n       Install both Datastore and Hero with a single NPM/Yarn command.\n      ",-1),c=(0,r.createElementVNode)("h2",{class:"font-bold mt-8"},"Create Your First Datastore",-1);function l(e,t,o,l,i,d){var s=(0,r.resolveComponent)("MainHeader"),u=(0,r.resolveComponent)("AlertDevelopmentEnvironment"),m=(0,r.resolveComponent)("Prism"),x=(0,r.resolveComponent)("router-link"),p=(0,r.resolveComponent)("AboveTheFold"),h=(0,r.resolveComponent)("MainLayout");return(0,r.openBlock)(),(0,r.createBlock)(h,{class:"ChromeAlive",showPadding:!1},{default:(0,r.withCtx)((function(){return[(0,r.createVNode)(p,null,{default:(0,r.withCtx)((function(){return[(0,r.createVNode)(s,{productKey:"datastore"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("Ulixee Datastore")]})),_:1}),(0,r.createTextVNode)(),(0,r.createVNode)(u),(0,r.createTextVNode)(),n,(0,r.createTextVNode)(),a,(0,r.createTextVNode)(),(0,r.createVNode)(m,{language:"bash"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("\n        npm install @ulixee/datastore-plugins-hero\n      ")]})),_:1}),(0,r.createTextVNode)(),c,(0,r.createTextVNode)(),(0,r.createElementVNode)("p",null,[(0,r.createTextVNode)("The following script is exactly the same as the "),(0,r.createVNode)(x,{to:"/hero/example"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("Hero Example")]})),_:1}),(0,r.createTextVNode)("  except this one is wrapped in a Datastore. ")]),(0,r.createTextVNode)(),(0,r.createVNode)(m,{language:"javascript"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("\n        import { Extractor, HeroExtractorPlugin } from '@ulixee/datastore-plugins-hero';\n\n        export new Extractor(async { Hero, Output } => {\n          const hero = new Hero();\n          await hero.goto('https://ulixee.org/tryit/welcome-to-hero');\n\n          output.title = await hero.querySelector('.title').innerText;\n\n          await hero.querySelector('button.next-page').click();\n\n          await hero.waitForState(assert => {\n            assert(hero.querySelector('.loading').getAttribute('data-pct'), 100);\n          });\n\n          Output.emit({ description: await hero.querySelector('.description') });\n        }, HeroExtractorPlugin);\n      ")]})),_:1}),(0,r.createTextVNode)(),(0,r.createElementVNode)("p",null,[(0,r.createTextVNode)("You can run above code directly from the command line by using `node example-datastore.js`, but the real power\n        comes when you activate it with "),(0,r.createVNode)(x,{to:"/chromealive"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("ChromeAlive")]})),_:1}),(0,r.createTextVNode)(" or query it through a\n        "),(0,r.createVNode)(x,{to:"/stream"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("Stream")]})),_:1}),(0,r.createTextVNode)(".")])]})),_:1})]})),_:1})}var i=o(9697),d=o(1692),s=o(2630),u=o(882),m=o(7008),x=o(6328),p=o(8756);const h=r.defineComponent({components:{InstallIt:i.Z,Dependencies:d.Z,UseIt:s.Z,Command:u.Z,MainHeader:m.cC,SubHeader:m.bU,AboveTheFold:m.JS,ActionButtons:m.EY,Prism:x.Z,AlertDevelopmentEnvironment:p.Z}});var N=o(3744);const V=(0,N.Z)(h,[["render",l]]),f=V}}]);
//# sourceMappingURL=512.9498ad23.js.map