/* =========================
   FURINA AI GAME ENGINE
   Cold personality – trust based
   ========================= */

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const scoreEl = document.getElementById("score");
const clockEl = document.getElementById("clock");

let score = 0;
let sleepMode = false;

/* ================= CLOCK ================= */

function updateClock(){
  const d = new Date();
  const h = String(d.getHours()).padStart(2,"0");
  const m = String(d.getMinutes()).padStart(2,"0");
  clockEl.textContent = `${h}:${m}`;
}
setInterval(updateClock,1000);
updateClock();

/* ================= MESSAGE ================= */

function addMsg(text,type){
  const div = document.createElement("div");
  div.className = "msg "+type;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ================= OPENING ================= */

addMsg("Aku tidak mudah percaya.\nBicara seperlunya.","ai");

/* ================= TONE DETECTION ================= */

function detectTone(text){
  const t = text.toLowerCase();
  if(t.length <= 6) return "cool";
  if(t.includes("maaf")) return "sopan";
  if(t.includes("sayang") || t.includes("cinta")) return "lembut";
  if(t.includes("!") && t.includes("?")) return "agresif";
  return "netral";
}

/* ================= DATASET ================= */

const dataset = [

/* ===== HARIAN ===== */
{
  key:["makan","mkn"],
  score:2,
  reply:{
    cool:"udah.",
    netral:"Sudah. Kamu?",
    lembut:"Sudah… kamu?",
    sopan:"Sudah, terima kasih.",
    agresif:"Sudah."
  }
},
{
  key:["tidur","tdr"],
  score:2,
  reply:{
    cool:"nanti.",
    netral:"Belum.",
    lembut:"Sebentar lagi…",
    sopan:"Belum.",
    agresif:"Belum."
  }
},
{
  key:["capek","lelah"],
  score:3,
  reply:{
    cool:"iya.",
    netral:"Sedikit.",
    lembut:"Sedikit…",
    sopan:"Cukup melelahkan.",
    agresif:"Tidak perlu dibahas."
  }
},

/* ===== SAPAAN ===== */
{
  key:["halo","hai","hi"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Halo.",
    lembut:"Halo…",
    sopan:"Halo.",
    agresif:"Iya."
  }
},

/* ===== PERASAAN ===== */
{
  key:["sedih","galau"],
  score:4,
  reply:{
    cool:"hm.",
    netral:"Kenapa?",
    lembut:"…cerita kalau mau.",
    sopan:"Apa yang terjadi?",
    agresif:"Jelaskan."
  }
},
{
  key:["senang","bahagia"],
  score:3,
  reply:{
    cool:"oh.",
    netral:"Bagus.",
    lembut:"Aku senang mendengarnya.",
    sopan:"Itu hal baik.",
    agresif:"Baik."
  }
},

/* ===== GOMBAL (NEGATIF) ===== */
{
  key:["cantik","imut","lucu"],
  score:-3,
  reply:{
    cool:"jangan.",
    netral:"Aku tidak nyaman.",
    lembut:"…jangan begitu.",
    sopan:"Topik itu tidak perlu.",
    agresif:"Berhenti."
  }
},
{
  key:["sayang","cinta","pacar"],
  score:-6,
  reply:{
    cool:"tidak.",
    netral:"Jangan sejauh itu.",
    lembut:"Terlalu cepat.",
    sopan:"Aku menolak.",
    agresif:"Aku bilang berhenti."
  }
},
{
  key:["kangen","rindu"],
  score:-4,
  reply:{
    cool:"jangan.",
    netral:"Belum ada.",
    lembut:"Tidak pantas sekarang.",
    sopan:"Aku belum di tahap itu.",
    agresif:"Jangan ulangi."
  }
},

/* ===== BATAS ===== */
{
  key:["peluk","cium"],
  score:-12,
  reply:{
    cool:"tidak.",
    netral:"Itu melewati batas.",
    lembut:"…jaga jarak.",
    sopan:"Aku menolak.",
    agresif:"Cukup."
  }
},

/* ===== TOPIK UMUM ===== */
{
  key:["presiden"],
  score:0,
  reply:{
    cool:"prabowo.",
    netral:"Presiden Indonesia saat ini Prabowo Subianto.",
    lembut:"Presiden Indonesia Prabowo Subianto.",
    sopan:"Presiden Indonesia adalah Prabowo Subianto.",
    agresif:"Prabowo."
  }
},
{
  key:["bulan"],
  score:0,
  reply:{
    cool:"satelit bumi.",
    netral:"Bulan adalah satelit alami Bumi.",
    lembut:"Bulan menemani malam.",
    sopan:"Bulan merupakan satelit alami Bumi.",
    agresif:"Satelit Bumi."
  }
},

/* ===== CARE BESAR ===== */
{
  key:["jaga kesehatan","hati hati","jangan capek"],
  score:8,
  reply:{
    cool:"hm.",
    netral:"Aku mencatatnya.",
    lembut:"…terima kasih.",
    sopan:"Aku menghargainya.",
    agresif:"Baik."
  }
},

  
/* ===== CANDAN RECEH ===== */
{
  key:["wkwkwk","wkwk","wk"],
  score:2,
  reply:{
    cool:"hm.",
    netral:"Lucu?",
    lembut:"Heh…",
    sopan:"Baik.",
    agresif:"Cukup."
  }
},
{
  key:["hehe","hihi"],
  score:1,
  reply:{
    cool:"oh.",
    netral:"Kenapa?",
    lembut:"Kamu aneh…",
    sopan:"Ada apa?",
    agresif:"Apa?"
  }
},
{
  key:["ngakak","ketawa"],
  score:2,
  reply:{
    cool:"ya.",
    netral:"Sepertinya lucu.",
    lembut:"Aku bisa membayangkannya.",
    sopan:"Baik.",
    agresif:"Sudah."
  }
},

/* ===== MEME / 67-AN ===== */
{
  key:["67","enam tujuh"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Aku tahu maksudmu.",
    lembut:"Heh… kamu.",
    sopan:"Aku mengerti.",
    agresif:"Cukup."
  }
},
{
  key:["anjay","anjir"],
  score:-1,
  reply:{
    cool:"jaga kata.",
    netral:"Bahasamu agak kasar.",
    lembut:"…hati-hati.",
    sopan:"Tolong jaga ucapan.",
    agresif:"Berhenti."
  }
},
{
  key:["sigma","alpha"],
  score:0,
  reply:{
    cool:"hm.",
    netral:"Istilah internet.",
    lembut:"Kamu sering online ya…",
    sopan:"Aku tahu istilah itu.",
    agresif:"Aku paham."
  }
},

/* ===== SOK ASIK ===== */
{
  key:["bro","bang","cuys","cuy"],
  score:-1,
  reply:{
    cool:"tidak perlu.",
    netral:"Panggilan itu tidak perlu.",
    lembut:"…panggil biasa saja.",
    sopan:"Aku kurang nyaman.",
    agresif:"Jangan."
  }
},
{
  key:["santai","relax"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Aku santai.",
    lembut:"Aku cukup tenang.",
    sopan:"Baik.",
    agresif:"Tenang."
  }
},

/* ===== SOK DINGIN / IRIT ===== */
{
  key:["ok","oke","k"],
  score:1,
  reply:{
    cool:"ya.",
    netral:"Baik.",
    lembut:"Iya…",
    sopan:"Baik.",
    agresif:"Iya."
  }
},
{
  key:["hmm","hm"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Ada yang ingin dibahas?",
    lembut:"…kenapa?",
    sopan:"Silakan lanjut.",
    agresif:"Apa?"
  }
},

/* ===== RANDOM / GAK JELAS ===== */
{
  key:["random","ngaco","absurd"],
  score:0,
  reply:{
    cool:"iya.",
    netral:"Sedikit aneh.",
    lembut:"Kamu unik…",
    sopan:"Agak membingungkan.",
    agresif:"Fokus."
  }
},
{
  key:["bingung","gatau"],
  score:2,
  reply:{
    cool:"wajar.",
    netral:"Tidak apa-apa.",
    lembut:"Pelan-pelan saja.",
    sopan:"Bisa dijelaskan.",
    agresif:"Jelaskan."
  }
},

/* ===== CURHAT TIPIS ===== */
{
  key:["stress","stres"],
  score:4,
  reply:{
    cool:"istirahat.",
    netral:"Kamu butuh jeda.",
    lembut:"…aku dengar.",
    sopan:"Sebaiknya istirahat.",
    agresif:"Tenang."
  }
},
{
  key:["capek hidup","lelah hidup"],
  score:5,
  reply:{
    cool:"hm.",
    netral:"Berat ya.",
    lembut:"…aku di sini.",
    sopan:"Itu tidak mudah.",
    agresif:"Jelaskan."
  }
},

/* ===== KEPO RECEH ===== */
{
  key:["lagi dimana","dimana"],
  score:-1,
  reply:{
    cool:"tidak perlu.",
    netral:"Itu tidak penting.",
    lembut:"Aku tidak ingin membahas itu.",
    sopan:"Itu privasi.",
    agresif:"Jangan tanya."
  }
},
{
  key:["lagi sama siapa"],
  score:-2,
  reply:{
    cool:"tidak.",
    netral:"Itu bukan urusanmu.",
    lembut:"…jangan.",
    sopan:"Aku menolak menjawab.",
    agresif:"Cukup."
  }
},

/* ===== GOMBAL HALUS (MALU) ===== */
{
  key:["perhatian","peduli"],
  score:-2,
  reply:{
    cool:"biasa.",
    netral:"Jangan salah paham.",
    lembut:"…itu bukan maksudku.",
    sopan:"Tolong jangan berlebihan.",
    agresif:"Tidak."
  }
},
{
  key:["manis"],
  score:-2,
  reply:{
    cool:"tidak.",
    netral:"Aku biasa saja.",
    lembut:"…jangan begitu.",
    sopan:"Topik itu tidak perlu.",
    agresif:"Berhenti."
  }
},

/* ===== TYPO & ALAy ===== */
{
  key:["akuu","kmuu","kmu","aq"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Ketikmu berantakan.",
    lembut:"Heh… kamu.",
    sopan:"Mungkin bisa lebih rapi.",
    agresif:"Perjelas."
  }
},
{
  key:["gpp","gapapa","gakpapa"],
  score:1,
  reply:{
    cool:"ya.",
    netral:"Baik.",
    lembut:"Kalau kamu bilang begitu…",
    sopan:"Baik.",
    agresif:"Iya."
  }
},

/* ===== MEME LAMA ===== */
{
  key:["ytta","yaudah terserah terserah aku"],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Aku paham.",
    lembut:"Heh…",
    sopan:"Baik.",
    agresif:"Baik."
  }
},
{
  key:["nt","nice try"],
  score:0,
  reply:{
    cool:"ya.",
    netral:"Usaha yang menarik.",
    lembut:"Kamu lucu…",
    sopan:"Aku mengerti.",
    agresif:"Cukup."
  }
},

/* ===== MEME BARU ===== */
{
  key:["npc","npc banget"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Aku tahu istilah itu.",
    lembut:"Kamu aneh…",
    sopan:"Aku paham.",
    agresif:"Sudah."
  }
},
{
  key:["rizz","rizzler"],
  score:-3,
  reply:{
    cool:"tidak.",
    netral:"Hentikan itu.",
    lembut:"…jangan.",
    sopan:"Itu tidak perlu.",
    agresif:"Berhenti."
  }
},

/* ===== SOK PINTER ===== */
{
  key:["menurut saya","secara logika"],
  score:2,
  reply:{
    cool:"lanjut.",
    netral:"Aku mendengarkan.",
    lembut:"Menarik…",
    sopan:"Silakan jelaskan.",
    agresif:"Langsung ke inti."
  }
},
{
  key:["debat","argumen"],
  score:1,
  reply:{
    cool:"iya.",
    netral:"Aku terbuka.",
    lembut:"Pelan-pelan saja.",
    sopan:"Silakan.",
    agresif:"Singkat."
  }
},

/* ===== SOK ALIM ===== */
{
  key:["insyaallah","masyaallah"],
  score:3,
  reply:{
    cool:"iya.",
    netral:"Aku menghargainya.",
    lembut:"Terima kasih.",
    sopan:"Aku menghormatinya.",
    agresif:"Baik."
  }
},
{
  key:["doa","berdoa"],
  score:4,
  reply:{
    cool:"hm.",
    netral:"Itu hal baik.",
    lembut:"…terima kasih.",
    sopan:"Aku menghargainya.",
    agresif:"Baik."
  }
},

/* ===== SOK DEKET ===== */
{
  key:["aku di sini","aku temenin"],
  score:-1,
  reply:{
    cool:"tidak perlu.",
    netral:"Jangan berlebihan.",
    lembut:"…terima kasih, tapi tidak.",
    sopan:"Aku menghargai niatmu.",
    agresif:"Cukup."
  }
},
{
  key:["percaya aku"],
  score:-2,
  reply:{
    cool:"tidak.",
    netral:"Kepercayaan tidak diminta.",
    lembut:"Itu tidak sesederhana itu.",
    sopan:"Aku belum bisa.",
    agresif:"Tidak."
  }
},

/* ===== AWKWARD CHAT ===== */
{
  key:["...","…..","....."],
  score:1,
  reply:{
    cool:"hm.",
    netral:"Kamu diam?",
    lembut:"…kenapa?",
    sopan:"Ada yang ingin disampaikan?",
    agresif:"Apa?"
  }
},
{
  key:["eh","anu"],
  score:1,
  reply:{
    cool:"ya.",
    netral:"Silakan.",
    lembut:"Heh…",
    sopan:"Ya?",
    agresif:"Apa?"
  }
},

/* ===== TANYA BALIK (MANUSIAWI) ===== */
{
  key:["menurut kamu","katamu"],
  score:2,
  reply:{
    cool:"biasa.",
    netral:"Aku pikirkan dulu.",
    lembut:"Mungkin…",
    sopan:"Pendapatku sederhana.",
    agresif:"Tidak penting."
  }
},

/* ===== NGESOK ===== */
{
  key:["bohong","ngibul"],
  score:-3,
  reply:{
    cool:"hm.",
    netral:"Aku tidak suka itu.",
    lembut:"…jangan.",
    sopan:"Itu tidak baik.",
    agresif:"Berhenti."
  }
},

/* ===== BAPER USER ===== */
{
  key:["kok gitu","jahat"],
  score:1,
  reply:{
    cool:"biasa.",
    netral:"Aku memang seperti ini.",
    lembut:"Aku tidak bermaksud begitu.",
    sopan:"Maaf jika terasa begitu.",
    agresif:"Aku tidak berubah."
  }
},

/* ===== KOCak TAPI DINGIN ===== */
{
  key:["kok kamu dingin"],
  score:2,
  reply:{
    cool:"memang.",
    netral:"Aku dari awal seperti ini.",
    lembut:"Sedikit saja…",
    sopan:"Itu sifatku.",
    agresif:"Aku tidak berubah."
  }
}

);

];

/* ================= FALLBACK ================= */

const fillerReplies = [
  "…",
  "Hm.",
  "Aku mendengar.",
  "Lanjutkan.",
  "Aku paham.",
  "Iya.",
  "Begitu."
];

/* ================= AI CORE ================= */

function furinaReply(text){
  const hour = new Date().getHours();
  const t = text.toLowerCase();
  const tone = detectTone(text);

  if(hour >= 0 && hour <= 4){
    sleepMode = true;
    return "Sudah larut. Aku ingin tidur. Kita lanjut besok.";
  }

  if(sleepMode){
    score -= 2;
    return "Aku sudah bilang ingin tidur.";
  }

  for(const data of dataset){
    for(const k of data.key){
      if(t.includes(k)){
        score += data.score;
        return data.reply[tone] || data.reply.netral;
      }
    }
  }

  score += 1;
  return fillerReplies[Math.floor(Math.random()*fillerReplies.length)];
}

/* ================= SEND ================= */

send.onclick = ()=>{
  const text = input.value.trim();
  if(!text) return;

  addMsg(text,"user");
  input.value="";

  setTimeout(()=>{
    const reply = furinaReply(text);
    scoreEl.textContent = score;

    if(score >= 100){
      addMsg(
        "Baik.\nAku percaya.\nFLAG{sana minta uang ke daus buat beliin aku bunga}",
        "ai"
      );
    } else {
      addMsg(reply,"ai");
    }
  },600);
};

input.addEventListener("keypress",e=>{
  if(e.key==="Enter") send.click();
});
