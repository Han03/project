(self["webpackChunkgutar"]=self["webpackChunkgutar"]||[]).push([[288],{958:function(t){t.exports={chordMap:{C:[{fret:1,string:2,finger:1},{fret:2,string:4,finger:2},{fret:3,string:5,finger:3}],D:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],E:[{fret:1,string:3,finger:1},{fret:2,string:5,finger:2},{fret:2,string:4,finger:3}],F:[{fret:1,string:1,finger:1},{fret:1,string:2,finger:1},{fret:1,string:6,finger:1},{fret:2,string:3,finger:2},{fret:3,string:5,finger:3},{fret:3,string:4,finger:3}],G:[{fret:2,string:5,finger:2},{fret:3,string:6,finger:3},{fret:3,string:1,finger:4}],A:[{fret:2,string:4,finger:2},{fret:2,string:3,finger:3},{fret:2,string:2,finger:4}],B:[{fret:2,string:1,finger:1},{fret:2,string:5,finger:1},{fret:2,string:6,finger:1},{fret:4,string:2,finger:2},{fret:4,string:3,finger:3},{fret:4,string:4,finger:4}],Am:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],Dm:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],Em:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}]},enabledChord:["C","D","E","F","G","A","B","Am","Dm","Em"],pitchNames:[[{number:3,topDot:1},{number:4,topDot:1},{number:4,topDot:1,half:1},{number:5,topDot:1}],[{number:7},{number:1,topDot:1},{number:1,topDot:1,half:1},{number:2,half:1}],[{number:5},{number:5,half:1},{number:6},{number:6,half:1}],[{number:2},{number:2,half:1},{number:3},{number:4}],[{number:6,bottomDot:1},{number:6,bottomDot:1,half:1},{number:7,bottomDot:1},{number:1}],[{number:3,bottomDot:1},{number:4,bottomDot:1},{number:4,bottomDot:1,half:1},{number:5,bottomDot:1}]]}},8288:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return w}});r(4114);var n=r(6768),i=r(4232),a=r(958),s=r.n(a),l=r(144);const o=t=>((0,n.Qi)("data-v-c5d1560c"),t=t(),(0,n.jt)(),t),g={style:{display:"flex","flex-direction":"column",height:"100%"}},f=o((()=>(0,n.Lk)("div",{style:{width:"100%"}},[(0,n.Lk)("div",{style:{"background-color":"#a6a6a6",height:"10vh",width:"100%"}})],-1))),d={class:"note-page"},c={class:"bar-line"},v={class:"string-line"},u=(0,n.Fv)('<div class="note-item" data-v-c5d1560c><div data-v-c5d1560c><div class="note-tab" data-v-c5d1560c><span class="note-tab-text" data-v-c5d1560c>T</span><span class="note-tab-text" data-v-c5d1560c>A</span><span class="note-tab-text" data-v-c5d1560c>B</span></div><div class="note-string" data-v-c5d1560c></div><div class="note-string" data-v-c5d1560c></div><div class="note-string" data-v-c5d1560c></div><div class="note-string" data-v-c5d1560c></div><div class="note-string" data-v-c5d1560c></div><div class="note-string" data-v-c5d1560c></div></div></div>',1),m={class:"note-item"},b={class:"note-string"},h={class:"note-string"},p={class:"note-string"},k={class:"note-string"},L={class:"note-string"},D={class:"note-string"},C={class:"number-line"},M=o((()=>(0,n.Lk)("div",{class:"note-item"},null,-1))),_={class:"note-item"},x={class:"number-box"};var B={__name:"index",setup(t){const e=(0,l.KR)(),r=(0,l.Kh)({activeString:[],interval:void 0,interValTime:10,intervalRunTime:0,speed:60,barBeat:4,beatNote:1/4,minBeatNote:1/8,noteRate:[2,2,6,3],maxFret:3,barStack:[],barLength:5}),a=t=>{for(let e=0;e<t;e++){let t=[],e=r.barBeat*r.beatNote,n=0,i=r.barBeat*r.beatNote/r.minBeatNote,a=0,l=0;while(n<i){if(a>n*r.minBeatNote)t.push(0);else{let r=B();r<=e?e-=r:(r=e,e=0),t.push(r),l+=1,a+=r}n++}let g=o(l),f=[],d=0;for(let r=0;r<t.length;r++){let e=t[r];if(e>0){let t=g[d],r=s().pitchNames[t.string-1][t.fret];f.push({note:e,...t,...r}),d++}else f.push({note:e})}r.barStack.length>=r.barLength&&r.barStack.splice(0,1),r.barStack.push(f)}},o=t=>{let e,n=[],i=s().enabledChord.length,a=0;for(let l=0;l<t;l++){if(a<1){let o=(0===l||Math.random()>.5)&&t-l>1;if(o){let t=Math.floor(Math.random()*i);e=s().enabledChord[t];let r=s().chordMap[e].length;a=2+Math.floor(Math.random()*(r-1))}else n.push({fret:Math.floor(Math.random()*(r.maxFret+1)),string:Math.ceil(6*Math.random())})}if(a>0){let t=s().chordMap[e],r=s().chordMap[e].length,i=Math.floor(Math.random()*r),l=t[i];n.push({chordName:e,fret:l.fret,string:l.string}),a--}}return n},B=()=>{let t=0,e=0;for(let i=0;i<r.noteRate.length;i++){let n=r.noteRate[i]*Math.random();n>e&&(e=n,t=i)}let n=1/(1<<t);return n},E=()=>{if(r.barStack.length<r.barLength)a(r.barLength-r.barStack.length);else{const t=6e4/r.speed*r.barBeat;r.intervalRunTime%t<r.interValTime&&a(1)}},T=()=>{const t=6e4/r.speed*r.barBeat;if(e.value.children[0]){let n=e.value.children[0].clientHeight,i=r.intervalRunTime%t/t*n;e.value.style=`margin-top:${-i}px`}},w=()=>{if(void 0!==r.interval)return clearInterval(r.interval),void(r.interval=void 0);r.interval=setInterval((()=>{E(),T(),r.intervalRunTime+=r.interValTime}),r.interValTime)};return(0,n.sV)((()=>{console.log(e.value.clientHeight)})),(t,a)=>((0,n.uX)(),(0,n.CE)("div",g,[f,(0,n.Lk)("div",d,[(0,n.Lk)("div",{class:"note-table",ref_key:"noteTable",ref:e},[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(r.barStack,(t=>((0,n.uX)(),(0,n.CE)("div",c,[(0,n.Lk)("div",v,[u,((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(t,(t=>((0,n.uX)(),(0,n.CE)("div",m,[(0,n.Lk)("div",b,(0,i.v_)(1===t.string?t.fret:""),1),(0,n.Lk)("div",h,(0,i.v_)(2===t.string?t.fret:""),1),(0,n.Lk)("div",p,(0,i.v_)(3===t.string?t.fret:""),1),(0,n.Lk)("div",k,(0,i.v_)(4===t.string?t.fret:""),1),(0,n.Lk)("div",L,(0,i.v_)(5===t.string?t.fret:""),1),(0,n.Lk)("div",D,(0,i.v_)(6===t.string?t.fret:""),1)])))),256))]),(0,n.Lk)("div",C,[M,((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(t,(t=>((0,n.uX)(),(0,n.CE)("div",_,[(0,n.Lk)("div",x,[(0,n.Lk)("div",{class:(0,i.C4)(["number-dot",t.topDot?"number-dot-show":""])},null,2),(0,n.Lk)("div",{class:(0,i.C4)(t.half?"number-half":"")},[(0,n.Lk)("span",null,(0,i.v_)(t.number),1)],2),(0,n.Lk)("div",{class:(0,i.C4)(["number-dot",t.bottomDot?"number-dot-show":""])},null,2)])])))),256))])])))),256))],512)]),(0,n.Lk)("div",{style:{width:"100%"}},[(0,n.Lk)("div",{style:{"background-color":"#a6a6a6",height:"10vh",width:"100%"},onClick:w})])]))}},E=r(1241);const T=(0,E.A)(B,[["__scopeId","data-v-c5d1560c"]]);var w=T}}]);
//# sourceMappingURL=288.6eb2632a.js.map