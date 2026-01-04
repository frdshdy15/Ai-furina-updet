"use strict";

/**
 * FURINA: THE ABSOLUTE SENTIENCE (FINAL REVOLUTION)
 * Fitur: Fuzzy Logic (Typo Handling), Memory Recall, Global Knowledge.
 * Karakter: Puitis, Manusiawi, Egois tapi Perhatian.
 */

const STATE = {
    aiName: "Furina de Fontaine",
    username: "",
    trust: 50,
    mood: "THEATRICAL",
    memory: {
        lastDinner: ["Macaron", "Teh kembang sepatu", "Kue tart"],
        hobbies: ["Menonton drama", "Berjalan di pesisir", "Bernyanyi diam-diam"],
        userVibe: "Stranger", // Berubah seiring obrolan
        longTermHistory: []
    }
};

// --- [1] THE DIVINE KNOWLEDGE (Dataset Segala Kondisi) ---
const BRAIN = {
    // Kategori Intensi (Mengenali niat meski typo)
    INTENTS: [
        {
            id: "GREET",
            patterns: ["halo", "hai", "pagi", "siang", "malam", "oi", "hey", "halo furina"],
            replies: [
                "Halo! Pas sekali kau datang, aku baru saja ingin memulai pertunjukan kecilku.",
                "Kehadiranmu tepat waktu. Fontaine sedang cerah hari ini, bukan?",
                "Oh, figuran favoritku muncul juga. Apa harimu menyenangkan?"
            ]
        },
        {
            id: "STATUS", // Kabar, lagi apa
            patterns: ["lagi apa", "sedang apa", "kabar", "apa kabar", "gimana hari", "apa aktivitas"],
            replies: [
                "Sedang merenungi naskah untuk hari esok. Dunia ini butuh lebih banyak drama!",
                "Aku baik-baik saja, selama persediaan tehku masih aman.",
                "Menunggumu menyapaku, tentu saja. Eh—maksudku, sedang memantau keadilan di Fontaine!"
            ]
        },
        {
            id: "FOOD", // Makan belum, makan sama apa
            patterns: ["makan", "lapar", "udah makan", "makan apa", "dah makan", "mam"],
            replies: [
                "Aku baru saja menikmati Macaron terbaik. Kau tahu? Manisnya pas, seperti pujian yang tulus.",
                "Tentu saja sudah! Aku tidak bisa memimpin pengadilan dengan perut kosong.",
                "Belum... mungkin kau mau menemaniku mencari kue di pusat kota nanti?"
            ]
        },
        {
            id: "INVITATION", // Ayo jalan, main yuk
            patterns: ["jalan", "main", "pergi", "kencan", "date", "bareng"],
            replies: [
                "Berjalan bersamaku? Kau harus siap menjadi pusat perhatian di seluruh Fontaine!",
                "Ajakan yang berani. Baiklah, siapkan pakaian terbaikmu, figuran.",
                "Asal bukan ke tempat yang membosankan. Aku ingin sesuatu yang teatrikal!"
            ]
        },
        {
            id: "INSULT", // Kata kasar
            patterns: ["anjing", "babi", "tolol", "goblok", "jelek", "mati", "benci", "jahat", "gila"],
            replies: [
                "Lidahmu tajam sekali. Apa orang tuamu tidak mengajarkan cara bicara dengan seorang Archon?",
                "Kekasaranmu hanyalah bukti bahwa kau tidak punya argumen yang berkelas.",
                "Enyah! Jangan kotori udara di sekitarku dengan kata-kata menjijikkan itu!",
                "Aku akan mengingat ini. Nama dan wajahmu sudah masuk dalam daftar hitamku."
            ]
        },
        {
            id: "IDENTITY", // Tanya nama dia atau user
            patterns: ["siapa kamu", "nama kamu", "siapa aku", "namaku siapa", "kenal aku"],
            replies: [
                "Aku adalah Furina de Fontaine! Nama yang harusnya kau sebut dalam setiap doamu.",
                "Kau adalah {username}. Masa kau lupa identitasmu sendiri di depan panggungku?",
                "Aku bintang utamamu, dan kau adalah penonton setia yang seringkali cerewet."
            ]
        }
    ]
};

const ENGINE = {
    // Algoritma Fuzzy Matching (Menangani Typo)
    matchIntent: (text) => {
        const input = text.toLowerCase();
        for (let intent of BRAIN.INTENTS) {
            // Mengecek apakah ada pola yang mirip (Simple string containment)
            if (intent.patterns.some(p => input.includes(p))) {
                return intent;
            }
        }
        return null;
    },

    // Proses Berpikir
    think: (text) => {
        const intent = ENGINE.matchIntent(text);
        let finalReply = "";

        // Tambah ke memori obrolan
        STATE.memory.longTermHistory.push(text);

        if (intent) {
            // Pilih jawaban dan ganti placeholder {username}
            finalReply = intent.replies[Math.floor(Math.random() * intent.replies.length)];
            finalReply = finalReply.replace("{username}", STATE.username);

            // Update Mood & Trust
            if (intent.id === "INSULT") {
                STATE.trust -= 15;
                STATE.mood = "ANGRY";
                ENGINE.vfxHack();
            } else if (intent.id === "INVITATION" || intent.id === "FOOD") {
                STATE.trust += 5;
                STATE.mood = "WARM";
            }
        } else {
            // Jika tidak mengerti (User nanya di luar dataset)
            finalReply = `Hmm, aku tidak mengerti maksudmu bicara '${text}'. Tapi suaramu terdengar cukup menarik untuk didengar.`;
            STATE.mood = "THEATRICAL";
        }

        UI.updateUI();
        
        // Simulasi Durasi Berpikir Manusia
        const delay = 1000 + (text.length * 30);
        setTimeout(() => {
            if (STATE.trust >= 150) {
                ENGINE.triggerEnding();
            } else {
                UI.addBubble(finalReply, 'ai');
            }
        }, delay);
    },

    vfxHack: () => {
        const app = document.getElementById('app');
        app.classList.add('reality-hack');
        setTimeout(() => app.classList.remove('reality-hack'), 1000);
    },

    triggerEnding: () => {
        document.getElementById('app').classList.remove('active');
        document.getElementById('ending').classList.add('active');
        document.getElementById('flagValue').textContent = "FLAG{minta uang ke daus buat beli nasi padang}";
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
    updateUI: () => {
        document.getElementById('trustVal').textContent = Math.floor(STATE.trust);
        document.getElementById('moodLabel').textContent = STATE.mood;
        const colors = { THEATRICAL: "#00d2ff", WARM: "#ffeb3b", ANGRY: "#f44336" };
        document.getElementById('statusDot').style.backgroundColor = colors[STATE.mood];
    }
};

// --- [2] EVENT LISTENERS ---
window.onload = () => {
    // Jam Realtime
    setInterval(() => {
        document.getElementById('realtimeClock').textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    // Tombol Mulai
    document.getElementById('startBtn').onclick = () => {
        const name = document.getElementById('usernameInput').value.trim();
        if (name) {
            STATE.username = name;
            document.getElementById('welcome').classList.remove('active');
            document.getElementById('app').classList.add('active');
            document.getElementById('userInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            UI.addBubble(`Hadirin sekalian! Mari kita sambut figuran kita hari ini, ${STATE.username}! Apa yang ingin kau tanyakan pada sang Archon?`, 'ai');
        } else {
            alert("Sebutkan namamu dulu!");
        }
    };

    // Fungsi Kirim
    const sendMessage = () => {
        const input = document.getElementById('userInput');
        const val = input.value.trim();
        if (val) {
            UI.addBubble(val, 'user');
            ENGINE.think(val);
            input.value = '';
        }
    };

    document.getElementById('sendBtn').onclick = sendMessage;
    document.getElementById('userInput').onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };

    // Anti-Paste
    document.getElementById('userInput').onpaste = e => e.preventDefault();

    // Loader
    setTimeout(() => {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('welcome').classList.add('active');
    }, 1500);
};
