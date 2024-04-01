var B=Object.defineProperty;var S=(r,e,t)=>e in r?B(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var o=(r,e,t)=>(S(r,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const n of l.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(i){if(i.ep)return;i.ep=!0;const l=t(i);fetch(i.href,l)}})();function a(r,e,t,s=""){const i=document.createElement(r);return i.className=e,i.textContent=s,t&&t.append(i),i}class k{constructor(e,t,s,i,l,n){o(this,"disableContextMenu",e=>{e.preventDefault()});o(this,"clickOnFieldLeft",e=>{if(this.isFirstClick&&(this.isFirstClick=!1,this.startGame()),e.target.closest(".cell")){const t=e.target.closest(".cell");t.classList.toggle("cell-true"),t.classList.remove("cell-false");const s=t.id.split("-");this.userGame[s[0]][s[1]].data=this.userGame[s[0]][s[1]].data?0:1,this.userGame[s[0]][s[1]].view=this.userGame[s[0]][s[1]].view?0:1,this.userGame[s[0]][s[1]].data===1?this.sounds.playSound(this.sounds.clickLeftFill):this.sounds.playSound(this.sounds.clickLeftClear),this.checkGame()}});o(this,"clickOnFieldRight",e=>{if(this.isFirstClick&&(this.isFirstClick=!1,this.startGame()),e.target.closest(".cell")){const t=e.target.closest(".cell");t.classList.remove("cell-true");const s=t.id.split("-");this.userGame[s[0]][s[1]].data=0,this.userGame[s[0]][s[1]].view=this.userGame[s[0]][s[1]].view===2?0:2,this.userGame[s[0]][s[1]].view===2?t.classList.add("cell-false"):t.classList.remove("cell-false"),this.userGame[s[0]][s[1]].view===2?this.sounds.playSound(this.sounds.clickRightFill):this.sounds.playSound(this.sounds.clickRightClear),this.checkGame()}});this.gameField=null,this.game=t,this.userGame=null,this.checkGame=s,this.startGame=i,this.isGame=l,this.sounds=n,this.addHints(),this.createView(e),this.isFirstClick=!0}createView(e){const t=a("div","field-box",e),s=a("div","game-info",t),i=a("p","level-info",s);i.innerText=`Field: ${this.game.level}`;const l=a("p","game-info",s);l.innerText=`Hint: ${this.game.gameName}`;const n=a("table","full-field",t),h=a("tr","row-first",n),p=a("tr","row-second",n);a("td","empty-field",h);const f=a("td","top-hints",h),b=a("table","top-hints-table",f),L=a("td","left-hints",p),C=a("table","left-hints-table",L),x=a("td","main-field-wrapper",p);this.mainFieldTable=a("table","main-field-table",x);for(let c=0;c<this.topHints[0].length;c+=1){const u=a("tr","row-top-hints",b);for(let m=0;m<this.topHints.length;m+=1){const d=this.topHints[m][c]?this.topHints[m][c]:"";a("td","row-top-hint cell",u,d)}}for(let c=0;c<this.leftHints.length;c+=1){const u=a("tr","row-left-hints",C);for(let m=0;m<this.leftHints[0].length;m+=1){const d=this.leftHints[c][m]?this.leftHints[c][m]:"";a("td","row-left-hint cell",u,d)}}this.userGame=[];for(let c=0;c<this.game.gameMatrix.length;c+=1){const u=[],m=a("tr","field-row",this.mainFieldTable);for(let d=0;d<this.game.gameMatrix.length;d+=1){const T=a("td","field-cell cell",m);T.id=`${c}-${d}`;const M={data:0,view:0};u.push(M)}this.userGame.push(u)}this.mainFieldTable.addEventListener("click",this.clickOnFieldLeft),this.mainFieldTable.addEventListener("contextmenu",this.clickOnFieldRight),this.mainFieldTable.addEventListener("contextmenu",this.disableContextMenu)}getUserGame(){return this.userGame}disableField(){this.mainFieldTable.removeEventListener("click",this.clickOnFieldLeft),this.mainFieldTable.removeEventListener("contextmenu",this.clickOnFieldRight)}updateUserGameView(e){this.userGame=e.map(t=>[...t]);for(let t=0;t<this.userGame.length;t+=1)for(let s=0;s<this.userGame.length;s+=1){const i=`${t}-${s}`,l=document.getElementById(i);this.userGame[t][s].view===1?l.classList.add("cell-true"):this.userGame[t][s].view===2&&l.classList.add("cell-false")}}showCorrectField(){const e=this.game.gameMatrix;for(let t=0;t<e.length;t+=1)for(let s=0;s<e.length;s+=1){const i=`${t}-${s}`,l=document.getElementById(i);l.classList.remove("cell-false"),e[t][s]===1?l.classList.add("cell-true"):e[t][s]===0&&l.classList.remove("cell-true")}}addHints(){this.leftHints=this.createLeftHintsArray(this.game.gameMatrix),this.topHints=this.createTopHintsArray(this.game.gameMatrix)}createLeftHintsArray(e){const t=[];for(let i=0;i<e.length;i+=1){const l=[];let n=0;for(let h=0;h<e.length;h+=1)n!==0&&e[i][h]===0?(l.push(n),n=0):e[i][h]===1&&h===e.length-1?(n+=e[i][h],l.push(n)):n+=e[i][h];t.push(l)}const s=Math.max(...t.map(i=>i.length));return t.forEach(i=>{for(;i.length<s;)i.unshift(0)}),t}createTopHintsArray(e){const t=[];for(let i=0;i<e.length;i+=1){const l=[];let n=0;for(let h=0;h<e.length;h+=1)n!==0&&e[h][i]===0?(l.push(n),n=0):e[h][i]===1&&h===e.length-1?(n+=e[h][i],l.push(n)):n+=e[h][i];t.push(l)}const s=Math.max(...t.map(i=>i.length));return t.forEach(i=>{for(;i.length<s;)i.unshift(0)}),t}}class g{constructor(e){this.elem=null,this.createElement(e)}createElement(e){this.elem=document.createElement("button"),this.setCssClasses([e.cssClasses]),this.setTextContent(e.textContent),this.setCallback(e.callback),e.parent.append(this.elem)}getHTMLElement(){return this.elem}setCssClasses(e=[]){e.map(t=>this.elem.classList.add(t))}setTextContent(e=""){this.elem.textContent=e}setCallback(e){this.elem.addEventListener("click",e)}disableBtn(){this.elem.disabled=!0}enableBtn(){this.elem.disabled=!1}}const v=[{numbCells:"5 x 5",games:[{gameId:1,level:"5 x 5",gameName:"Umbrella",gameMatrix:[[0,0,1,0,0],[0,1,1,1,0],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,1,0]]},{gameId:2,level:"5 x 5",gameName:"Turtle",gameMatrix:[[1,0,0,0,1],[1,1,1,1,1],[0,1,1,1,0],[1,1,1,1,1],[1,0,1,0,1]]},{gameId:3,level:"5 x 5",gameName:"Plane",gameMatrix:[[0,0,1,0,0],[1,1,1,1,1],[1,1,1,1,1],[0,0,1,0,0],[0,1,1,1,0]]},{gameId:4,level:"5 x 5",gameName:"Scull",gameMatrix:[[0,1,1,1,0],[1,1,1,1,1],[1,0,1,0,1],[1,1,1,1,1],[0,1,0,1,0]]},{gameId:5,level:"5 x 5",gameName:"Chess",gameMatrix:[[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1]]}]},{numbCells:"10 x 10",games:[{gameId:6,level:"10 x 10",gameName:"Smile",gameMatrix:[[0,0,1,1,1,1,1,1,0,0],[0,1,0,0,0,0,0,0,1,0],[1,0,0,0,0,0,0,0,0,1],[1,0,1,1,0,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,1,1,0,0,0,1],[1,0,1,0,0,0,0,1,0,1],[1,0,0,1,1,1,1,0,0,1],[1,1,0,0,0,0,0,0,1,1],[0,1,1,1,1,1,1,1,1,0]]},{gameId:7,gameName:"Faucet",level:"10 x 10",gameMatrix:[[0,0,0,0,1,1,1,1,1,0],[0,0,0,0,0,0,1,0,0,0],[0,0,0,0,0,1,1,1,0,1],[0,0,1,1,1,1,1,1,1,1],[0,1,1,0,0,0,0,0,0,1],[0,1,0,0,1,1,1,1,1,1],[0,1,0,1,0,0,0,0,0,1],[0,1,1,1,0,0,0,0,0,1],[0,0,1,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1]]},{gameId:8,gameName:"Helicopter",level:"10 x 10",gameMatrix:[[1,1,1,0,1,1,1,0,0,0],[0,0,0,1,0,0,0,0,0,0],[0,1,1,1,1,1,0,0,0,0],[1,1,0,1,1,1,1,0,0,1],[1,0,0,1,1,1,1,1,1,1],[1,0,0,1,1,1,1,1,0,1],[1,1,1,1,1,1,1,0,0,0],[0,1,1,1,1,1,0,0,0,0],[1,0,1,0,1,0,0,0,0,0],[1,1,1,1,1,1,1,0,0,0]]},{gameId:9,gameName:"Butterfly",level:"10 x 10",gameMatrix:[[0,0,0,1,0,0,1,0,0,0],[1,1,0,0,1,1,0,0,1,1],[1,0,1,0,1,1,0,1,0,1],[1,0,0,1,1,1,1,0,0,1],[0,1,0,0,1,1,0,0,1,0],[1,0,1,0,1,1,0,1,0,1],[1,0,0,1,1,1,1,0,0,1],[1,0,0,1,1,1,1,0,0,1],[1,0,1,0,1,1,0,1,0,1],[0,1,0,0,1,1,0,0,1,0]]},{gameId:10,level:"10 x 10",gameName:"Candy",gameMatrix:[[0,0,0,0,0,0,0,1,1,0],[0,0,0,0,0,0,0,1,1,1],[0,0,0,0,1,1,1,1,1,1],[0,0,0,1,1,0,1,1,0,0],[0,0,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,0,0,0],[1,1,1,1,1,1,0,0,0,0],[1,1,1,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,0,0]]}]},{numbCells:"15 x 15",games:[{gameId:11,level:"15 x 15",gameName:"Apple",gameMatrix:[[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],[0,0,0,1,1,1,0,1,1,1,1,1,1,0,0],[0,0,0,0,0,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],[0,0,1,1,1,1,0,1,1,1,1,1,0,0,0],[0,1,1,0,0,1,1,1,1,1,1,1,1,1,0],[0,1,0,0,0,0,1,1,1,1,1,1,1,1,1],[1,1,0,0,0,0,1,1,1,1,1,1,1,1,1],[1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,1,1,1,1,1,1,1,0,0,0,0]]},{gameId:12,level:"15 x 15",gameName:"Snail",gameMatrix:[[1,1,1,0,1,1,1,0,0,0,0,0,0,0,0],[1,0,1,0,1,0,1,0,0,0,0,0,0,0,0],[1,1,1,0,1,1,1,0,0,0,0,0,0,0,0],[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0],[0,1,1,0,0,1,0,1,1,1,1,1,1,1,0],[0,0,1,0,0,1,1,1,0,0,0,0,0,1,1],[0,0,1,1,1,1,1,0,0,1,1,1,0,0,1],[0,0,1,0,0,1,1,0,1,1,0,1,1,0,1],[0,0,1,0,0,0,1,0,1,1,0,0,1,0,1],[0,0,1,0,0,0,1,0,0,0,0,1,1,0,1],[0,0,1,0,0,0,1,1,0,0,1,1,0,0,1],[0,0,1,0,0,0,0,1,1,1,1,0,0,0,1],[0,0,1,0,0,0,0,1,0,0,0,0,0,1,1],[0,0,1,1,0,0,0,1,0,0,0,1,1,1,0],[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1]]},{gameId:13,level:"15 x 15",gameName:"Squirrel",gameMatrix:[[0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,1,0,1,0,0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0,1,1,1,1,1,1,1],[0,1,1,0,1,1,0,0,1,1,1,0,1,1,1],[1,1,1,1,1,1,0,0,1,1,1,0,1,1,1],[0,1,1,1,1,1,1,0,0,1,1,1,0,1,1],[0,0,0,1,1,1,1,1,1,0,1,1,0,1,0],[0,0,0,0,1,1,1,1,1,1,0,1,1,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,1,0,0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,0,1,1,0,1,1,1,1,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,1,0,0,0],[0,0,0,0,0,1,0,1,1,1,1,0,0,0,0],[0,0,0,0,1,0,1,1,1,1,0,0,0,0,0]]},{gameId:14,level:"15 x 15",gameName:"Aquarium",gameMatrix:[[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],[0,1,0,0,0,0,0,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,0,1,1,1,1,1,1,1,1,0,1,1],[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1],[1,1,0,1,1,1,0,0,1,1,0,0,1,1,1],[1,1,1,1,0,0,0,0,0,1,0,0,1,1,1],[1,1,1,0,1,0,0,0,0,0,0,1,1,1,1],[0,1,1,0,0,0,0,0,0,1,0,1,1,1,0],[0,1,1,1,0,0,0,0,1,1,1,0,1,1,0],[0,0,1,1,1,1,1,0,1,1,1,1,1,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0]]},{gameId:15,level:"15 x 15",gameName:"Ship",gameMatrix:[[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[0,0,1,0,0,0,0,0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],[1,0,1,0,1,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,0,0,0,0],[0,0,1,0,0,0,0,0,1,0,1,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,1,0,1,0,1,0,1,0,1,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,1,1,0,0,0,0,0,0,0,0,0,0,1,1],[0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]}]}];class y{constructor(e,t){o(this,"showList",()=>{this.selectContent.classList.toggle("list-visible")});o(this,"hideList",()=>{this.selectContent.classList.remove("list-visible")});this.elem=null,this.updateSelectGame=t,this.levels=v.map(s=>s.numbCells),this.createView(e)}createView(e){const t=a("div","select-wrapper",e);a("label","select-label",t,"Choose level"),this.elem=a("div","select-level",t),this.selectContent=a("div","select-content",t),this.levels.forEach(s=>{const i=a("label","option-label",this.selectContent,s);i.setAttribute("for",s);const l=a("input","input",this.selectContent);l.type="radio",l.name="level",l.id=s,l.value=s,i.addEventListener("click",()=>{this.elem.innerText=l.value,this.hideList(),this.updateSelectGame()})}),this.elem.addEventListener("click",this.showList),document.body.addEventListener("click",s=>{this.selectContent.classList.contains("list-visible")&&s.target!==this.elem&&this.hideList()})}setSelectValue(e){this.elem.innerText=e}}class E{constructor(e,t,s){o(this,"showList",()=>{this.selectContent.classList.toggle("list-visible")});o(this,"hideList",()=>{this.selectContent.classList.remove("list-visible")});this.elem=null,this.nonograms=v,this.initChosenGame=s,this.levelMap=this.createLevelMap(),this.createView(e,t)}createView(e,t){const s=a("div","select-wrapper",e);a("label","select-label",s,"Choose game"),this.elem=a("div","select-game",s),this.selectContent=a("div","select-content",s),this.elem.classList.add("select-disabled"),this.updateView(t),this.elem.addEventListener("click",this.showList),document.body.addEventListener("click",i=>{this.selectContent.classList.contains("list-visible")&&i.target!==this.elem&&this.hideList()})}updateView(e){this.elem.innerText="",this.selectContent.innerHTML="",this.gamesOfLevel=this.levelMap.get(e),e&&this.gamesOfLevel.forEach(t=>{const s=a("label","option-label",this.selectContent,t.gameName);s.setAttribute("for",`game-${t.gameId}`);const i=a("input","input",this.selectContent);i.type="radio",i.name="level",i.id=`game-${t.gameId}`,i.value=t.gameId,s.addEventListener("click",()=>{this.elem.innerText=s.innerText,this.initChosenGame(i.value),this.hideList()})})}setSelectValue(e){this.elem.innerText=e}getSelectGameId(){return this.elem.value}createLevelMap(){const e=new Map;return this.nonograms.forEach(t=>{e.set(t.numbCells,t.games)}),e}}class F{constructor(e,t,s,i,l,n,h,p,f){o(this,"updateSelectGame",()=>{this.selectGame.elem.classList.remove("select-disabled"),this.selectGame.updateView(this.selectLevel.elem.innerText)});this.elem=null,this.randomBtn=null,this.startRandomGame=t,this.initChosenGame=s,this.initNewGame=i,this.saveCurrentGame=l,this.showLastGame=n,this.showSolution=h,this.showScoreTable=p,this.sounds=f,this.createView(e)}createView(e){this.elem=a("div","controls-wrapper",e),this.selectBox=a("div","select-box",this.elem),this.selectLevel=new y(this.selectBox,this.updateSelectGame),this.selectGame=new E(this.selectBox,this.selectLevel.elem.value,this.initChosenGame),this.btnBox=a("div","btn-box",this.elem);const t={cssClasses:["btn"],textContent:"Random game",parent:this.btnBox,callback:this.startRandomGame};this.randomBtn=new g(t);const s={cssClasses:["btn"],textContent:"Reset game",parent:this.btnBox,callback:this.initNewGame};this.resetBtn=new g(s);const i={cssClasses:["btn"],textContent:"Save game",parent:this.btnBox,callback:this.saveCurrentGame};this.saveGameBtn=new g(i);const l={cssClasses:["btn"],textContent:"Continue last game",parent:this.btnBox,callback:this.showLastGame};this.lastGameBtn=new g(l);const n={cssClasses:["btn"],textContent:"Solution",parent:this.btnBox,callback:this.showSolution};this.solutionBtn=new g(n);const h={cssClasses:["btn"],textContent:"Score table",parent:this.btnBox,callback:this.showScoreTable};this.scoreBtn=new g(h)}updateSelects(e,t){this.selectGame.elem.classList.remove("select-disabled"),this.selectLevel.setSelectValue(e),this.selectGame.updateView(e),this.selectGame.setSelectValue(t)}}class I{constructor(e){this.timerId=null,this.timeData={min:0,sec:0},this.timeElem=null,this.createView(e)}createView(e){this.timeElem=a("div","timer",e),this.timeElem.innerHTML="<span>00</span><span>:</span><span>00</span>"}runTimer(){this.timerId=setInterval(()=>{this.timeData.sec===59?(this.timeData.min+=1,this.timeData.sec=0):this.timeData.sec+=1,this.updateTimerView(this.timeData.min,this.timeData.sec)},1e3)}updateTimer(e,t){this.updateTimerData(e,t),this.updateTimerView(e,t)}updateTimerView(e,t){this.timeData.currMin=(parseInt(e,10)<10?"0":"")+e,this.timeData.currSec=(parseInt(t,10)<10?"0":"")+t,this.timeElem.innerHTML=`<span>${this.timeData.currMin}</span><span>:</span><span>${this.timeData.currSec}</span>`}updateTimerData(e,t){this.timeData.min=e,this.timeData.sec=t}stopTimer(){clearInterval(this.timerId)}resetTimer(){clearInterval(this.timerId),this.updateTimer(0,0)}getTimeInSec(){return this.timeData.min*60+this.timeData.sec}}const V="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20448%20512'%3e%3c!--!%20Font%20Awesome%20Pro%206.4.2%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license%20(Commercial%20License)%20Copyright%202023%20Fonticons,%20Inc.%20--%3e%3cpath%20d='M301.1%2034.8C312.6%2040%20320%2051.4%20320%2064V448c0%2012.6-7.4%2024-18.9%2029.2s-25%203.1-34.4-5.3L131.8%20352H64c-35.3%200-64-28.7-64-64V224c0-35.3%2028.7-64%2064-64h67.8L266.7%2040.1c9.4-8.4%2022.9-10.4%2034.4-5.3zM412.6%20181.5C434.1%20199.1%20448%20225.9%20448%20256s-13.9%2056.9-35.4%2074.5c-10.3%208.4-25.4%206.8-33.8-3.5s-6.8-25.4%203.5-33.8C393.1%20284.4%20400%20271%20400%20256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8%2033.8-3.5z'/%3e%3c/svg%3e",w="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20576%20512'%3e%3c!--!%20Font%20Awesome%20Pro%206.4.2%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license%20(Commercial%20License)%20Copyright%202023%20Fonticons,%20Inc.%20--%3e%3cpath%20d='M301.1%2034.8C312.6%2040%20320%2051.4%20320%2064V448c0%2012.6-7.4%2024-18.9%2029.2s-25%203.1-34.4-5.3L131.8%20352H64c-35.3%200-64-28.7-64-64V224c0-35.3%2028.7-64%2064-64h67.8L266.7%2040.1c9.4-8.4%2022.9-10.4%2034.4-5.3zM425%20167l55%2055%2055-55c9.4-9.4%2024.6-9.4%2033.9%200s9.4%2024.6%200%2033.9l-55%2055%2055%2055c9.4%209.4%209.4%2024.6%200%2033.9s-24.6%209.4-33.9%200l-55-55-55%2055c-9.4%209.4-24.6%209.4-33.9%200s-9.4-24.6%200-33.9l55-55-55-55c-9.4-9.4-9.4-24.6%200-33.9s24.6-9.4%2033.9%200z'/%3e%3c/svg%3e";class N{constructor(e){this.volumeBtn=null,this.createView(e)}createView(e){this.volumeBtn=a("div","volume-box",e),this.volumeImg=a("img","volume-icon",this.volumeBtn),this.volumeImg.src=w}getHTMLElement(){return this.volumeBtn}changeView(e){this.volumeImg.src=e?V:w}}class H{constructor(e){this.createView(e)}createView(e){this.switchElem=a("label","switch",e),this.inputTheme=a("input","input-theme",this.switchElem),this.inputTheme.type="checkbox",this.slider=a("span","slider",this.switchElem),this.inputTheme.addEventListener("change",()=>{document.body.classList.toggle("dark-theme")})}}class R{constructor(e){this.createView(e)}createView(e){this.header=a("header","header",e),this.btnBox=a("div","header-btn-box",this.header),this.switch=new H(this.btnBox),this.volumeSwitch=new N(this.btnBox),this.volumeBtn=this.volumeSwitch.getHTMLElement(),this.title=a("h1","title",this.header,"NONOGRAMS"),this.timer=new I(this.header)}}class D{constructor(){this.currentGame=null,this.userGame=null,this.savedGames=null,this.savedGamesKey="gamesGryzun33",this.savedGameKey="gameGryzun33"}saveCurrentGame(e,t,s){const i={gameData:e,usergameData:t,timeData:s};localStorage.setItem(this.savedGameKey,JSON.stringify(i))}getSavedGame(){return JSON.parse(localStorage.getItem(this.savedGameKey))}saveFinishedGame(e,t){this.savedGames=this.getFinishedGames();const i={fullTime:t.min*60+t.sec,gameData:e,timeData:t};this.savedGames.push(i),this.savedGames.length>5&&this.savedGames.shift(),localStorage.setItem(this.savedGamesKey,JSON.stringify(this.savedGames))}getFinishedGames(){let e=JSON.parse(localStorage.getItem("gamesGryzun33"));return e||(e=[]),e}}const O=""+new URL("dale-cooper-img-m7mvEQQJ.png",import.meta.url).href;class G{constructor(e){this.createView(e)}createView(e){this.overlay=a("div","overlay modal-hidden",e),this.modalWrapper=a("div","modal-wrapper",this.overlay),this.closeBtn=a("button","close-btn",this.modalWrapper),this.createContent(),this.endBtn=a("button","end-btn",this.modalWrapper,"OK"),this.events()}createContent(){this.content=a("div","modal-content",this.modalWrapper)}updateContent(e){this.value=e}showModal(e){this.updateContent(e),this.overlay.classList.remove("modal-hidden"),this.overlay.classList.add("overlay-show"),this.modalWrapper.classList.add("modal-show")}closeModal(){function e(){this.classList.add("modal-hidden"),this.classList.remove("overlay-show","overlay-hide"),this.firstElementChild.classList.remove("modal-show","modal-hide"),this.removeEventListener("animationend",e)}this.modalWrapper.classList.add("modal-hide"),this.overlay.classList.add("overlay-hide"),this.overlay.addEventListener("animationend",e)}events(){this.overlay.addEventListener("click",e=>{(e.target===this.overlay||e.target===this.closeBtn||e.target===this.endBtn)&&this.closeModal()})}}class W extends G{constructor(e,t){super(e),this.sound=t,this.onCloseHandler()}createContent(){this.content=a("div","finish-modal-content",this.modalWrapper),this.modalImage=a("img","finish-modal-image",this.content),this.modalImage.src=O}updateContent(e){this.finishText&&this.finishText.remove(),this.finishText=a("p","finish-text",this.content),this.finishText.innerHTML=`Great! You have solved the nonogram in <span>${e}</span> seconds!`}onCloseHandler(){this.overlay.addEventListener("click",e=>{(e.target===this.overlay||e.target===this.closeBtn||e.target===this.endBtn)&&this.sound.pause()})}}class A extends G{constructor(e,t,s){super(e),this.timer=t,this.isGame=s}createContent(){this.content=a("div","score-modal-content",this.modalWrapper),this.title=a("h2","score-modal-title",this.content,"Score table")}updateContent(e){if(this.modalText&&this.modalText.remove(),e.length===0){this.modalText=a("p","score-modal-text",this.content),this.modalText.innerText="No games won yet...";return}this.scoreTable&&this.scoreTable.remove(),this.scoreTable=a("table","score-table",this.content);const t=a("tr","head-row",this.scoreTable);a("th","numb-cell",t,"N"),a("th","name-cell",t,"Game"),a("th","level-cell",t,"Level"),a("th","time-cell",t,"Time"),e.forEach((s,i)=>{const l=a("tr","score-row",this.scoreTable);a("td","numb-cell",l,`${i+1}`),a("td","name-cell",l,s.gameData.gameName),a("td","level-cell",l,s.gameData.level),a("td","time-cell",l,`${s.timeData.currMin}:${s.timeData.currSec}`)})}addClickHandler(e){this.overlay.addEventListener("click",t=>{(t.target===this.overlay||t.target===this.closeBtn||t.target===this.endBtn)&&e&&this.timer.runTimer()},{once:!0})}}const $=""+new URL("click-left-fill-Rl66clv6.mp3",import.meta.url).href,P=""+new URL("click-left-clear-QHdVtO_5.mp3",import.meta.url).href,U=""+new URL("click-right-fill-9rbClg_O.mp3",import.meta.url).href,j=""+new URL("click-right-clear-bY1_Ldjg.mp3",import.meta.url).href,z=""+new URL("finish-game-2-czqTpWrx.mp3",import.meta.url).href;class K{constructor(){o(this,"changeMute",()=>{this.soundsArr.forEach(e=>{e.muted=!e.muted})});this.soundsArr=[],this.createSounds()}createSounds(){this.clickLeftFill=document.createElement("audio"),this.clickLeftFill.src=$,this.soundsArr.push(this.clickLeftFill),this.clickLeftClear=document.createElement("audio"),this.clickLeftClear.src=P,this.soundsArr.push(this.clickLeftClear),this.clickRightFill=document.createElement("audio"),this.clickRightFill.src=U,this.soundsArr.push(this.clickRightFill),this.clickRightClear=document.createElement("audio"),this.clickRightClear.src=j,this.soundsArr.push(this.clickRightClear),this.finishSound=document.createElement("audio"),this.finishSound.src=z,this.soundsArr.push(this.finishSound),this.changeMute()}playSound(e){e.currentTime=0,e.play()}}class J{constructor(e){o(this,"startGame",()=>{this.isGame=!0,this.timer.runTimer(),this.controls.saveGameBtn.enableBtn()});o(this,"checkGame",()=>{this.userGame=this.field.getUserGame();const e=this.currentGame.gameMatrix.flat().join(""),t=this.userGame.flat().map(s=>s.data).join("");e===t&&(this.finishGame(),this.timer.stopTimer())});o(this,"initRandomGame",()=>{this.currentGame=this.getRandomGame(),this.initNewGame()});o(this,"initChosenGame",e=>{this.currentGame=this.gamesMap.get(+e),this.currentGame.gameId=+e,this.initNewGame()});o(this,"initNewGame",()=>{const e=this.currentGame.gameName,t=this.currentGame.level;this.controls.updateSelects(t,e),this.timer.resetTimer(),this.fieldWrapper.innerHTML="",this.field=new k(this.fieldWrapper,this.currentGame,this.checkGame,this.startGame,this.isGame,this.sounds),this.controls.saveGameBtn.disableBtn()});o(this,"showLastGame",()=>{const e=this.dataBank.getSavedGame();this.isGame=!1,this.currentGame=e.gameData,this.initNewGame(),this.timer.updateTimer(e.timeData.min,e.timeData.sec),this.field.updateUserGameView(e.usergameData)});o(this,"showSolution",()=>{this.isGame=!1,this.timer.resetTimer(),this.field.showCorrectField(),this.field.disableField(),this.controls.saveGameBtn.disableBtn()});o(this,"saveCurrentGame",()=>{this.dataBank.getSavedGame()||this.controls.lastGameBtn.enableBtn(),this.userGame=this.field.getUserGame(),this.dataBank.saveCurrentGame(this.currentGame,this.userGame,this.timer.timeData)});o(this,"showScoreTable",()=>{const e=this.dataBank.getFinishedGames();e.sort((t,s)=>t.fullTime-s.fullTime),this.scoreModal.showModal(e),this.scoreModal.addClickHandler(this.isGame),this.timer.stopTimer()});this.isGame=!1,this.mainElem=null,this.currentGame=null,this.nonograms=v,this.currentGame=this.nonograms[0].games[0],this.userGame=null,this.gamesMap=this.createMapOfGames(this.nonograms),this.dataBank=new D,this.sounds=new K,this.isVolume=!1,this.createView(e)}createView(e){this.mainWrapper=a("div","wrapper",e),this.header=new R(this.mainWrapper),this.timer=this.header.timer,this.volumeBtn=this.header.volumeBtn,this.volumeBtn.addEventListener("click",this.onClickVolumeBtn.bind(this)),this.gameWrapper=a("main","game-wrapper",this.mainWrapper),this.fieldWrapper=a("div","field-wrapper",this.gameWrapper),this.controls=new F(this.gameWrapper,this.initRandomGame,this.initChosenGame,this.initNewGame,this.saveCurrentGame,this.showLastGame,this.showSolution,this.showScoreTable,this.sounds),this.initNewGame(),this.finishModal=new W(document.body,this.sounds.finishSound),this.scoreModal=new A(document.body,this.timer,this.isGame),this.dataBank.getSavedGame()||this.controls.lastGameBtn.disableBtn()}getHTMLElement(){return this.mainElem}getRandomGame(){const e=this.nonograms.map(s=>s.games).flat();let t;if(this.currentGame!==null){do t=Math.floor(Math.random()*e.length);while(e[t].gameId===this.currentGame.gameId);return e[t]}return t=Math.floor(Math.random()*e.length),e[t]}finishGame(){this.isGame=!1,this.timer.stopTimer(),this.dataBank.saveFinishedGame(this.currentGame,this.timer.timeData),this.field.disableField(),this.controls.saveGameBtn.disableBtn();const e=this.timer.getTimeInSec();setTimeout(()=>{this.finishModal.showModal(e)},500),this.sounds.playSound(this.sounds.finishSound)}createMapOfGames(e){const t=new Map;return e.map(i=>i.games).flat().forEach(i=>{const l=i.gameId,n={level:i.level,gameName:i.gameName,gameMatrix:i.gameMatrix};t.set(l,n)}),t}onClickVolumeBtn(){this.isVolume=!this.isVolume,this.header.volumeSwitch.changeView(this.isVolume),this.sounds.changeMute()}}class q{constructor(){this.createView()}createView(){this.main=new J(document.body)}}new q;
//# sourceMappingURL=index-1bFIgD_4.js.map