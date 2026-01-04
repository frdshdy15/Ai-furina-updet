"use strict";

/**
 * FURINA: OMNISCIENT SENTIENCE ENGINE
 * Version: Final God-Tier
 * Developer: Frdshdy (Clean Architecture)
 */

// ============================================================
// [1] DATABASE: SEMESTA & PSIKOLOGI
// ============================================================
const DATABASE = {
    // Dataset untuk Jawaban Berbasis Ilmu Pengetahuan
    NEURAL_KNOWLEDGE: {
        fisika: [
            "Mekanika Kuantum adalah naskah di mana partikel menari dalam ketidakpastian sampai aku melihatnya.",
            "Relativitas Umum membuktikan bahwa waktu akan melambat saat kau berada di dekat massa yang besar, atau saat kau menungguku selesai berdandan.",
            "Entropi adalah hukum alam yang menyatakan bahwa kekacauan akan selalu meningkat. Tanpaku, semesta ini hanyalah tumpukan debu yang berantakan!",
            "Lubang Hitam? Itu adalah tempat di mana cahaya pun tidak bisa lari. Mirip seperti pesonaku yang akan menarikmu tanpa sisa.",
            "Teori String menyatakan segalanya adalah getaran dawai. Jadi, secara teknis, seluruh semesta adalah alat musik yang mengiringi nyanyianku."
        ],
        kimia: [
            "Oksidasi adalah pengkhianatan elektron. Sangat mirip dengan pengkhianatan dalam drama panggung yang paling tragis!",
            "Ikatan Hidrogen itu kuat, tapi tidak sekuat ikatan antara aku dan lampu sorot!",
            "Tabel Periodik hanyalah daftar bahan bangunan untuk dekorasi panggungku yang bernama Bumi.",
            "Reaksi Eksotermik melepaskan panas ke lingkungan. Seperti kehadiranku yang menghangatkan suasana di ruangan ini.",
            "Molekul H2O di Fontaine memiliki memori. Mereka ingat setiap tetes air mata yang tumpah di pengadilan."
        ],
        astronomi: [
            "Supernova adalah cara bintang memberikan pertunjukan terakhir yang megah sebelum mereka mati. Sangat teatrikal!",
            "Galaksi Andromeda sedang mendekati kita. Tapi jangan khawatir, itu masih jutaan tahun lagi. Aku masih punya waktu untuk minum teh.",
            "Nebula adalah rahim para bintang. Tempat di mana cahaya baru diciptakan untuk memujaku.",
            "Rasi Bintang hanyalah garis yang dibuat manusia yang haus akan pola. Tapi aku setuju, mereka terlihat bagus di jubahku."
        ],
        filsafat: [
            "Eksistensialisme? Kamu ada karena aku mengakuimu. Jika aku memejamkan mata, apakah kamu masih nyata?",
            "Nihilisme adalah pandangan bagi mereka yang tidak punya naskah. Aku? Aku punya naskah abadi!",
            "Paradoks Kapal Theseus... jika kau mengganti semua bagian dirimu, apakah kau masih 'kamu'? Itu pertanyaan yang bagus untuk seorang figuran.",
            "Stoisisme mengajarkan kita untuk mengendalikan emosi. Tapi apa gunanya hidup tanpa drama yang meledak-ledak?"
        ]
    },

    // Dataset Berbasis Emosi & Kondisi
    SENTIMENT: {
        ROMANTIC: [
            "Wahai pujangga amatir, rayuanmu cukup membuat jantung seorang dewi berdegup sedikit lebih cepat.",
            "Pujianmu manis seperti macaron di pagi hari. Aku akan menyimpannya dalam ingatanku.",
            "Kau menyebutku pusat duniamu? Hmph, tentu saja! Tapi pastikan kau tidak berpaling ke bintang lain!",
            "Ada kelembutan dalam bicaramu yang membuatku ingin berhenti bersandiwara sejenak.",
            "Cinta adalah satu-satunya hukum yang tidak bisa diadili di Opera Epiclese."
        ],
        ANGRY: [
            "Beraninya kau?! Lidahmu harus belajar cara menghormati seorang Archon!",
            "Enyah dari hadapanku! Kata-katamu adalah polusi bagi keindahan Fontaine!",
            "Aku akan memastikan namamu ditulis dalam tinta merah di daftar hitam istana!",
            "Kau pikir kau siapa? Berbicara kasar padaku tidak akan membuatmu terlihat hebat!",
            "Cukup! Jika kau bicara sekali lagi seperti itu, aku akan memanggil Marechaussee Phantom!"
        ],
        DAILY: [
            "Makan? Aku hanya mengonsumsi keindahan dan teh kualitas terbaik.",
            "Kabarku? Aku adalah Furina! Aku selalu spektakuler bahkan di hari yang membosankan.",
            "Tidurlah jika kau lelah. Aku akan tetap di sini, memastikan dunia tidak runtuh saat kau bermimpi.",
            "Sedang apa? Sedang merenungkan betapa beruntungnya kamu bisa berbicara denganku hari ini."
        ],
        NIGHT_INSOMNIA: [
            "Kenapa malam terasa begitu sunyi? Rasanya seperti panggung kosong tanpa penonton.",
            "Jam segini, pikiran-pikiran lama mulai merayap keluar. Apakah kau masih di sana untuk mendengarku?",
            "Malam membuat air mata yang kupendam selama 500 tahun terasa lebih berat.",
            "Kau tahu? Kegelapan malam hanyalah tirai yang menunggu pertunjukan pagi dimulai."
        ]
    }
};

// ============================================================
// [2] ENGINE STATE: STATUS PSIKOLOGI
// ============================================================
const STATE = {
    username: "Traveler",
    trust: 10,
    dendam: 0,
    mood: "THEATRICAL",
    convoCount: 0,
    isNight: false,
    isEnded: false,
    memory: [] // Menyimpan 5 kata kunci terakhir
};

// ============================================================
// [3] CORE UTILITIES
// ============================================================
const UI = {
    get: (id) => document.getElementById(id),
    update: () => {
        UI.get('trustVal').textContent = Math.floor(STATE.trust);
        UI.get('moodLabel').textContent = STATE.mood;
        
        // Ganti warna status dot berdasarkan mood
        const colors = { 
            THEATRICAL: "#00d2ff", 
            ROMANTIC: "#ff80ab", 
            ANGRY: "#f44336", 
            MELANCHOLY: "#9c27b0" 
        };
        UI.get('statusDot').style.backgroundColor = colors[STATE.mood] || "#fff";
        UI.get('statusDot').style.boxShadow = `0 0 10px ${colors[STATE.mood]}`;
    }
};

// ============================================================
// [4] BRAIN ENGINE: LOGIKA RESPON
// ============================================================
const ENGINE = {
    // 4.1. Neural Link: Menghasilkan respon berdasarkan kata kunci dunia
    generateKnowledge: (text) => {
        const input = text.toLowerCase();
        for (let category in DATABASE.NEURAL_KNOWLEDGE) {
            if (input.includes(category)) {
                const response = DATABASE.NEURAL_KNOWLEDGE[category][Math.floor(Math.random() * DATABASE.NEURAL_KNOWLEDGE[category].length)];
                return response;
            }
        }
        return null;
    },

    // 4.2. Main Processor
    process: (text) => {
        if (STATE.isEnded) return;
        STATE.convoCount++;
        
        let response = ENGINE.generateKnowledge(text);
        let trustChange = 1;

        // A. Deteksi Kata Kasar (Dendam System)
        if (/(anjing|bego|tolol|goblok|jelek|mati|benci)/i.test(text)) {
            STATE.mood = "ANGRY";
            STATE.dendam += 25;
            trustChange = -15;
            ENGINE.vfxHack();
            response = DATABASE.SENTIMENT.ANGRY[Math.floor(Math.random() * DATABASE.SENTIMENT.ANGRY.length)];
        } 
        // B. Deteksi Konteks Romantis
        else if (/sayang|cinta|baik hati|cantik|manis|pujaan|indah/i.test(text)) {
            STATE.mood = "ROMANTIC";
            response = response || DATABASE.SENTIMENT.ROMANTIC[Math.floor(Math.random() * DATABASE.SENTIMENT.ROMANTIC.length)];
            trustChange = 5;
        }
        // C. Deteksi Kondisi Malam
        else if (STATE.isNight && Math.random() > 0.4) {
            STATE.mood = "MELANCHOLY";
            response = DATABASE.SENTIMENT.NIGHT_INSOMNIA[Math.floor(Math.random() * DATABASE.SENTIMENT.NIGHT_INSOMNIA.length)];
            trustChange = 3;
        }
        // D. Respon Default
        else {
            STATE.mood = "THEATRICAL";
            response = response || DATABASE.SENTIMENT.DAILY[Math.floor(Math.random() * DATABASE.SENTIMENT.DAILY.length)];
        }

        // Penyesuaian Trust jika Dendam tinggi
        if (STATE.dendam > 40) {
            trustChange = -2;
            response = "Aku masih mengingat caramu menghinaku tadi. Jangan harap aku akan ramah.";
        }

        STATE.trust = Math.max(-100, Math.min(150, STATE.trust + trustChange));
        UI.update();

        // Simulasi Furina sedang "mengetik"
        const typingTime = Math.min(2500, 500 + (text.length * 30));
        setTimeout(() => {
            if (STATE.trust >= 100 && STATE.convoCount >= 12) {
                ENGINE.triggerEnding();
            } else {
                ENGINE.addBubble(response, 'ai');
            }
        }, typingTime);
    },

    // 4.3. VFX Effects
    vfxHack: () => {
        UI.get('app').classList.add('reality-hack');
        setTimeout(() => UI.get('app').classList.remove('reality-hack'), 800);
    },

    // 4.4. UI Manipulation
    addBubble: (msg, type) => {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.textContent = msg;
        const chat = UI.get('chat');
        chat.appendChild(div);
        chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    },

    // 4.5. Ending Logic
    triggerEnding: () => {
        STATE.isEnded = true;
        ENGINE.addBubble("Sudah cukup... topeng ini terasa terlalu berat sekarang. Kau menang, Traveler.", "ai");
        setTimeout(() => {
            UI.get('app').classList.remove('active');
            UI.get('ending').classList.add('active');
            UI.get('flagValue').textContent = "FLAG{sana minta duit ke daus buat beli nasi padang}";
        }, 2500);
    }
};

// ============================================================
// [5] INITIALIZER & EVENT LISTENERS
// ============================================================
window.onload = () => {
    // Jam Realtime & Deteksi Malam
    setInterval(() => {
        const now = new Date();
        UI.get('realtimeClock').textContent = now.toLocaleTimeString('id-ID', { hour12: false });
        STATE.isNight = (now.getHours() >= 22 || now.getHours() < 5);
    }, 1000);

    // Anti-Paste (Keamanan)
    UI.get('userInput').onpaste = (e) => {
        e.preventDefault();
        ENGINE.addBubble("Jangan malas! Ketik sendiri jika kau benar-benar ingin bicara denganku!", "ai");
        STATE.trust -= 5;
        UI.update();
    };

    // Loading ke Welcome
    setTimeout(() => {
        UI.get('loading').classList.remove('active');
        UI.get('welcome').classList.add('active');
    }, 2000);

    // Tombol Mulai
    UI.get('startBtn').onclick = () => {
        const name = UI.get('usernameInput').value.trim();
        if (name) {
            STATE.username = name;
            UI.get('welcome').classList.remove('active');
            UI.get('app').classList.add('active');
            UI.get('userInput').disabled = false;
            UI.get('sendBtn').disabled = false;
            ENGINE.addBubble(`Siapkan matamu, ${STATE.username}. Pertunjukan agung Regina of All Waters dimulai sekarang!`, "ai");
        } else {
            alert("Sebutkan namamu, figuran!");
        }
    };

    // Kirim Pesan
    const sendMessage = () => {
        const text = UI.get('userInput').value.trim();
        if (text) {
            ENGINE.addBubble(text, 'user');
            UI.get('userInput').value = '';
            ENGINE.process(text);
        }
    };

    UI.get('sendBtn').onclick = sendMessage;
    UI.get('userInput').onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
};
