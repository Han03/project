(self["webpackChunkgutar"]=self["webpackChunkgutar"]||[]).push([[941],{958:function(t){t.exports={chordMap:{C:[{fret:1,string:2,finger:1},{fret:2,string:4,finger:2},{fret:3,string:5,finger:3}],D:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],E:[{fret:1,string:3,finger:1},{fret:2,string:5,finger:2},{fret:2,string:4,finger:3}],F:[{fret:1,string:1,finger:1},{fret:1,string:2,finger:1},{fret:1,string:6,finger:1},{fret:2,string:3,finger:2},{fret:3,string:5,finger:3},{fret:3,string:4,finger:3}],G:[{fret:2,string:5,finger:2},{fret:3,string:6,finger:3},{fret:3,string:1,finger:4}],A:[{fret:2,string:4,finger:2},{fret:2,string:3,finger:3},{fret:2,string:2,finger:4}],B:[{fret:2,string:1,finger:1},{fret:2,string:5,finger:1},{fret:2,string:6,finger:1},{fret:4,string:2,finger:2},{fret:4,string:3,finger:3},{fret:4,string:4,finger:4}],Am:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],Dm:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}],Em:[{fret:2,string:1,finger:1},{fret:2,string:3,finger:2},{fret:3,string:2,finger:3}]},enabledChord:["C","D","E","F","G","A","B","Am","Dm","Em"],pitchNames:[[{number:3,topDot:1},{number:4,topDot:1},{number:4,topDot:1,half:1},{number:5,topDot:1}],[{number:7},{number:1,topDot:1},{number:1,topDot:1,half:1},{number:2,half:1}],[{number:5},{number:5,half:1},{number:6},{number:6,half:1}],[{number:2},{number:2,half:1},{number:3},{number:4}],[{number:6,bottomDot:1},{number:6,bottomDot:1,half:1},{number:7,bottomDot:1},{number:1}],[{number:3,bottomDot:1},{number:4,bottomDot:1},{number:4,bottomDot:1,half:1},{number:5,bottomDot:1}]]}},1941:function(t,e,r){"use strict";r.r(e),r.d(e,{default:function(){return j}});r(4114);var n=r(6768),a=r(4232),i=r(958),s=r.n(i),l=r(144);const o=t=>((0,n.Qi)("data-v-2c87b5a0"),t=t(),(0,n.jt)(),t),g={style:{display:"flex","flex-direction":"column",height:"100%"}},f=o((()=>(0,n.Lk)("div",{style:{width:"100%"}},[(0,n.Lk)("div",{style:{"background-color":"white",height:"10vh",width:"100%"}})],-1))),d={class:"note-page"},b={class:"bar-line"},c={class:"chord-line"},v=o((()=>(0,n.Lk)("div",{class:"note-item"},null,-1))),u={class:"note-item"},h={key:0,class:"chord-box"},m={class:"bar-content"},k=o((()=>(0,n.Lk)("div",{class:"bar-start"},[(0,n.Lk)("div",{class:"bar-start-top"}),(0,n.Lk)("div",{class:"bar-start-center"}),(0,n.Lk)("div",{class:"bar-start-bottom"})],-1))),p={class:"string-line"},L=(0,n.Fv)('<div class="note-item" data-v-2c87b5a0><div data-v-2c87b5a0><div class="note-tab" data-v-2c87b5a0><span class="note-tab-text" data-v-2c87b5a0>T</span><span class="note-tab-text" data-v-2c87b5a0>A</span><span class="note-tab-text" data-v-2c87b5a0>B</span></div><div class="note-string" data-v-2c87b5a0></div><div class="note-string" data-v-2c87b5a0></div><div class="note-string" data-v-2c87b5a0></div><div class="note-string" data-v-2c87b5a0></div><div class="note-string" data-v-2c87b5a0></div><div class="note-string" data-v-2c87b5a0></div></div></div>',1),C={class:"note-item"},D={key:0,class:"note-tab-end"},M=o((()=>(0,n.Lk)("span",{class:"note-tab-text"}," ",-1))),x=o((()=>(0,n.Lk)("span",{class:"note-tab-text"}," ",-1))),E=o((()=>(0,n.Lk)("span",{class:"note-tab-text"}," ",-1))),_=[M,x,E],w={class:"note-string"},N={class:"note-string"},B={class:"note-string"},X={class:"note-string"},y={class:"note-string"},T={class:"note-string"},F={class:"number-line"},R=o((()=>(0,n.Lk)("div",{class:"note-item"},null,-1))),S={class:"note-item"},I={class:"number-box"},A={class:"note-number"},K=o((()=>(0,n.Lk)("div",{style:{width:"100%"}},[(0,n.Lk)("div",{style:{"background-color":"white",height:"10vh",width:"100%"}})],-1)));var V={__name:"index",setup(t){const e=(0,l.KR)(),r=(0,l.Kh)({activeNote:[0,0],interval:void 0,interValTime:10,intervalRunTime:0,speed:60,barBeat:4,beatNote:1/4,minBeatNote:1/8,noteRate:[2,2,6,3],maxFret:3,barStack:[],barLength:10}),i=t=>{for(let e=0;e<t;e++){let t=[],e=r.barBeat*r.beatNote,n=0,a=r.barBeat*r.beatNote/r.minBeatNote,i=0,l=0;while(n<a){const a=n*r.minBeatNote;if(i>a)a%r.beatNote===0?t.push(-1):t.push(0);else{let r=M();r<=e?e-=r:(r=e,e=0),t.push(r),l+=1,i+=r}n++}let g=o(l),f=[],d=0;for(let r=0;r<t.length;r++){let e=t[r];if(e>0){let t=g[d],r=s().pitchNames[t.string-1][t.fret];f.push({note:e,...t,...r}),d++}else f.push({note:e})}r.barStack.length>=r.barLength&&r.barStack.splice(0,1),r.barStack.push(f)}},o=t=>{let e,n=[],a=s().enabledChord.length,i=0;for(let l=0;l<t;l++){let o=!1;if(i<1){let g=(0===l||Math.random()>.5)&&t-l>1;if(g){let t=Math.floor(Math.random()*a);o=!0,e=s().enabledChord[t];let r=s().chordMap[e].length;i=2+Math.floor(Math.random()*(r-1))}else n.push({fret:Math.floor(Math.random()*(r.maxFret+1)),string:Math.ceil(6*Math.random())})}if(i>0){let t=s().chordMap[e],r=s().chordMap[e].length,a=Math.floor(Math.random()*r),l=t[a];n.push({beginChord:o,chordName:e,fret:l.fret,string:l.string}),i--}}return n},M=()=>{let t=0,e=0;for(let a=0;a<r.noteRate.length;a++){let n=r.noteRate[a]*Math.random();n>e&&(e=n,t=a)}let n=1/(1<<t);return n},x=()=>{if(r.barStack.length<r.barLength)i(r.barLength-r.barStack.length);else{const t=6e4/r.speed*r.barBeat;r.intervalRunTime%t<r.interValTime&&i(1)}},E=()=>{const t=6e4/r.speed*r.barBeat;if(e.value.children[0]){let n=e.value.children[0].clientHeight,a=r.intervalRunTime%t/t*n;e.value.style=`margin-top:${-a}px`}},V=()=>{if(void 0!==r.interval)return clearInterval(r.interval),void(r.interval=void 0);r.interval=setInterval((()=>{x(),E(),r.intervalRunTime+=r.interValTime}),r.interValTime)};return(0,n.sV)((()=>{i(r.barLength-r.barStack.length-1)})),(t,i)=>((0,n.uX)(),(0,n.CE)("div",g,[f,(0,n.Lk)("div",d,[(0,n.Lk)("div",{class:"note-table",ref_key:"noteTable",ref:e,onClick:V},[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(r.barStack,((t,e)=>((0,n.uX)(),(0,n.CE)("div",b,[(0,n.Lk)("div",c,[v,((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(t,(t=>((0,n.uX)(),(0,n.CE)("div",u,[t.beginChord?((0,n.uX)(),(0,n.CE)("div",h,[(0,n.Lk)("span",null,(0,a.v_)(t.chordName),1)])):(0,n.Q3)("",!0)])))),256))]),(0,n.Lk)("div",m,[k,(0,n.Lk)("div",null,[(0,n.Lk)("div",p,[L,((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(t,((e,r)=>((0,n.uX)(),(0,n.CE)("div",C,[(0,n.Lk)("div",null,[r===t.length-1?((0,n.uX)(),(0,n.CE)("div",D,_)):(0,n.Q3)("",!0),(0,n.Lk)("div",w,(0,a.v_)(1===e.string?e.fret:""),1),(0,n.Lk)("div",N,(0,a.v_)(2===e.string?e.fret:""),1),(0,n.Lk)("div",B,(0,a.v_)(3===e.string?e.fret:""),1),(0,n.Lk)("div",X,(0,a.v_)(4===e.string?e.fret:""),1),(0,n.Lk)("div",y,(0,a.v_)(5===e.string?e.fret:""),1),(0,n.Lk)("div",T,(0,a.v_)(6===e.string?e.fret:""),1)])])))),256))]),(0,n.Lk)("div",F,[R,((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(t,(t=>((0,n.uX)(),(0,n.CE)("div",S,[(0,n.Lk)("div",I,[(0,n.Lk)("div",{class:(0,a.C4)(["number-dot",t.topDot?"number-dot-show":""])},null,2),(0,n.Lk)("div",{class:(0,a.C4)(["number-half",t.half?"number-half-show":""])},[(0,n.Lk)("span",A,(0,a.v_)(t.number),1)],2),(0,n.Lk)("div",{class:(0,a.C4)(["number-dot",t.bottomDot?"number-dot-show":""])},null,2)])])))),256))])])])])))),256))],512)]),K]))}},Q=r(1241);const G=(0,Q.A)(V,[["__scopeId","data-v-2c87b5a0"]]);var j=G}}]);
//# sourceMappingURL=941.f533054f.js.map