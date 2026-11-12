import {questions,extraQuestions,tieQuestions,scoreAnswers,zodiacFor,typeNotes} from './core.mjs';
const $=id=>document.getElementById(id);
const month=$('birth-month'),day=$('birth-day');
for(let i=1;i<=12;i++){const o=document.createElement('option');o.value=i;o.textContent=i+' 月';month.append(o)}
function populateDays(){const selected=Number(day.value);const max=month.value?[31,29,31,30,31,30,31,31,30,31,30,31][Number(month.value)-1]:31;day.replaceChildren(new Option('选择日期',''));for(let i=1;i<=max;i++)day.add(new Option(i+' 日',String(i)));if(selected>=1&&selected<=max)day.value=String(selected)}
month.addEventListener('change',populateDays);populateDays();
$('zodiac-form').addEventListener('submit',event=>{event.preventDefault();if(!month.value||!day.value)return;try{const sign=zodiacFor(Number(month.value),Number(day.value));$('zodiac-empty').hidden=true;$('zodiac-output').hidden=false;$('zodiac-symbol').textContent=sign.symbol+'\uFE0E';$('zodiac-en').textContent=sign.en;$('zodiac-name').textContent=sign.name;$('zodiac-range').textContent=sign.range+'  ·  '+sign.element;$('zodiac-keywords').textContent=sign.keywords;$('zodiac-description').textContent=sign.description}catch(error){day.setCustomValidity('请选择有效日期');day.reportValidity()}});
day.addEventListener('change',()=>day.setCustomValidity(''));
let baseItems=questions,items=questions,answers=Array(items.length).fill(null),index=0;
const dimensionNames={EI:['外向','内向'],SN:['实感','直觉'],TF:['思考','情感'],JP:['判断','知觉']};
const dimensionNotes={EI:['倾向通过交流和互动获得能量。','倾向通过独处和内在思考恢复能量。'],SN:['倾向关注具体事实、经验和实际细节。','倾向关注整体联系、想象和可能性。'],TF:['倾向依据逻辑、原则和一致性判断。','倾向考虑人的感受、价值和关系。'],JP:['倾向事先安排，喜欢明确的计划。','倾向保持弹性，喜欢边探索边调整。']};
function show(id){['quiz-welcome','quiz-question','quiz-result'].forEach(name=>$(name).hidden=name!==id)}
function question(){show('quiz-question');const q=items[index];$('quiz-counter').textContent=`${String(index+1).padStart(2,'0')} / ${items.length}`;$('question-kicker').textContent=index>=baseItems.length?'加测题 / 接近的两种偏好':`QUESTION ${String(index+1).padStart(2,'0')}`;$('question-text').textContent=q[1];$('answer-a').querySelector('b').textContent=q[2];$('answer-b').querySelector('b').textContent=q[3];$('quiz-back').disabled=index===0;$('progress-fill').style.width=`${index/items.length*100}%`;document.querySelector('.progress').setAttribute('aria-valuemax',items.length);document.querySelector('.progress').setAttribute('aria-valuenow',index)}
function result(){const data=scoreAnswers(answers,items),profile=typeNotes[data.type];if(!profile)throw Error('偏好结果不完整');show('quiz-result');$('quiz-counter').textContent='测试完成';$('result-type').textContent=data.type;$('result-title').textContent=profile[0];$('result-description').textContent=profile[1]+' 每个人都会随着情境变化，类型只是一种探索视角。';const box=$('dimensions');box.replaceChildren();for(const d of data.dimensions){const wrap=document.createElement('div'),title=document.createElement('strong'),note=document.createElement('p');const names=dimensionNames[d.pair],side=d.letter===d.pair[0]?0:1;title.textContent=`偏向${names[side]}（${d.letter}）`;note.textContent=dimensionNotes[d.pair][side];wrap.append(title,document.createTextNode(`${names[0]} ${d.first} · ${names[1]} ${d.second}`),note);box.append(wrap)}}
function answer(n){answers[index]=n;
 if(index===baseItems.length-1){const baseAnswers=answers.slice(0,baseItems.length);const ties=scoreAnswers(baseAnswers,baseItems).dimensions.filter(d=>d.letter==='X');items=[...baseItems,...ties.map(d=>tieQuestions[d.pair])];answers=[...baseAnswers,...Array(ties.length).fill(null)]}
 if(index===items.length-1)result();else{index++;question()}}
function begin(long){baseItems=long?[...questions,...extraQuestions]:questions;items=baseItems;answers=Array(items.length).fill(null);index=0;question();document.querySelector('.quiz-panel').scrollIntoView({behavior:'smooth',block:'start'})}
$('quiz-short').addEventListener('click',()=>begin(false));$('quiz-long').addEventListener('click',()=>begin(true));
$('answer-a').addEventListener('click',()=>answer(0));$('answer-b').addEventListener('click',()=>answer(1));
$('quiz-back').addEventListener('click',()=>{if(index>0){index--;question()}});
$('quiz-restart').addEventListener('click',()=>{answers=[];index=0;$('quiz-counter').textContent='准备开始';show('quiz-welcome')});

