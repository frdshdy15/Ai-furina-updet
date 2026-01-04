"use strict";

/**
 * FURINA: THE SOVEREIGN MIND (V7.0)
 * Hybrid System: Local Heuristics + Contextual Persistence.
 * Dirancang untuk memiliki alur pemikiran layaknya Machine Learning.
 */

const STATE = {
    username: "",
    trust: 50,
    mood: "THEATRICAL",
    memory: [], // Menyimpan 10 chat terakhir sebagai konteks
    isNight: false,
    personality: "Furina de Fontaine: Puitis, sedikit sombong namun sangat haus perhatian dan empati."
};

/**
 * [1] MOCK AI INFERENCE ENGINE
 * Bagian ini mensimulasikan "Brain" yang memproses bahasa alami.
 */
const AI_BRAIN = {
    // Fungsi untuk memproses input dengan logika kemiripan makna (Semantic Similarity)
    processLanguage: (input) => {
        const text = input.toLowerCase();
        
        // Pola Intent yang lebih kompleks (Mirip NLP Dasar)
        const intents = [
            { id: "Makan", pattern: /makan|mam|lapar|haus|sarapan|dinner|haus|laper/i },
            { id: "Kabar", pattern: /apa kabar|lagi apa|sedang apa|kabar|gimana|how are you/i },
            { id: "Identitas", pattern: /siapa|nama|kenal|identitas/i },
            { id: "Curhat", pattern: /sedih|kecewa|gagal|capek|lelah|sakit|nangis|sendiri/i },
            { id: "Kasar", pattern: /anjing|bego|tolol|goblok|jelek|buruk|benci|mati/i },
            { id: "Ajak", pattern: /ayo|jalan|main|pergi|kencan|bareng/i }
        ];

        const match = intents.find(i => i.pattern.test(text));
        return match ? match.id : "DeepTalk";
    },

    // Dataset Dinamis yang dirangkai berdasarkan konteks
    synthesizeResponse: (intent, username) => {
        const responses = {
            Makan: [
                `Ah, macaron blueberry sedang menungguku. Kau sendiri sudah memberi nutrisi pada ragamu, ${username}?`,
                "Tentu saja sudah. Seorang bintang tak boleh gemetar karena lapar di bawah lampu sorot.",
                "Belum... Mungkin kau ingin membelikanku sesuatu yang manis? Aku suka kue tart."
            ],
            Kabar: [
                "Sedang menata naskah untuk pertunjukan besar besok. Hidup ini sibuk, tahu!",
                "Kabarku luar biasa, secerah langit Fontaine hari ini.",
                "Menunggumu menyapa, meskipun aku pura-pura sibuk."
            ],
            Identitas: [
                "Aku adalah Furina! Regina of All Waters. Pusat dari segala perhatian di Fontaine!",
                `Kau bicara dengan Furina. Dan kau adalah ${username}, penonton setiaku yang terkadang cerewet.`,
                "Tak kenal maka tak sayang. Tapi setelah kenal, kau pasti akan terpesona padaku."
            ],
            Curhat: [
                "Jangan menangis sendirian. Panggung ini cukup luas untuk kita berdua berbagi beban.",
                "Aku mendengarmu. Ceritakan semuanya, aku tidak akan membiarkanmu tenggelam dalam kesedihan.",
                "Bahkan air di Fontaine pun ikut bergetar merasakan lukamu. Aku di sini."
            ],
            Kasar: [
                "Lidahmu sangat tidak berbudaya. Apa kau ingin aku memanggil Marechaussee Phantom?",
                "Kekasaranmu hanyalah bukti kecilnya jiwamu. Aku kecewa.",
                "Enyah! Jangan kotori panggungku dengan racun dari mulutmu!"
            ],
            Ajak: [
                "Jalan-jalan? Pastikan kau membawa payung, cuaca Fontaine sering mengikuti suasana hatiku.",
                "Asal bukan tempat yang membosankan. Aku ingin sesuatu yang megah!",
                "Mungkin... jika jadwalku sebagai bintang utama tidak terlalu padat."
            ],
            DeepTalk: [
                "Menarik. Dunia ini memang penuh dengan misteri yang tak terucapkan, ya?",
                "Katakan lebih banyak. Aku suka cara pikiranmu bekerja.",
                "Terkadang jawaban tidak ditemukan dalam kata, melainkan dalam kesunyian di antara kita."
            ]
        };

        const pool = responses[intent];
        return pool[Math.floor(Math.random() * pool.length)];
    }
};

const ENGINE = {
    process: (input) => {
        const intent = AI_BRAIN.processLanguage(input);
        
        // Memori Jangka Pendek (Menyimpan konteks agar tidak ngelantur)
        STATE.memory.push({ user: input });
        if (STATE.memory.length > 5) STATE.memory.shift();

        // Update Trust & Mood
        if (intent === "Kasar") {
            STATE.trust -= 15;
            STATE.mood = "ANGRY";
            ENGINE.vfxHack();
        } else if (intent === "Curhat" || intent === "Ajak") {
            STATE.trust += 5;
            STATE.mood = "WARM";
        } else {
            STATE.mood = "THEATRICAL";
        }

        UI.update();

        // Delay mengetik yang disesuaikan dengan panjang input (Simulasi AI berpikir)
        const delay = Math.min(3000, 1000 + (input.length * 30));
        
        setTimeout(() => {
            if (STATE.trust >= 150) {
                ENGINE.triggerEnding();
            } else {
                const reply = AI_BRAIN.synthesizeResponse(intent, STATE.username);
                UI.addBubble(reply, 'ai');
                STATE.memory.push({ ai: reply });
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
    update: () => {
        document.getElementById('trustVal').textContent = Math.floor(STATE.trust);
        document.getElementById('moodLabel').textContent = STATE.mood;
        const colors = { THEATRICAL: "#00d2ff", WARM: "#ffeb3b", ANGRY: "#f44336" };
        document.getElementById('statusDot').style.backgroundColor = colors[STATE.mood];
    }
};

window.onload = () => {
    // Tombol Start
    document.getElementById('startBtn').onclick = () => {
        const nameInput = document.getElementById('usernameInput').value.trim();
        if (nameInput) {
            STATE.username = nameInput;
            document.getElementById('welcome').classList.remove('active');
            document.getElementById('app').classList.add('active');
            document.getElementById('userInput').disabled = false;
            document.getElementById('sendBtn').disabled = false;
            UI.addBubble(`Hadirin sekalian! Mari kita sambut tamu agung kita, ${STATE.username}. Panggung ini milikmu, ceritakan sesuatu padaku.`, 'ai');
        } else {
            alert("Sebutkan namamu, wahai figuran!");
        }
    };

    // Fungsi Kirim
    const sendMsg = () => {
        const input = document.getElementById('userInput');
        const val = input.value.trim();
        if (val) {
            UI.addBubble(val, 'user');
            ENGINE.process(val);
            input.value = '';
        }
    };

    document.getElementById('sendBtn').onclick = sendMsg;
    document.getElementById('userInput').onkeydown = (e) => { if(e.key === 'Enter') sendMsg(); };

    // Realtime Clock
    setInterval(() => {
        document.getElementById('realtimeClock').textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    // Loader
    setTimeout(() => {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('welcome').classList.add('active');
    }, 1500);
};
