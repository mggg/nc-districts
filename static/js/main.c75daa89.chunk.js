(this.webpackJsonpnc=this.webpackJsonpnc||[]).push([[0],[,,,,,,,,,function(e,t,a){e.exports=a(17)},,,,,function(e,t,a){},function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(5),o=a.n(s),i=(a(14),a(15),a(16),a(1)),c=a(2),l=a(3),u=a(6),m=a(7),d=a(8);var p=function(){function e(t,a,n){Object(i.a)(this,e),this.map=t,this.layer=a,this.id=a.id,this.sourceId=a.source,this.type=a.type,this.sourceLayer=a["source-layer"],n?n(t,a):t&&t.addLayer(a),this.getFeature=this.getFeature.bind(this)}return Object(c.a)(e,[{key:"addToMap",value:function(e){e&&!this.map&&(this.map=e,e.addLayer(this.layer))}},{key:"remove",value:function(){this.map&&(this.map.removeLayer(this.id),this.map=null)}},{key:"setOpacity",value:function(e,t){this.setPaintProperty("".concat(t?"text":this.type.replace("symbol","icon"),"-opacity"),e)}},{key:"setColor",value:function(e){this.setPaintProperty("".concat(this.type,"-color"),e)}},{key:"getColor",value:function(){return this.getPaintProperty("".concat(this.type,"-color"))}},{key:"setPaintProperties",value:function(e){for(var t in e)this.setPaintProperty(t,e[t])}},{key:"setFeatureState",value:function(e,t){this.map.setFeatureState({source:this.sourceId,sourceLayer:this.sourceLayer,id:e},t)}},{key:"setPaintProperty",value:function(e,t){this.map.setPaintProperty(this.id,e,t)}},{key:"getPaintProperty",value:function(e){return this.map.getPaintProperty(this.id,e)}},{key:"getFeatureState",value:function(e){return this.map.getFeatureState({source:this.sourceId,sourceLayer:this.sourceLayer,id:e})}},{key:"getFeature",value:function(e){return this.map.querySourceFeatures(this.sourceId,{sourceLayer:this.sourceLayer,filter:["==",["id"],e]})[0]}},{key:"queryRenderedFeatures",value:function(){return this.map.queryRenderedFeatures(null,{layers:[this.id]})}},{key:"querySourceFeatures",value:function(){return this.map.querySourceFeatures(this.sourceId,{sourceLayer:this.sourceLayer})}},{key:"getAssignment",value:function(e){return this.getFeatureState(e).color}},{key:"setAssignment",value:function(e,t){this.setFeatureState(e.id,Object(d.a)({},e.state,{color:t}))}},{key:"on",value:function(e){for(var t,a=arguments.length,n=new Array(a>1?a-1:0),r=1;r<a;r++)n[r-1]=arguments[r];(t=this.map).on.apply(t,[e,this.id].concat(n))}},{key:"off",value:function(e){for(var t,a=arguments.length,n=new Array(a>1?a-1:0),r=1;r<a;r++)n[r-1]=arguments[r];(t=this.map).off.apply(t,[e,this.id].concat(n))}},{key:"untilSourceLoaded",value:function(e){var t=this;if(this.map.isSourceLoaded(this.sourceId))return e();this.map.on("sourcedata",(function a(){return e((function(){return t.map.off("sourcedata",a)}))}))}}]),e}();window.mapboxgl.accessToken="pk.eyJ1IjoiZGlzdHJpY3RyIiwiYSI6ImNqbjUzMTE5ZTBmcXgzcG81ZHBwMnFsOXYifQ.8HRRLKHEJA0AismGk2SX2g";var h=[{name:"Charlotte",center:[-80.9073009,35.2119091],zoom:9},{name:"Raleigh",center:[-78.6902118,35.8221152],zoom:9},{name:"Greensboro",center:[-79.8936405,36.0808962],zoom:9},{name:"Durham",center:[-78.9644001,35.9893843],zoom:9},{name:"Winston-Salem",center:[-80.322947,36.1079573],zoom:9},{name:"Fayetteville",center:[-79.0080239,35.0717055],zoom:9},{name:"Cary",center:[-78.8826751,35.7693799],zoom:9.5},{name:"Wilmington",center:[-77.9131854,34.2130073],zoom:9.5},{name:"High Point",center:[-80.0280459,35.9723156],zoom:9.5}],y=function(e){Object(m.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this)).state={mapLoaded:!1,layer:"federal"},n.showBorder=n.showBorder.bind(Object(l.a)(n)),n.layers={federal:[],house:[],senate:[]},n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.maps=[],fetch("/nc-districts/nc-geo/current_districts.geojson").then((function(e){return e.json()})).then((function(t){fetch("/nc-districts/nc-geo/state_house_districts.geojson?r2").then((function(e){return e.json()})).then((function(a){fetch("/nc-districts/nc-geo/state_senate_districts.geojson").then((function(e){return e.json()})).then((function(n){h.forEach((function(r,s){var o=new window.mapboxgl.Map({container:e.refs["map"+s],style:"mapbox://styles/mapbox/light-v10",center:r.center,zoom:r.zoom,attributionControl:!1,pitchWithRotate:!1,dragPan:!0,touchZoomRotate:!0});o.on("load",(function(){o.addControl(new window.mapboxgl.NavigationControl),o.addSource("districts",{type:"geojson",data:t}),e.layers.federal.push(new p(o,{id:"districts",source:"districts",type:"line",paint:{"line-color":"#555","line-width":1.5}})),o.addSource("state_senate",{type:"geojson",data:n}),e.layers.senate.push(new p(o,{id:"state_senate",source:"state_senate",type:"line",paint:{"line-color":"#555","line-width":1.5,"line-opacity":0}})),o.addSource("state_house",{type:"geojson",data:a}),e.layers.house.push(new p(o,{id:"state_house",source:"state_house",type:"line",paint:{"line-color":"#555","line-width":1.5,"line-opacity":0}})),o.addSource("precincts",{type:"vector",url:"mapbox://districtr.nc_precincts"});new p(o,{id:"precincts-borders",source:"precincts","source-layer":"nc_precincts",type:"line",paint:{"line-color":"#777777","line-width":["interpolate",["linear"],["zoom"],0,0,7,1],"line-opacity":.3}})}))}))}))}))}))}},{key:"setMapSelection",value:function(){}},{key:"switchLayer",value:function(e){}},{key:"showBorder",value:function(e){this.layers[this.state.layer].forEach((function(e){e.setOpacity(0)})),this.layers[e].forEach((function(e){e.setOpacity(1)})),this.setState({layer:e})}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"options"},r.a.createElement("label",null,r.a.createElement("input",{type:"radio",name:"districts",checked:"federal"===this.state.layer,value:"fed",onChange:function(t){e.showBorder("federal")}}),"US Congress"),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",name:"districts",checked:"senate"===this.state.layer,value:"senate",onChange:function(t){e.showBorder("senate")}}),"State Senate"),r.a.createElement("label",null,r.a.createElement("input",{type:"radio",name:"districts",checked:"house"===this.state.layer,value:"house",onChange:function(t){e.showBorder("house")}}),"State House")),r.a.createElement("div",{className:"map-row"},r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map0"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map1"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map2"}))),r.a.createElement("div",{className:"map-row"},r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map3"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map4"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map5"}))),r.a.createElement("div",{className:"map-row"},r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map6"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map7"})),r.a.createElement("div",{className:"map-cell"},r.a.createElement("div",{className:"map-square",ref:"map8"}))))}}]),a}(r.a.Component);var f=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("section",null,r.a.createElement(y,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(f,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[9,1,2]]]);
//# sourceMappingURL=main.c75daa89.chunk.js.map