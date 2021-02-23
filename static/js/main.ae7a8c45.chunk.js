(this["webpackJsonpjigsaw-puzzle"]=this["webpackJsonpjigsaw-puzzle"]||[]).push([[0],{57:function(e,t,s){},68:function(e,t,s){},85:function(e,t,s){},86:function(e,t,s){"use strict";s.r(t);var n=s(1),a=s.n(n),o=s(19),i=s.n(o),c=s(50),r=s(17),l=s(7),h=s(8),u=s(9),d=s(14),p=s(13);function m(e){return Array.from(Array(e).keys())}function g(e){return Math.floor(Math.random()*Math.floor(e))}var b="b",f="r",j="f";function v(){var e=[b,f];return e[g(e.length)]}var y=s(16),O=s(31),P=s.n(O),w="Left",x="Top",k="Right",z="Bottom",I=Object(y.a)({},Symbol.iterator,P.a.mark((function e(){return P.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w;case 2:return e.next=4,x;case 4:return e.next=6,k;case 6:return e.next=8,z;case 8:case"end":return e.stop()}}),e)}))),S=function(){function e(t,s,n){Object(l.a)(this,e),this.START="START",this.templates=this.makeTemplates(t,s,n)}return Object(h.a)(e,[{key:"makeTemplates",value:function(e,t,s){var n={};return n[this.START]="M ".concat(s," ").concat(t-s," "),n.bLeft=function(e,n,a,o){return"V ".concat((t+e)/2)+"C ".concat(s-n," ").concat(t/2+a," ",0," ").concat(t/2+o," ",0," ").concat(t/2," ")+"C ".concat(0," ",t/2-o," ").concat(s-n," ").concat(t/2-a," ").concat(s," ").concat((t-e)/2," ")},n.rLeft=function(e,n,a,o){return"V ".concat((t+e)/2)+"C ".concat(s+n," ").concat(t/2+a," ").concat(2*s," ").concat(t/2+o," ").concat(2*s," ").concat(t/2," ")+"C ".concat(2*s," ").concat(t/2-o," ").concat(s+n," ").concat(t/2-a," ").concat(s," ").concat((t-e)/2," ")},n.Left="V ".concat(s," "),n.bTop=function(t,n,a,o){return"H ".concat((e-t)/2," ")+"C ".concat(e/2-a," ").concat(s-n," ").concat(e/2-o," ",0," ").concat(e/2," ",0," ")+"C ".concat(e/2+o," ",0," ").concat(e/2+a," ").concat(s-n," ").concat((e+t)/2," ").concat(s," ")},n.rTop=function(t,n,a,o){return"H ".concat((e-t)/2," ")+"C ".concat(e/2-a," ").concat(s+n,"  ").concat(e/2-o," ").concat(2*s," ").concat(e/2," ").concat(2*s," ")+"C ".concat(e/2+o," ").concat(2*s," ").concat(e/2+a," ").concat(s+n," ").concat((e+t)/2," ").concat(s," ")},n.Top="H ".concat(e-s," "),n.bRight=function(n,a,o,i){return"V ".concat((t-n)/2," ")+"C ".concat(e-s+a," ").concat(t/2-o," ").concat(e," ").concat(t/2-i," ").concat(e," ").concat(t/2," ")+"C ".concat(e," ").concat(t/2+i," ").concat(e-s+a," ").concat(t/2+o," ").concat(e-s," ").concat((t+n)/2," ")},n.rRight=function(n,a,o,i){return"V ".concat((t-n)/2," ")+"C ".concat(e-s-a," ").concat(t/2-o," ").concat(e-2*s," ").concat(t/2-i," ").concat(e-2*s," ").concat(t/2," ")+"C ".concat(e-2*s," ").concat(t/2+i," ").concat(e-s-a," ").concat(t/2+o," ").concat(e-s," ").concat((t+n)/2," ")},n.Right="V ".concat(t-s," "),n.bBottom=function(n,a,o,i){return"H ".concat((e+n)/2," ")+"C ".concat(e/2+o," ").concat(t-s+a," ").concat(e/2+i," ").concat(t," ").concat(e/2," ").concat(t," ")+"C ".concat(e/2-i," ").concat(t," ").concat(e/2-o," ").concat(t-s+a," ").concat((e-n)/2," ").concat(t-s," ")},n.rBottom=function(n,a,o,i){return"H ".concat((e+n)/2," ")+"C ".concat(e/2+o," ").concat(t-s-a,"  ").concat(e/2+i," ").concat(t-2*s," ").concat(e/2," ").concat(t-2*s," ")+"C ".concat(e/2-i," ").concat(t-2*s," ").concat(e/2-o," ").concat(t-s-a," ").concat((e-n)/2," ").concat(t-s," ")},n.Bottom="Z",n}},{key:"getPathString",value:function(e,t){var s=e===w?this.templates[this.START]:"",n=this.templates[e],a="";if(t.type!==j){var o=t.type+e;a=this.templates[o](t.w,t.o,t.c1,t.c2)}return s+a+n}}]),e}(),C=s(22),R=function(){function e(t,s,n,a,o){Object(l.a)(this,e),this.type=t,this.w=s,this.o=n,this.c1=a,this.c2=o}return Object(h.a)(e,[{key:"opposite",value:function(){var e=Object(C.a)({},this);return e.type=function(e){switch(e){case b:return f;case f:return b;default:throw Error("getOppositeEdge: ".concat(e," does not have an opposite edge type"))}}(this.type),e}}]),e}(),D=s(2),N=function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;Object(l.a)(this,s);var a=(n=t.call(this,e)).props.model.bgPos;return n.backgroundPositionString="".concat(a.left,"px ").concat(a.top,"px"),n.clipPathString=n.getClipPathString(n.props.edgeDrawer),n}return Object(h.a)(s,[{key:"getClipPathString",value:function(e){var t,s="path('",n=Object(r.a)(I);try{for(n.s();!(t=n.n()).done;){var a=t.value;s+=e.getPathString(a,this.props.model.edges[a])}}catch(o){n.e(o)}finally{n.f()}return s+"')"}},{key:"render",value:function(){var e=this,t=this.props.model,s="puzzle-piece"+(this.props.blockPointerEvents?" block-pointer-events":"");return Object(D.jsx)("div",{className:s,tempid:t.key,onPointerDown:function(t){return e.props.onPointerDown(t)},style:{backgroundPosition:this.backgroundPositionString,clipPath:this.clipPathString,width:this.props.width,height:this.props.height,left:t.displayPos.left,top:t.displayPos.top,zIndex:t.zIndex>0?t.zIndex:"auto"}})}}]),s}(n.PureComponent),M=function(){function e(t,s,n,a,o,i,c,r){Object(l.a)(this,e),this.group=t,this.key=t,this.col=s,this.row=n,this.bgPos=o,this.zIndex=i,this.edges=c,this.neighbors=r,this.setPos(a.left,a.top)}return Object(h.a)(e,[{key:"pos",get:function(){return this.actualPos},set:function(e){throw Error('PieceModel: Don\'t set "pos" directly - use setPos() instead.')}},{key:"setPos",value:function(e,t){this.actualPos={left:e,top:t},this.displayPos=this.actualPos}},{key:"setDisplayPos",value:function(e,t){this.displayPos={left:e,top:t}}},{key:"clone",value:function(){var t=new e(this.key,this.col,this.row,this.pos,this.bgPos,this.zIndex,this.edges,this.neighbors);return t.group=this.group,t.setDisplayPos(this.displayPos.left,this.displayPos.top),t}}]),e}(),T=function(){function e(t){var s;Object(l.a)(this,e),this.key=t,this.pieces=[],this.bounds=(s={},Object(y.a)(s,w,-1),Object(y.a)(s,x,-1),Object(y.a)(s,k,-1),Object(y.a)(s,z,-1),s)}return Object(h.a)(e,[{key:"addPiece",value:function(e,t,s){this.pieces.push(e),(this.bounds.Left<0||s<this.bounds.Left)&&(this.bounds.Left=s),(this.bounds.Right<0||s>this.bounds.Right)&&(this.bounds.Right=s),(this.bounds.Top<0||t<this.bounds.Top)&&(this.bounds.Top=t),(this.bounds.Bottom<0||t>this.bounds.Bottom)&&(this.bounds.Bottom=t)}},{key:"mergeWith",value:function(e){this.pieces=this.pieces.concat(e.pieces),e.bounds.Left<this.bounds.Left&&(this.bounds.Left=e.bounds.Left),e.bounds.Right>this.bounds.Right&&(this.bounds.Right=e.bounds.Right),e.bounds.Top<this.bounds.Top&&(this.bounds.Top=e.bounds.Top),e.bounds.Bottom>this.bounds.Bottom&&(this.bounds.Bottom=e.bounds.Bottom)}}]),e}(),U=function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;return Object(l.a)(this,s),(n=t.call(this,e)).state=Object(C.a)({},n.props.startPos),n}return Object(h.a)(s,[{key:"componentDidMount",value:function(){var e=this;requestAnimationFrame((function(){return requestAnimationFrame((function(){return e.setState(Object(C.a)({},e.props.destPos))}))}))}},{key:"render",value:function(){return Object(D.jsx)("div",{className:"puzzle-complete-img",onTransitionEnd:this.props.onTransitionEnd,style:{width:this.props.width,height:this.props.height,left:this.state.left,top:this.state.top}})}}]),s}(n.Component),B=(s(57),function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;Object(l.a)(this,s),(n=t.call(this,e)).innerWidth=n.props.imgWidth/n.props.cols,n.innerHeight=n.props.imgHeight/n.props.rows,n.borderSize=Math.min(n.innerHeight,n.innerWidth)/4,n.pieceWidth=2*n.borderSize+n.innerWidth,n.pieceHeight=2*n.borderSize+n.innerHeight,n.pointerDownHandlers=m(n.props.rows*n.props.cols).map((function(e){return n.handlePointerDown.bind(Object(u.a)(n),e)})),n.handlePointerMove=n.handlePointerMove.bind(Object(u.a)(n)),n.handlePointerUp=n.handlePointerUp.bind(Object(u.a)(n)),n.handleResize=n.handleResize.bind(Object(u.a)(n)),n.handleTransitionEnd=n.handleTransitionEnd.bind(Object(u.a)(n)),n.edgeDrawer=new S(n.pieceWidth,n.pieceHeight,n.borderSize),n.nextzIndex=1;var a=n.createPieces();return n.groups=n.createGroups(a),n.state={pieces:a,gameComplete:!1,draggedPiece:null},n}return Object(h.a)(s,[{key:"componentDidMount",value:function(){this.setScaleFactor(),window.addEventListener("resize",this.handleResize)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.handleResize)}},{key:"setScaleFactor",value:function(){var e=.7*document.documentElement.clientWidth/this.props.imgWidth,t=.7*document.documentElement.clientHeight/this.props.imgHeight,s=Math.min(e,t);return this.setState({scaleFactor:s}),s}},{key:"clampPiecesToBoardBounds",value:function(e){var t,s=document.querySelector(".puzzle-background"),n=s.clientWidth/e-this.pieceWidth,a=s.clientHeight/e-this.pieceHeight,o=this.state.pieces.slice(),i=Object(r.a)(o.entries());try{for(i.s();!(t=i.n()).done;){var l=Object(c.a)(t.value,2),h=l[0],u=l[1],d=this.groups[u.group],p=n-this.innerWidth*(d.bounds.Right-u.col),m=a-this.innerHeight*(d.bounds.Bottom-u.row);o[h]=u.clone(),o[h].setDisplayPos(u.pos.left>p?p:u.pos.left,u.pos.top>m?m:u.pos.top)}}catch(g){i.e(g)}finally{i.f()}this.setState({pieces:o})}},{key:"getGridPosition",value:function(e,t,s){return{left:(this.innerWidth+s)*e-this.borderSize,top:(this.innerHeight+s)*t-this.borderSize}}},{key:"getRandomPosition",value:function(){return{left:Math.random()*(.2*this.props.imgWidth),top:Math.random()*(this.props.imgHeight-this.pieceHeight)}}},{key:"getBackgroundPosition",value:function(e,t){return{left:-this.innerWidth*e+this.borderSize,top:-this.innerHeight*t+this.borderSize}}},{key:"createEdge",value:function(e){var t=this.borderSize*(.8+.45*Math.random()),s=this.borderSize*(.4+.1*Math.random()),n=t>this.borderSize?t*(.75+.25*Math.random()):this.borderSize*(.85+.35*Math.random()),a=t*(.5+.15*Math.random());return new R(e,t,s,n,a)}},{key:"createPieces",value:function(){for(var e=this,t=[],s=m(this.props.cols*this.props.rows),n=Array(this.props.cols).fill(null).map((function(){return Array(e.props.rows)})),a=0;a<this.props.cols;a++)for(var o=0;o<this.props.rows;o++){var i=g(s.length),c=s.splice(i,1)[0];n[a][o]=c;var r=this.getRandomPosition(),l=this.getBackgroundPosition(a,o),h={};a>0&&(h.Left=n[a-1][o],t[h.Left].neighbors.Right=c),o>0&&(h.Top=n[a][o-1],t[h.Top].neighbors.Bottom=c);var u={};u.Left=0===a?this.createEdge(j):t[h.Left].edges.Right.opposite(),u.Top=0===o?this.createEdge(j):t[h.Top].edges.Bottom.opposite(),u.Right=a===this.props.cols-1?this.createEdge(j):this.createEdge(v()),u.Bottom=o===this.props.rows-1?this.createEdge(j):this.createEdge(v()),t[c]=new M(c,a,o,r,l,0,u,h)}return this.topLeftKey=n[0][0],t}},{key:"createGroups",value:function(e){var t,s={},n=Object(r.a)(e);try{for(n.s();!(t=n.n()).done;){var a=t.value,o=new T(a.key);o.addPiece(a.key,a.row,a.col),s[a.key]=o}}catch(i){n.e(i)}finally{n.f()}return s}},{key:"alignPiece",value:function(e,t){e.setPos(t.displayPos.left+this.innerWidth*(e.col-t.col),t.displayPos.top+this.innerHeight*(e.row-t.row))}},{key:"isTouching",value:function(e,t,s){var n=7/this.state.scaleFactor;return t===k?Math.abs(e.displayPos.top-s.displayPos.top)<=n&&Math.abs(s.displayPos.left-e.displayPos.left-this.innerWidth)<=n:t===w?Math.abs(e.displayPos.top-s.displayPos.top)<=n&&Math.abs(e.displayPos.left-s.displayPos.left-this.innerWidth)<=n:t===x?Math.abs(e.displayPos.left-s.displayPos.left)<=n&&Math.abs(e.displayPos.top-s.displayPos.top-this.innerHeight)<=n:t===z?Math.abs(e.displayPos.left-s.displayPos.left)<=n&&Math.abs(s.displayPos.top-e.displayPos.top-this.innerHeight)<=n:void 0}},{key:"mergeGroups",value:function(e,t,s){var n,a=e[this.groups[t].pieces[0]],o=Object(r.a)(this.groups[s].pieces);try{for(o.s();!(n=o.n()).done;){var i=n.value,c=e[i].clone();c.group=t,c.zIndex=a.zIndex,this.alignPiece(c,a),e[i]=c}}catch(l){o.e(l)}finally{o.f()}this.groups[t].mergeWith(this.groups[s]),delete this.groups[s]}},{key:"handlePointerDown",value:function(e,t){if(null===this.state.draggedPiece&&t.isPrimary&&("mouse"!==t.pointerType||0===t.button)){var s,n=this.state.pieces.slice(),a=n[e].group,o=Object(r.a)(this.groups[a].pieces);try{for(o.s();!(s=o.n()).done;){var i=s.value;n[i]=n[i].clone(),n[i].zIndex=this.nextzIndex,n[i].setPos(n[i].displayPos.left,n[i].displayPos.top)}}catch(c){o.e(c)}finally{o.f()}this.nextzIndex++,this.setState({pieces:n,draggedPiece:e,offsetX:t.clientX-n[e].pos.left*this.state.scaleFactor,offsetY:t.clientY-n[e].pos.top*this.state.scaleFactor})}}},{key:"handlePointerMove",value:function(e){if(null!==this.state.draggedPiece&&e.isPrimary){var t=document.elementFromPoint(e.clientX,e.clientY);if(t&&t.classList.contains("puzzle-area")){var s=this.state.draggedPiece,n=this.state.pieces.slice(),a=n[s].clone();n[s]=a;var o=(e.clientX-this.state.offsetX)/this.state.scaleFactor,i=(e.clientY-this.state.offsetY)/this.state.scaleFactor;a.setPos(o,i);var c,l=this.groups[a.group],h=Object(r.a)(l.pieces);try{for(h.s();!(c=h.n()).done;){var u=c.value;n[u]=n[u].clone(),this.alignPiece(n[u],a)}}catch(d){h.e(d)}finally{h.f()}this.setState({pieces:n})}}}},{key:"handlePointerUp",value:function(){if(null!==this.state.draggedPiece){var e,t=this.state.draggedPiece,s=this.state.pieces.slice(),n=s[t].group,a=Object(r.a)(this.groups[n].pieces);try{for(a.s();!(e=a.n()).done;){var o,i=s[e.value],c=Object(r.a)(I);try{for(c.s();!(o=c.n()).done;){var l=o.value,h=s[i.neighbors[l]];h&&h.group!==i.group&&this.isTouching(i,l,h)&&this.mergeGroups(s,i.group,h.group)}}catch(d){c.e(d)}finally{c.f()}}}catch(d){a.e(d)}finally{a.f()}var u=1===Object.keys(this.groups).length;this.setState({pieces:s,draggedPiece:null,gameComplete:u})}}},{key:"handleResize",value:function(){var e=this.setScaleFactor();this.clampPiecesToBoardBounds(e)}},{key:"handleTransitionEnd",value:function(){this.setState({endAnimationComplete:!0})}},{key:"getTopLeftPos",value:function(){var e=this.state.pieces[this.topLeftKey].displayPos;return{left:e.left+this.borderSize,top:e.top+this.borderSize}}},{key:"getCenteredImagePos",value:function(){var e=document.querySelector(".puzzle-background");return{left:(e.clientWidth/this.state.scaleFactor-this.props.imgWidth)/2,top:(e.clientHeight/this.state.scaleFactor-this.props.imgHeight)/2}}},{key:"renderPiece",value:function(e){return Object(D.jsx)(N,{model:e,width:this.pieceWidth,height:this.pieceHeight,blockPointerEvents:null!==this.state.draggedPiece,edgeDrawer:this.edgeDrawer,onPointerDown:this.pointerDownHandlers[e.key]},e.key)}},{key:"render",value:function(){var e,t=this,s={transform:"scale(".concat(this.state.scaleFactor,")"),width:100/this.state.scaleFactor+"%",height:100/this.state.scaleFactor+"%"};if(this.state.gameComplete&&this.state.endAnimationComplete)e=Object(D.jsx)("div",{className:"puzzle-area puzzle-complete",style:s});else if(this.state.gameComplete)e=Object(D.jsx)("div",{className:"puzzle-area",style:s,children:Object(D.jsx)(U,{startPos:this.getTopLeftPos(),destPos:this.getCenteredImagePos(),width:this.props.imgWidth,height:this.props.imgHeight,onTransitionEnd:this.handleTransitionEnd})});else{var n=this.state.pieces.map((function(e){return t.renderPiece(e)}));e=Object(D.jsx)("div",{className:"puzzle-area"+(null!==this.state.draggedPiece?" no-scroll":""),onPointerMove:this.handlePointerMove,onPointerUp:this.handlePointerUp,style:s,children:n})}return Object(D.jsxs)("div",{className:"puzzle-container mt-2",children:[Object(D.jsx)("div",{className:"puzzle-background"}),e,Object(D.jsx)("div",{className:"pb-3"})]})}}]),s}(n.Component)),H=s(88),L=s(93),E=s(91),F=s(89),W=s(90),A=function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(){return Object(l.a)(this,s),t.apply(this,arguments)}return Object(h.a)(s,[{key:"render",value:function(){var e=this.props.image,t="";if(e&&e.source){var s=(e.source.nameIsTitle?e.name:"Photo")+" by "+e.author;t=Object(D.jsxs)(H.a,{children:[Object(D.jsxs)(F.a,{children:[Object(D.jsx)(W.a,{md:"8",children:Object(D.jsx)("img",{src:e.url,alt:"Image preview",width:"100%"})}),Object(D.jsxs)(W.a,{md:"4",className:"mt-3 mt-md-0 pl-md-0",children:[Object(D.jsx)("p",{children:s}),Object(D.jsxs)("p",{children:["Source: ",e.source.sourceName]})]})]}),Object(D.jsx)(F.a,{className:"mt-md-3",children:Object(D.jsxs)(W.a,{children:[Object(D.jsxs)("p",{class:"text-break",children:["See the original at: ",Object(D.jsx)("a",{href:e.source.sourceUrl,target:"_blank",rel:"external noopener",children:e.source.sourceUrl})]}),e.source.description?Object(D.jsx)("p",{children:e.source.description}):null]})})]})}return Object(D.jsxs)(L.a,{toggle:this.props.toggleModal,isOpen:this.props.isOpen,centered:!0,children:[Object(D.jsx)(E.a,{toggle:this.props.toggleModal,children:"Image details"}),t]})}}]),s}(n.Component),K=function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;return Object(l.a)(this,s),(n=t.call(this,e)).toggleModal=n.toggleModal.bind(Object(u.a)(n)),n.state={modalOpen:!1},n}return Object(h.a)(s,[{key:"toggleModal",value:function(){this.setState((function(e){return{modalOpen:!e.modalOpen}}))}},{key:"render",value:function(){var e=this.props.puzzleImage;if(!e)return null;var t=e.source&&e.source.isPhoto,s=e.source&&e.source.nameIsTitle,n=s?Object(D.jsx)("em",{children:e.name}):"",a="";e.author&&(a+=s?", ".concat(t?" photo":""," by "):t?"Photo by ":"By ",a+=e.author);var o=e.source?Object(D.jsx)("button",{type:"button",className:"btn btn-link btn-sm text-muted px-1",onClick:this.toggleModal,children:"more info"}):"";return Object(D.jsxs)("div",{className:"container-fluid container-md mt-3",children:[Object(D.jsxs)("div",{className:"row justify-content-center flex-sm-nowrap mx-n2",children:[Object(D.jsx)("div",{className:"col-2 d-none d-md-block px-2",children:" "}),Object(D.jsx)("div",{className:"col-auto flex-shrink-1 px-2",children:Object(D.jsxs)("p",{className:"h5",children:[n,a]})}),Object(D.jsx)("div",{className:"col-auto col-sm-2 px-2",children:o})]}),Object(D.jsx)(A,{toggleModal:this.toggleModal,isOpen:this.state.modalOpen,image:e})]})}}]),s}(n.Component),q=s(94),G=s(92),V=function e(t,s,n,a,o,i,c){Object(l.a)(this,e),this.name=t,this.url=s,this.defaultRows=n,this.defaultCols=a,this.author=o,this.source=i,this.shortName=null!==c&&void 0!==c?c:t},Y=function e(t){var s=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"";Object(l.a)(this,e),this.sourceName=t,this.nameIsTitle=s,this.sourceUrl=a,this.isPhoto=n,this.description=o},X=s.p+"static/media/ito-jakuchu-red-parrot-on-the-branch-of-a-tree.a8f36cd5.jpg",J=s.p+"static/media/david-clode-eOSqRq2Qm1c-unsplash.42540cb6.jpg",Q=s.p+"static/media/casey-horner-80UR4DM2Rz0-unsplash.001ae9f7.jpg",Z=s.p+"static/media/van-gogh-roses-nga.8fa9d120.jpg",_=s.p+"static/media/scott-webb-lYzgtps0UtQ-unsplash.509dd0a5.jpg",$=s.p+"static/media/travel-sourced-FsmcD6uKcHk-unsplash.97041d06.jpg",ee=[new V("Red Parrot on the Branch of a Tree",X,6,8,"It\u014d Jakuch\u016b",new Y("Metropolitan Museum of Art",!0,!1,"https://www.metmuseum.org/art/collection/search/57123"),"Red Parrot"),new V("Coral",J,7,10,"David Clode",new Y("Unsplash",!1,!0,"https://unsplash.com/photos/eOSqRq2Qm1c")),new V("Starry Sky",Q,7,10,"Casey Horner",new Y("Unsplash",!1,!0,"https://unsplash.com/photos/80UR4DM2Rz0")),new V("Roses",Z,8,10,"Vincent van Gogh",new Y("National Gallery of Art",!0,!1,"https://www.nga.gov/collection/art-object-page.72328.html")),new V("Succulents",_,8,5,"Scott Webb",new Y("Unsplash",!1,!0,"https://unsplash.com/photos/lYzgtps0UtQ")),new V("Jellyfish",$,7,10,"Travel Sourced",new Y("Unsplash",!1,!0,"https://unsplash.com/photos/FsmcD6uKcHk"))],te=(s(67),s(68),function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;return Object(l.a)(this,s),(n=t.call(this,e)).fileInput=a.a.createRef(),n.selectedPreset=ee[0],n.userImage=null,n.handleSelectChange=n.handleSelectChange.bind(Object(u.a)(n)),n.handleFileChange=n.handleFileChange.bind(Object(u.a)(n)),n.handleRadioKeyDown=n.handleRadioKeyDown.bind(Object(u.a)(n)),n.useUserImage=n.useUserImage.bind(Object(u.a)(n)),n.usePresetImage=n.usePresetImage.bind(Object(u.a)(n)),n.state={usingUserImage:!1,invalidUserImage:!1},n}return Object(h.a)(s,[{key:"usePresetImage",value:function(){this.setState({usingUserImage:!1}),this.props.setSelectedImage(this.selectedPreset)}},{key:"useUserImage",value:function(){this.setState({usingUserImage:!0}),this.props.setSelectedImage(this.userImage)}},{key:"handleRadioKeyDown",value:function(e){switch(e.key){case"ArrowLeft":case"ArrowUp":case"Left":case"Up":return void("radioBtn2"===e.target.id&&(document.getElementById("radioBtn1").focus(),e.preventDefault()));case"ArrowRight":case"ArrowDown":case"Down":case"Right":return void("radioBtn1"===e.target.id&&(document.getElementById("radioBtn2").focus(),e.preventDefault()))}}},{key:"handleSelectChange",value:function(e){this.usePresetImage();var t=e.target;-1!==t.selectedIndex&&(this.selectedPreset=ee[t.selectedIndex],this.props.setSelectedImage(this.selectedPreset))}},{key:"handleFileChange",value:function(){var e=this;this.useUserImage();var t=this.fileInput.current.files[0],s=URL.createObjectURL(t),n=new Image;n.onerror=function(){URL.revokeObjectURL(s),e.userImage&&URL.revokeObjectURL(e.userImage.url),e.userImage=null,e.setState({invalidUserImage:!0}),e.props.setSelectedImage(null)},n.onload=function(){e.userImage&&URL.revokeObjectURL(e.userImage.url);var a=e.generateDefaultDimensions(n.naturalWidth,n.naturalHeight);e.userImage=new V(t.name,s,a.rows,a.cols),e.setState({invalidUserImage:!1}),e.props.setSelectedImage(e.userImage)},n.src=s}},{key:"generateDefaultDimensions",value:function(e,t){var s=this.props.minPuzzleDimension,n=e/t,a=function(e,t,s){if(t>s)throw Error("clamp: min (".concat(t,") is greater than max (").concat(s,")."));return Math.max(Math.min(e,s),t)}(Math.round(15/(n+1)),s,15-s);return{rows:a,cols:15-a}}},{key:"renderSelectOptions",value:function(){for(var e=[],t=0;t<ee.length;t++){var s=ee[t];e.push(Object(D.jsx)("option",{value:s.url,children:s.shortName},t))}return e}},{key:"render",value:function(){var e=this.state.usingUserImage?"btn-outline-dark":"btn-dark",t=this.state.usingUserImage?"btn-dark":"btn-outline-dark";return Object(D.jsxs)("div",{className:"input-group",children:[Object(D.jsx)("div",{className:"input-group-prepend col-12 col-lg-6 pr-lg-0",children:Object(D.jsxs)("div",{className:"btn ".concat(e," d-flex flex-wrap flex-sm-nowrap align-items-center w-100"),onClick:this.usePresetImage,children:[Object(D.jsx)("input",{readOnly:!0,className:"col-auto",id:"radioBtn1",type:"radio",checked:!this.state.usingUserImage,onKeyDown:this.handleRadioKeyDown}),Object(D.jsx)("label",{className:"col col-sm-4 col-md-3 col-lg-auto col-form-label",htmlFor:"radioBtn1",children:"Choose an image:"}),Object(D.jsx)("div",{className:"w-100 d-sm-none"}),Object(D.jsx)("label",{className:"sr-only",htmlFor:"puzzle-image-select",children:"Select image"}),Object(D.jsx)("select",{className:"custom-select col mr-lg-4",id:"puzzle-image-select",onChange:this.handleSelectChange,children:this.renderSelectOptions()})]})}),Object(D.jsx)("div",{className:"input-group-append col-12 col-lg-6 pl-lg-0",children:Object(D.jsxs)("div",{className:"btn ".concat(t," d-flex flex-wrap flex-sm-nowrap align-items-center w-100"),onClick:this.useUserImage,children:[Object(D.jsx)("input",{readOnly:!0,className:"col-auto order-first order-lg-last ml-lg-3",id:"radioBtn2",type:"radio",checked:this.state.usingUserImage,onKeyDown:this.handleRadioKeyDown}),Object(D.jsx)("label",{className:"col col-sm-4 col-md-3 col-lg-auto col-form-label",htmlFor:"radioBtn2",children:"Or use your own:"}),Object(D.jsx)("div",{className:"w-100 d-sm-none"}),Object(D.jsx)(q.a,{className:"col text-left",id:"file-input",type:"file",accept:"image/*",innerRef:this.fileInput,invalid:this.state.invalidUserImage,onChange:this.handleFileChange}),Object(D.jsx)("a",{className:"unstyled ml-2",id:"show-tooltip",href:"#",onClick:function(e){e.preventDefault(),e.stopPropagation()},children:Object(D.jsx)("i",{className:"bi-info-circle"})}),Object(D.jsx)(G.a,{placement:"top",target:"show-tooltip",children:"Images are only used locally in your browser and are never uploaded or sent over the Internet."})]})})]})}}]),s}(n.Component)),se=function(e){Object(d.a)(s,e);var t=Object(p.a)(s);function s(e){var n;return Object(l.a)(this,s),(n=t.call(this,e)).handleDimensionsChange=n.handleDimensionsChange.bind(Object(u.a)(n)),n.handleDimensionsBlur=n.handleDimensionsBlur.bind(Object(u.a)(n)),n.setSelectedImage=n.setSelectedImage.bind(Object(u.a)(n)),n.newPuzzle=n.newPuzzle.bind(Object(u.a)(n)),n.state={selectedImage:ee[0],rows:ee[0].defaultRows,cols:ee[0].defaultCols},n}return Object(h.a)(s,[{key:"componentDidMount",value:function(){this.newPuzzle()}},{key:"handleDimensionsChange",value:function(e){this.setState(Object(y.a)({},e.target.name,e.target.valueAsNumber))}},{key:"handleDimensionsBlur",value:function(e){this.setState(Object(y.a)({},e.target.name,this.validateDimension(e.target.value)))}},{key:"validateDimension",value:function(e){var t=parseInt(e,10);return isNaN(t)||t<2?t=2:t>25&&(t=25),t}},{key:"setSelectedImage",value:function(e){var t=e?e.defaultRows:this.state.rows,s=e?e.defaultCols:this.state.cols;this.setState({selectedImage:e,rows:t,cols:s})}},{key:"newPuzzle",value:function(){var e=this;if(this.state.selectedImage){var t=this.validateDimension(this.state.rows),s=this.validateDimension(this.state.cols),n=this.state.selectedImage;document.documentElement.style.setProperty("--puzzle-img","url(".concat(n.url,")"));var a=new Image;a.onerror=function(){return console.log("Failed to load image")},a.onload=function(){return e.props.newPuzzle(a.naturalWidth,a.naturalHeight,t,s,n)},a.src=n.url}}},{key:"render",value:function(){var e=isNaN(this.state.rows)?"":this.state.rows,t=isNaN(this.state.cols)?"":this.state.cols;return Object(D.jsxs)("form",{className:"container mt-4",children:[Object(D.jsx)("div",{className:"form-group row",children:Object(D.jsx)(te,{setSelectedImage:this.setSelectedImage,minPuzzleDimension:2})}),Object(D.jsxs)("div",{className:"form-group row justify-content-center",children:[Object(D.jsx)("label",{className:"mr-2 my-2 col-form-label",htmlFor:"row-input",children:"Rows:"}),Object(D.jsx)("input",{className:"mr-2 my-2",id:"row-input",type:"number",min:2,max:25,name:"rows",value:e,onChange:this.handleDimensionsChange,onBlur:this.handleDimensionsBlur}),Object(D.jsx)("label",{className:"mr-2 my-2 col-form-label",htmlFor:"col-input",children:"Columns:"}),Object(D.jsx)("input",{className:"mr-4 my-2",id:"col-input",type:"number",min:2,max:25,name:"cols",value:t,onChange:this.handleDimensionsChange,onBlur:this.handleDimensionsBlur}),Object(D.jsx)("button",{className:"btn btn-dark btn-lg",type:"button",disabled:!this.state.selectedImage,onClick:this.newPuzzle,children:"New puzzle"})]})]})}}]),s}(n.Component),ne=(s(84),s(85),1);i.a.render(Object(D.jsx)(a.a.StrictMode,{children:Object(D.jsx)(se,{newPuzzle:function e(t,s,n,o,c){i.a.render(Object(D.jsxs)(a.a.StrictMode,{children:[Object(D.jsx)(se,{newPuzzle:e}),Object(D.jsx)(K,{puzzleImage:c}),Object(D.jsx)(B,{imgWidth:t,imgHeight:s,rows:n,cols:o},++ne)]}),document.getElementById("react-root"))}})}),document.getElementById("react-root"))}},[[86,1,2]]]);
//# sourceMappingURL=main.ae7a8c45.chunk.js.map