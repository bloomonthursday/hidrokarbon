
function goTo(id){
  const pages = {beranda:'index.html', materi:'materi.html', 'zona-ssi':'zona-ssi.html', ar:'ar-molekul.html', kalkulator:'kalkulator.html', proyek:'proyek.html', kuis:'kuis.html'};
  if(pages[id]) window.location.href = pages[id];
}

/* ============================================================
   COUNT-UP STATS
============================================================ */
function countUp(el, target, suffix, duration, decimals=0){
  const start=performance.now();
  const formatter=new Intl.NumberFormat('id-ID',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
  function tick(now){
    const p=Math.min((now-start)/duration,1);
    el.textContent = formatter.format(target*p) + suffix;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
[['statA',33837,' Hektare',0],['statB',3.61,' Juta KL',2],['statC',141926,' Ton',0]].forEach(([id,target,suffix,decimals])=>{
  const el=document.getElementById(id);
  if(el) countUp(el,target,suffix,1400,decimals);
});

/* ============================================================
   MATERI: isomer toggle + mini quiz
============================================================ */
function switchTab(btn, paneId){
  const wrap = btn.closest('.tab-wrap');
  if(!wrap) return;
  wrap.querySelectorAll('.tab-toggle button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  wrap.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  const pane = wrap.querySelector('#'+paneId);
  if(pane) pane.classList.add('active');
}

/* ============================================================
   MESIN MODEL MOLEKUL 3D (Three.js, semua aset tertanam di file ini)
   Geometri molekul dihitung dengan RDKit + medan gaya MMFF94.
============================================================ */
const MOL3D = {"metana":{"a":[{"e":"C","p":[0.0,0.0,-0.0]},{"e":"H","p":[-0.499,-0.896,-0.375]},{"e":"H","p":[1.07,-0.065,-0.209]},{"e":"H","p":[-0.414,0.881,-0.495]},{"e":"H","p":[-0.157,0.08,1.078]}],"b":[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},"etana":{"a":[{"e":"C","p":[-0.756,-0.0,-0.0]},{"e":"C","p":[0.756,0.0,-0.0]},{"e":"H","p":[-1.14,-0.743,-0.705]},{"e":"H","p":[-1.14,-0.239,0.996]},{"e":"H","p":[-1.14,0.982,-0.291]},{"e":"H","p":[1.14,-0.982,0.291]},{"e":"H","p":[1.14,0.743,0.705]},{"e":"H","p":[1.14,0.239,-0.996]}],"b":[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]]},"propana":{"a":[{"e":"C","p":[-1.257,-0.234,0.0]},{"e":"C","p":[-0.0,0.62,0.0]},{"e":"C","p":[1.257,-0.234,-0.0]},{"e":"H","p":[-1.297,-0.874,-0.887]},{"e":"H","p":[-1.297,-0.874,0.887]},{"e":"H","p":[-2.147,0.403,-0.0]},{"e":"H","p":[0.0,1.269,0.882]},{"e":"H","p":[-0.0,1.269,-0.882]},{"e":"H","p":[1.297,-0.874,-0.887]},{"e":"H","p":[2.147,0.403,-0.0]},{"e":"H","p":[1.297,-0.874,0.887]}],"b":[[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[1,7,1],[2,8,1],[2,9,1],[2,10,1]]},"butana":{"a":[{"e":"C","p":[-1.933,0.096,-0.0]},{"e":"C","p":[-0.548,-0.532,-0.0]},{"e":"C","p":[0.548,0.532,-0.0]},{"e":"C","p":[1.933,-0.096,-0.0]},{"e":"H","p":[-2.081,0.72,-0.887]},{"e":"H","p":[-2.702,-0.683,0.0]},{"e":"H","p":[-2.081,0.72,0.887]},{"e":"H","p":[-0.444,-1.174,0.882]},{"e":"H","p":[-0.444,-1.174,-0.882]},{"e":"H","p":[0.444,1.174,-0.882]},{"e":"H","p":[0.444,1.174,0.882]},{"e":"H","p":[2.081,-0.72,0.887]},{"e":"H","p":[2.702,0.683,0.0]},{"e":"H","p":[2.081,-0.72,-0.887]}],"b":[[0,1,1],[1,2,1],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[1,8,1],[2,9,1],[2,10,1],[3,11,1],[3,12,1],[3,13,1]]},"isobutana":{"a":[{"e":"C","p":[-0.517,-1.354,0.07]},{"e":"C","p":[0.0,0.0,-0.41]},{"e":"C","p":[-0.914,1.125,0.07]},{"e":"C","p":[1.431,0.229,0.07]},{"e":"H","p":[-1.533,-1.534,-0.297]},{"e":"H","p":[0.12,-2.166,-0.297]},{"e":"H","p":[-0.538,-1.408,1.164]},{"e":"H","p":[-0.0,-0.0,-1.507]},{"e":"H","p":[-1.936,0.979,-0.297]},{"e":"H","p":[-0.95,1.17,1.164]},{"e":"H","p":[-0.562,2.095,-0.297]},{"e":"H","p":[1.816,1.187,-0.297]},{"e":"H","p":[1.488,0.238,1.164]},{"e":"H","p":[2.095,-0.561,-0.297]}],"b":[[0,1,1],[1,2,1],[1,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[2,8,1],[2,9,1],[2,10,1],[3,11,1],[3,12,1],[3,13,1]]},"heptana":{"a":[{"e":"C","p":[-3.673,-0.057,0.152]},{"e":"C","p":[-2.299,-0.559,-0.264]},{"e":"C","p":[-1.198,0.418,0.15]},{"e":"C","p":[0.183,-0.09,-0.27]},{"e":"C","p":[1.283,0.887,0.148]},{"e":"C","p":[2.675,0.479,-0.341]},{"e":"C","p":[3.184,-0.81,0.284]},{"e":"H","p":[-4.445,-0.771,-0.153]},{"e":"H","p":[-3.897,0.906,-0.316]},{"e":"H","p":[-3.734,0.065,1.238]},{"e":"H","p":[-2.12,-1.538,0.195]},{"e":"H","p":[-2.282,-0.701,-1.35]},{"e":"H","p":[-1.385,1.397,-0.308]},{"e":"H","p":[-1.222,0.56,1.237]},{"e":"H","p":[0.358,-1.071,0.187]},{"e":"H","p":[0.208,-0.229,-1.358]},{"e":"H","p":[1.055,1.88,-0.261]},{"e":"H","p":[1.293,0.99,1.24]},{"e":"H","p":[2.673,0.38,-1.433]},{"e":"H","p":[3.378,1.285,-0.098]},{"e":"H","p":[2.585,-1.671,-0.027]},{"e":"H","p":[4.217,-0.997,-0.028]},{"e":"H","p":[3.166,-0.752,1.377]}],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[0,7,1],[0,8,1],[0,9,1],[1,10,1],[1,11,1],[2,12,1],[2,13,1],[3,14,1],[3,15,1],[4,16,1],[4,17,1],[5,18,1],[5,19,1],[6,20,1],[6,21,1],[6,22,1]]},"oktana":{"a":[{"e":"C","p":[-3.552,0.63,-0.67]},{"e":"C","p":[-3.09,-0.455,0.29]},{"e":"C","p":[-1.589,-0.747,0.205]},{"e":"C","p":[-0.72,0.437,0.638]},{"e":"C","p":[0.766,0.084,0.771]},{"e":"C","p":[1.426,-0.27,-0.564]},{"e":"C","p":[2.912,-0.615,-0.431]},{"e":"C","p":[3.777,0.564,-0.013]},{"e":"H","p":[-3.123,1.603,-0.412]},{"e":"H","p":[-4.642,0.728,-0.63]},{"e":"H","p":[-3.271,0.389,-1.7]},{"e":"H","p":[-3.637,-1.378,0.062]},{"e":"H","p":[-3.358,-0.174,1.315]},{"e":"H","p":[-1.371,-1.608,0.847]},{"e":"H","p":[-1.341,-1.043,-0.821]},{"e":"H","p":[-1.072,0.801,1.611]},{"e":"H","p":[-0.83,1.266,-0.071]},{"e":"H","p":[0.885,-0.748,1.476]},{"e":"H","p":[1.273,0.949,1.213]},{"e":"H","p":[1.304,0.56,-1.271]},{"e":"H","p":[0.923,-1.138,-1.004]},{"e":"H","p":[3.042,-1.436,0.284]},{"e":"H","p":[3.27,-0.981,-1.401]},{"e":"H","p":[3.547,0.891,1.004]},{"e":"H","p":[4.834,0.28,-0.037]},{"e":"H","p":[3.639,1.412,-0.691]}],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1],[6,7,1],[0,8,1],[0,9,1],[0,10,1],[1,11,1],[1,12,1],[2,13,1],[2,14,1],[3,15,1],[3,16,1],[4,17,1],[4,18,1],[5,19,1],[5,20,1],[6,21,1],[6,22,1],[7,23,1],[7,24,1],[7,25,1]]},"etena":{"a":[{"e":"C","p":[-0.668,-0.0,-0.0]},{"e":"C","p":[0.668,0.0,-0.0]},{"e":"H","p":[-1.228,0.93,-0.0]},{"e":"H","p":[-1.228,-0.93,0.0]},{"e":"H","p":[1.228,0.93,0.0]},{"e":"H","p":[1.228,-0.93,-0.0]}],"b":[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]},"etuna":{"a":[{"e":"C","p":[-0.6,0.0,0.0]},{"e":"C","p":[0.6,0.0,-0.0]},{"e":"H","p":[-1.666,-0.0,-0.0]},{"e":"H","p":[1.666,-0.0,0.0]}],"b":[[0,1,3],[0,2,1],[1,3,1]]},"propena":{"a":[{"e":"C","p":[-1.13,0.117,0.0]},{"e":"C","p":[0.23,-0.501,0.0]},{"e":"C","p":[1.372,0.196,-0.0]},{"e":"H","p":[-1.685,-0.203,-0.887]},{"e":"H","p":[-1.086,1.211,-0.0]},{"e":"H","p":[-1.685,-0.203,0.887]},{"e":"H","p":[0.272,-1.588,-0.0]},{"e":"H","p":[1.379,1.282,0.0]},{"e":"H","p":[2.332,-0.311,-0.0]}],"b":[[0,1,1],[1,2,2],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[2,7,1],[2,8,1]]},"siklopropana":{"a":[{"e":"C","p":[-0.349,-0.794,-0.0]},{"e":"C","p":[0.862,0.095,0.0]},{"e":"C","p":[-0.513,0.699,0.0]},{"e":"H","p":[-0.586,-1.332,-0.911]},{"e":"H","p":[-0.586,-1.332,0.911]},{"e":"H","p":[1.446,0.159,0.911]},{"e":"H","p":[1.446,0.159,-0.911]},{"e":"H","p":[-0.861,1.173,0.911]},{"e":"H","p":[-0.861,1.173,-0.911]}],"b":[[0,1,1],[1,2,1],[2,0,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[2,7,1],[2,8,1]]},"sikloheksana":{"a":[{"e":"C","p":[1.451,-0.139,0.226]},{"e":"C","p":[0.606,-1.326,-0.226]},{"e":"C","p":[-0.846,-1.188,0.226]},{"e":"C","p":[-1.451,0.139,-0.226]},{"e":"C","p":[-0.606,1.326,0.226]},{"e":"C","p":[0.846,1.188,-0.226]},{"e":"H","p":[1.536,-0.147,1.319]},{"e":"H","p":[2.467,-0.236,-0.174]},{"e":"H","p":[0.641,-1.404,-1.319]},{"e":"H","p":[1.029,-2.254,0.174]},{"e":"H","p":[-0.895,-1.257,1.319]},{"e":"H","p":[-1.438,-2.019,-0.174]},{"e":"H","p":[-1.536,0.147,-1.319]},{"e":"H","p":[-2.467,0.236,0.174]},{"e":"H","p":[-0.641,1.404,1.319]},{"e":"H","p":[-1.029,2.254,-0.174]},{"e":"H","p":[0.895,1.257,-1.319]},{"e":"H","p":[1.438,2.019,0.174]}],"b":[[0,1,1],[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,0,1],[0,6,1],[0,7,1],[1,8,1],[1,9,1],[2,10,1],[2,11,1],[3,12,1],[3,13,1],[4,14,1],[4,15,1],[5,16,1],[5,17,1]]},"benzena":{"a":[{"e":"C","p":[1.381,0.198,-0.0]},{"e":"C","p":[0.862,-1.097,-0.0]},{"e":"C","p":[-0.519,-1.295,-0.0]},{"e":"C","p":[-1.381,-0.198,-0.0]},{"e":"C","p":[-0.862,1.097,-0.0]},{"e":"C","p":[0.519,1.295,-0.0]},{"e":"H","p":[2.456,0.353,0.0]},{"e":"H","p":[1.534,-1.951,0.0]},{"e":"H","p":[-0.923,-2.304,0.0]},{"e":"H","p":[-2.456,-0.353,0.0]},{"e":"H","p":[-1.534,1.951,0.0]},{"e":"H","p":[0.923,2.304,0.0]}],"b":[[0,1,1],[1,2,2],[2,3,1],[3,4,2],[4,5,1],[5,0,2],[0,6,1],[1,7,1],[2,8,1],[3,9,1],[4,10,1],[5,11,1]]},"cis2butena":{"a":[{"e":"C","p":[-1.589,0.405,-0.0]},{"e":"C","p":[-0.671,-0.774,-0.0]},{"e":"C","p":[0.671,-0.774,-0.0]},{"e":"C","p":[1.589,0.405,-0.0]},{"e":"H","p":[-2.231,0.372,-0.886]},{"e":"H","p":[-2.231,0.372,0.886]},{"e":"H","p":[-1.067,1.364,0.0]},{"e":"H","p":[-1.174,-1.741,0.0]},{"e":"H","p":[1.174,-1.741,-0.0]},{"e":"H","p":[2.231,0.372,-0.886]},{"e":"H","p":[2.231,0.372,0.886]},{"e":"H","p":[1.067,1.364,-0.0]}],"b":[[0,1,1],[1,2,2],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[2,8,1],[3,9,1],[3,10,1],[3,11,1]]},"trans2butena":{"a":[{"e":"C","p":[-1.949,0.049,0.0]},{"e":"C","p":[-0.528,-0.413,0.0]},{"e":"C","p":[0.528,0.413,0.0]},{"e":"C","p":[1.949,-0.049,0.0]},{"e":"H","p":[-2.465,-0.332,-0.887]},{"e":"H","p":[-2.465,-0.332,0.887]},{"e":"H","p":[-2.03,1.14,-0.0]},{"e":"H","p":[-0.374,-1.49,0.0]},{"e":"H","p":[0.374,1.49,0.0]},{"e":"H","p":[2.03,-1.14,-0.0]},{"e":"H","p":[2.465,0.332,0.887]},{"e":"H","p":[2.465,0.332,-0.887]}],"b":[[0,1,1],[1,2,2],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[2,8,1],[3,9,1],[3,10,1],[3,11,1]]},"butadiena13":{"a":[{"e":"C","p":[-1.831,0.083,-0.0]},{"e":"C","p":[-0.589,-0.415,-0.0]},{"e":"C","p":[0.589,0.415,-0.0]},{"e":"C","p":[1.831,-0.083,-0.0]},{"e":"H","p":[-2.026,1.151,-0.0]},{"e":"H","p":[-2.69,-0.581,0.0]},{"e":"H","p":[-0.452,-1.495,0.0]},{"e":"H","p":[0.452,1.495,-0.0]},{"e":"H","p":[2.026,-1.151,-0.0]},{"e":"H","p":[2.69,0.581,0.0]}],"b":[[0,1,2],[1,2,1],[2,3,2],[0,4,1],[0,5,1],[1,6,1],[2,7,1],[3,8,1],[3,9,1]]},"metilbutana2":{"a":[{"e":"C","p":[-1.755,-0.791,-0.032]},{"e":"C","p":[-0.477,-0.013,-0.357]},{"e":"C","p":[-0.623,1.437,0.107]},{"e":"C","p":[0.736,-0.712,0.281]},{"e":"C","p":[2.07,-0.089,-0.104]},{"e":"H","p":[-1.685,-1.822,-0.395]},{"e":"H","p":[-2.624,-0.328,-0.511]},{"e":"H","p":[-1.938,-0.822,1.047]},{"e":"H","p":[-0.351,-0.013,-1.447]},{"e":"H","p":[-0.691,1.5,1.198]},{"e":"H","p":[-1.527,1.89,-0.314]},{"e":"H","p":[0.225,2.047,-0.218]},{"e":"H","p":[0.642,-0.711,1.373]},{"e":"H","p":[0.749,-1.764,-0.032]},{"e":"H","p":[2.174,0.921,0.303]},{"e":"H","p":[2.182,-0.039,-1.192]},{"e":"H","p":[2.894,-0.691,0.293]}],"b":[[0,1,1],[1,2,1],[1,3,1],[3,4,1],[0,5,1],[0,6,1],[0,7,1],[1,8,1],[2,9,1],[2,10,1],[2,11,1],[3,12,1],[3,13,1],[4,14,1],[4,15,1],[4,16,1]]},"neoheksana":{"a":[{"e":"C","p":[-0.513,-0.875,1.253]},{"e":"C","p":[-0.439,0.012,0.0]},{"e":"C","p":[-1.652,0.962,0.0]},{"e":"C","p":[-0.513,-0.875,-1.253]},{"e":"C","p":[0.85,0.874,0.0]},{"e":"C","p":[2.164,0.102,0.0]},{"e":"H","p":[-1.471,-1.407,1.303]},{"e":"H","p":[0.277,-1.633,1.262]},{"e":"H","p":[-0.419,-0.278,2.167]},{"e":"H","p":[-2.595,0.403,0.0]},{"e":"H","p":[-1.649,1.608,-0.885]},{"e":"H","p":[-1.649,1.608,0.885]},{"e":"H","p":[0.277,-1.633,-1.262]},{"e":"H","p":[-0.419,-0.278,-2.167]},{"e":"H","p":[-1.471,-1.407,-1.303]},{"e":"H","p":[0.844,1.533,-0.878]},{"e":"H","p":[0.844,1.533,0.878]},{"e":"H","p":[2.264,-0.527,0.889]},{"e":"H","p":[3.005,0.804,0.0]},{"e":"H","p":[2.264,-0.527,-0.889]}],"b":[[0,1,1],[1,2,1],[1,3,1],[1,4,1],[4,5,1],[0,6,1],[0,7,1],[0,8,1],[2,9,1],[2,10,1],[2,11,1],[3,12,1],[3,13,1],[3,14,1],[4,15,1],[4,16,1],[5,17,1],[5,18,1],[5,19,1]]},"klorometana":{"a":[{"e":"C","p":[-0.139,-0.0,0.0]},{"e":"Cl","p":[1.628,0.0,-0.0]},{"e":"H","p":[-0.496,-1.018,0.173]},{"e":"H","p":[-0.496,0.359,-0.968]},{"e":"H","p":[-0.496,0.658,0.795]}],"b":[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]}};

const MOLINFO = {
  metana:{n:'Metana', f:'CH₄', geo:'Tetrahedral', ang:'109,5°', hyb:'sp³', callout:'Atom karbon pusat'},
  etana:{n:'Etana', f:'C₂H₆', geo:'Tetrahedral', ang:'109,5°', hyb:'sp³'},
  propana:{n:'Propana', f:'C₃H₈', geo:'Zig-zag', ang:'109,5°', hyb:'sp³'},
  butana:{n:'n-Butana', f:'C₄H₁₀', geo:'Zig-zag', ang:'109,5°', hyb:'sp³'},
  isobutana:{n:'Isobutana', f:'C₄H₁₀', geo:'Bercabang', ang:'109,5°', hyb:'sp³'},
  heptana:{n:'Heptana', f:'C₇H₁₆', geo:'Zig-zag', ang:'109,5°', hyb:'sp³'},
  oktana:{n:'Oktana', f:'C₈H₁₈', geo:'Zig-zag', ang:'109,5°', hyb:'sp³'},
  etena:{n:'Etena', f:'C₂H₄', geo:'Trigonal planar', ang:'120°', hyb:'sp²'},
  etuna:{n:'Etuna', f:'C₂H₂', geo:'Linear', ang:'180°', hyb:'sp'},
  propena:{n:'Propena', f:'C₃H₆', geo:'Trigonal planar', ang:'120°', hyb:'sp²/sp³'},
  siklopropana:{n:'Siklopropana', f:'C₃H₆', geo:'Cincin C₃', ang:'60°', hyb:'sp³'},
  sikloheksana:{n:'Sikloheksana', f:'C₆H₁₂', geo:'Cincin bentuk kursi', ang:'109,5°', hyb:'sp³'},
  benzena:{n:'Benzena', f:'C₆H₆', geo:'Heksagonal planar', ang:'120°', hyb:'sp²'},
  cis2butena:{n:'cis-2-butena', f:'C₄H₈', geo:'Gugus sesisi', ang:'120°', hyb:'sp²'},
  trans2butena:{n:'trans-2-butena', f:'C₄H₈', geo:'Berseberangan', ang:'120°', hyb:'sp²'},
  butadiena13:{n:'1,3-butadiena', f:'C₄H₆', geo:'Planar terkonjugasi', ang:'120°', hyb:'sp²'},
  metilbutana2:{n:'2-metilbutana', f:'C₅H₁₂', geo:'Bercabang', ang:'109,5°', hyb:'sp³'},
  neoheksana:{n:'Neoheksana', f:'C₆H₁₄', geo:'Bercabang', ang:'109,5°', hyb:'sp³', callout:'Atom C kuartener'},
  klorometana:{n:'Klorometana', f:'CH₃Cl', geo:'Tetrahedral', ang:'≈109,5°', hyb:'sp³', callout:'Atom Cl pengganti H'},
};

const MOLSTYLE = {
  U: 3.6,                       /* satuan scene per ångström */
  r: {C:1.22, H:0.74, Cl:1.45},
  badge:{C:'#1e293b', H:'#ffffff', Cl:'#2C6B48'},
  badgeText:{C:'#ffffff', H:'#1e293b', Cl:'#ffffff'},
};

const MOLMAT = {};
function molMaterial(el){
  if(MOLMAT[el]) return MOLMAT[el];
  const color = el==='C' ? 0x334155 : (el==='Cl' ? 0x3f9c63 : 0xf8fafc);
  MOLMAT[el] = new THREE.MeshPhysicalMaterial({
    color, roughness: el==='H'?0.18:0.28, metalness:0.08,
    clearcoat: el==='H'?0.8:0.6, clearcoatRoughness:0.08
  });
  return MOLMAT[el];
}
let BONDMAT = null;
function bondMaterial(){
  if(!BONDMAT) BONDMAT = new THREE.MeshStandardMaterial({color:0xc0c8d0, roughness:0.22, metalness:0.85});
  return BONDMAT;
}

function roundRectPath(ctx,x,y,w,h,r){
  if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); return; }
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

/* --------------------------------------------------------
   Satu viewer = satu <canvas> WebGL + satu <canvas> overlay 2D
-------------------------------------------------------- */
function MolViewer(mount, key, opts){
  opts = opts || {};
  const self = {mount, key, opts, live:false, visible:false, spin:opts.autoRotate!==false};
  let renderer, scene, camera, group, overlay, octx, canvas, ro;
  let rotX = -0.24, rotY = 0.42, dist = 20, atoms = [], focusIdx = -1;
  let drag=false, lx=0, ly=0;

  function buildScene(){
    const data = MOL3D[self.key];
    const U = MOLSTYLE.U;
    scene = new THREE.Scene();
    if(opts.bg !== null){
      const bg = new THREE.Color(opts.bg || 0xf1f5f9);
      scene.background = bg;
    }
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key1 = new THREE.DirectionalLight(0xffffff, 1.3);
    key1.position.set(8,16,12);
    key1.castShadow = true;
    key1.shadow.mapSize.width = 1024; key1.shadow.mapSize.height = 1024;
    key1.shadow.camera.near = 0.5; key1.shadow.camera.far = 90;
    key1.shadow.bias = -0.0006;
    scene.add(key1);
    const fill = new THREE.DirectionalLight(0x94a3b8, 0.5); fill.position.set(-10,6,-8); scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 0.3); top.position.set(0,14,0); scene.add(top);

    group = new THREE.Group();
    scene.add(group);

    atoms = data.a.map(a=>({
      el:a.e,
      pos:new THREE.Vector3(a.p[0]*U, a.p[1]*U, a.p[2]*U),
      r:(MOLSTYLE.r[a.e]||0.8)
    }));

    atoms.forEach(a=>{
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(a.r, 40, 40), molMaterial(a.el));
      mesh.position.copy(a.pos);
      mesh.castShadow = true; mesh.receiveShadow = true;
      group.add(mesh);
      a.mesh = mesh;
    });

    const bgeo = new THREE.CylinderGeometry(0.17, 0.17, 1, 20);
    const up = new THREE.Vector3(0,1,0);
    data.b.forEach(([i,j,order])=>{
      const A = atoms[i].pos, B = atoms[j].pos;
      const dir = new THREE.Vector3().subVectors(B,A);
      const len = dir.length();
      dir.normalize();
      /* arah tegak lurus untuk memisahkan ikatan rangkap */
      let perp = new THREE.Vector3(0,0,1).cross(dir);
      if(perp.lengthSq() < 1e-4) perp = new THREE.Vector3(0,1,0).cross(dir);
      perp.normalize();
      const gap = 0.34;
      const offs = order===1?[0] : order===2?[-gap,gap] : [-gap*1.35,0,gap*1.35];
      offs.forEach(o=>{
        const rod = new THREE.Mesh(bgeo, bondMaterial());
        rod.position.copy(A).add(B).multiplyScalar(0.5).addScaledVector(perp, o);
        rod.scale.set(1, len, 1);
        rod.quaternion.setFromUnitVectors(up, dir);
        rod.castShadow = true; rod.receiveShadow = true;
        group.add(rod);
      });
    });

    /* atom fokus = yang paling banyak tetangganya (untuk busur sudut ikatan) */
    const deg = atoms.map(()=>0);
    const nb = atoms.map(()=>[]);
    data.b.forEach(([i,j])=>{ deg[i]++; deg[j]++; nb[i].push(j); nb[j].push(i); });
    focusIdx = deg.indexOf(Math.max(...deg));
    atoms.forEach((a,i)=> a.nb = nb[i]);

    /* pusat & jari-jari dihitung dari atom (bukan kotak pembatas) supaya molekul tidak terlalu kecil */
    const bb = new THREE.Box3();
    atoms.forEach(a=>bb.expandByPoint(a.pos));
    const center = bb.getCenter(new THREE.Vector3());
    let rad = 0;
    atoms.forEach(a=>{ rad = Math.max(rad, a.pos.distanceTo(center) + a.r); });
    group.position.sub(center);
    self.radius = rad;

    /* lantai bayangan lembut */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.ShadowMaterial({opacity:0.13}));
    ground.material.color = new THREE.Color(0x0f172a);
    ground.rotation.x = -Math.PI/2;
    ground.position.y = -(rad + 1.4);
    ground.receiveShadow = true;
    scene.add(ground);
  }

  function fitCamera(){
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    const aspect = w/h;
    camera.aspect = aspect;
    const vfov = camera.fov * Math.PI/180;
    const hfov = 2*Math.atan(Math.tan(vfov/2)*aspect);
    dist = Math.max(self.radius/Math.tan(vfov/2), self.radius/Math.tan(hfov/2)) * 1.18 + 1.5;
    camera.position.set(0, self.radius*0.18, dist);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
  }

  function resize(){
    const w = mount.clientWidth, h = mount.clientHeight;
    if(!w || !h) return;
    renderer.setSize(w, h, false);
    overlay.width = w * Math.min(window.devicePixelRatio||1, 2);
    overlay.height = h * Math.min(window.devicePixelRatio||1, 2);
    overlay.style.width = w+'px'; overlay.style.height = h+'px';
    fitCamera();
  }

  function project(v){
    const p = v.clone().applyMatrix4(group.matrixWorld).project(camera);
    return {
      x:(p.x*0.5+0.5)*overlay.clientWidth,
      y:(-p.y*0.5+0.5)*overlay.clientHeight,
      z:p.z, visible:p.z < 1
    };
  }

  function drawOverlay(){
    const w = overlay.clientWidth, h = overlay.clientHeight;
    if(!w || !h || !octx) return;
    const dpr = Math.min(window.devicePixelRatio||1, 2);
    octx.setTransform(1,0,0,1,0,0);
    octx.clearRect(0,0,overlay.width,overlay.height);
    octx.scale(dpr,dpr);

    const info = MOLINFO[self.key];
    const compact = w < 260;

    /* kartu judul */
    if(info && opts.header !== false){
      const bw = compact ? Math.min(w-20, 168) : 208, bh = compact ? 38 : 46, bx = 12, by = 12;
      octx.fillStyle = 'rgba(255,255,255,0.9)';
      octx.strokeStyle = 'rgba(203,213,225,0.9)';
      octx.lineWidth = 1;
      roundRectPath(octx, bx, by, bw, bh, 9);
      octx.fill(); octx.stroke();
      octx.textAlign = 'left'; octx.textBaseline = 'alphabetic';
      octx.fillStyle = '#0f172a';
      octx.font = (compact?'600 11px ':'600 13px ')+'"Space Grotesk", system-ui, sans-serif';
      octx.fillText(`${info.n} · ${info.f}`, bx+11, by+(compact?16:20));
      octx.fillStyle = '#64748b';
      octx.font = (compact?'500 9px ':'500 10.5px ')+'"IBM Plex Mono", monospace';
      octx.fillText(`${info.hyb} · sudut ${info.ang}`, bx+11, by+(compact?30:35));
    }

    /* proyeksi semua atom, urut dari yang terjauh */
    const pts = atoms.map((a,i)=>({i, el:a.el, s:project(a.pos), r:a.r}));
    const vfov = camera.fov*Math.PI/180;
    const pxPerUnit = (h/2)/Math.tan(vfov/2)/dist;
    const heavy = atoms.filter(a=>a.el!=='H').length;
    const showH = atoms.length <= 14;
    const sorted = pts.slice().sort((a,b)=> b.s.z - a.s.z);

    /* busur sudut ikatan pada atom pusat */
    const fa = pts[focusIdx];
    if(info && heavy <= 7 && w >= 210 && fa && fa.s.visible){
      const nbs = atoms[focusIdx].nb.map(k=>pts[k]).filter(p=>p.s.visible);
      if(nbs.length >= 2){
        let best=null;
        for(let i=0;i<nbs.length;i++) for(let j=i+1;j<nbs.length;j++){
          const a0=Math.atan2(nbs[i].s.y-fa.s.y, nbs[i].s.x-fa.s.x);
          const a1=Math.atan2(nbs[j].s.y-fa.s.y, nbs[j].s.x-fa.s.x);
          let d=Math.abs(a0-a1); if(d>Math.PI) d=2*Math.PI-d;
          if(!best || d>best.d) best={d, a0, a1};
        }
        if(best && best.d > 0.5){
          const arcR = Math.min(38, Math.max(22, atoms[focusIdx].r*pxPerUnit*1.9));
          let lo=Math.min(best.a0,best.a1), hi=Math.max(best.a0,best.a1);
          if(hi-lo > Math.PI){ const t=lo; lo=hi; hi=t+2*Math.PI; }
          octx.strokeStyle='rgba(99,102,241,0.65)'; octx.lineWidth=1.5;
          octx.setLineDash([3,3]); octx.beginPath();
          octx.arc(fa.s.x, fa.s.y, arcR, lo, hi); octx.stroke(); octx.setLineDash([]);
          const mid=(lo+hi)/2;
          const px=fa.s.x+Math.cos(mid)*(arcR+14), py=fa.s.y+Math.sin(mid)*(arcR+14);
          if(px>34 && px<w-34 && py>26 && py<h-16){
            octx.fillStyle='rgba(79,70,229,0.92)';
            roundRectPath(octx, px-24, py-9, 48, 18, 9); octx.fill();
            octx.fillStyle='#fff'; octx.textAlign='center'; octx.textBaseline='middle';
            octx.font='600 10px "IBM Plex Mono", monospace';
            octx.fillText(info.ang, px, py+0.5);
          }
        }
      }
    }

    /* lencana huruf pada tiap atom */
    sorted.forEach(p=>{
      if(!p.s.visible) return;
      if(p.el==='H' && !showH) return;
      const rpx = Math.max(6.5, Math.min(15, p.r*pxPerUnit*0.8));
      if(p.r*pxPerUnit*0.8 < 6.5) return;
      octx.beginPath(); octx.arc(p.s.x, p.s.y, rpx, 0, Math.PI*2);
      octx.fillStyle = MOLSTYLE.badge[p.el] || '#64748b';
      octx.strokeStyle = p.el==='H' ? '#94a3b8' : '#e2e8f0';
      octx.lineWidth = p.el==='H' ? 1.4 : 2;
      octx.fill(); octx.stroke();
      octx.fillStyle = MOLSTYLE.badgeText[p.el] || '#fff';
      octx.font = `700 ${Math.round(rpx*0.95)}px "Space Grotesk", system-ui, sans-serif`;
      octx.textAlign='center'; octx.textBaseline='middle';
      octx.fillText(p.el, p.s.x, p.s.y+0.5);
    });

    /* garis penunjuk untuk atom penting */
    if(info && info.callout && fa && fa.s.visible && w >= 250){
      const tx = Math.min(w-96, Math.max(96, fa.s.x + 58));
      const ty = Math.min(h-16, Math.max(74, fa.s.y + 42));
      octx.strokeStyle='rgba(100,116,139,0.45)'; octx.lineWidth=1;
      octx.beginPath(); octx.moveTo(fa.s.x, fa.s.y); octx.lineTo(tx, ty); octx.stroke();
      octx.font='500 10px "IBM Plex Mono", monospace';
      const tw = octx.measureText(info.callout).width + 16;
      octx.fillStyle='rgba(255,255,255,0.92)';
      octx.strokeStyle='rgba(203,213,225,0.9)';
      roundRectPath(octx, tx-tw/2, ty-10, tw, 20, 7); octx.fill(); octx.stroke();
      octx.fillStyle='#475569'; octx.textAlign='center'; octx.textBaseline='middle';
      octx.fillText(info.callout, tx, ty+0.5);
    }
  }

  function frame(dt){
    if(self.spin && !drag) rotY += dt*0.32;
    group.rotation.set(rotX, rotY, 0);
    renderer.render(scene, camera);
    drawOverlay();
  }

  function init(){
    if(self.live) return;
    canvas = document.createElement('canvas');
    canvas.className = 'mol-canvas';
    overlay = document.createElement('canvas');
    overlay.className = 'mol-overlay';
    mount.appendChild(canvas); mount.appendChild(overlay);
    octx = overlay.getContext('2d');
    renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:opts.bg===null});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    if(THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    buildScene();
    resize();
    if(window.ResizeObserver){ ro = new ResizeObserver(resize); ro.observe(mount); }
    self.live = true;
    frame(0);
  }

  function dispose(){
    if(!self.live) return;
    if(ro){ ro.disconnect(); ro=null; }
    scene.traverse(o=>{ if(o.geometry) o.geometry.dispose(); });
    renderer.dispose();
    if(renderer.forceContextLoss) renderer.forceContextLoss();
    canvas.remove(); overlay.remove();
    renderer=null; scene=null; camera=null; group=null; octx=null;
    self.live=false;
  }

  /* interaksi seret */
  mount.addEventListener('pointerdown', e=>{
    if(e.target.closest('button')) return;
    drag=true; lx=e.clientX; ly=e.clientY;
    mount.setPointerCapture(e.pointerId);
  });
  mount.addEventListener('pointerup', ()=>{ drag=false; });
  mount.addEventListener('pointercancel', ()=>{ drag=false; });
  mount.addEventListener('pointermove', e=>{
    if(!drag || !self.live) return;
    rotY += (e.clientX-lx)*0.01;
    rotX += (e.clientY-ly)*0.01;
    rotX = Math.max(-1.3, Math.min(1.3, rotX));
    lx=e.clientX; ly=e.clientY;
  });

  self.init=init; self.dispose=dispose; self.frame=frame; self.resize=resize;
  self.setMolecule=k=>{
    self.key=k;
    if(self.live){ dispose(); init(); }
  };
  self.reset=()=>{ rotX=-0.24; rotY=0.42; };
  return self;
}

/* --------------------------------------------------------
   Kolam viewer: hanya yang terlihat di layar yang dihidupkan,
   maksimal 6 konteks WebGL sekaligus supaya browser tetap ringan.
-------------------------------------------------------- */
const MOL_POOL = [];
const MOL_MAX_LIVE = 6;

function registerViewer(v, alwaysOn){
  MOL_POOL.push(v);
  if(alwaysOn){ v.visible = true; v.init(); return v; }
  if('IntersectionObserver' in window){
    new IntersectionObserver(es=>{
      v.visible = es[0].isIntersecting;
      if(v.visible) ensureLive(v);
    },{threshold:0.05, rootMargin:'120px'}).observe(v.mount);
  } else { v.visible=true; ensureLive(v); }
  return v;
}
function ensureLive(v){
  if(v.live) return;
  const live = MOL_POOL.filter(x=>x.live);
  if(live.length >= MOL_MAX_LIVE){
    const victim = live.find(x=>!x.visible);
    if(victim) victim.dispose();
    else return;
  }
  v.init();
}
let _molLast = performance.now();
(function molLoop(t){
  const dt = Math.min((t-_molLast)/1000, 0.1); _molLast = t;
  MOL_POOL.forEach(v=>{ if(v.live && v.visible) v.frame(dt); });
  requestAnimationFrame(molLoop);
})(performance.now());

/* ---- molekul 3D di hero beranda ----
   dipasang SETELAH MOL_POOL dibuat; kalau dipanggil lebih awal,
   registerViewer menyentuh MOL_POOL sebelum inisialisasi (TDZ)
   dan seluruh skrip berhenti — itu yang bikin angka statistik jadi 0. */
(function(){
  const mount = document.getElementById('heroMol');
  if(!mount) return;
  registerViewer(MolViewer(mount, 'benzena', {bg:null, header:false}), true);
})();

/* ---- kartu molekul di halaman Materi ---- */
document.querySelectorAll('.mol3d[data-mol]').forEach(box=>{
  const key = box.dataset.mol;
  const info = MOLINFO[key];
  const frame = box.querySelector('.m3-frame');
  const v = MolViewer(frame, key, {});
  const spinBtn = box.querySelector('.m3-spin');
  if(spinBtn) spinBtn.addEventListener('click', ()=>{
    v.spin = !v.spin;
    spinBtn.classList.toggle('off', !v.spin);
  });
  if(info){
    const stats=document.createElement('div');
    stats.className='m3-stats';
    stats.innerHTML=`<div><span class="k">Molekul</span><span class="v">${info.f}</span></div>`+
                    `<div><span class="k">Geometri</span><span class="v">${info.geo}</span></div>`+
                    `<div><span class="k">Sudut ikatan</span><span class="v">${info.ang}</span></div>`;
    box.appendChild(stats);
  }
  registerViewer(v);
});


document.querySelectorAll('.mq-opts').forEach(group=>{
  const answer = parseInt(group.dataset.answer);
  group.querySelectorAll('.mq-opt').forEach((btn,i)=>{
    btn.onclick=()=>{
      if(btn.dataset.done) return;
      group.querySelectorAll('.mq-opt').forEach((b,j)=>{
        b.dataset.done='1';
        if(j===answer) b.classList.add('correct');
        else if(b===btn) b.classList.add('wrong');
      });
    };
  });
});

/* ============================================================
   ZONA SSI: cases
============================================================ */
const cases=[
  {
    tag:'Kasus 1', title:'Ketika Pipa Patah, Laut Menangis',
    kicker:'Tumpahan Minyak Balikpapan · 31 Maret – April 2018',
    facts:[['7.000–12.987','hektare laut terdampak'],['34','hektare mangrove rusak'],['5','orang meninggal'],['162','perahu nelayan tak bisa melaut']],
    kimia:'Minyak bumi adalah campuran alkana (C₅–C₁₇). Alkana bersifat non-polar sehingga tidak larut dalam air dan bersifat toksik bagi biota laut. Karena massa jenisnya lebih kecil dari air, minyak mengapung di permukaan dan menghalangi pertukaran oksigen — menyebabkan biota di bawahnya mati lemas.',
    eqn:'C₅H₁₂ … C₁₇H₃₆  (campuran alkana penyusun minyak bumi)',
    dilema:['Siapa yang bertanggung jawab atas kebocoran ini?','Apakah santunan bagi nelayan sudah cukup adil?','Bagaimana mencegah kejadian serupa terulang?'],
    comments:[['Rani','Menurutku perusahaan & pemerintah harus sama-sama awasi jalur pipa secara berkala.'],['Deo','Santunan penting, tapi pemulihan mangrove butuh waktu bertahun-tahun — itu yang sering dilupakan.']]
  },
  {
    tag:'Kasus 2', title:'Saat Mobil Macet, Paru-Paru Jadi Korban',
    kicker:'Polusi Udara Jakarta',
    facts:[['70%','polusi berasal dari transportasi'],['↓','turun drastis saat Lebaran 2025'],['↑','naik lagi H+4 setelah Lebaran']],
    kimia:'Pembakaran tidak sempurna bahan bakar kendaraan menghasilkan gas CO (karbon monoksida) — gas beracun, tidak berwarna, dan tidak berbau, yang mengikat hemoglobin lebih kuat dari oksigen.',
    eqn:'2C₈H₁₈ + 17O₂ → 16CO + 18H₂O',
    dilema:['Siapa yang paling bertanggung jawab: pengendara, produsen, atau pemerintah?','Apakah kebijakan ganjil-genap cukup efektif?','Kebiasaan apa yang bisa kita ubah mulai hari ini?'],
    comments:[['Sinta','Aku jadi ngerti kenapa udara terasa lebih segar pas mudik Lebaran — kendaraan berkurang drastis.'],['Bagas','CO itu serem karena gak kelihatan & gak berbau, jadi orang gak sadar udah kena.']]
  },
  {
    tag:'Kasus 3', title:'Dari Etena ke Bencana Ekologis',
    kicker:'Sampah Plastik Indonesia',
    facts:[['34,2 Jt Ton','sampah nasional per tahun'],['19%','adalah sampah plastik'],['7%','yang berhasil didaur ulang'],['#2','peringkat dunia penghasil sampah plastik laut']],
    kimia:'Etena (C₂H₄) berpolimerisasi membentuk rantai panjang polietilen — bahan dasar plastik. Struktur rantai karbon yang sangat panjang & stabil inilah yang membuat plastik butuh sekitar 400 tahun untuk terurai secara alami.',
    eqn:'n C₂H₄  →  (C₂H₄)ₙ   [ etena → polietilen ]',
    dilema:['Siapa yang harus bertanggung jawab: konsumen, produsen, atau pemerintah?','Apakah daur ulang saja cukup untuk mengatasi masalah ini?','Apa pengganti plastik sekali pakai yang realistis untuk pelajar?'],
    comments:[['Wulan','Aku mulai bawa botol minum sendiri ke sekolah setelah baca data ini.'],['Fajar','400 tahun itu lebih lama dari umur kita semua digabung — serem juga mikirnya.']]
  }
];
function showCase(i){
  const c=cases[i];
  const box=document.getElementById('caseDetails');
  box.innerHTML = `
    <div class="card case-detail active">
      <b class="mono" style="font-size:12px; color:var(--muted); text-transform:uppercase;">${c.tag}</b>
      <h2>${c.title}</h2>
      <div class="kicker">${c.kicker}</div>
      <div class="fact-grid">
        ${c.facts.map(f=>`<div class="fact"><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}
      </div>
      <div class="eyebrow">Keterkaitan kimia</div>
      <div class="kimia-box">${c.kimia}<span class="eqn">${c.eqn}</span></div>
      <div class="eyebrow">Dilema etis — diskusikan!</div>
      <div class="dilema-grid">
        ${c.dilema.map((d,i)=>`<div class="dilema-card"><b>Pertanyaan ${i+1}</b>${d}</div>`).join('')}
      </div>
      <div class="eyebrow">Forum diskusi — apa aksi nyata yang akan kamu lakukan?</div>
      <div class="forum-box">
        <textarea placeholder="Tulis pendapatmu di sini..."></textarea>
        <div style="margin-top:10px;"><button class="btn btn-coral" onclick="addComment(${i},this)">Tulis Pendapat</button></div>
        <div class="forum-list" id="forumList-${i}">
          ${c.comments.map(cm=>`<div class="forum-item"><b>${cm[0]}</b>${cm[1]}</div>`).join('')}
        </div>
      </div>
    </div>`;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}
function addComment(i, btn){
  const wrap=btn.closest('.forum-box');
  const ta=wrap.querySelector('textarea');
  if(!ta.value.trim()) return;
  const list=document.getElementById('forumList-'+i);
  const div=document.createElement('div');
  div.className='forum-item';
  div.innerHTML=`<b>Kamu</b>${ta.value.trim()}`;
  list.prepend(div);
  ta.value='';
}

/* ============================================================
   AR MOLEKUL — 3D ball & stick viewer
============================================================ */
function ring(n,R,Rh,doubleEvery, y=0){
  const atoms=[], bonds=[];
  for(let i=0;i<n;i++){
    const ang=Math.PI*2/n*i - Math.PI/2;
    const x=R*Math.cos(ang), z=R*Math.sin(ang);
    atoms.push({el:'C', x, y, z});
    const hx=Rh*Math.cos(ang), hz=Rh*Math.sin(ang);
    atoms.push({el:'H', x:hx, y, z:hz});
    bonds.push([atoms.length-1, atoms.length-2, 1]); // C-H
  }
  for(let i=0;i<n;i++){
    const order = (doubleEvery && i%2===0) ? 2 : 1;
    bonds.push([i*2, ((i+1)%n)*2, order]);
  }
  return {atoms, bonds};
}
function cyclohexaneAtoms(){
  const R=70, Rh=40, yOff=32;
  const atoms=[], bonds=[];
  for(let i=0;i<6;i++){
    const ang=Math.PI/3*i - Math.PI/2;
    const x=R*Math.cos(ang), z=R*Math.sin(ang);
    atoms.push({el:'C', x, y:0, z});
  }
  for(let i=0;i<6;i++) bonds.push([i,(i+1)%6,1]);
  for(let i=0;i<6;i++){
    const ang=Math.PI/3*i - Math.PI/2;
    const rx=Math.cos(ang), rz=Math.sin(ang);
    atoms.push({el:'H', x:R*rx+Rh*rx, y:yOff, z:R*rz+Rh*rz});
    bonds.push([atoms.length-1, i, 1]);
    atoms.push({el:'H', x:R*rx+Rh*rx, y:-yOff, z:R*rz+Rh*rz});
    bonds.push([atoms.length-1, i, 1]);
  }
  return {atoms, bonds};
}
const benzeneData = ring(6,70,125,true);
const cyclohexaneData = cyclohexaneAtoms();

const molecules = [
  {
    name:'Metana', formula:'CH₄', bentuk:'Tetrahedral', sudut:'109,5°',
    kegunaan:'Komponen utama gas alam / LPG untuk memasak & bahan bakar.',
    dampak:'Gas rumah kaca kuat jika bocor ke atmosfer sebelum terbakar.',
    atoms:[{el:'C',x:0,y:0,z:0},{el:'H',x:50,y:50,z:50},{el:'H',x:50,y:-50,z:-50},{el:'H',x:-50,y:50,z:-50},{el:'H',x:-50,y:-50,z:50}],
    bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]
  },
  {
    name:'Etana', formula:'C₂H₆', bentuk:'Rantai lurus (staggered)', sudut:'109,5°',
    kegunaan:'Bahan baku industri petrokimia, salah satunya untuk membuat etena.',
    dampak:'Komponen gas alam; pembakarannya menghasilkan CO₂ & H₂O.',
    atoms:[
      {el:'C',x:-60,y:0,z:0},{el:'C',x:60,y:0,z:0},
      {el:'H',x:-110,y:45,z:45},{el:'H',x:-110,y:45,z:-45},{el:'H',x:-95,y:-60,z:0},
      {el:'H',x:110,y:-45,z:0},{el:'H',x:95,y:30,z:55},{el:'H',x:95,y:30,z:-55}
    ],
    bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]]
  },
  {
    name:'Etena', formula:'C₂H₄', bentuk:'Trigonal planar', sudut:'120°',
    kegunaan:'Bahan baku utama plastik polietilen (kantong plastik, botol).',
    dampak:'Sumber sampah plastik — sekitar 7,8 juta ton pertahun di Indonesia.',
    atoms:[
      {el:'C',x:-55,y:0,z:0},{el:'C',x:55,y:0,z:0},
      {el:'H',x:-95,y:50,z:0},{el:'H',x:-95,y:-50,z:0},
      {el:'H',x:95,y:50,z:0},{el:'H',x:95,y:-50,z:0}
    ],
    bonds:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]
  },
  {
    name:'Etuna', formula:'C₂H₂', bentuk:'Linear', sudut:'180°',
    kegunaan:'Gas asetilena untuk las karbit — nyala bakarnya sangat panas.',
    dampak:'Mudah meledak jika bertekanan tinggi; harus disimpan hati-hati.',
    atoms:[{el:'C',x:-50,y:0,z:0},{el:'C',x:50,y:0,z:0},{el:'H',x:-110,y:0,z:0},{el:'H',x:110,y:0,z:0}],
    bonds:[[0,1,3],[0,2,1],[1,3,1]]
  },
  {
    name:'Sikloheksana', formula:'C₆H₁₂', bentuk:'Cincin (kursi disederhanakan)', sudut:'109,5°',
    kegunaan:'Pelarut industri & bahan baku pembuatan nilon.',
    dampak:'Mudah terbakar; uapnya berbahaya jika terhirup dalam jumlah besar.',
    atoms:cyclohexaneData.atoms,
    bonds:cyclohexaneData.bonds
  },
  {
    name:'Benzena', formula:'C₆H₆', bentuk:'Cincin aromatik planar', sudut:'120°',
    kegunaan:'Bahan baku plastik, pewarna, dan berbagai senyawa aromatik lain.',
    dampak:'Karsinogenik — paparan jangka panjang berisiko tinggi bagi kesehatan.',
    atoms:benzeneData.atoms,
    bonds:benzeneData.bonds
  }
];

let currentMol = 0;
let rotX=-18, rotY=25, dragging=false, lastX=0, lastY=0;

function renderMarkerList(){
  const list=document.getElementById('markerList');
  list.innerHTML='';
  molecules.forEach((m,i)=>{
    const item=document.createElement('div');
    item.className='marker-item'+(i===currentMol?' active':'');
    item.innerHTML=`<div class="mk">${m.formula}</div><div><b>${m.name}</b><span>Marker ${i+1}</span></div>`;
    item.onclick=()=>{ currentMol=i; rotX=-18; rotY=25; renderMarkerList(); renderMolecule(); };
    list.appendChild(item);
  });
}

const AR_KEYS = ['metana','etana','etena','etuna','sikloheksana','benzena'];
let arViewer = null;

function renderMolecule(){
  const m = molecules[currentMol];
  const mountEl = document.getElementById('moleculeMount');
  if(!arViewer){
    arViewer = MolViewer(mountEl, AR_KEYS[currentMol], {});
    registerViewer(arViewer);
  } else {
    arViewer.setMolecule(AR_KEYS[currentMol]);
    arViewer.reset();
  }
  document.getElementById('infoPanel').innerHTML = `
    <h3>${m.name} <span class="mono" style="font-size:14px; color:var(--muted);">${m.formula}</span></h3>
    <div class="info-row"><span>Bentuk</span><b>${m.bentuk}</b></div>
    <div class="info-row"><span>Sudut ikatan</span><b>${m.sudut}</b></div>
    <div class="info-tag"><b>Kegunaan:</b> ${m.kegunaan}</div>
    <div class="info-tag"><b>Dampak:</b> ${m.dampak}</div>
  `;
}

if(document.getElementById('markerList')){
  renderMarkerList();
  renderMolecule();
}

/* ============================================================
   KALKULATOR
============================================================ */
const vehicles = [
  {name:'Motor (100 cc)', factor:50},
  {name:'Motor (125 cc)', factor:70},
  {name:'Mobil (1200 cc)', factor:120},
  {name:'Mobil (1500 cc)', factor:150},
  {name:'Angkutan umum', factor:20},
];
let selectedVehicle=0;
function renderVehicleList(){
  const list=document.getElementById('vehicleList');
  list.innerHTML='';
  vehicles.forEach((v,i)=>{
    const opt=document.createElement('label');
    opt.className='radio-opt'+(i===selectedVehicle?' sel':'');
    opt.innerHTML=`<input type="radio" name="veh" ${i===selectedVehicle?'checked':''}> ${v.name} <span class="f">${v.factor} g/km</span>`;
    opt.onclick=()=>{ selectedVehicle=i; renderVehicleList(); };
    list.appendChild(opt);
  });
}
if(document.getElementById('vehicleList')) renderVehicleList();

function hitungEmisi(){
  const jarak = parseFloat(document.getElementById('jarakInput').value);
  const hari = parseFloat(document.getElementById('hariInput').value);
  const card = document.getElementById('resultCard');
  if(!jarak || !hari || jarak<=0 || hari<=0){
    card.classList.add('empty');
    card.innerHTML = 'Isi jarak tempuh dan hari sekolah dengan angka yang valid dulu, ya.';
    return;
  }
  const v = vehicles[selectedVehicle];
  const gramPerHari = v.factor * jarak * 2; // pergi-pulang
  const kgPerBulan = (gramPerHari * hari) / 1000;
  const kgPerTahun = kgPerBulan * 12;
  const pohon = Math.max(1, Math.ceil(kgPerTahun / 21));

  let rekom;
  if(selectedVehicle===4){
    rekom = 'Kamu sudah memilih angkutan umum — salah satu pilihan dengan jejak karbon terendah. Pertahankan!';
  } else {
    rekom = 'Coba gunakan transportasi umum, ajak teman carpool, atau naik sepeda untuk jarak dekat agar emisimu turun.';
  }

  card.classList.remove('empty');
  card.innerHTML = `
    <h3 style="margin-bottom:14px;">Hasil Perhitungan</h3>
    <div class="result-big">
      <div class="result-num"><b>${kgPerBulan.toFixed(1)}</b><span>kg CO₂ / bulan</span></div>
      <div class="result-num"><b>${kgPerTahun.toFixed(0)}</b><span>kg CO₂ / tahun</span></div>
    </div>
    <div class="tree-line">🌳 <span>Setara dengan menanam <b>${pohon}</b> pohon untuk menyerap emisi tahunanmu.</span></div>
    <div class="eyebrow">Rekomendasi</div>
    <div class="rekom">${rekom}</div>
  `;
}

/* ============================================================
   PROYEK
============================================================ */
const guides = [
  {
    title:'Poster Digital — "Dari Molekul ke Bencana"', duration:'1 minggu',
    steps:['Pilih salah satu kasus SSI (Balikpapan, Jakarta, atau sampah plastik).','Tentukan satu pesan utama yang ingin disampaikan.','Buat sketsa kasar di kertas.','Desain digital menggunakan Canva atau PowerPoint.','Unggah &amp; presentasikan ke kelas.']
  },
  {
    title:'Video Edukasi — "Hidrokarbon & Kehidupan"', duration:'2 minggu',
    steps:['Tentukan sub-topik yang ingin dijelaskan (materi atau kasus SSI).','Tulis naskah singkat & storyboard sederhana.','Rekam menggunakan HP, tambahkan animasi/teks jika perlu.','Edit dan beri narasi yang mudah dipahami.','Unggah &amp; presentasikan ke kelas.']
  },
  {
    title:'Model Molekul 3D dari Bahan Daur Ulang', duration:'1 minggu',
    steps:['Pilih satu molekul dari materi (metana, etena, benzena, dll).','Kumpulkan bahan daur ulang (sedotan, kardus, tutup botol, dsb).','Rangkai model sesuai bentuk molekul yang benar.','Beri label atom & jenis ikatan pada model.','Presentasikan struktur & fungsi molekulmu ke kelas.']
  }
];
function showGuide(i){
  const g=guides[i];
  const box=document.getElementById('guideDetails');
  box.innerHTML=`
    <div class="card guide-detail active">
      <div class="eyebrow">Panduan proyek · ${g.duration}</div>
      <h2 style="font-size:22px; margin-bottom:14px;">${g.title}</h2>
      <ul class="guide-steps">${g.steps.map(s=>`<li>${s}</li>`).join('')}</ul>
      <div style="display:flex; gap:10px; margin:18px 0 26px;">
        <button class="btn btn-ghost" onclick="alert('Template proyek akan diunduh di sini.')">Download Template</button>
        <button class="btn btn-leaf" onclick="alert('Fitur unggah tugas terhubung ke Google Classroom kelasmu.')">Upload Tugas</button>
      </div>
      <div class="eyebrow">Rubrik penilaian</div>
      <table class="rubrik">
        <tr><th>Kriteria</th><th>Bobot</th><th>Deskripsi</th></tr>
        <tr><td>Akurasi konsep kimia</td><td>35%</td><td>Ketepatan penjelasan struktur, rumus, dan reaksi</td></tr>
        <tr><td>Keterkaitan dengan kasus SSI</td><td>25%</td><td>Kejelasan hubungan materi dengan isu sosial nyata</td></tr>
        <tr><td>Kreativitas &amp; presentasi</td><td>25%</td><td>Kualitas visual, storytelling, dan penyampaian</td></tr>
        <tr><td>Kerja sama kelompok</td><td>15%</td><td>Kontribusi merata antar anggota kelompok</td></tr>
      </table>
      <div class="eyebrow" style="margin-top:20px;">Timeline</div>
      <div class="timeline">
        <div class="tl-item"><b>Hari 1–2</b><span>Eksplorasi &amp; sketsa</span></div>
        <div class="tl-item"><b>Hari 3–4</b><span>Produksi</span></div>
        <div class="tl-item"><b>Hari 5</b><span>Finalisasi</span></div>
        <div class="tl-item"><b>Hari 6</b><span>Presentasi</span></div>
      </div>
    </div>`;
  box.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ============================================================
   KUIS
============================================================ */
const quizData = [
  {q:'Apa yang membuat atom karbon mampu membentuk jutaan senyawa berbeda?', opts:['Elektron valensinya 4 dan dapat membentuk rantai panjang','Ukuran atomnya paling besar di tabel periodik','Hanya bisa berikatan dengan hidrogen','Tidak reaktif terhadap oksigen'], a:0},
  {q:'Rumus umum alkana adalah...', opts:['CₙH₂ₙ','CₙH₂ₙ₊₂','CₙH₂ₙ₋₂','CₙH₂ₙ₊₁'], a:1},
  {q:'Senyawa dengan rumus C₃H₆ termasuk golongan...', opts:['Alkana','Alkena','Alkuna','Alkohol'], a:1},
  {q:'Ikatan rangkap tiga (C≡C) terdapat pada golongan...', opts:['Alkana','Alkena','Alkuna','Sikloalkana'], a:2},
  {q:'Dua senyawa dengan rumus molekul sama tapi struktur berbeda disebut...', opts:['Isotop','Isomer','Isobar','Isoelektronik'], a:1},
  {q:'Gas beracun hasil pembakaran tidak sempurna bahan bakar adalah...', opts:['CO₂','H₂O','CO','O₂'], a:2},
  {q:'Minyak bumi yang tumpah di Balikpapan mengapung di laut karena...', opts:['Massa jenisnya lebih besar dari air','Bersifat polar seperti air','Massa jenisnya lebih kecil dari air','Mudah larut dalam air'], a:2},
  {q:'Etena (C₂H₄) merupakan bahan baku utama pembuatan...', opts:['Kertas','Polietilen (plastik)','Kaca','Semen'], a:1},
  {q:'Sekitar 70% polusi udara di Jakarta berasal dari...', opts:['Industri tekstil','Transportasi','Pembakaran sampah rumah tangga','Peternakan'], a:1},
  {q:'Salah satu cara paling efektif menurunkan jejak karbon perjalanan harian adalah...', opts:['Menggunakan transportasi umum atau bersepeda','Mengganti motor lama dengan motor baru','Menutup jendela mobil','Menyalakan AC lebih dingin'], a:0},
];
let quizIdx=0, quizScore=0, answered=false;
function renderQuiz(){
  const body=document.getElementById('quizBody');
  document.getElementById('quizBar').style.width = (quizIdx/quizData.length*100)+'%';
  if(quizIdx>=quizData.length){
    body.innerHTML=`
      <div class="quiz-result">
        <span style="font-family:var(--mono); font-size:13px; color:var(--muted);">Skor Pilihan Ganda</span>
        <b>${quizScore}/${quizData.length}</b>
        <p style="color:var(--muted); font-size:14px; margin-top:6px;">Lanjutkan ke bagian esai di bawah untuk melengkapi kuismu.</p>
        <button class="btn btn-ghost" style="margin-top:16px;" onclick="quizIdx=0;quizScore=0;renderQuiz();">Ulangi Kuis</button>
      </div>`;
    document.getElementById('quizBar').style.width='100%';
    return;
  }
  answered=false;
  const q=quizData[quizIdx];
  body.innerHTML=`
    <div style="font-size:12px; font-family:var(--mono); color:var(--muted); margin-bottom:8px;">Soal ${quizIdx+1} dari ${quizData.length}</div>
    <div class="quiz-q">${q.q}</div>
    <div class="quiz-opts" id="quizOpts">
      ${q.opts.map((o,i)=>`<button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>`).join('')}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <div class="quiz-nav">
      <span></span>
      <button class="btn btn-amber" id="quizNextBtn" style="display:none;" onclick="quizIdx++;renderQuiz();">Soal Berikutnya →</button>
    </div>
  `;
}
function answerQuiz(i){
  if(answered) return;
  answered=true;
  const q=quizData[quizIdx];
  const opts=document.querySelectorAll('#quizOpts .quiz-opt');
  opts.forEach((btn,j)=>{
    if(j===q.a) btn.classList.add('correct');
    else if(j===i) btn.classList.add('wrong');
  });
  if(i===q.a) quizScore++;
  const fb=document.getElementById('quizFeedback');
  fb.style.display='block';
  fb.textContent = (i===q.a ? '✅ Benar! ' : '❌ Kurang tepat. ') + 'Jawaban: ' + q.opts[q.a];
  document.getElementById('quizNextBtn').style.display='inline-flex';
}
if(document.getElementById('quizBody')) renderQuiz();
