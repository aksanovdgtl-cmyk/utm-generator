
(function(){
  'use strict';
  const root=document.getElementById('ad-utm-page');
  if(!root)return;

  const templates={
    google:{source:'google',medium:'cpc'},
    yandex:{source:'yandex',medium:'cpc'},
    meta:{source:'meta',medium:'paid_social'},
    telegram:{source:'telegram',medium:'paid_social'},
    vk:{source:'vk',medium:'paid_social'},
    tiktok:{source:'tiktok',medium:'paid_social'},
    linkedin:{source:'linkedin',medium:'paid_social'},
    microsoft:{source:'bing',medium:'cpc'},
    email:{source:'newsletter',medium:'email'},
    'telegram-post':{source:'telegram',medium:'social'},
    youtube:{source:'youtube',medium:'video'},
    partner:{source:'partner',medium:'referral'},
    qr:{source:'offline',medium:'qr'},
    custom:{source:'',medium:''}
  };
  const dynamicPresets={
    google:{
      title:'Автоподстановки Google Ads',
      note:'Параметры ValueTrack заменяются после клика. Скопируйте параметры в Final URL suffix или готовый шаблон с {lpurl}.',
      source:'google',medium:'cpc',campaign:'{campaignid}',id:'{campaignid}',content:'{creative}.{network}.{device}.{matchtype}.{targetid}',term:'{keyword}',
      macros:[
        ['{campaignid}','ID кампании'],['{adgroupid}','ID группы объявлений'],['{creative}','ID объявления'],['{keyword}','Ключевая фраза'],['{matchtype}','Тип соответствия'],['{targetid}','ID цели или таргетинга'],['{device}','Тип устройства'],['{network}','Рекламная сеть'],['{placement}','Площадка КМС'],['{loc_physical_ms}','Фактическая геолокация'],['{loc_interest_ms}','География интереса'],['{feeditemid}','ID элемента фида'],['{extensionid}','ID расширения']
      ]
    },
    yandex:{
      title:'Автоподстановки Яндекс Директа',
      note:'Динамические параметры заменяются при клике. Скопируйте строку без адреса в параметры ссылки объявления или кампании.',
      source:'yandex',medium:'cpc',campaign:'{campaign_name_lat}.{campaign_id}',id:'{campaign_id}',content:'{ad_id}.{source_type}.{position_type}.{position}.{device_type}',term:'{keyword}',
      macros:[
        ['{campaign_id}','ID кампании'],['{campaign_name_lat}','Название кампании латиницей'],['{campaign_type}','Тип кампании'],['{ad_id}','ID объявления'],['{creative_id}','ID креатива'],['{gbid}','ID группы объявлений'],['{keyword}','Ключевая фраза'],['{phrase_id}','ID ключевой фразы'],['{matched_keyword}','Подобранная фраза'],['{match_type}','Тип соответствия'],['{adtarget_id}','ID условия показа'],['{retargeting_id}','ID условия ретаргетинга'],['{device_type}','Тип устройства'],['{position}','Позиция показа'],['{position_type}','Тип блока'],['{source}','Площадка показа'],['{source_type}','Тип площадки'],['{region_id}','ID региона'],['{region_name}','Название региона'],['{yclid}','Идентификатор клика']
      ]
    }
  };
  const defaults={template:'google',url:'https://example.com/landing',campaign:'brand-search',separator:'-',normalize:true,preserve:true};
  const translit={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
  const fields={
    template:root.querySelector('#utm-template'),dynamicPlatform:root.querySelector('#utm-dynamic-platform'),url:root.querySelector('#landing-url'),source:root.querySelector('#utm-source'),medium:root.querySelector('#utm-medium'),campaign:root.querySelector('#utm-campaign'),id:root.querySelector('#utm-id'),content:root.querySelector('#utm-content'),term:root.querySelector('#utm-term'),separator:root.querySelector('#utm-separator'),normalize:root.querySelector('#utm-normalize'),preserve:root.querySelector('#utm-preserve')
  };
  const utmKeys=['source','medium','campaign','id','content','term'];
  const modeButtons=root.querySelectorAll('.mode-button');
  const staticTemplateField=root.querySelector('#static-template-field');
  const dynamicPlatformField=root.querySelector('#dynamic-platform-field');
  const platformNote=root.querySelector('#utm-platform-note');
  const macroLibrary=root.querySelector('#utm-macro-library');
  const macroTitle=root.querySelector('#utm-macro-title');
  const macroGrid=root.querySelector('#utm-macro-grid');
  const macroDescriptions=root.querySelector('#utm-macro-descriptions');
  const macroTarget=root.querySelector('#utm-macro-target');
  const resultTitle=root.querySelector('#utm-result-title');
  const result=root.querySelector('#utm-result');
  const suffixResult=root.querySelector('#utm-suffix');
  const suffixHint=root.querySelector('#utm-suffix-hint');
  const trackingResult=root.querySelector('#utm-tracking');
  const trackingBlock=root.querySelector('#utm-tracking-block');
  const status=root.querySelector('#utm-status');
  const lengthNode=root.querySelector('#utm-length');
  const nameNode=root.querySelector('#utm-name');
  const parameterList=root.querySelector('#utm-parameter-list');
  const copyButton=root.querySelector('#utm-copy');
  const copySuffixButton=root.querySelector('#utm-copy-suffix');
  const copyTrackingButton=root.querySelector('#utm-copy-tracking');
  const downloadButton=root.querySelector('#utm-download');
  const resetButton=root.querySelector('#utm-reset');
  let mode='static';
  let activeField='content';
  let currentData=null;

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char];});
  }

  function normalizeLiteral(value,separator){
    const safeSeparator=separator==='_'?'_':'-';
    const text=String(value||'').toLowerCase().replace(/[а-я]/g,function(letter){return Object.prototype.hasOwnProperty.call(translit,letter)?translit[letter]:letter;});
    return text
      .replace(/[\s_-]+/g,safeSeparator)
      .replace(/[^a-z0-9._-]+/g,'')
      .replace(new RegExp('\\'+safeSeparator+'{2,}','g'),safeSeparator)
      .replace(new RegExp('^\\'+safeSeparator+'|\\'+safeSeparator+'$','g'),'');
  }

  function normalizeValue(value,separator){
    const macros=[];
    const protectedValue=String(value||'').trim().replace(/\{[^{}]+\}/g,function(macro){
      macros.push(macro);
      return 'admacrotoken'+(macros.length-1)+'x';
    });
    let normalized=normalizeLiteral(protectedValue,separator);
    macros.forEach(function(macro,index){normalized=normalized.replace('admacrotoken'+index+'x',macro);});
    return normalized;
  }

  function readValue(key){
    const value=fields[key].value.trim();
    return fields.normalize.checked?normalizeValue(value,fields.separator.value):value;
  }

  function readable(value){return String(value||'').replace(/%7B/gi,'{').replace(/%7D/gi,'}');}
  function setInvalid(input,invalid){input.setAttribute('aria-invalid',String(invalid));}

  function showError(message){
    status.textContent=message;
    status.className='status error';
    result.value='';
    suffixResult.value='';
    trackingResult.value='';
    lengthNode.textContent='';
    nameNode.textContent='-';
    parameterList.innerHTML='';
    currentData=null;
    [copyButton,copySuffixButton,copyTrackingButton,downloadButton].forEach(function(button){button.disabled=true;});
  }

  function build(){
    const rawUrl=fields.url.value.trim();
    const source=readValue('source');
    const medium=readValue('medium');
    const campaign=readValue('campaign');
    setInvalid(fields.url,!rawUrl);
    setInvalid(fields.source,!source);
    setInvalid(fields.medium,!medium);
    setInvalid(fields.campaign,!campaign);
    if(!rawUrl||!source||!medium||!campaign){showError('Заполните адрес страницы и три обязательные UTM-метки.');return;}

    let candidate=rawUrl;
    if(!/^https?:\/\//i.test(candidate))candidate='https://'+candidate;
    let url;
    try{url=new URL(candidate);}catch(error){setInvalid(fields.url,true);showError('Проверьте адрес страницы. Пример: https://example.com/landing');return;}
    if(!/^https?:$/.test(url.protocol)){setInvalid(fields.url,true);showError('Используйте адрес с протоколом https или http.');return;}
    setInvalid(fields.url,false);
    const hash=url.hash;
    url.hash='';
    if(!fields.preserve.checked)url.search='';

    const params={utm_source:source,utm_medium:medium,utm_campaign:campaign,utm_id:readValue('id'),utm_content:readValue('content'),utm_term:readValue('term')};
    const utmParams=new URLSearchParams();
    Object.keys(params).forEach(function(key){
      if(params[key]){url.searchParams.set(key,params[key]);utmParams.set(key,params[key]);}
      else url.searchParams.delete(key);
    });
    url.hash=hash;
    const fullUrl=readable(url.toString());
    const suffix=readable(utmParams.toString());
    const isGoogleDynamic=mode==='dynamic'&&fields.dynamicPlatform.value==='google';
    const trackingTemplate=isGoogleDynamic?'{lpurl}?'+suffix:'';
    const campaignName=[source,medium,campaign].filter(Boolean).join(fields.separator.value);

    result.value=fullUrl;
    suffixResult.value=suffix;
    trackingResult.value=trackingTemplate;
    suffixHint.textContent=isGoogleDynamic?'Final URL suffix':mode==='dynamic'?'параметры ссылки':'для настроек канала';
    trackingBlock.hidden=!isGoogleDynamic;
    copyTrackingButton.hidden=!isGoogleDynamic;
    lengthNode.textContent=fullUrl.length+' симв.';
    nameNode.textContent=campaignName;
    status.textContent=mode==='dynamic'?'Динамический шаблон готов. Макросы заменит рекламная система после клика.':'Ссылка готова.';
    status.className='status';
    parameterList.innerHTML=Object.keys(params).filter(function(key){return params[key];}).map(function(key){return '<li><code>'+key+'</code><span>'+escapeHtml(params[key])+'</span></li>';}).join('');
    currentData={mode:mode,platform:mode==='dynamic'?fields.dynamicPlatform.value:fields.template.value,base_url:rawUrl,utm_source:source,utm_medium:medium,utm_campaign:campaign,utm_id:params.utm_id,utm_content:params.utm_content,utm_term:params.utm_term,campaign_name:campaignName,url_suffix:suffix,tracking_template:trackingTemplate,full_url:fullUrl};
    [copyButton,copySuffixButton,downloadButton].forEach(function(button){button.disabled=false;});
    copyTrackingButton.disabled=!isGoogleDynamic;
  }

  function applyTemplate(){
    const selected=templates[fields.template.value];
    if(!selected)return;
    fields.source.value=selected.source;
    fields.medium.value=selected.medium;
    build();
  }

  function renderMacros(){
    const preset=dynamicPresets[fields.dynamicPlatform.value];
    macroTitle.textContent=preset.title;
    platformNote.textContent=preset.note;
    macroGrid.innerHTML=preset.macros.map(function(item){return '<button class="macro-chip" type="button" data-macro="'+escapeHtml(item[0])+'" title="'+escapeHtml(item[1])+'">'+escapeHtml(item[0])+'</button>';}).join('');
    macroDescriptions.innerHTML=preset.macros.map(function(item){return '<div><code>'+escapeHtml(item[0])+'</code><span>'+escapeHtml(item[1])+'</span></div>';}).join('');
    macroGrid.querySelectorAll('.macro-chip').forEach(function(button){
      button.addEventListener('click',function(){insertMacro(button.getAttribute('data-macro'));});
    });
  }

  function applyDynamicPreset(){
    const preset=dynamicPresets[fields.dynamicPlatform.value];
    if(!preset)return;
    fields.source.value=preset.source;
    fields.medium.value=preset.medium;
    fields.campaign.value=preset.campaign;
    fields.id.value=preset.id;
    fields.content.value=preset.content;
    fields.term.value=preset.term;
    renderMacros();
    build();
  }

  function insertMacro(macro){
    const input=fields[activeField]||fields.content;
    const start=typeof input.selectionStart==='number'?input.selectionStart:input.value.length;
    const end=typeof input.selectionEnd==='number'?input.selectionEnd:start;
    const before=input.value.slice(0,start);
    const after=input.value.slice(end);
    const joiner=before&&start===input.value.length&&!/[._-]$/.test(before)?'.':'';
    input.value=before+joiner+macro+after;
    const cursor=(before+joiner+macro).length;
    input.focus();
    input.setSelectionRange(cursor,cursor);
    build();
  }

  function setMode(nextMode){
    mode=nextMode==='dynamic'?'dynamic':'static';
    modeButtons.forEach(function(button){
      const active=button.getAttribute('data-mode')===mode;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    staticTemplateField.hidden=mode!=='static';
    dynamicPlatformField.hidden=mode!=='dynamic';
    macroLibrary.hidden=mode!=='dynamic';
    resultTitle.textContent=mode==='dynamic'?'Динамический шаблон':'Готовая ссылка';
    if(mode==='dynamic')applyDynamicPreset();else applyTemplate();
  }

  async function copyText(textValue,fallback,successMessage){
    if(!textValue)return;
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(textValue);
      else{fallback.focus();fallback.select();document.execCommand('copy');}
      status.textContent=successMessage;
      status.className='status';
    }catch(error){status.textContent='Не удалось скопировать. Выделите значение вручную.';status.className='status error';}
  }

  function csvCell(value){return '"'+String(value||'').replace(/"/g,'""')+'"';}
  function downloadCsv(){
    if(!currentData)return;
    const columns=['mode','platform','base_url','utm_source','utm_medium','utm_campaign','utm_id','utm_content','utm_term','campaign_name','url_suffix','tracking_template','full_url'];
    const csv='\uFEFF'+columns.join(',')+'\r\n'+columns.map(function(key){return csvCell(currentData[key]);}).join(',');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    const blobUrl=URL.createObjectURL(blob);
    const anchor=document.createElement('a');
    anchor.href=blobUrl;
    anchor.download='utm-'+mode+'-'+new Date().toISOString().slice(0,10)+'.csv';
    document.body.appendChild(anchor);anchor.click();anchor.remove();
    setTimeout(function(){URL.revokeObjectURL(blobUrl);},1200);
    status.textContent='CSV готов.';
    status.className='status';
  }

  function reset(){
    fields.url.value=defaults.url;
    fields.separator.value=defaults.separator;
    fields.normalize.checked=defaults.normalize;
    fields.preserve.checked=defaults.preserve;
    if(mode==='dynamic')applyDynamicPreset();
    else{
      fields.template.value=defaults.template;
      fields.campaign.value=defaults.campaign;
      fields.id.value='';fields.content.value='';fields.term.value='';
      applyTemplate();
    }
    status.textContent='Примерные значения восстановлены.';
  }

  modeButtons.forEach(function(button){button.addEventListener('click',function(){setMode(button.getAttribute('data-mode'));});});
  fields.template.addEventListener('change',applyTemplate);
  fields.dynamicPlatform.addEventListener('change',applyDynamicPreset);
  ['url','source','medium','campaign','id','content','term'].forEach(function(key){fields[key].addEventListener('input',build);});
  ['separator','normalize','preserve'].forEach(function(key){fields[key].addEventListener('change',build);});
  utmKeys.forEach(function(key){
    fields[key].addEventListener('focus',function(){activeField=key;macroTarget.textContent='utm_'+key;});
  });
  copyButton.addEventListener('click',function(){if(currentData)copyText(currentData.full_url,result,'Ссылка скопирована.');});
  copySuffixButton.addEventListener('click',function(){if(currentData)copyText(currentData.url_suffix,suffixResult,'Параметры скопированы.');});
  copyTrackingButton.addEventListener('click',function(){if(currentData)copyText(currentData.tracking_template,trackingResult,'Шаблон отслеживания скопирован.');});
  downloadButton.addEventListener('click',downloadCsv);
  resetButton.addEventListener('click',reset);
  setMode('static');
})();
