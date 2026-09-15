const KEY='cw_beautiful_readings',AKEY='cw_beautiful_alerts',CKEY='cw_beautiful_contact';
let readings=JSON.parse(localStorage.getItem(KEY)||'[]'),alerts=JSON.parse(localStorage.getItem(AKEY)||'[]');
let demo=true,timer=null,tick=0;

function scrollToId(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}
function openApp(){document.getElementById('landing').style.display='none';document.getElementById('siteNav').style.display='none';document.getElementById('app').style.display='block';startDemo();drawAll();renderAlerts();window.scrollTo(0,0)}
function closeApp(){stopDemo();document.getElementById('app').style.display='none';document.getElementById('landing').style.display='block';document.getElementById('siteNav').style.display='block';window.scrollTo(0,0)}
document.querySelectorAll('.app-nav button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.app-nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.app-page').forEach(x=>x.classList.remove('active'));document.getElementById(b.dataset.app).classList.add('active');drawAll();renderAlerts()}));

function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2400)}
function risk(v){
 let s=0,r=[];
 if(v.temp>=38){s+=3;r.push('fever-range temperature')}else if(v.temp>=37.5){s++;r.push('elevated temperature')}
 if(v.hr>=120||v.hr<=50){s+=3;r.push('marked heart-rate change')}else if(v.hr>=100||v.hr<=55){s++;r.push('elevated/low heart rate')}
 if(v.rr>=24||v.rr<=10){s+=3;r.push('abnormal respiration')}else if(v.rr>=20){s++;r.push('elevated respiration')}
 if(v.temp>=38&&v.hr>=100)s+=2;if(v.hr>=120&&v.rr>=24)s+=2;if(v.temp>=38&&v.rr>=24)s+=2;
 const level=s>=7?'HIGH':s>=3?'MODERATE':'LOW';
 const msg=level==='LOW'?'No concerning combination detected.':level==='MODERATE'?'A change is present. Recheck and consider contacting the care team.':'Multiple concerning changes detected. Seek urgent medical assessment.';
 return {level,score:s,msg:msg+(r.length?' ('+r.join(', ')+').':'')};
}
function ingest(v){
 const row={hr:+v.hr,temp:+v.temp,rr:+v.rr,ts:Date.now()};if(!Number.isFinite(row.hr)||!Number.isFinite(row.temp)||!Number.isFinite(row.rr))return;
 readings.push(row);if(readings.length>500)readings.shift();localStorage.setItem(KEY,JSON.stringify(readings));
 const x=risk(row);const p=alerts[0];if(x.level!=='LOW' && !(p&&Date.now()-p.ts<10000&&p.level===x.level)){alerts.unshift({ts:row.ts,level:x.level,title:x.level+' risk detected',msg:x.msg});alerts=alerts.slice(0,100);localStorage.setItem(AKEY,JSON.stringify(alerts))}
 render(row,x);drawAll();renderAlerts();
}
function render(v,x){document.getElementById('ahr').textContent=Math.round(v.hr);document.getElementById('atemp').textContent=v.temp.toFixed(1);document.getElementById('arr').textContent=Math.round(v.rr);document.getElementById('riskTitle').textContent=x.level+' RISK';document.getElementById('riskMsg').textContent=x.msg;document.getElementById('riskScore').textContent='Score '+x.score;const r=document.getElementById('appRisk');r.style.background=x.level==='HIGH'?'#fff0f0':x.level==='MODERATE'?'#fff7e7':'#eaf9f2';r.style.borderColor=x.level==='HIGH'?'#efb8b8':x.level==='MODERATE'?'#efd49d':'#bde7d5'}
function sample(){const v={hr:Math.round(78+7*Math.sin(tick/5)+(Math.random()*4-2)),temp:36.6+.18*Math.sin(tick/8)+(Math.random()*.08-.04),rr:Math.round(15+2*Math.sin(tick/6)+(Math.random()*2-1))};tick++;ingest(v)}
function startDemo(){clearInterval(timer);demo=true;document.getElementById('demoToggle').textContent='Stop Demo';document.getElementById('appState').textContent='Demo Mode';document.getElementById('appDevice').textContent='Simulated sensor stream';sample();timer=setInterval(sample,1800)}
function stopDemo(){clearInterval(timer);timer=null;demo=false}
function toggleDemo(){if(demo){stopDemo();document.getElementById('demoToggle').textContent='Start Demo';document.getElementById('appState').textContent='Offline';document.getElementById('appDevice').textContent='No simulated stream';toast('Demo stopped')}else startDemo()}
function stressTest(){const sequence=[{hr:105,temp:37.8,rr:21},{hr:124,temp:38.1,rr:25}];sequence.forEach((v,i)=>setTimeout(()=>ingest(v),i*700));toast('Simulating a warning pattern')}
function draw(id,vals){
 const c=document.getElementById(id);if(!c)return;const ctx=c.getContext('2d'),d=devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 if(vals.length<2){ctx.fillStyle='#78909a';ctx.font='12px system-ui';ctx.fillText('Waiting for readings…',12,24);return}
 const min=Math.min(...vals),max=Math.max(...vals),range=Math.max(max-min,1);ctx.strokeStyle='#dfecef';ctx.lineWidth=1;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,i*h/5);ctx.lineTo(w,i*h/5);ctx.stroke()}
 ctx.beginPath();vals.forEach((v,i)=>{let x=7+i*(w-14)/(vals.length-1),y=h-12-(v-min)/range*(h-28);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle='#0b6e8f';ctx.lineWidth=3;ctx.stroke();
}
function drawAll(){const a=readings.slice(-60);draw('appChart',a.map(x=>x.hr));draw('h1',a.map(x=>x.hr));draw('h2',a.map(x=>x.temp));draw('h3',a.map(x=>x.rr));draw('landingChart',a.slice(-30).map(x=>x.hr))}
function renderAlerts(){const el=document.getElementById('alertsBox');if(!el)return;if(!alerts.length){el.innerHTML='<div class="panel" style="text-align:center;color:var(--muted)">No alerts yet.</div>';return}el.innerHTML=alerts.map(a=>`<div class="alert-item ${a.level==='HIGH'?'high':''}"><h4>${a.title}</h4><p>${a.msg}</p><small style="color:#8aa0a7">${new Date(a.ts).toLocaleString()}</small></div>`).join('')}
function clearReadings(){if(confirm('Clear locally stored readings?')){readings=[];localStorage.removeItem(KEY);drawAll();toast('History cleared')}}
function clearAlerts(){if(confirm('Clear alerts?')){alerts=[];localStorage.removeItem(AKEY);renderAlerts();toast('Alerts cleared')}}
function saveContact(){localStorage.setItem(CKEY,JSON.stringify({name:document.getElementById('cname').value,phone:document.getElementById('cphone').value}));toast('Emergency contact saved locally')}
function loadContact(){const c=JSON.parse(localStorage.getItem(CKEY)||'{}');document.getElementById('cname').value=c.name||'';document.getElementById('cphone').value=c.phone||''}
function sms(){const p=document.getElementById('cphone').value.trim();if(!p)return toast('Enter a phone number first');location.href='sms:'+encodeURIComponent(p)+'?body='+encodeURIComponent('CAREWEAVE alert: please check on the mother immediately and seek medical help if needed.')}
function call(){const p=document.getElementById('cphone').value.trim();if(!p)return toast('Enter a phone number first');location.href='tel:'+encodeURIComponent(p)}
async function connectBLE(){
 if(!navigator.bluetooth){toast('Web Bluetooth needs a compatible browser on HTTPS/localhost');return}
 try{
  const service='6e400001-b5a3-f393-e0a9-e50e24dcca9e',ch='6e400003-b5a3-f393-e0a9-e50e24dcca9e';
  const device=await navigator.bluetooth.requestDevice({filters:[{services:[service]}]});const server=await device.gatt.connect();const s=await server.getPrimaryService(service);const c=await s.getCharacteristic(ch);await c.startNotifications();
  c.addEventListener('characteristicvaluechanged',e=>{try{ingest(JSON.parse(new TextDecoder().decode(e.target.value)))}catch(err){}});
  stopDemo();document.getElementById('demoToggle').textContent='Start Demo';document.getElementById('appState').textContent='ESP32 Connected';document.getElementById('appDevice').textContent='BLE live stream';document.getElementById('bleState').textContent='Connected: '+(device.name||'CAREWEAVE ESP32');toast('ESP32 connected')
 }catch(e){toast('BLE connection cancelled or unavailable')}
}
loadContact();drawAll();window.addEventListener('resize',drawAll);
