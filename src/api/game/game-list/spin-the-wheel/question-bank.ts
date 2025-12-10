export interface IQuestionItem {
  question: string;
  options: string[];
  answerIndex: number; // index di options
}

export const questionBank: Record<string, IQuestionItem[]> = {
  math: [
    {
      question: '7 × 8 = ?',
      options: ['54', '56', '58', '60'],
      answerIndex: 1,
    },
    { question: '12 ÷ 3 = ?', options: ['3', '4', '5', '6'], answerIndex: 1 },
    {
      question: 'Akar kuadrat dari 81?',
      options: ['7', '8', '9', '10'],
      answerIndex: 2,
    },
    {
      question: '25% dari 200 = ?',
      options: ['25', '40', '50', '75'],
      answerIndex: 2,
    },
    {
      question: 'Bilangan prima pertama?',
      options: ['0', '1', '2', '3'],
      answerIndex: 2,
    },

    // 🔽 Tambahan 5 soal baru
    {
      question: '10² = ?',
      options: ['20', '50', '100', '120'],
      answerIndex: 2,
    },
    {
      question: 'Hasil dari 9 + 6 × 2 = ?',
      options: ['21', '30', '18', '27'],
      answerIndex: 0, // 9 + (6×2) = 21
    },
    {
      question: 'Bilangan desimal dari 1/2 adalah…',
      options: ['0.2', '0.25', '0.4', '0.5'],
      answerIndex: 3,
    },
    {
      question: 'Luas persegi dengan sisi 8 cm?',
      options: ['16', '32', '64', '80'],
      answerIndex: 2,
    },
    {
      question: 'Hasil dari 45 – 19 = ?',
      options: ['26', '24', '22', '18'],
      answerIndex: 0,
    },
  ],

  language: [
    {
      question: 'Sinonim dari “indah” adalah…',
      options: ['cantik', 'buruk', 'jelek', 'kasar'],
      answerIndex: 0,
    },
    {
      question: 'Antonim dari “besar” adalah…',
      options: ['kecil', 'tinggi', 'lebar', 'panjang'],
      answerIndex: 0,
    },
    {
      question: 'Bahasa Inggris “meja” adalah…',
      options: ['chair', 'table', 'desk', 'shelf'],
      answerIndex: 1,
    },
    {
      question: 'Bentuk benar: “di mana” atau “dimana”?',
      options: ['di mana', 'dimana', 'kedua benar', 'kontekstual'],
      answerIndex: 0,
    },
    {
      question: 'Kata baku dari “ijin” adalah…',
      options: ['ijin', 'izin', 'ijien', 'izinan'],
      answerIndex: 1,
    },

    // 🔽 Tambahan 5 soal baru
    {
      question: 'Manakah yang termasuk kata kerja?',
      options: ['lari', 'indah', 'rumah', 'merah'],
      answerIndex: 0,
    },
    {
      question: 'Antonim dari “cepat” adalah…',
      options: ['lambat', 'ringan', 'kecil', 'halus'],
      answerIndex: 0,
    },
    {
      question: 'Bahasa Inggris dari “buku” adalah…',
      options: ['book', 'bag', 'back', 'box'],
      answerIndex: 0,
    },
    {
      question: 'Kalimat yang benar adalah…',
      options: [
        'Saya pergi kepasar.',
        'Saya pergi ke pasar.',
        'Saya pergi di pasar.',
        'Saya pasar pergi.',
      ],
      answerIndex: 1,
    },
    {
      question: 'Sinonim dari “marah” adalah…',
      options: ['kesal', 'senang', 'ceria', 'riang'],
      answerIndex: 0,
    },
  ],

  history: [
    {
      question: 'Proklamasi RI terjadi tahun…',
      options: ['1942', '1945', '1950', '1955'],
      answerIndex: 1,
    },
    {
      question: 'Candi Borobudur berasal dari masa…',
      options: ['Majapahit', 'Mataram Kuno', 'Sriwijaya', 'Tarumanegara'],
      answerIndex: 1,
    },
    {
      question: 'Penemu lampu pijar adalah…',
      options: ['Edison', 'Tesla', 'Bell', 'Newton'],
      answerIndex: 0,
    },
    {
      question: 'Perang Dunia II berakhir tahun…',
      options: ['1943', '1944', '1945', '1946'],
      answerIndex: 2,
    },
    {
      question: 'Kerajaan Sriwijaya berpusat di…',
      options: ['Palembang', 'Yogyakarta', 'Kutai', 'Banten'],
      answerIndex: 0,
    },

    // 🔽 Tambahan 5 soal baru
    {
      question: 'Presiden pertama Republik Indonesia adalah…',
      options: ['Soekarno', 'Hatta', 'Soeharto', 'Habibie'],
      answerIndex: 0,
    },
    {
      question: 'Candi Prambanan merupakan peninggalan agama…',
      options: ['Hindu', 'Buddha', 'Islam', 'Konghucu'],
      answerIndex: 0,
    },
    {
      question: 'Kerajaan Majapahit mencapai puncak kejayaan di bawah…',
      options: ['Ken Arok', 'Gajah Mada', 'Airlangga', 'Hayam Wuruk'],
      answerIndex: 3,
    },
    {
      question: 'Tokoh penemu telepon adalah…',
      options: ['Alexander Graham Bell', 'Marconi', 'Tesla', 'Einstein'],
      answerIndex: 0,
    },
    {
      question: 'Perang Dunia I dimulai tahun…',
      options: ['1900', '1914', '1920', '1930'],
      answerIndex: 1,
    },
  ],

  programming: [
    {
      question: 'Bahasa yang berjalan di browser?',
      options: ['Python', 'C++', 'JavaScript', 'Go'],
      answerIndex: 2,
    },
    {
      question: 'HTTP status untuk “Not Found”?',
      options: ['200', '301', '404', '500'],
      answerIndex: 2,
    },
    {
      question: 'npm adalah package manager untuk…',
      options: ['Node.js', 'Python', 'Ruby', 'PHP'],
      answerIndex: 0,
    },
    {
      question: 'Operator strict equality di JS?',
      options: ['==', '===', '!=', '!=='],
      answerIndex: 1,
    },
    {
      question: 'Git perintah membuat branch baru?',
      options: ['git new', 'git branch', 'git checkout', 'git switch'],
      answerIndex: 1,
    },

    // 🔽 Tambahan 5 soal baru
    {
      question: 'HTML merupakan singkatan dari…',
      options: [
        'Hyperlinks Text Marking Language',
        'HyperText Markup Language',
        'HyperTool Markup Language',
        'Hybrid Text Maker Language',
      ],
      answerIndex: 1,
    },
    {
      question: 'Perintah untuk melihat versi Node.js?',
      options: ['node -v', 'npm -v', 'node run', 'npm start'],
      answerIndex: 0,
    },
    {
      question: 'CSS digunakan untuk…',
      options: ['struktur', 'logika', 'styling', 'database'],
      answerIndex: 2,
    },
    {
      question: 'JSON adalah format…',
      options: ['gambar', 'audio', 'data', 'video'],
      answerIndex: 2,
    },
    {
      question: 'Git untuk melihat riwayat commit?',
      options: ['git log', 'git status', 'git init', 'git show'],
      answerIndex: 0,
    },
  ],
};
