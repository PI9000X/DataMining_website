'use strict';
(() => {
 const $=id=>document.getElementById(id), controls=['country','crop','year','model'].map(x=>$('demo-'+x));
 const [country,crop,year,model]=controls, cache=new Map();let data=null,study='global',generation=0;
 const fixed=x=>Number(x).toFixed(4),create=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 const status=(text,error=false)=>{$('demo-status').textContent=text;$('demo-status').classList.toggle('error',error);};
 const options=(select,items,preferred)=>{select.replaceChildren();items.forEach(([value,label])=>{const o=create('option',label);o.value=String(value);select.append(o);});select.value=items.some(x=>String(x[0])===String(preferred))?String(preferred):String(items[0]?.[0]??'');select.disabled=items.length===0;};
 const rows=()=>data.rows.filter(r=>r[0]===country.value&&r[1]===crop.value);
 const clear=()=>{$('prediction-output').hidden=true;$('yield-chart').replaceChildren();$('observation-models').replaceChildren();};
 function years(preferred){options(year,rows().map(r=>[r[2],r[2]]),preferred);}
 function crops(preferred){options(crop,[...new Set(data.rows.filter(r=>r[0]===country.value).map(r=>r[1]))].sort().map(c=>[c,c[0].toUpperCase()+c.slice(1)]),preferred);years();}
 function chart(actual,predicted,label){
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 640 180');svg.setAttribute('role','img');svg.setAttribute('aria-label',`Actual yield ${fixed(actual)} and ${label} yield ${fixed(predicted)} tonnes per hectare`);
  const low=Math.min(0,actual,predicted),high=Math.max(0,actual,predicted),span=high-low||1,scale=x=>160+(x-low)/span*425;
  function part(tag,attrs,text){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));if(text!==undefined)e.textContent=text;svg.append(e);}
  part('line',{x1:scale(0),y1:20,x2:scale(0),y2:145,stroke:'#66776f','stroke-width':1});
  [[actual,35,'Actual','#264e3c'],[predicted,95,'Predicted','#8a6b18']].forEach(([value,y,title,color])=>{part('text',{x:12,y:y+18,fill:'#19332c','font-size':17},title);part('rect',{x:Math.min(scale(0),scale(value)),y,width:Math.max(Math.abs(scale(value)-scale(0)),1),height:26,fill:color});part('text',{x:scale(value),y:y-8,'text-anchor':value>=0?'end':'start',fill:'#19332c','font-size':14},fixed(value)+' t/ha');});
  part('text',{x:scale(0),y:169,'text-anchor':'middle',fill:'#19332c','font-size':13},'0');$('yield-chart').replaceChildren(svg);
 }
 function render(){
  clear();if(!data)return;
  const matches=rows().filter(r=>String(r[2])===year.value),m=data.models.find(m=>m.id===model.value);
  if(matches.length!==1||!m){status('No saved prediction exists for this exact selection. Choose an available country, crop, year and model; no other observation has been substituted.',true);return;}
  const r=matches[0],actual=r[4],predicted=r[m.column],error=Math.abs(predicted-actual),period=data.windows[r[3]];
  if(!Number.isFinite(predicted)||!period||r[2]<period[0]||r[2]>period[1]){status('The saved observation failed its value or validation-period check. No prediction is displayed.',true);return;}
  const label=`${data.countries[r[0]]} (${r[0]}) · ${r[1]} · ${r[2]} · validation ${period[0]}–${period[1]}`;
  $('observation-label').textContent=label;$('actual-yield').textContent=fixed(actual);$('predicted-yield').textContent=fixed(predicted);$('absolute-error').textContent=fixed(error);chart(actual,predicted,m.label);
  $('result-explanation').textContent=`${m.label} ${predicted>actual?'overestimated':predicted<actual?'underestimated':'exactly matched'} this observed yield${predicted===actual?'':` by ${fixed(error)} t/ha`}. The earlier five-year yield reference was ${fixed(r[7])} t/ha. ${predicted<0?'The negative saved yield is not physically plausible; it is retained as a model limitation. ':''}This one example does not establish the model’s reliability.`;
  const details=$('reference-details');details.replaceChildren();[['Observation key',`${r[0]}|${r[1]}|${r[2]}`],['Saved model ID',m.id],['Earlier five-year mean',fixed(r[7])+' t/ha'],['Earlier full-history trend',fixed(r[5])+' t/ha'],['Historical scale S',fixed(r[6])+' t/ha'],['Actual normalized deviation',fixed(100*(actual-r[5])/r[6])+' points'],['Predicted normalized deviation',fixed(100*(predicted-r[5])/r[6])+' points']].forEach(([k,v])=>details.append(create('dt',k),create('dd',v)));
  const body=$('observation-models');data.models.forEach(item=>{const tr=create('tr');if(item.id===m.id)tr.classList.add('selected');const th=create('th',item.label);th.scope='row';tr.append(th,create('td',fixed(r[item.column])),create('td',fixed(Math.abs(r[item.column]-actual))),create('td',fixed(100*(r[item.column]-r[5])/r[6])));body.append(tr);});
  $('observation-caption').textContent=label+' · identical actual yield/reference for every method';$('prediction-output').hidden=false;status('Showing saved observation: '+label+'.');
 }
 function performance(){
  $('study-title').textContent=data.experiment+' historical validation';
  $('study-description').textContent=`${data.n.toLocaleString('en-US')} crop observations, ${Object.keys(data.countries).length} countries/territories and ${data.countryYears.toLocaleString('en-US')} distinct national country-years, 1996–2015. ${data.cohort}.`;
  $('metrics-description').textContent='These are whole-study saved scores on identical eligible observations, not scores for the currently selected country or year. Primary errors use historical-yield-scale points; the last column uses t/ha.';
  $('metrics-caption').textContent=`${data.experiment} · ${data.n.toLocaleString('en-US')} common observations · 1996–2015 · three chronological validation periods`;
  const body=$('demo-metrics');body.replaceChildren();data.models.forEach(m=>{const tr=create('tr'),th=create('th',m.label);th.scope='row';tr.append(th,create('td',String(data.n)),...['mae','rmse','r2'].map(k=>create('td',fixed(m.normalized[k]))),create('td',fixed(m.raw.mae)));body.append(tr);});
  $('study-limitations').textContent=study==='global'?'Global V3 reuses the selected V2 prediction setup and previously examined validation windows. The no-climate forest has the lowest aggregate MAE among these four approaches; annual climate adds no consistent gain. This is retrospective evaluation, not independent confirmation or causal evidence.':'Secondary case study only: five countries, rice and maize, 194 crop rows but 97 shared national country-years. Wheat is excluded from this comparison. Ridge with fertilizer has the lowest observed aggregate MAE, but its incremental gain depends heavily on Vietnam and the earliest period; it was not consistently better across countries or periods. Do not rank these scores against the global sample.';
 }
 async function load(next){
  study=next;const ticket=++generation;data=null;clear();controls.forEach(e=>e.disabled=true);$('retry').hidden=true;$('demo-metrics').replaceChildren();$('study-title').textContent=next==='global'?'Global V3 historical validation':'Regional rice/maize historical validation';$('study-description').textContent='Loading the selected saved study…';$('metrics-description').textContent='';status('Loading saved historical data…');
  for(const key of ['global','regional']){const tab=$('tab-'+key);tab.setAttribute('aria-selected',String(key===study));tab.tabIndex=key===study?0:-1;}$('explorer').setAttribute('aria-labelledby','tab-'+study);
  try{
   if(!cache.has(next)){const response=await fetch(next==='global'?'assets/demo/global-v3.json':'assets/demo/regional-rice-maize.json');if(!response.ok)throw new Error('HTTP '+response.status);const value=await response.json();if(value.schema!==1||!Array.isArray(value.rows)||value.rows.length!==value.n||!value.models.length)throw new Error('Unsupported saved-data schema');cache.set(next,value);}
   if(ticket!==generation)return;data=cache.get(next);performance();
   const countries=Object.entries(data.countries).sort((a,b)=>a[1].localeCompare(b[1]));options(country,countries.map(([code,name])=>[code,name+' ('+code+')']),'THA');crops('rice');options(model,data.models.map(m=>[m.id,m.label]),next==='global'?'B_no_climate':'R_original_forest_cc');render();
  }catch(e){if(ticket!==generation)return;data=null;clear();$('study-description').textContent='Saved data could not be loaded.';status('Could not load the saved prediction file. Start the local HTTP preview or check the deployed JSON path, then retry. No illustrative values are substituted. '+e.message,true);$('retry').hidden=false;}
 }
 country.addEventListener('change',()=>{if(data){crops();render();}});crop.addEventListener('change',()=>{if(data){years();render();}});year.addEventListener('change',render);model.addEventListener('change',render);$('retry').addEventListener('click',()=>load(study));
 for(const key of ['global','regional']){const tab=$('tab-'+key);tab.addEventListener('click',()=>load(key));tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const target=e.key==='Home'?'global':e.key==='End'?'regional':key==='global'?'regional':'global';$('tab-'+target).focus();load(target);}});}
 load('global');
})();
