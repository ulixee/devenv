"use strict";(self["webpackChunk_ulixee_website_main"]=self["webpackChunk_ulixee_website_main"]||[]).push([[7],{34553:(e,t,n)=>{var r=n(82109),o=n(42092).findIndex,a=n(51223),l="findIndex",i=!0;l in[]&&Array(1)[l]((function(){i=!1})),r({target:"Array",proto:!0,forced:i},{findIndex:function(e){return o(this,e,arguments.length>1?arguments[1]:void 0)}}),a(l)},15218:(e,t,n)=>{var r=n(82109),o=n(14230),a=n(43429);r({target:"String",proto:!0,forced:a("anchor")},{anchor:function(e){return o(this,"a","name",e)}})},7:(e,t,n)=>{n.r(t),n.d(t,{default:()=>S});n(92222),n(29254),n(15218),n(74916),n(23123),n(15306);var r=n(70821),o={class:"pt-[53px]"},a={class:"border-b border-slate-300 px-6 py-5 text-xl font-bold tracking-[0.2em] uppercase"},l=(0,r.createElementVNode)("span",{class:"text-slate-400 font-light"},"/",-1),i={class:"text-ulixee-purple"},c={class:"mt-2 flex flex-col-reverse items-start items-stretch px-6 pb-10 md:flex-row"},s={class:"LEFTBAR md:pr-12"},u={class:"mt-5 whitespace-nowrap font-bold"},d={class:"whitespace-nowrap font-bold"},m={class:"DocsContent flex-1"},p={class:"mx-3 mt-5 md:mx-32"},h=["innerHTML"],f={class:"RIGHTBAR hidden md:block"},k=(0,r.createElementVNode)("h3",{class:"mb-2 font-bold"},"On this page",-1),v={key:0,class:"u"},x=["href","innerHTML"];function g(e,t,n,g,y,N){var b=(0,r.resolveComponent)("router-link");return(0,r.openBlock)(),(0,r.createElementBlock)("div",o,[(0,r.createElementVNode)("div",a,[(0,r.createVNode)(b,{to:"/documentation",class:"text-ulixee-purple opacity-50 no-underline"},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)("Documentation")]})),_:1}),(0,r.createTextVNode)(),l,(0,r.createTextVNode)(),(0,r.createElementVNode)("span",i,(0,r.toDisplayString)(e.toolName),1)]),(0,r.createTextVNode)(),(0,r.createElementVNode)("div",c,[(0,r.createElementVNode)("div",s,[e.links?((0,r.openBlock)(!0),(0,r.createElementBlock)(r.Fragment,{key:0},(0,r.renderList)(e.links,(function(t,n){return(0,r.openBlock)(),(0,r.createElementBlock)(r.Fragment,{key:"title-".concat(n)},[(0,r.createElementVNode)("h3",u,(0,r.toDisplayString)(t.title),1),(0,r.createTextVNode)(),((0,r.openBlock)(!0),(0,r.createElementBlock)(r.Fragment,null,(0,r.renderList)(t.items,(function(t,o){return(0,r.openBlock)(),(0,r.createElementBlock)(r.Fragment,{key:"title-".concat(n,"-").concat(o)},[t.items?((0,r.openBlock)(),(0,r.createElementBlock)(r.Fragment,{key:0},[(0,r.createElementVNode)("h4",d,(0,r.toDisplayString)(t.title),1),(0,r.createTextVNode)(),((0,r.openBlock)(!0),(0,r.createElementBlock)(r.Fragment,null,(0,r.renderList)(t.items,(function(t,a){return(0,r.openBlock)(),(0,r.createBlock)(b,{key:"link-".concat(n,"-").concat(o,"-").concat(a),class:(0,r.normalizeClass)([{isSelected:e.isSelected(t.link)},"block whitespace-nowrap"]),to:t.link},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)((0,r.toDisplayString)(t.title),1)]})),_:2},1032,["class","to"])})),128))],64)):((0,r.openBlock)(),(0,r.createBlock)(b,{key:1,class:(0,r.normalizeClass)([{isSelected:e.isSelected(t.link)},"block whitespace-nowrap"]),to:t.link},{default:(0,r.withCtx)((function(){return[(0,r.createTextVNode)((0,r.toDisplayString)(t.title),1)]})),_:2},1032,["class","to"]))],64)})),128))],64)})),128)):(0,r.createCommentVNode)("",!0)]),(0,r.createTextVNode)(),(0,r.createElementVNode)("div",m,[(0,r.createElementVNode)("div",p,[(0,r.createElementVNode)("div",{class:"post mb",innerHTML:e.page.content},null,8,h)]),(0,r.createTextVNode)()]),(0,r.createTextVNode)(),(0,r.createElementVNode)("div",f,[e.page.subtitles.length&&2===e.page.subtitles[0].depth?((0,r.openBlock)(),(0,r.createElementBlock)(r.Fragment,{key:0},[k,(0,r.createTextVNode)(),e.page.subtitles.length?((0,r.openBlock)(),(0,r.createElementBlock)("ul",v,[((0,r.openBlock)(!0),(0,r.createElementBlock)(r.Fragment,null,(0,r.renderList)(e.page.subtitles,(function(e){return(0,r.openBlock)(),(0,r.createElementBlock)("li",{class:(0,r.normalizeClass)("depth-"+e.depth),key:e.value},[(0,r.createElementVNode)("a",{href:e.anchor,innerHTML:e.value.replace(" W3C","").split(/\s/g)[0]},null,8,x)],2)})),128))])):(0,r.createCommentVNode)("",!0)],64)):(0,r.createCommentVNode)("",!0)])])])}var y=n(89584),N=n(66347),b=n(48534),V=(n(35666),n(41539),n(78783),n(33948),n(34553),n(42119)),B=n(26338),E=n(44989),w={client:"Client",hero:"Hero",datastore:"Datastore",cloud:"Cloud",sql:"SQL"};const T=r.defineComponent({setup:function(){return(0,b.Z)(regeneratorRuntime.mark((function e(){var t,n,o,a,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=(0,V.yj)(),n=r.ref(),o=r.ref({content:"",title:"",subtitles:[]}),a=(0,B.Q)(t.path),l=w[a],e.next=7,Promise.all([B.Z.fetchDocLinks(t.path).then((function(e){return n.value=e})),B.Z.fetchDocPage(t.path).then((function(e){return o.value=e}))]);case 7:return e.abrupt("return",{links:n,page:o,toolName:l});case 8:case"end":return e.stop()}}),e)})))()},mounted:function(){E.p.highlightAll()},methods:{isSelected:function(e){return this.$route.path===e||e==="".concat(this.$route.path,"/overview/introduction")}},computed:{currentPath:function(){return this.$route.matched[0].path},editLink:function(){var e;return null===(e=this.items[this.currentIndex])||void 0===e?void 0:e.editLink},items:function(){var e,t=[],n=(0,N.Z)(this.links);try{for(n.s();!(e=n.n()).done;){var r=e.value;t.push({title:r.title,link:r.link,isHeader:!0});var o,a=(0,N.Z)(r.items);try{for(a.s();!(o=a.n()).done;){var l=o.value;t.push({title:l.title,link:l.link,editLink:l.editLink}),l.items&&t.push.apply(t,(0,y.Z)(l.items))}}catch(i){a.e(i)}finally{a.f()}}}catch(i){n.e(i)}finally{n.f()}return t},currentIndex:function(){var e,t=this;return this.currentPath===this.rootPath?1:null!==(e=this.items.findIndex((function(e){return e.link.replace(/\/$/,"")===t.$route.path.replace(/\/$/,"")})))&&void 0!==e?e:this.items.findIndex((function(e){return!e.isHeader}))},nextPage:function(){for(var e=this.currentIndex+1;e<this.items.length;e+=1){var t=this.items[e];if(!t.isHeader)return t}return null},previousPage:function(){for(var e=this.currentIndex-1;e>=0;e-=1){var t=this.items[e];if(!t.isHeader)return t}return null}}});var C=n(83744);const L=(0,C.Z)(T,[["render",g]]),S=L},89584:(e,t,n)=>{n.d(t,{Z:()=>c});n(79753);var r=n(49227);function o(e){if(Array.isArray(e))return(0,r.Z)(e)}n(82526),n(41817),n(41539),n(32165),n(78783),n(33948),n(91038);function a(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}var l=n(12780);n(21703),n(96647);function i(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(e){return o(e)||a(e)||(0,l.Z)(e)||i()}}}]);
//# sourceMappingURL=7.92b00ba4.js.map