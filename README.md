# Game 24 Remi 3D

Game matematika **"24"** berbasis web dengan tampilan **kartu remi 3D** menggunakan Three.js + TypeScript + Vite.

---

## 🎮 Fitur Utama

* 4 kartu remi acak tampil di meja 3D (drag mouse untuk memutar kamera).
* Klik kartu & tombol operasi (+, -, \*, /, (, )) untuk menyusun ekspresi matematika.
* Input ekspresi juga bisa manual (A, J, Q, K otomatis dikonversi ke angka).
* Klik **"Cek Jawaban"** untuk memeriksa hasil (harus tepat 24).
* Klik **"Kartu Baru"** untuk mengacak kartu remi lain.
* UI simple, edukatif, responsif.

---

## 🚀 Cara Install & Menjalankan

1. **Clone repository ini:**

   ```bash
   git clone https://github.com/wildandt2/game24.git
   cd game24
   ```

2. **Install dependency:**

   ```bash
   npm install
   ```

3. **Jalankan development server:**

   ```bash
   npm run dev
   ```

   Buka browser ke [http://localhost:5173](http://localhost:5173)
   *(link default dari Vite, bisa berubah sesuai konfigurasi/port)*

---

## 🛠️ Teknologi & Library

* [Three.js](https://threejs.org/) — Untuk render 3D kartu remi.
* [TypeScript](https://www.typescriptlang.org/) — Untuk keamanan dan struktur code.
* [Vite](https://vitejs.dev/) — Build & dev server modern.
* [NPM](https://www.npmjs.com/) — Manajemen package.

---

## 📁 Struktur Folder

```
game24-3d/
├─ index.html
├─ style.css
├─ README.md
├─ tsconfig.json
├─ package.json
└─ src/
   └─ main.ts
```

---

## ✏️ Cara Main

1. 4 kartu remi acak muncul di meja 3D.
2. Susun ekspresi matematika yang memakai **semua kartu** (klik kartu/operator atau ketik manual).
3. Klik **"Cek Jawaban"**:

   * Jika ekspresi valid & hasil 24 → “🎉 Benar! Hasilnya 24”.
   * Jika salah, muncul hasil ekspresi yang kamu buat.
4. Klik **"Kartu Baru"** untuk mengacak ulang 4 kartu.

> **Note:**
>
> * Label A = 1, J = 11, Q = 12, K = 13
> * Ekspresi wajib pakai semua kartu (urutan bebas, kombinasi operator bebas).

---

## 📝 Catatan Developer

* Semua kode dan asset open source untuk edukasi/pengembangan.
* Jangan push folder `node_modules` dan `dist` ke repo (sudah di `.gitignore`).
* Untuk kontribusi (PR/bug), silakan open issue/pull request!

---

## 💡 Ide Pengembangan Selanjutnya

* Animasi flip kartu/drag-and-drop ekspresi.
* Skor, timer, multi-level, leaderboard.
* Mode mobile responsive.
* Deploy ke GitHub Pages untuk live demo.

---

> Dibuat oleh [@wildandt2](https://github.com/wildandt2) — Powered by Three.js & TypeScript.
