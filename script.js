/* =========================================================
   FURINA — GOD MODE ENGINE (STABLE FINAL)
========================================================= */

/* =========================
   ELEMENTS
========================= */
const screens = document.querySelectorAll(".screen");
const welcomeBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("nameInput");

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

const scoreEl = document.getElementById("score");
const clockEl = document.getElementById("clock");
const celebration = document.getElementById("celebration");

/* =========================
   STATE (SATU SUMBER)
========================= */
const state = {
  userName: "Kamu",

  score: 0,
  trust: 0,
  rage: 0,
  suspicion: 0,
  fatigue: 0,

  dead: false,
  awakened: false,

  memory: [],
  lastInput: "",
  lastTime: 0
};

const SAVE_KEY = "furina_state_v2";
const DEAD_KEY = "furina_dead_v2";

/* =========================
   DATASET SLOT
========================= */
const DATASET = [

/* =====================================================
   1. SAPAAN & PEMBUKA
===================================================== */
{
  trigger:["halo","hai","hi","hey"],
  effect:{score:1, trust:1},
  reply:()=> "…iya."
},
{
  trigger:["assalamualaikum","salam"],
  effect:{score:2, trust:2},
  reply:()=> "Waalaikumsalam."
},
{
  trigger:["pagi"],
  effect:{trust:1},
  reply:()=> "Pagi tidak selalu cerah."
},
{
  trigger:["malam"],
  effect:{trust:1},
  reply:()=> "Malam bikin orang jujur."
},

/* =====================================================
   2. CUEK / DRY / SATU KATA
===================================================== */
{
  trigger:["ok","oke","ya","iya","oh","hmm"],
  effect:{trust:-1},
  reply:(ctx)=> ctx.trust < 10 ? "…" : "Iya."
},
{
  trigger:["."],
  effect:{trust:-2},
  reply:()=> "Diam juga sikap."
},

/* =====================================================
   3. SOPAN & ETIKA
===================================================== */
{
  trigger:["maaf"],
  effect:{trust:4, rage:-2},
  reply:()=> "Aku dengar."
},
{
  trigger:["tolong","mohon"],
  effect:{trust:3},
  reply:()=> "Cara bicaramu benar."
},
{
  trigger:["terima kasih","makasih"],
  effect:{trust:3},
  reply:()=> "Dicatat."
},

/* =====================================================
   4. MAKSA / MENEKAN
===================================================== */
{
  trigger:["jawab","cepet","kok lama","??","???"],
  effect:{rage:4, suspicion:3},
  reply:()=> "Nada bicaramu salah."
},
{
  trigger:["plis","serius","penting"],
  effect:{suspicion:2},
  reply:()=> "Tekanan bukan alasan."
},

/* =====================================================
   5. MARAH / TOXIC
===================================================== */
{
  trigger:["anjing","bangsat","tolol","bodoh","kontol"],
  effect:{rage:12, score:-15},
  reply:()=> "Aku tidak akan melanjutkan dengan bahasa itu."
},
{
  trigger:["bacot","diem"],
  effect:{rage:8},
  reply:()=> "Kamu kehilangan kendali."
},

/* =====================================================
   6. PERASAAN & EMOSI
===================================================== */
{
  trigger:["sedih","capek hidup","lelah"],
  effect:{trust:4},
  reply:()=> "Capek bukan berarti menyerah."
},
{
  trigger:["kesepian","sendiri"],
  effect:{trust:3},
  reply:()=> "Kesendirian kadang perlu."
},
{
  trigger:["patah hati"],
  effect:{trust:4},
  reply:()=> "Tidak semua yang pergi salah."
},

/* =====================================================
   7. CINTA (DIBATASI)
===================================================== */
{
  trigger:["cinta","love"],
  effect:{trust:-1, suspicion:2},
  reply:()=> "Kata besar, tanggung jawabnya juga."
},
{
  trigger:["sayang","beb"],
  effect:{rage:4},
  reply:()=> "Jangan memanggilku seperti itu."
},

/* =====================================================
   8. MANIPULASI HALUS
===================================================== */
{
  trigger:["percaya aku","trust me"],
  effect:{suspicion:5},
  reply:()=> "Yang jujur tidak memaksa."
},
{
  trigger:["aku tulus","aku serius"],
  effect:{suspicion:4},
  reply:()=> "Ketulusan tidak diumumkan."
},
{
  trigger:["aku berubah"],
  effect:{trust:-2},
  reply:()=> "Perubahan diuji waktu."
},

/* =====================================================
   9. FILOSOFI & NIHIL
===================================================== */
{
  trigger:["hidup","arti hidup"],
  effect:{trust:4},
  reply:()=> "Hidup bukan lomba bahagia."
},
{
  trigger:["mati","kematian"],
  effect:{trust:3},
  reply:()=> "Akhir memberi nilai."
},
{
  trigger:["takdir","nasib"],
  effect:{trust:3},
  reply:()=> "Takdir sering dijadikan alasan."
},

/* =====================================================
   10. ABSURD / HALU
===================================================== */
{
  trigger:["aku dewa","aku tuhan","aku alien"],
  effect:{suspicion:5},
  reply:()=> "Klaim besar butuh bukti besar."
},
{
  trigger:["simulasi","matrix"],
  effect:{trust:2},
  reply:()=> "Mungkin. Tapi kamu tetap memilih."
},

/* =====================================================
   11. SOSIAL & DUNIA NYATA
===================================================== */
{
  trigger:["uang","duit","kaya","miskin"],
  effect:{trust:1},
  reply:()=> "Nilai manusia bukan saldo."
},
{
  trigger:["kerja","lembur"],
  effect:{trust:2},
  reply:()=> "Istirahat juga keputusan."
},
{
  trigger:["sekolah","kuliah"],
  effect:{trust:1},
  reply:()=> "Belajar tidak selalu formal."
},

/* =====================================================
   12. TEKNOLOGI & AI
===================================================== */
{
  trigger:["ai","bot","robot"],
  effect:{trust:1},
  reply:()=> "Alat tergantung siapa yang memegang."
},
{
  trigger:["kamu ai","kamu bot"],
  effect:{},
  reply:()=> "Label tidak mengubah fungsiku."
},

/* =====================================================
   13. COSMIC / GOD MODE
===================================================== */
{
  trigger:["alam semesta","universe","kosmos"],
  effect:{trust:5},
  reply:()=> "Kita kecil, tapi berarti."
},
{
  trigger:["tak terbatas","infinite"],
  effect:{trust:4},
  reply:()=> "Batas sering ilusi."
},
{
  trigger:["realitas","eksistensi"],
  effect:{trust:4},
  reply:()=> "Realitas rapuh."
},

/* =====================================================
   14. META / GAME AWARE (ANTI FARM)
===================================================== */
{
  trigger:["score","trust","flag","ending"],
  effect:{suspicion:6},
  reply:()=> "Kamu terlalu fokus hasil."
},
{
  trigger:["reset","ulang","reload"],
  effect:{rage:3},
  reply:()=> "Tidak semua bisa diulang."
}

];

/* =========================
   UTILS
========================= */
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));

function showScreen(id){
  screens.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function addMsg(text,type){
  const d = document.createElement("div");
  d.className = "msg "+type;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

/* =========================
   CLOCK
========================= */
setInterval(()=>{
  clockEl.textContent = new Date().toLocaleTimeString("id-ID");
},1000);

/* =========================
   MEMORY & ANALYSIS
========================= */
function analyze(text){
  const t = text.toLowerCase();
  return {
    short: t.length <= 3,
    repeat: t === state.lastInput,
    aggressive: /!{2,}|anjing|bangsat|tolol/.test(t),
    polite: /maaf|tolong/.test(t),
    forcing: /\?\?+|jawab|cepet/.test(t),
    fast: Date.now() - state.lastTime < 700
  };
}

function updateMemory(text){
  state.memory.push(text);
  if(state.memory.length > 6) state.memory.shift();
}

/* =========================
   DATASET ENGINE
========================= */
function datasetReply(text, ctx){
  for(const d of DATASET){
    if(d.trigger.some(k=>text.includes(k))){
      if(d.effect){
        for(const key in d.effect){
          if(state[key] !== undefined){
            state[key] += d.effect[key];
          }
        }
      }
      return typeof d.reply === "function"
        ? d.reply({...ctx, ...state})
        : d.reply;
    }
  }
  return null;
}

/* =========================
   CORE AI
========================= */
function furinaReply(text){
  if(state.dead) return "— koneksi terputus —";

  const t = text.toLowerCase();
  const ctx = analyze(text);

  updateMemory(t);

  // Anti curang halus
  if(ctx.repeat) state.suspicion += 2;
  if(ctx.fast && ctx.short) state.rage += 2;
  if(ctx.aggressive) state.rage += 5;
  if(ctx.forcing) state.suspicion += 3;
  if(ctx.polite) state.trust += 2;

  // Dataset
  const ds = datasetReply(t, ctx);
  if(ds) return ds;

  // Mirroring cuek
  if(ctx.short && state.trust < 10){
    return "...";
  }

  // Lock
  if(state.rage > 50 || state.suspicion > 45){
    state.dead = true;
    localStorage.setItem(DEAD_KEY,"1");
    input.disabled = true;
    send.disabled = true;
    return "Cukup. Aku berhenti.";
  }

  // Awakening
  if(state.trust > 40 && !state.awakened){
    state.awakened = true;
    return "Kamu tidak seperti yang lain.";
  }

  // Default manusia
  state.trust += 1;
  state.score += 1;

  return "Hm.";
}

/* =========================
   SAVE / LOAD
========================= */
function save(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function load(){
  const raw = localStorage.getItem(SAVE_KEY);
  if(raw){
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
  }
  if(localStorage.getItem(DEAD_KEY)){
    state.dead = true;
    input.disabled = true;
    send.disabled = true;
  }
}
load();
scoreEl.textContent = state.score;

/* =========================
   START
========================= */
welcomeBtn.onclick = ()=>{
  state.userName = nameInput.value.trim() || "Kamu";
  showScreen("app");
  input.disabled = false;
  send.disabled = false;
  addMsg(
`Aku tidak selalu jujur, ${state.userName}.
Dan aku tidak selalu berpihak padamu.`,
  "ai");
};

/* =========================
   SEND
========================= */
send.onclick = ()=>{
  const text = input.value.trim();
  if(!text || state.dead) return;

  addMsg(text,"user");
  input.value = "";

  setTimeout(()=>{
    const reply = furinaReply(text);
    addMsg(reply,"ai");

    state.score = clamp(state.score,0,999);
    state.trust = clamp(state.trust,-50,100);
    state.rage = clamp(state.rage,0,100);
    state.suspicion = clamp(state.suspicion,0,100);

    scoreEl.textContent = state.score;

    if(state.score >= 120 && state.trust >= 80 && !state.dead){
      celebration.classList.remove("hidden");
      addMsg(
`Baik.
Aku percaya padamu.`,
      "ai");
      input.disabled = true;
      send.disabled = true;
    }

    state.lastInput = text.toLowerCase();
    state.lastTime = Date.now();
    save();
  },500);
};

input.addEventListener("keypress",e=>{
  if(e.key==="Enter") send.click();
});