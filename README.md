# Mini 3D Scene dengan Three.js — Progress Praktikum Pertemuan 6

**Nama Mahasiswa:** Mohammad Najib Bahrudin  
**NRP:** 5025241230  
**Mata Kuliah:** EF234504 — Grafika Komputer  
**Judul Praktikum:** Pertemuan 6 — Introduction to Three.js (Mini 3D Scene)  
**Dosen Pengampu:** Dr. Darlis Herumurti  
**Departemen:** Teknik Informatika — Institut Teknologi Sepuluh Nopember  

---

## 1. Deskripsi Scene
Aplikasi ini merupakan implementasi progres praktikum **Mini 3D Scene** berbasis **Three.js** yang dibangun menggunakan **Node.js + Vite**. Proyek ini menerapkan seluruh tahapan dari **Milestone 1 hingga Milestone 10**:
- Abstraksi WebGL melalui Three.js `Scene`, `PerspectiveCamera`, dan `WebGLRenderer`.
- Geometri dasar 3D di ruang spasial: Kubus (`BoxGeometry`), Bola (`SphereGeometry`), dan Lantai (`PlaneGeometry`).
- Sistem pencahayaan dinamis (`AmbientLight` dan `DirectionalLight`).
- Proyeksi bayangan realistis (*Shadow Mapping*) menggunakan `PCFSoftShadowMap`.
- Animasi kontinu berbasis **Delta Time** (`THREE.Clock`) agar pergerakan objek stabil di segala *frame rate*.
- Penanganan resolusi responsif terhadap perubahan ukuran layar browser (*responsive rendering*).

---

## 2. Daftar Geometry

| No. | Objek | Geometry | Dimensi / Segmen | Keterangan |
|:---:|:---|:---|:---|:---|
| 1 | **Cube** | `THREE.BoxGeometry` | $1 \times 1 \times 1$ (diskalakan $1.2, 0.8, 1.2$) | Objek kubus utama dengan transformasi |
| 2 | **Sphere** | `THREE.SphereGeometry` | radius: $0.7$, segmen: $32 \times 16$ | Objek bola dengan kalkulasi pantulan cahaya |
| 3 | **Ground** | `THREE.PlaneGeometry` | $10 \times 10$ (rotasi $X = -90^\circ$) | Bidang datar penerima bayangan |

---

## 3. Daftar Material

1. **`MeshLambertMaterial` (Warna Cyan `#22d3ee` pada Cube):**
   * Menghasilkan pantulan difus (*diffuse reflection*) berdasarkan sudut jatuh cahaya (hukum Lambert). Tidak memiliki kilap (*matte*).
2. **`MeshPhongMaterial` (Warna Biru `#4488ff` pada Sphere):**
   * Menggunakan model shading Blinn-Phong dengan parameter `shininess: 60`, menghasilkan titik kilap (*specular highlight*) yang mengkilap saat terkena cahaya langsung.
3. **`MeshLambertMaterial` (Warna Slate `#334155` pada Ground):**
   * Material difus untuk permukaan lantai penangkap bayangan.

---

## 4. Daftar Light (Pencahayaan)

1. **`THREE.AmbientLight`:**
   * Warna: Putih (`0xffffff`), Intensitas: $0.35$.
   * Menerangi seluruh scene dari segala arah tanpa arah spesifik, mencegah bagian objek yang tidak terkena sinar langsung menjadi gelap gulita.
2. **`THREE.DirectionalLight`:**
   * Warna: Putih (`0xffffff`), Intensitas: $2.0$, Posisi: $(3, 5, 2)$.
   * Bertindak sebagai sumber cahaya utama sejajar (*parallel rays*) seperti matahari yang memproyeksikan bayangan objek ke lantai.

---

## 5. Konfigurasi Shadow (Bayangan)

Rantai konfigurasi bayangan yang diaktifkan:
1. **Renderer:**
   * `renderer.shadowMap.enabled = true;`
2. **Light:**
   * `directionalLight.castShadow = true;`
   * Resolusi shadow map: `1024 x 1024` piksel.
   * Batas volume kamera bayangan ortografis: `left: -5`, `right: 5`, `top: 5`, `bottom: -5`, `near: 0.5`, `far: 20`.
3. **Caster (Penghasil Bayangan):**
   * `cube.castShadow = true;`
   * `sphere.castShadow = true;`
4. **Receiver (Penerima Bayangan):**
   * `ground.receiveShadow = true;`

---

## 6. Animasi yang Dibuat

1. **Rotasi Kubus:** Kubus berputar secara kontinu pada sumbu Y dengan kecepatan `0.8 * delta` radian/detik.
2. **Rotasi Bola:** Bola berputar pada sumbu Y dengan kecepatan `0.5 * delta` radian/detik.
3. **Hovering Sinusoidal Bola:** Bola bergerak melayang naik-turun secara harmonik:
   $$y = 0.75 + \sin(2.0 \cdot t) \times 0.15$$
4. **Frame-Rate Independent:** Animasi menggunakan `THREE.Clock` dengan pembatasan `delta = Math.min(clock.getDelta(), 0.05)` agar stabil dan tidak melompat ketika jendela diminimalkan.

---

## 7. Challenge yang Dikerjakan

Pada tahap progress ini telah disiapkan fondasi untuk:
- Eksperimen material non-lit vs lighting material (Lambert vs Phong).
- Penambahan HUD telemetri scene (`Objects count` dan koordinat posisi kamera).
- *Fitur challenge lanjutan (dual camera, orbit lampu, kontrol interaktif, gallery material) tersedia secara lengkap pada branch `main`.*

---

## 8. Kontrol Keyboard & Interaksi

- **Mouse / Viewport:** Menampilkan tampilan statis perspektif 3D secara dinamis.
- **Resize Jendela:** Otomatis memperbarui `camera.aspect`, `camera.updateProjectionMatrix()`, dan `renderer.setSize()`.

---

## 9. Cara Menjalankan

### Persyaratan:
- Node.js (v18 ke atas)
- npm / pnpm

### Langkah:
```bash
# 1. Masuk ke folder praktikum 6
cd "praktikum 6"

# 2. Install dependency
npm install
# atau
pnpm install

# 3. Jalankan server lokal
npm run dev
# atau
pnpm dev
```
Buka browser pada URL yang tertera di terminal: `http://localhost:5173/`.

---

## 10. Catatan Debugging

1. **Orientasi Ground:** `PlaneGeometry` secara default menghadap ke sumbu Z positif (vertikal). Untuk menjadikannya lantai datar horizontal, geometri harus dirotasi $-90^\circ$ pada sumbu X: `groundGeometry.rotateX(-Math.PI / 2);`.
2. **Rantai Shadow:** Bayangan tidak akan muncul jika salah satu dari empat syarat (`renderer.shadowMap.enabled`, `light.castShadow`, `mesh.castShadow`, `ground.receiveShadow`) tidak diaktifkan.
3. **Distorsi Kamera saat Resize:** Jika aspect ratio diubah tanpa memanggil `camera.updateProjectionMatrix()`, objek akan tampak gepeng saat jendela browser diubah ukurannya.

---

## 11. Refleksi Praktikum

1. Penggunaan Three.js memberikan lonjakan produktivitas yang sangat besar dibandingkan WebGL manual karena tidak perlu lagi menulis puluhan baris shader GLSL dan konfigurasi buffer VBO secara berulang.
2. Abstraksi yang paling membantu adalah konsep `Mesh` yang menggabungkan `BufferGeometry` dan `Material`, serta penanganan `Scene Graph` yang mempermudah hierarki koordinat.
3. Objek `BufferGeometry` di Three.js tetap mempertahankan data posisi titik vertex dan normal yang nantinya diteruskan ke GPU sebagai *Vertex Attribute*.
4. `Material` seperti `MeshPhongMaterial` secara otomatis meng-compile fragment shader dengan rumus pencahayaan ambient, diffuse, dan specular Blinn-Phong tanpa perlu menulis rumus vektor manual.
5. Konfigurasi shadow yang paling sering terlupa adalah mengaktifkan `renderer.shadowMap.enabled = true` dan memastikan ukuran batas `shadow.camera` mencakup seluruh posisi objek.
6. Penerapan delta time (`clock.getDelta()`) terbukti krusial agar kecepatan rotasi dan pergerakan objek konsisten pada berbagai layar dengan refresh rate berbeda.
7. Kendala debugging utama terletak pada penyesuaian posisi kamera dan pencahayaan agar bayangan jatuh tepat di atas lantai tanpa terpotong batas *frustum* shadow.
