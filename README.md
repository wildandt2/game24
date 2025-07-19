# 🎴 24 Kartu 3D - Game Edukasi Matematika

**24 Kartu 3D** adalah game edukasi matematika berbasis web, di mana pemain harus menyusun ekspresi matematika menggunakan **4 kartu acak** sehingga hasilnya tepat **24**. Game ini memanfaatkan **Three.js** untuk visualisasi kartu 3D dan **GSAP** untuk animasi, serta UI interaktif untuk membangun ekspresi.

---

## Fitur

* **Visualisasi 3D** kartu remi acak (4 kartu tiap ronde)
* **Animasi kartu** dengan GSAP
* **UI ekspresi interaktif**: klik kartu & operator untuk membangun ekspresi
* **Validasi**: ekspresi harus menggunakan semua kartu (sekali saja per kartu)
* **Score**: tambah poin tiap kali berhasil mendapat 24
* **Ekspresi dapat diedit** (hapus token dengan klik)
* **Kartu J/Q/K/A otomatis dikonversi** ke angka (J/Q/K = 10, A = 11)
* **Responsif** di berbagai ukuran layar

---

## Aturan Permainan

1. **4 kartu acak** akan muncul di atas meja 3D.
2. Bangun ekspresi matematika (gunakan tombol kartu & operator) agar hasilnya **tepat 24**.

   * Setiap kartu hanya bisa dipakai **satu kali**.
   * Operator yang didukung: `+`, `-`, `*`, `/`, `(`, `)`.
   * Nilai kartu:

     * A = 11
     * J, Q, K = 10
     * 2-10 sesuai angka pada kartu
3. Setelah ekspresi selesai, klik **"Cek Jawaban"**.
4. Jika benar, poin bertambah 1 dan ekspresi di-reset.
5. Klik **"Kartu Baru"** untuk mengganti 4 kartu acak berikutnya.
6. Kamu bisa menghapus token (kartu/operator) di bar ekspresi dengan klik token tersebut.

---

## Cara Main (Langkah-Langkah)

1. **Buka halaman web** (pastikan elemen dengan id `threejs-container`, `cards-list`, `op-list`, `exp-bar`, `score`, `result`, `check-btn`, dan `new-btn` tersedia di HTML).
2. Pilih kartu (klik tombol kartu di bawah visual 3D).
3. Tambahkan operator matematika sesuai kebutuhan.
4. Ulangi hingga semua **4 kartu** dipakai (hanya satu kali per kartu).
5. Klik **"Cek Jawaban"** untuk memeriksa apakah hasilnya 24.
6. Jika ingin memulai ulang dengan 4 kartu baru, klik **"Kartu Baru"**.
7. Pantau poin kamu di pojok atas.

---

## Struktur Folder/Script Minimal

```txt
index.html
app.js         // Kode utama game (script di atas)
style.css      // (Optional) CSS untuk tombol/UI
```

Contoh HTML minimal:

```html
<div id="threejs-container"></div>
<div id="score"></div>
<div id="cards-list"></div>
<div id="op-list"></div>
<div id="exp-bar"></div>
<div id="result"></div>
<button id="check-btn">Cek Jawaban</button>
<button id="new-btn">Kartu Baru</button>
<script src="app.js" type="module"></script>
```

---

## Dependensi

* [three.js](https://threejs.org/)
* [GSAP](https://greensock.com/gsap/)

**Install via npm:**

```bash
npm install three gsap
```

atau bisa juga langsung import CDN pada HTML.

---

## Penjelasan Fitur Kode

* **generate4Cards**: Membuat 4 kartu acak (value, label, suit, color).
* **render3DCards**: Render kartu secara 3D menggunakan Three.js, posisi & animasi masuk ke meja.
* **renderCardButtons & renderOpButtons**: UI tombol kartu dan operator, dinamis, disable otomatis jika kartu sudah dipakai.
* **Ekspresi Array**: State ekspresi berupa array string (`expArr`), tiap klik kartu/operator akan masuk ke array.
* **Bar Ekspresi**: Ekspresi tampil di bar, bisa dihapus dengan klik token (kartu/operator), jika hapus kartu maka tombol kartu re-aktif.
* **Validasi Ekspresi**: Ekspresi hanya valid jika semua 4 kartu dipakai tepat sekali & urutannya sesuai, hasil ekspresi dihitung pakai `Function`.
* **Nilai Kartu**: J, Q, K = 10; A = 11; angka lain sesuai labelnya.
* **Skor**: Skor bertambah jika hasil ekspresi = 24.

---

## Catatan Teknis

* **Keamanan**: Ekspresi dihitung dengan `Function("return (exp)")`. Hanya karakter yang diizinkan (`0-9`, `+`, `-`, `*`, `/`, `()`, dan spasi).
* **Drag Kamera 3D**: Kamera bisa di-drag pakai mouse untuk melihat sudut lain.

---

## Lisensi

Game ini open-source dan dapat dikembangkan lebih lanjut.

---

**Selamat bermain dan mengasah logika matematikamu! 🎲**

---

Jika butuh README dalam format bahasa Inggris atau ingin tambahan fitur, silakan request!
