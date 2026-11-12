import SpeedTest from './speedtest.mjs';
const $ = id => document.getElementById(id);
const ua=navigator.userAgent, platform=navigator.userAgentData?.platform || navigator.platform || '';
const os=/Windows/i.test(platform+ua)?'Windows':/Android/i.test(ua)?'Android':/iPhone|iPad/i.test(ua)?'iOS / iPadOS':/Mac/i.test(platform+ua)?'macOS':/Linux/i.test(platform+ua)?'Linux':platform||'浏览器未提供';
const browser=/Edg\//.test(ua)?'Microsoft Edge':/OPR\//.test(ua)?'Opera':/Chrome\//.test(ua)?'Google Chrome':/Firefox\//.test(ua)?'Firefox':/Safari\//.test(ua)?'Safari':'当前浏览器';
$('os').textContent=os; $('browser-name').textContent=browser;
$('device-kind').textContent=/Android|iPhone|iPad/i.test(ua)?'移动设备':'电脑设备';
$('screen').textContent=`${screen.width} × ${screen.height}`;
$('cores').textContent=navigator.hardwareConcurrency?`${navigator.hardwareConcurrency} 个逻辑处理器`:'浏览器未提供';
$('memory').textContent=navigator.deviceMemory?`约 ${navigator.deviceMemory} GB（浏览器估算）`:'浏览器未提供';
if(navigator.userAgentData?.getHighEntropyValues){navigator.userAgentData.getHighEntropyValues(['model']).then(v=>{if(v.model)$('model').textContent=v.model}).catch(()=>{});}
const fmt = n => Number.isFinite(n) ? (n>=100?n.toFixed(0):n.toFixed(1)) : '—';
const setMetric=(id,n,unit)=>{const el=$(id);el.textContent='';el.append(document.createTextNode(fmt(n)+' '));const small=document.createElement('small');small.textContent=unit;el.append(small)};
function render(summary){setMetric('download',summary.download/1e6,'Mbps');setMetric('upload',summary.upload/1e6,'Mbps');setMetric('latency',summary.latency,'ms');}
let running=false;
$('start').addEventListener('click',()=>{
 if(running)return;running=true;$('start').disabled=true;$('start').textContent='正在测试…';$('speed-status').textContent='正在连接 Cloudflare，测试可能需要一些时间。';$('big-speed').textContent='—';render({});
 const engine=new SpeedTest({autoStart:false,logAimApiUrl:null,measurements:[{type:'latency',numPackets:8},{type:'download',bytes:1e5,count:4},{type:'download',bytes:1e6,count:4},{type:'download',bytes:1e7,count:2},{type:'upload',bytes:1e5,count:4},{type:'upload',bytes:1e6,count:4},{type:'upload',bytes:1e7,count:2}]});
 let failed=false;
 engine.onPhaseChange=({measurement})=>{$('phase-label').textContent=({latency:'测试延迟',download:'测试下载',upload:'测试上传'})[measurement.type]||'正在测试';};
 engine.onResultsChange=()=>{const s=engine.results.getSummary();render(s);const current=engine.results.getSummary();$('big-speed').textContent=fmt((current.upload??current.download)/1e6);};
 engine.onError=()=>{failed=true;};
 engine.onFinish=results=>{const s=results.getSummary();render(s);$('big-speed').textContent=fmt((s.download??s.upload)/1e6);$('phase-label').textContent='测试完成';$('speed-status').textContent=failed?'部分测试未完成，请检查网络或稍后重试。':'测速完成。结果反映当前设备到 Cloudflare 节点的连接。';$('start').innerHTML='重新测速 <span>↗</span>';$('start').disabled=false;running=false;};
 try{engine.play()}catch(e){running=false;$('start').disabled=false;$('start').textContent='重试测速';$('phase-label').textContent='测试未完成';$('speed-status').textContent='无法连接测速节点，请检查网络后重试。';}
});

