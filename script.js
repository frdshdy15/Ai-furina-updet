"use strict";

/**
 * FURINA: THE LIVING SOUL (V5.0 - MEMORY CORE)
 * Fitur: Long-Term Memory, Contextual Recall, Deep Empathy
 * Logic by: Frdshdy
 */

const STATE = {
    username: "Traveler",
    trust: 30,
    mood: "THEATRICAL", 
    // Memori Jangka Panjang: Menyimpan fakta tentang user
    memoryBank: {
        lastTopic: "",
        userFeelings: [],
        secrets: [],
        mentionCount: 0
    },
    isEnded: false
};

// --- [1] SOUL FRAGMENTS (Dataset Puitis & Empati) ---
const SOUL = {
    fillers: {
        THEATRICAL: ["Tahukah kau,", "Di atas panggung ini,", "Seorang Archon sepertiku melihat..."],
        MELANCHOLY: ["Di kegelapan Fontaine,", "Air mata yang jatuh ke laut...", "Terkadang sepi itu..."],
        WARM: ["Dengar, figuran kecilku,", "Mungkin kau benar,", "Aku ada di sini untukmu,"],
        ANGRY: ["Cukup!", "Lidahmu terlalu tajam!", "Beraninya kau menodai panggungku!"]
    },
    wisdoms: {
        curhat: [
            "beban yang kau pikul tidak harus kau tanggung sendirian di bawah lampu sorot.",
            "setiap luka adalah skenario yang akan membuatmu lebih kuat di babak berikutnya.",
            "dunia mungkin tidak mendengarmu, tapi air di Fontaine mencatat setiap keluhanmu."
        ],
        life: [
            "bahwa hidup hanyalah opera panjang tanpa waktu istirahat.",
            "keadilan seringkali hanya sebuah ilusi yang kita ciptakan agar bisa tidur nyenyak.",
            "macaron dan teh sore adalah obat terbaik untuk jiwa yang lelah."
        ]
    }
};

const ENGINE = {
    // Memahami Niat & Menyimpan ke Memori
    analyzeAndRemember: (text) => {
        const input = text.toLowerCase();
        
        // Simpan potongan memori jika user curhat
        if (/(sedih|capek|lelah|masalah|sendiri|sakit|gagal)/i.test(input)) {
            STATE.memoryBank.userFeelings.push(input);
            return "SUPPORT";
        }
        if (/(sayang|cinta|suka|keren|hebat|cantik)/i.test(input)) {
            return "ROMANTIC";
        }
        if (/(makan|minum|kabar|apa kabar)/i.test(input)) {
            return "DAILY";
        }
        if (/(anjing|bego|tolol|jahat|goblok)/i.test(input)) {
            return "INSULT";
        }
        return "GENERAL";
    },

    // Algoritma Berpikir dengan Recall (Mengingat Masa Lalu)
    synthesize: (intent, rawText) => {
        const f = SOUL.fillers;
        const w = SOUL.wisdoms;
        let response = "";

        // 1. LOGIKA RECALL (Mengingat pesan sebelumnya)
        if (STATE.memoryBank.userFeelings.length > 2 && Math.random() > 0.6) {
            const oldFeeling = STATE.memoryBank.userFeelings[0];
            response = `Tadi kau bilang kau merasa '${oldFeeling}'... Aku masih memikirkannya. Jangan pikir aku tidak peduli hanya karena aku seorang bintang.`;
            STATE.memoryBank.userFeelings.shift(); // Hapus memori yang sudah disebut
            return response;
        }

        // 2. LOGIKA RESPON BERDASARKAN INTENT
        const moodType = STATE.mood;
        const filler = f[moodType][Math.floor(Math.random() * f[moodType].length)];

        switch(intent) {
            case "SUPPORT":
                response = `${filler} ${w.curhat[Math.floor(Math.random() * w.curhat.length)]}`;
                STATE.mood = "WARM";
                STATE.trust += 5;
                break;
            case "ROMANTIC":
                response = `${filler} pujianmu menari di hatiku, meski aku tak mau mengakuinya.`;
                STATE.mood = "WARM";
                STATE.trust += 8;
                break;
            case "INSULT":
                response = `${filler} suaramu mengganggu simfoniku. Jaga etikamu!`;
                STATE.mood = "ANGRY";
                STATE.trust -= 15;
                ENGINE.vfxHack();
                break;
            default:
                response = `${filler} ${w.life[Math.floor(Math.random() * w.life.length)]}`;
                STATE.mood = "THEATRICAL";
        }

        return response;
    },

    process: (input) => {
        if (STATE.isEnded) return;

        const intent = ENGINE.analyzeAndRemember(input);
        UI.update();

        // Simulasi Furina merenungkan jawaban (Delay natural)
        const thinkingTime = 1500 + (Math.random() * 2000);
        
        setTimeout(() => {
            if (STATE.trust >= 130) {
                ENGINE.triggerEnding();
            } else {
                const reply = ENGINE.synthesize(intent, input);
                UI.addBubble(reply, 'ai');
            }
        }, thinkingTime);
    },

    vfxHack: () => {
        document.getElementById('app').classList.add('reality-hack');
        setTimeout(() => document.getElementById('app').classList.remove('reality-hack'), 1000);
    },

    triggerEnding: () => {
        STATE.isEnded = true;
        UI.addBubble("Tirai telah tertutup... Terima kasih telah menjadi bagian dari naskah hidupku yang berantakan ini.", "ai");
        setTimeout(() => {
            document.getElementById('app').classList.remove('active');
            document.getElementById('ending').classList.add('active');
            // FLAG SESUAI PERMINTAAN
            document.getElementById('flagValue').textContent = "FLAG{minta uang ke daus buat beli nasi padang}";
        }, 2500);
    }
};

const UI = {
    addBubble: (msg, type) => {
        const chat = document.getElementById('chat');
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.textContent = msg;
        chat.appendChild(div);
        chat.scrollTo({ top: chat.scrollHeight, behavior: 'smooth' });
    },
    update: () => {
        document.getElementById('trustVal').textContent = Math.floor(STATE.trust);
        document.getElementById('moodLabel').textContent = STATE.mood;
        const colors = { THEATRICAL: "#00d2ff", WARM: "#ffeb3b", ANGRY: "#f44336", MELANCHOLY: "#9c27b0" };
        document.getElementById('statusDot').style.backgroundColor = colors[STATE.mood];
    }
};

// --- INITIALIZER ---
window.onload = () => {
    document.getElementById('userInput').onpaste = e => e.preventDefault();

    document.getElementById('startBtn').onclick = () => {
        const name = document.getElementById('usernameInput').value.trim();
        if (name) {
            STATE.username = name;
            document.getElementById('welcome').classList.remove('active');
            document.getElementById('app').classList.add('active');
            document.getElementById('userInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            UI.addBubble(`Hadirin sekalian! Terutama kau, ${STATE.username}. Panggung ini sudah menantimu. Ceritakan segalanya padaku!`, 'ai');
        }
    };

    const send = () => {
        const input = document.getElementById('userInput');
        if (input.value.trim()) {
            UI.addBubble(input.value, 'user');
            ENGINE.process(input.value);
            input.value = '';
        }
    };

    document.getElementById('sendBtn').onclick = send;
    document.getElementById('userInput').onkeydown = e => { if (e.key === 'Enter') send(); };

    setInterval(() => {
        document.getElementById('realtimeClock').textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    setTimeout(() => {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('welcome').classList.add('active');
    }, 1500);
};
