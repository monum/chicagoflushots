/* http://keith-wood.name/icalendar.html
   iCalendar processing for jQuery v1.1.1.
   Written by Keith Wood (kbwood{at}iinet.com.au) October 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
(function($){var p='icalendar';var q='icalendar-flash-copy';function iCalendar(){this._defaults={sites:[],icons:'icalendar.png',iconSize:16,target:'_blank',compact:false,popup:false,popupText:'Send to my calendar...',tipPrefix:'',echoUrl:'',echoField:'',start:null,end:null,title:'',summary:'',description:'',location:'',url:'',contact:'',recurrence:null,copyConfirm:'The event will be copied to your clipboard. Continue?',copySucceeded:'The event has been copied to your clipboard',copyFailed:'Failed to copy the event to the clipboard\n',copyFlash:'clipboard.swf',copyUnavailable:'The clipboard is unavailable, please copy the event details from below:\n'};this._sites={'google':{display:'Google',icon:0,override:null,url:'http://www.google.com/calendar/event?action=TEMPLATE'+'&amp;text={t}&amp;dates={s}/{e}&amp;details={d}&amp;location={l}&amp;sprop=website:{u}'},'icalendar':{display:'iCalendar',icon:1,override:null,url:'echo'},'outlook':{display:'Outlook',icon:2,override:null,url:'echo'},'yahoo':{display:'Yahoo',icon:3,override:yahooOverride,url:'http://calendar.yahoo.com/?v=60&amp;view=d&amp;type=20'+'&amp;title={t}&amp;st={s}&amp;dur={p}&amp;desc={d}&amp;in_loc={l}&amp;url={u}&amp;rpat={r}'}}}var r=[{method:'Seconds',factor:1},{method:'Minutes',factor:60},{method:'Hours',factor:3600},{method:'Date',factor:86400},{method:'Month',factor:1},{method:'FullYear',factor:12},{method:'Date',factor:604800}];var s=0;var t=1;var u=2;var w=3;var x=4;var y=5;var z=6;$.extend(iCalendar.prototype,{markerClassName:'hasICalendar',setDefaults:function(a){extendRemove(this._defaults,a||{});return this},addSite:function(a,b,c,d,e){this._sites[a]={display:b,icon:c,override:e,url:d};return this},getSites:function(){return this._sites},_attachICalendar:function(a,b){a=$(a);if(a.hasClass(this.markerClassName)){return}a.addClass(this.markerClassName);this._updateICalendar(a,b)},_changeICalendar:function(a,b){a=$(a);if(!a.hasClass(this.markerClassName)){return}this._updateICalendar(a,b)},_updateICalendar:function(i,j){j=extendRemove($.extend({},this._defaults,$.data(i[0],p)||{}),j);$.data(i[0],p,j);var k=j.sites||this._defaults.sites;if(k.length==0){$.each(this._sites,function(a){k[k.length]=a})}var l=function(b,c){var d={t:encodeURIComponent(j.title),d:encodeURIComponent(j.description),s:$.icalendar.formatDateTime(j.start),e:$.icalendar.formatDateTime(j.end),p:$.icalendar.calculateDuration(j.start,j.end),l:encodeURIComponent(j.location),u:encodeURIComponent(j.url),c:encodeURIComponent(j.contact),r:makeRecurrence(j.recurrence)};if(b.override){b.override.apply(i,[d,j])}var e=b.url;$.each(d,function(n,v){var a=new RegExp('\\{'+n+'\\}','g');e=e.replace(a,v)});var e=(b.url=='echo'?'#':e);var f=$('<li></li>');var g=$('<a href="'+e+'" title="'+j.tipPrefix+b.display+'"'+(b.url=='echo'?'':' target="'+j._target+'"')+'></a>');if(b.url=='echo'){g.click(function(){return $.icalendar._echo(i[0],c)})}var h='';if(b.icon!=null){if(typeof b.icon=='number'){h+='<span style="background: '+'transparent url('+j.icons+') no-repeat -'+(b.icon*j.iconSize)+'px 0px;'+($.browser.mozilla&&$.browser.version<'1.9'?' padding-left: '+j.iconSize+'px; padding-bottom: '+Math.max(0,(j.iconSize/2)-5)+'px;':'')+'"></span>'}else{h+='<img src="'+b.icon+'"'+(($.browser.mozilla&&$.browser.version<'1.9')||($.browser.msie&&$.browser.version<'7.0')?' style="vertical-align: bottom;"':($.browser.msie?' style="vertical-align: middle;"':($.browser.opera||$.browser.safari?' style="vertical-align: baseline;"':'')))+'/>'}h+=(j.compact?'':'&#xa0;')}g.html(h+(j.compact?'':b.display));f.append(g);return f};var m=$('<ul class="icalendar_list'+(j.compact?' icalendar_compact':'')+'"></ul>');var o=this._sites;$.each(k,function(a,b){m.append(l(o[b],b))});i.empty().append(m);if(j.popup){m.before('<span class="icalendar_popup_text">'+j.popupText+'</span>').wrap('<div class="icalendar_popup"></div>');i.click(function(){var a=$(this);var b=a.offset();$('.icalendar_popup',a).css('left',b.left).css('top',b.top+a.outerHeight()).toggle()})}},_destroyICalendar:function(a){a=$(a);if(!a.hasClass(this.markerClassName)){return}a.removeClass(this.markerClassName).empty();$.removeData(a[0],p)},_echo:function(a,b){var c=$.data(a,p);var d=makeICalendar(c);if(c.echoUrl){window.location.href=c.echoUrl+'?content='+escape(d)}else if(c.echoField){$(c.echoField).val(d)}else if(!c.copyFlash){alert(c.copyUnavailable+d)}else if(confirm(c.copyConfirm)){var e='';if(e=copyViaFlash(d,c.copyFlash)){alert(c.copyFailed+e)}else{alert(c.copySucceeded)}}return false},_ensureTwo:function(a){return(a<10?'0':'')+a},formatDate:function(a,b){return(!a?'':''+a.getFullYear()+this._ensureTwo(a.getMonth()+1)+this._ensureTwo(a.getDate()))},formatDateTime:function(a,b){return(!a?'':(b?''+a.getFullYear()+this._ensureTwo(a.getMonth()+1)+this._ensureTwo(a.getDate())+'T'+this._ensureTwo(a.getHours())+this._ensureTwo(a.getMinutes())+this._ensureTwo(a.getSeconds()):''+a.getUTCFullYear()+this._ensureTwo(a.getUTCMonth()+1)+this._ensureTwo(a.getUTCDate())+'T'+this._ensureTwo(a.getUTCHours())+this._ensureTwo(a.getUTCMinutes())+this._ensureTwo(a.getUTCSeconds())+'Z'))},calculateDuration:function(a,b){if(!a||!b){return''}var c=Math.abs(b.getTime()-a.getTime())/1000;var d=Math.floor(c/86400);c-=d*86400;var e=Math.floor(c/3600);c-=e*3600;var f=Math.floor(c/60);c-=f*60;return(a.getTime()>b.getTime()?'-':'')+'P'+(d>0?d+'D':'')+(e||f||c?'T'+e+'H':'')+(f||c?f+'M':'')+(c?c+'S':'')},addDuration:function(d,e){if(!e){return d}var f=new Date(d.getTime());var g=I.exec(e);if(!g){throw'Invalid duration';}if(g[2]&&(g[3]||g[5]||g[6]||g[7])){throw'Invalid duration - week must be on its own';}if(!g[4]&&(g[5]||g[6]||g[7])){throw'Invalid duration - missing time marker';}var h=(g[1]=='-'?-1:+1);var i=function(a,b,c){a=parseInt(a);if(!isNaN(a)){f['setUTC'+c](f['getUTC'+c]()+h*a*b)}};if(g[2]){i(g[2],7,'Date')}else{i(g[3],1,'Date');i(g[5],1,'Hours');i(g[6],1,'Minutes');i(g[7],1,'Seconds')}return f},parse:function(a){var b={};var c={};var d=unfoldLines(a);parseGroup(d,0,b,c);if(!b.vcalendar){throw'Invalid iCalendar data';}return b.vcalendar},getWeekOfYear:function(a,b){return getWeekOfYear(a,b)},_parseParams:function(a,b){return parseParams(a,b)}});function extendRemove(a,b){$.extend(a,b);for(var c in b){if(b[c]==null){a[c]=null}}return a}$.fn.icalendar=function(a){var b=Array.prototype.slice.call(arguments,1);return this.each(function(){if(typeof a=='string'){$.icalendar['_'+a+'ICalendar'].apply($.icalendar,[this].concat(b))}else{$.icalendar._attachICalendar(this,a||{})}})};$.icalendar=new iCalendar();function yahooOverride(b,c){var d=function(a){return(a<10?'0':'')+a};var e=(c.end?(c.end.getTime()-c.start.getTime())/60000:0);b.p=(e?d(Math.floor(e/60))+''+d(e%60):'');if(b.r){var f=(c.recurrence.by&&c.recurrence.by[0].type=='day'?c.recurrence.by[0].values.join('').toLowerCase():'');var g={daily:'dy',weekly:'wk',monthly:'mh',yearly:'yr'}[c.recurrence.freq];b.r=(f||g?d(c.recurrence.interval||1)+(f||g):'')}}function makeICalendar(c){var d=function(a){var b='';while(a.length>75){b+=a.substr(0,75)+'\n';a=' '+a.substr(75)}b+=a;return b};return'BEGIN:VCALENDAR\n'+'VERSION:2.0\n'+'PRODID:jquery.icalendar\n'+'METHOD:PUBLISH\n'+'BEGIN:VEVENT\n'+'UID:'+new Date().getTime()+'@'+(window.location.href.replace(/^[^\/]*\/\/([^\/]*)\/.*$/,'$1')||'localhost')+'\n'+'DTSTAMP:'+$.icalendar.formatDateTime(new Date())+'\n'+(c.url?d('URL:'+c.url)+'\n':'')+(c.contact?d('MAILTO:'+c.contact)+'\n':'')+d('TITLE:'+c.title)+'\n'+'DTSTART:'+$.icalendar.formatDateTime(c.start)+'\n'+'DTEND:'+$.icalendar.formatDateTime(c.end)+'\n'+(c.summary?d('SUMMARY:'+c.summary)+'\n':'')+(c.description?d('DESCRIPTION:'+c.description)+'\n':'')+(c.location?d('LOCATION:'+c.location)+'\n':'')+(c.recurrence?makeRecurrence(c.recurrence)+'\n':'')+'END:VEVENT\n'+'END:VCALENDAR'}function makeRecurrence(a){if(!a){return''}var b='';if(a.dates){b='RDATE;VALUE=DATE:';if(!isArray(a.dates)){a.dates=[a.dates]}for(var i=0;i<a.dates.length;i++){b+=(i>0?',':'')+$.icalendar.formatDate(a.dates[i])}}else if(a.times){b='RDATE;VALUE=DATE-TIME:';if(!isArray(a.times)){a.times=[a.times]}for(var i=0;i<a.times.length;i++){b+=(i>0?',':'')+$.icalendar.formatDateTime(a.times[i])}}else if(a.periods){b='RDATE;VALUE=PERIOD:';if(!isArray(a.periods[0])){a.periods=[a.periods]}for(var i=0;i<a.periods.length;i++){b+=(i>0?',':'')+$.icalendar.formatDateTime(a.periods[i][0])+'/'+(a.periods[i][1].constructor!=Date?a.periods[i][1]:$.icalendar.formatDateTime(a.periods[i][1]))}}else{b='RRULE:FREQ='+(a.freq||'daily').toUpperCase()+(a.interval?';INTERVAL='+a.interval:'')+(a.until?';UNTIL='+$.icalendar.formatDateTime(a.until):(a.count?';COUNT='+a.count:''))+(a.weekStart!=null?';WKST='+['SU','MO','TU','WE','TH','FR','SA'][a.weekStart]:'');if(a.by){if(!isArray(a.by)){a.by=[a.by]}for(var i=0;i<a.by.length;i++){if(!isArray(a.by[i].values)){a.by[i].values=[a.by[i].values]}b+=';BY'+a.by[i].type.toUpperCase()+'='+a.by[i].values.join(',')}}}return b}function copyViaFlash(a,b){$('#'+q).remove();try{$('body').append('<div id="'+q+'"><embed src="'+b+'" FlashVars="clipboard='+encodeURIComponent(a)+'" width="0" height="0" type="application/x-shockwave-flash"></embed></div>');return''}catch(e){return e}}var A=/^\s(.*)$/;var B=/^([A-Za-z0-9-]+)((?:;[A-Za-z0-9-]+=(?:"[^"]+"|[^";:,]+)(?:,(?:"[^"]+"|[^";:,]+))*)*):(.*)$/;var C=/;([A-Za-z0-9-]+)=((?:"[^"]+"|[^";:,]+)(?:,(?:"[^"]+"|[^";:,]+))*)/g;var D=/,?("[^"]+"|[^";:,]+)/g;var E=/^(\d{4})(\d\d)(\d\d)$/;var F=/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)$/;var G=/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)\/(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)$/;var H=/^([+-])(\d\d)(\d\d)$/;var I=/^([+-])?P(\d+W)?(\d+D)?(T)?(\d+H)?(\d+M)?(\d+S)?$/;var J=['class'];function unfoldLines(b){var c=b.replace(/\r\n/g,'\n').split('\n');for(var i=c.length-1;i>0;i--){var d=A.exec(c[i]);if(d){c[i-1]+=d[1];c[i]=''}}return $.map(c,function(a,i){return(a?a:null)})}function parseGroup(a,b,c,d){if(b>=a.length||a[b].indexOf('BEGIN:')!=0){throw'Missing group start';}var e={};var f=a[b].substr(6);addEntry(c,f.toLowerCase(),e);b++;while(b<a.length&&a[b].indexOf('END:')!=0){if(a[b].indexOf('BEGIN:')==0){b=parseGroup(a,b,e,d)}else{var g=parseEntry(a[b]);addEntry(e,g._name,(g._simple?g._value:g))}b++}if(f=='VTIMEZONE'){var h=H.exec(e.standard.tzoffsetto);if(h){d[e.tzid]=(h[1]=='-'?-1:+1)*(parseInt(h[2],10)*60+parseInt(h[3],10))}}else{for(var i in e){resolveTimezones(e[i],d)}}if(a[b]!='END:'+f){throw'Missing group end '+f;}return b}function resolveTimezones(c,d){if(!c){return}if(c.tzid&&c._value){var e=d[c.tzid];var f=function(a,b){a.setMinutes(a.getMinutes()-e);a._type=b};if(isArray(c._value)){for(var i=0;i<c._value.length;i++){f(c._value[i],c.tzid)}}else if(c._value.start&&c._value.end){f(c._value.start,c.tzid);f(c._value.end,c.tzid)}else{f(c._value,c.tzid)}}else if(isArray(c)){for(var i=0;i<c.length;i++){resolveTimezones(c[i],d)}}}function addEntry(a,b,c){if(typeof c=='string'){c=c.replace(/\\n/g,'\n')}if($.inArray(b,J)>-1){b+='_'}if(a[b]){if(!isArray(a[b])||a['_'+b+'IsArray']){a[b]=[a[b]]}a[b][a[b].length]=c;if(a['_'+b+'IsArray']){a['_'+b+'IsArray']=undefined}}else{a[b]=c;if(isArray(c)){a['_'+b+'IsArray']=true}}}function parseEntry(a){var b={};var c=B.exec(a);if(!c){throw'Missing entry name: '+a;}b._name=c[1].toLowerCase();b._value=checkDate(c[3]);b._simple=true;parseParams(b,c[2]);return b}function parseParams(a,b){var c=C.exec(b);while(c){var d=[];var e=D.exec(c[2]);while(e){d.push(checkDate(e[1].replace(/^"(.*)"$/,'$1')));e=D.exec(c[2])}a[c[1].toLowerCase()]=(d.length>1?d:d[0]);a._simple=false;c=C.exec(b)}}function checkDate(a){var b=F.exec(a);if(b){return makeDate(b)}b=G.exec(a);if(b){return{start:makeDate(b),end:makeDate(b.slice(7))}}b=E.exec(a);if(b){return makeDate(b.concat([0,0,0,'']))}return a}function makeDate(a){var b=new Date(a[1],a[2]-1,a[3],a[4],a[5],a[6]);b._type=(a[7]?'UTC':'float');return utcDate(b)}function utcDate(a){a.setMinutes(a.getMinutes()-a.getTimezoneOffset());return a}function getWeekOfYear(a,b){b=(b||b==0?b:1);var c=new Date(a.getFullYear(),a.getMonth(),a.getDate(),(a.getTimezoneOffset()/-60));var d=new Date(c.getFullYear(),1-1,4);var e=d.getDay();d.setDate(4+b-e-(b>e?7:0));if(c<d){c.setDate(c.getDate()-3);return getWeekOfYear(c,b)}else if(c>new Date(c.getFullYear(),12-1,28)){var f=new Date(c.getFullYear()+1,1-1,4);e=f.getDay();f.setDate(4+b-e-(b>e?7:0));if(c>=f){return 1}}return Math.floor(((c-d)/(r[w].factor*1000))/7)+1}function isArray(a){return(a&&a.constructor==Array)}})(jQuery);
function TkMap(r){var n=typeof r.lat!=="undefined"?r.lat:null;var o=typeof r.lng!=="undefined"?r.lng:null;var a=typeof r.domid!=="undefined"?r.domid:null;var g=typeof r.zoom!=="undefined"?r.zoom:15;var f=typeof r.init!=="undefined"?r.init:false;var h=typeof r.responsive!=="undefined"?r.responsive:false;var d=typeof r.styles!=="undefined"?r.styles:null;var b={center:new google.maps.LatLng(n,o),draggable:true,mapTypeControl:false,mapTypeId:google.maps.MapTypeId.ROADMAP,panControl:false,streetViewControl:false,styles:[],zoom:g,zoomControl:true};var k=false;var j=null;var p=null;this.Map=null;var e=function(s){k=true;j=s.touches[0].pageY};var q=function(){k=false};var m=function(s){if(!k){return}p=s.touches[0].pageY;window.scrollBy(0,(j-p))};var l=function(){var s=d.split(" ");for(i in s){if(s[i]==="satellite"){b.mapTypeId=google.maps.MapTypeId.SATELLITE}else{if(s[i]==="hybrid"){b.mapTypeId=google.maps.MapTypeId.HYBRID}else{if(s[i]==="road"){b.mapTypeId=google.maps.MapTypeId.ROADMAP}else{if(s[i]==="terrain"){b.mapTypeId=google.maps.MapTypeId.TERRAIN}else{if(s[i]==="minlabels"){b.styles.push({featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"road",elementType:"labels",stylers:[{visibility:"on"}]})}else{if(s[i]==="grey"){b.backgroundColor="#C5C5C5";b.styles.push({stylers:[{saturation:-99}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{lightness:85}]},{featureType:"water",stylers:[{lightness:-40}]})}}}}}}}};var c=function(){var s=$("#"+a).width();if(s<481){b.zoom--}else{if(s>959){b.zoom++}}};this.initMap=function(){if(this.Map===null){if(d!==null){l()}if(h){c()}this.Map=new google.maps.Map(document.getElementById(a),b)}};this.setMapOptions=function(s){if(this.Map!==null){$.extend(b,s)}};this.setTouchScroll=function(t){var s=document.getElementById(a);if(t){s.addEventListener("touchstart",e,true);s.addEventListener("touchend",q,true);s.addEventListener("touchmove",m,true);this.Map.setOptions({zoomControl:false})}else{s.removeEventListener("touchstart",e,true);s.removeEventListener("touchend",q,true);s.removeEventListener("touchmove",m,true);this.Map.setOptions({zoomControl:true,zoomControlOptions:{position:google.maps.ControlPosition.LEFT_TOP}})}};this.setPanZoom=function(t){var s;if(t){s=false}else{s=true}this.Map.setOptions({disableDoubleClickZoom:s,draggable:t,keyboardShortcuts:t,scrollwheel:t,zoomControl:t})};if(f===true){this.initMap()}};
function TkMapFusionLayer(b){var f=typeof b.map!=="undefined"?b.map:null;var e=typeof b.geo!=="undefined"?b.geo:null;var d=typeof b.tableid!=="undefined"?b.tableid:null;var g=typeof b.where!=="undefined"?b.where:null;var c=typeof b.icon!=="undefined"?b.icon:null;var a=typeof b.style!=="undefined"?b.style:null;this.Layer=null;this.showLayer=function(h){var i=typeof h.where!=="undefined"?h.where:g;var l=typeof h.icon!=="undefined"?h.icon:c;var k=typeof h.linestyle!=="undefined"?h.style:a;this.hideLayer();var j=null;if(i===null){j={select:e,from:d}}else{j={select:e,from:d,where:i}}if(l!==null){this.Layer=new google.maps.FusionTablesLayer({clickable:true,query:j,styles:[{markerOptions:{iconName:l}}]})}else{if(k!==null){this.Layer=new google.maps.FusionTablesLayer({clickable:true,query:j,styles:k})}else{this.Layer=new google.maps.FusionTablesLayer({clickable:true,query:j})}}this.Layer.setMap(f)};this.hideLayer=function(){if(this.Layer!==null){this.Layer.setMap(null)}};if(f!==null&&e!==null&&d!==null){this.showLayer({})}};
$(document).ready(function(){var j=Modernizr.touch;var y=navigator.geolocation;var a=41.85;var B=-87.675;var w={};var h=null;var A=null;var C=null;var p=new google.maps.DirectionsService();var v={};var g=new TkMap({domid:"map",init:true,lat:a,lng:B,styles:"grey",zoom:11});var E=new Date();var G=E.getDate();var H=E.getMonth()+1;var s=E.getFullYear();var D=new Date(E);D.setDate(D.getDate()+7);var t=D.getDate();var x=D.getMonth()+1;var I=D.getFullYear();var q="Date >= '"+s+"."+(H<=9?"0"+H:H)+"."+(G<=9?"0"+G:G)+"'";var b=new TkMapFusionLayer({geo:"Location",map:g.Map,tableid:"5171986",where:q});o();var u="left";if(window.innerWidth>760){u="bottom"}function l(d,L,K,J){if($("#ical").hasClass("hasICalendar")){$("#ical").icalendar("change",{start:d,end:L,description:K,location:J});$(".icalendar_compact").css("border","0px");$("#ical-file").icalendar("change",{start:d,end:L,description:K,location:J})}else{$("#icalr").html('<small class="text-info">Calendar Reminder For This Event</small>');$("#ical").icalendar({start:d,end:L,title:"CDPH Free Flu Shot Event",summary:"CDPH Free Flu Shot Event",description:K,location:J,icons:"img/icalendar.png",sites:["google","yahoo"]});$(".icalendar_compact").css("border","0px");$("#ical-file").icalendar({start:d,end:L,title:"CDPH Free Flu Shot Event",summary:"CDPH Free Flu Shot Event",description:K,location:J,icons:"img/icalendar.png",sites:["icalendar","outlook"],echoUrl:"ical.php"})}}function o(){google.maps.event.addListener(b.Layer,"click",function(N){C=N.row;var L=C.Date.value.split("/");var d=C.Hours.value.split(" - ");var O=d[0].split(":");var R=d[1].split(":");var Q=O[1].match(/PM/i);if(Q!==null&&O[0]!=12){O[0]=parseInt(O[0],10)+12}var P=R[1].match(/PM/i);if(P!==null&&R!=12){R[0]=parseInt(R[0],10)+12}var S=O[1].split(" ");var K=R[1].split(" ");var J=new Date(L[2],L[0]-1,L[1],O[0],S[0],0);var M=new Date(L[2],L[0]-1,L[1],R[0],K[0],0);l(J,M,C.Name.value,C.Location.value);$("#eventselected").html("<b>"+C.Name.value+"</b>");if(typeof w.lat!=="undefined"){$("#grp-cta").show()}})}function n(d,L){d.style.padding="5px";var K=document.createElement("div");K.style.backgroundColor="white";K.style.borderStyle="solid";K.style.borderWidth="2px";K.style.cursor="pointer";K.style.textAlign="center";K.title="Click to set the map to Home";d.appendChild(K);var J=document.createElement("div");J.style.fontFamily="Arial,sans-serif";J.style.fontSize="12px";J.style.paddingLeft="4px";J.style.paddingRight="4px";J.innerHTML="Enable Pan/Zoom";K.appendChild(J);google.maps.event.addDomListener(K,"click",function(){if(g.Map.zoomControl==false){g.setPanZoom(true);g.setTouchScroll(false);J.innerHTML="Disable Pan/Zoom"}else{g.setPanZoom(false);g.setTouchScroll(true);J.innerHTML="Enable Pan/Zoom"}})}function e(){var d=new google.maps.Geocoder();d.geocode({address:$("#location").val()},function(K,J){if(J==google.maps.GeocoderStatus.OK){if(K[0]){g.Map.panTo(K[0].geometry.location);w.lat=K[0].geometry.location.lat();w.lng=K[0].geometry.location.lng();if(h!==null){h.setMap(null)}h=new google.maps.Marker({position:K[0].geometry.location,map:g.Map});$("#grp-find").show(0);if(C!==null){$("#grp-cta").show()}}else{alert("We're sorry. We could not locate this address. Please doublecheck your address and make sure to include your city, state and zip code.")}}else{alert("We're sorry. We could not locate this address. Please doublecheck your address and make sure to include your city, state and zip code.")}})}function f(){var d=new google.maps.Geocoder();d.geocode({address:$("#location").val()},function(M,K){if(K==google.maps.GeocoderStatus.OK){if(M[0]){g.Map.panTo(M[0].geometry.location);w.lat=M[0].geometry.location.lat();w.lng=M[0].geometry.location.lng();if(h!==null){h.setMap(null)}h=new google.maps.Marker({position:M[0].geometry.location,map:g.Map});var L=q+" AND ST_INTERSECTS(Location, CIRCLE(LATLNG("+w.lat+","+w.lng+"), 5000))";var J=new google.maps.LatLng(w.lat,w.lng);A=new google.maps.Circle({center:J,clickable:false,fillOpacity:0.1,map:g.Map,radius:5000,strokeWeight:2});g.Map.panToBounds(A.getBounds());g.Map.fitBounds(A.getBounds());b.showLayer({where:L});o()}else{alert("We're sorry. We could not locate this address. Please doublecheck your address and make sure to include your city, state and zip code.")}}else{alert("We're sorry. We could not locate this address. Please doublecheck your address and make sure to include your city, state and zip code.")}})}function z(){var d=q;if($("#btn-day-su").hasClass("marked")||$("#btn-day-mo").hasClass("marked")||$("#btn-day-tu").hasClass("marked")||$("#btn-day-we").hasClass("marked")||$("#btn-day-th").hasClass("marked")||$("#btn-day-fr").hasClass("marked")||$("#btn-day-sa").hasClass("marked")){d=d+" AND Day IN (";if($("#btn-day-su").hasClass("marked")){d=d+"'Sunday',"}if($("#btn-day-mo").hasClass("marked")){d=d+"'Monday',"}if($("#btn-day-tu").hasClass("marked")){d=d+"'Tuesday',"}if($("#btn-day-we").hasClass("marked")){d=d+"'Wednesday',"}if($("#btn-day-th").hasClass("marked")){d=d+"'Thursday',"}if($("#btn-day-fr").hasClass("marked")){d=d+"'Friday',"}if($("#btn-day-sa").hasClass("marked")){d=d+"'Saturday',"}d=d.substring(0,d.length-1);d=d+")"}b.showLayer({where:d});o()}function i(){var d="Date >= '"+s+"."+(H<=9?"0"+H:H)+"."+(G<=9?"0"+G:G)+"'";d=d+" AND Date <= '"+I+"."+(x<=9?"0"+x:x)+"."+(t<=9?"0"+t:t)+"'";b.showLayer({where:d});o()}function F(d){if(d){$("#gpsfail").text("Error: The Geolocation service failed.");$("#alert-gpsfail").removeClass("hide")}else{$("#gpsfail").text("Error: Your browser doesn't support geolocation.");$("#alert-gpsfail").removeClass("hide")}}function m(K,J){var d=new google.maps.Geocoder();d.geocode({latLng:K},function(M,L){if(L==google.maps.GeocoderStatus.OK){if(M[1]){$("#"+J).val(M[0].formatted_address);if(C!==null){$("#grp-cta").show()}}else{alert("We're sorry. We could not locate you. Please make sure your device's locator is working properly or you've clicked on the map at an addressable location.")}}else{alert("We're sorry. We could not locate you. Please make sure your device's locator is working properly or you've clicked on the map at an addressable location.")}})}if(y){$(".btn-gps").removeClass("hide")}if(j){g.setPanZoom(false);g.setTouchScroll(true);var c=document.createElement("div");var r=new n(c,g.Map);c.index=1;g.Map.controls[google.maps.ControlPosition.TOP_RIGHT].push(c)}else{v={draggable:true,suppressInfoWindows:true,suppressMarkers:false,polylineOptions:{strokeColor:"#0954cf",strokeWeight:"5",strokeOpacity:"0.85"}}}var k=new google.maps.DirectionsRenderer(v);$("#location").keyup(function(d){if($("#location").val().length>0){if(d.which==13){e()}}else{$("#grp-find").hide(0)}});$(".cta").click(function(){var N=$(this).attr("id");var J={};if(N=="ctarouteevent"){var M=C.Hours.value.split(" - ");if(M[0]=="12:00 PM"){M[0]="12:00"}var L=C.Date.value+" "+M[0];var d=Date.parse(L).getTime();J={arrivalTime:new Date(d)}}k.setMap(g.Map);$("#directions").html("");k.setPanel(document.getElementById("directions"));var K={origin:$("#location").val(),destination:C.Location.value,transitOptions:J,travelMode:google.maps.TravelMode.TRANSIT};p.route(K,function(P,O){if(O==google.maps.DirectionsStatus.OK){$("#theform").hide(500);$("#span-cta").show(500);delete P.routes[0].warnings;P.routes[0].copyrights="";$("#directions").html();$("#timetoleave").html();k.setDirections(P);if(N=="ctarouteevent"){$("#timetoleave").html('<p class="lead">CTA/Metra Directions<br><b>Leave by '+P.routes[0].legs[0].departure_time.text+" on "+C.Date.value+"</b></p>")}else{$("#timetoleave").html('<p class="lead">CTA/Metra Directions<br><b>Leave by '+P.routes[0].legs[0].departure_time.text+"</b></p>")}}else{if(typeof k!=="undefined"){k.setMap(null)}$("#theform").hide(500);$("#span-cta").show(500);$("#timetoleave").html('<p class="lead">CTA/Metra Directions</p>');$("#directions").html("<p><b>We are sorry. We cannot route you to this clinic.</b> It is likely that the CTA or Metra has not released schedule times for the date of your travel yet. Please check back soon.</p>")}});o()});$("#btn-by-loc").click(function(){$("#grp-day").hide(500);$(".day").removeClass("marked active");$("#grp-location").show(500);z()});$("#btn-by-day").click(function(){$("#grp-day").show(500)});$(".search").click(function(){if($(this).attr("id")=="search"){if(h!==null){h.setMap(null)}if(A!==null){A.setMap(null)}$("#grp-day").hide(500);$(".day").removeClass("marked active");f()}else{if($(this).hasClass("marked")){$(this).removeClass("marked")}else{$(this).addClass("marked")}z()}});$("#week").click(function(){$(".day").removeClass("active");$("#grp-day").hide(500);$("#btn-date-all").removeClass("active");$("#btn-date-available").addClass("active");i()});$("#reset-map").click(function(){$(".day").removeClass("active marked");$("#grp-day").hide(500);$("#grp-find").hide(500);$("#grp-cta").hide(500);$("#location").val("");w={};C=null;z();if(h!==null){h.setMap(null)}if(A!==null){A.setMap(null)}if(typeof k!=="undefined"){k.setMap(null)}$("#theform").show(500);$("#span-cta").hide(500);$("#timetoleave").html("");$("#directions").html("");$("#gen-info").show();g.Map.setZoom(11);var d=new google.maps.LatLng(a,B);g.Map.panTo(d)});$(".btn-gps").click(function(){if(y){var d=this.id.split("-");navigator.geolocation.getCurrentPosition(function(J){pos=new google.maps.LatLng(J.coords.latitude,J.coords.longitude);$("#grp-find").show(0);g.Map.panTo(pos);m(pos,d[2]);if(d[2]=="location"){w.lat=J.coords.latitude;w.lng=J.coords.longitude;var K=new google.maps.LatLng(J.coords.latitude,J.coords.longitude);if(h!==null){h.setMap(null)}h=new google.maps.Marker({position:K,map:g.Map})}},function(){F(true)})}else{F(false)}});$(".btn-map").click(function(){var J=$(this).attr("id");google.maps.event.clearListeners(g.Map,"click");var d=J.split("-")[2];$("#grp-"+d).addClass("error");$("#"+d).val("");$("#"+d).attr("placeholder","Click the map at your location");google.maps.event.addListenerOnce(g.Map,"click",function(L){pos=new google.maps.LatLng(L.latLng.lat(),L.latLng.lng());g.Map.panTo(pos);m(pos,d);if(d=="location"){w.lat=L.latLng.lat();w.lng=L.latLng.lng();var K=new google.maps.LatLng(L.latLng.lat(),L.latLng.lng());if(h!==null){h.setMap(null)}h=new google.maps.Marker({position:K,map:g.Map})}$("#grp-"+d).removeClass("error");$("#"+d).attr("placeholder","123 W StreetName, City, State, ZipCode");$("#grp-find").show(0);o()})});$("#location").focusout(function(){if($("#location").val().length>0){e()}})});
