# Mini 3D Scene dengan Three.js — Praktikum Pertemuan 6

**Mata Kuliah:** EF234504 — Grafika Komputer  
**Pertemuan:** 6 — Introduction to Three.js  
**Nama Mahasiswa:** Mohammad Najib Bahrudin  
**NRP:** 5025241230  
**Dosen Pengampu:** Dr. Darlis Herumurti  
**Departemen:** Teknik Informatika — Institut Teknologi Sepuluh Nopember  

---

## 1. Deskripsi Scene
Aplikasi ini merupakan **Mini 3D Scene** berbasis **Three.js** dan dibundel menggunakan **Node.js + Vite**. Aplikasi ini mendemonstrasikan transisi dari grafika WebGL manual (*low-level buffer, shader, matrix*) menuju *high-level abstraction library* (Three.js) tanpa menghilangkan esensi konsep dasar grafika 3D:
- **Scene Graph & Koordinat:** Seluruh objek, kamera, dan pencahayaan dikelola secara terstruktur di dalam `THREE.Scene`.
- **Lighting & Realistic Shading:** Menggabungkan pencahayaan ambient dan directional yang menghasilkan bayangan dinamis (*soft shadows* via `PCFSoftShadowMap`).
- **Material Gallery:** Membandingkan berbagai tipe material Three.js dalam satu scene interaktif.
- **Frame-Rate Independent Animation:** Animasi rotasi, hovering objek, dan orbit pencahayaan dihitung menggunakan **Delta Time** (`THREE.Clock`), memastikan pergerakan halus dan konsisten di segala refresh rate layar.
- **Dual Camera System:** Mendukung transisi instan antara **Perspective Camera** dan **Orthographic Camera**.

---

## 2. Daftar Geometry yang Digunakan

| No. | Objek | Geometry Class | Dimensi / Segmen | Peran dalam Scene |
|:---:|:---|:---|:---|:---|
| 1 | **Ground (Lantai)** | `THREE.PlaneGeometry` | $16 \times 16$ (rotasi $X = -90^\circ$) | Bidang datar penerima bayangan (*Shadow Receiver*) |
| 2 | **Cube** | `THREE.BoxGeometry` | $1.1 \times 1.1 \times 1.1$ | Objek interaktif (*Caster* & *Receiver*, kendali keyboard) |
| 3 | **Sphere** | `THREE.SphereGeometry` | radius: $0.7$, segmen: $32 \times 24$ | Objek animasi melayang sinusoidal (*Specular highlight*) |
| 4 | **Torus** | `THREE.TorusGeometry` | radius: $0.5$, tabung: $0.18$, segmen: $20 \times 48$ | Objek visualisasi *Surface Normal Vector* |
| 5 | **Cone** | `THREE.ConeGeometry` | radius: $0.55$, tinggi: $1.2$, segmen: $32$ | Objek unlit (*flat color*) |
| 6 | **Cylinder** | `THREE.CylinderGeometry` | radius: $0.45$, tinggi: $1.2$, segmen: $32$ | Objek material PBR berbasis pantulan fisik |
| 7 | **Light Marker** | `THREE.SphereGeometry` | radius: $0.12$, segmen: $16 \times 8$ | Penanda visual posisi sumber cahaya lampu |

---

## 3. Daftar Material yang Digunakan

1. **`MeshLambertMaterial` (Warna Cyan `#22d3ee` pada Cube & Abu Gelap `#17223b` pada Ground):**
   * Menghasilkan *diffuse reflection* non-glossy berdasarkan sudut jatuh cahaya terhadap normal bidang (Lambertian shading).
2. **`MeshPhongMaterial` (Warna Biru `#3b82f6` pada Sphere):**
   * Menghasilkan titik kilap (*specular highlight*) dengan konfigurasi `shininess: 70` dan `specular: 0x93c5fd`.
3. **`MeshNormalMaterial` (pada Torus):**
   * Memetakan vektor normal permukaan secara otomatis ke komponen warna RGB ($X \to R, Y \to G, Z \to B$). Tidak membutuhkan kalkulasi cahaya eksternal.
4. **`MeshBasicMaterial` (Warna Pink `#ec4899` pada Cone & Kuning `#fff3a1` pada Light Marker):**
   * Material dasar tanpa perhitungan pencahayaan (*unlit*), warna selalu tampil konstan terlepas dari keberadaan lampu.
5. **`MeshStandardMaterial` (Warna Zamrud `#10b981` pada Cylinder):**
   * Menggunakan prinsip *Physically Based Rendering* (PBR) dengan parameter `roughness: 0.35` dan `metalness: 0.65`.

---

## 4. Daftar Pencahayaan (Lights)

1. **`THREE.AmbientLight`:**
   * Intensitas: $0.38$, warna: putih (`0xffffff`).
   * Berfungsi sebagai penerangan lingkungan dasar agar sisi objek yang membelakangi cahaya directional tidak menjadi gelap gulita (menstimulasi *indirect bounce light*).
2. **`THREE.DirectionalLight`:**
   * Intensitas: $2.2$, warna: putih (`0xffffff`).
   * Posisi dasar: $(3.5, 5.5, 2.5)$.
   * Berfungsi sebagai sumber cahaya utama terarah (*key light*) yang menghasilkan bayangan terproyeksi (*shadow caster*).
3. **`THREE.HemisphereLight`:**
   * Intensitas: $0.25$, gradasi langit ke tanah (`0x38bdf8` ke `0x0f172a`), memberikan kedalaman gradien alami pada sisi bawah objek.

---

## 5. Konfigurasi Shadow (Bayangan)

Agar sistem shadow Three.js bekerja sempurna, seluruh rantai konfigurasi berikut telah diterapkan:
1. **Renderer:**
   * `renderer.shadowMap.enabled = true;`
   * `renderer.shadowMap.type = THREE.PCFSoftShadowMap;` (menghasilkan tepi bayangan halus anti-aliased).
2. **Light:**
   * `directionalLight.castShadow = true;`
   * Resolusi Shadow Map: `1024 x 1024` piksel.
   * Batas volume ortografis kamera bayangan: `left: -6`, `right: 6`, `top: 6`, `bottom: -6`, `near: 0.5`, `far: 25`.
   * Shadow bias: `-0.0005` (mencegah *shadow acne* pada permukaan kubus/bola).
3. **Caster (Objek penghasil bayangan):**
   * `cube.castShadow = true;`
   * `sphere.castShadow = true;`
   * `torus.castShadow = true;`
   * `cone.castShadow = true;`
   * `cylinder.castShadow = true;`
4. **Receiver (Permukaan penangkap bayangan):**
   * `ground.receiveShadow = true;`
   * `cube.receiveShadow = true;`
   * `sphere.receiveShadow = true;`

---

## 6. Animasi yang Dibuat

1. **Rotasi Kontinu Objek:** Kubus, bola, silinder, kerucut, dan torus berputar pada sumbunya masing-masing dengan kecepatan sudut berbasis radian per detik (`rad/s * delta`).
2. **Floating Sinusoidal Objek:**
   * Sphere bergerak naik-turun secara halus menggunakan fungsi harmonik: $y = 0.75 + 0.18 \cdot \sin(2.2 \cdot t)$.
   * Torus berosilasi halus: $y = 0.85 + 0.12 \cdot \cos(1.8 \cdot t)$.
3. **Light Orbiting Animation:**
   * `DirectionalLight` dan marker visualnya mengorbit di atas scene dengan kecepatan sudut $0.6\text{ rad/s}$ pada radius $4.5$ unit, menyebabkan sudut bayangan berputar dinamis di atas ground secara dramatis.

---

## 7. Challenge yang Dikerjakan

Modul mensyaratkan minimal 2 challenge. Proyek ini mengimplementasikan **7 Challenge sekaligus**:
- **Challenge A — Penambahan Geometri:** Menambahkan `CylinderGeometry`, `ConeGeometry`, dan `TorusGeometry` dengan penataan posisi rapi.
- **Challenge B — Material Gallery:** Menampilkan perbandingan kontras antara `MeshBasicMaterial`, `MeshNormalMaterial`, `MeshLambertMaterial`, `MeshPhongMaterial`, dan `MeshStandardMaterial`.
- **Challenge C — Dual Camera (Perspective ↔ Orthographic):** Tombol <kbd>P</kbd> mengganti seketika proyeksi kamera tanpa distorsi rasio saat resize.
- **Challenge D — Light Animation:** Lampu DirectionalLight berputar melingkari scene dengan penanda bola kecil kuning bercahaya.
- **Challenge F — Scene Information HUD:** Menampilkan telemetry real-time: FPS counter, mode kamera aktif, koordinat kamera, jumlah mesh, polycount (`renderer.info.render.triangles`), dan koordinat objek.
- **Challenge G — Toggle Animation:** Tombol <kbd>Space</kbd> atau tombol UI untuk mem-pause / me-resume seluruh animasi.
- **Challenge H — Continuous Object Control:** Tombol Panah (<kbd>▲</kbd><kbd>▼</kbd><kbd>◀</kbd><kbd>▶</kbd>) untuk menggeser posisi Kubus di atas ground, dan <kbd>Q</kbd>/<kbd>E</kbd> untuk merotasikannya secara kontinu menggunakan delta time.

---

## 8. Kontrol Keyboard & Interaksi

| Tombol / Tombol UI | Aksi | Keterangan |
|---|---|---|
| <kbd>▲</kbd> <kbd>▼</kbd> <kbd>◀</kbd> <kbd>▶</kbd> | Move Kubus | Menggeser posisi kubus pada sumbu X & Z secara kontinu |
| <kbd>Q</kbd> / <kbd>E</kbd> | Rotasi Kubus | Memutar kubus ke kiri / kanan mengitari sumbu Y |
| <kbd>Space</kbd> | Pause / Resume Animasi | Menghentikan atau melanjutkan seluruh animasi rotasi & hovering |
| <kbd>P</kbd> | Toggle Kamera | Beralih antara **Perspective** (sudut pandang mata) dan **Orthographic** (sudut teknik) |
| <kbd>L</kbd> | Toggle Orbit Lampu | Membekukan atau melanjutkan perputaran sumber cahaya |
| <kbd>1</kbd> | Preset Kamera 1 | Sudut pandang Overview default $(4.5, 3.5, 6.5)$ |
| <kbd>2</kbd> | Preset Kamera 2 | Sudut pandang Close-up $(0.5, 1.8, 3.2)$ |
| <kbd>3</kbd> | Preset Kamera 3 | Sudut pandang Top-down $(0.01, 8.5, 0.01)$ |
| Tombol **🔄 Reset Kubus** | Reset Posisi | Mengembalikan kubus ke koordinat awal $(-1.4, 0.55, 0.2)$ |

---

## 9. Cara Menjalankan

### Persyaratan:
- Node.js (versi 18 ke atas disarankan)
- npm

### Langkah Eksekusi:
```bash
# 1. Masuk ke direktori proyek
cd "praktikum 6"

# 2. Install dependencies (jika belum)
npm install

# 3. Jalankan development server
npm run dev
```

Buka URL lokal yang muncul di terminal (biasanya `http://localhost:5173/`) pada browser Google Chrome / Firefox / Edge.

---

## 10. Catatan Debugging

1. **Shadow Acne & Bias:**
   * Pada konfigurasi awal, permukaan kubus dan ground dapat memperlihatkan pola garis-garis gelap (*shadow acne*) akibat keterbatasan presisi depth buffer. Solusi: menambahkan `directionalLight.shadow.bias = -0.0005;` untuk menggeser kedalaman perbandingan shadow secara presisi.
2. **Kamera Orthographic Terdistorsi saat Resize:**
   * Berbeda dengan `PerspectiveCamera` yang hanya membutuhkan `camera.aspect = width / height`, `OrthographicCamera` mengharuskan frustum bounds (`left`, `right`, `top`, `bottom`) dihitung ulang dengan mengalikan aspek rasio terhadap ukuran frustum dasar sebelum memanggil `camera.updateProjectionMatrix()`.
3. **Perbedaan Refresh Rate Layar (Delta Time):**
   * Penggunaan rotasi langsung bernilai tetap (misal `+ 0.01`) menyebabkan objek berputar 2x lebih cepat pada monitor 120Hz/144Hz dibanding monitor 60Hz. Penggunaan `clock.getDelta()` menyelesaikan masalah ini secara tuntas sehingga kecepatan selalu konsisten per detik.

---

## 11. Refleksi Praktikum

1. **Perbedaan WebGL Manual vs Three.js:** Penggunaan Three.js secara drastis memangkas ratusan baris kode boilerplate untuk inisialisasi VAO/VBO, penulisan GLSL shader string, dan perkalian matriks manual, sehingga fokus pengembang dapat langsung diarahkan pada komposisi scene dan estetika.
2. **Abstraksi Paling Membantu:** Konsep `Mesh = Geometry + Material` dan `Scene Graph` adalah abstraksi Three.js paling intuitif karena mengemas koordinat lokal, normal vektor, dan pipeline shading ke dalam satu kesatuan objek yang mudah dimanipulasi transformasinya.
3. **Hubungan Geometry dengan Vertex Data:** `BufferGeometry` Three.js sebenarnya memetakan langsung atribut buffer WebGL (`position`, `normal`, `uv`) ke memori GPU dalam format `Float32Array`.
4. **Hubungan Material dengan Shader/Lighting:** Material seperti `MeshPhongMaterial` secara otomatis menyusun dan meng-compile vertex serta fragment shader WebGL di belakang layar dengan rumus pencahayaan Ambient, Diffuse, dan Specular Blinn-Phong.
5. **Konfigurasi Shadow yang Mudah Terlupa:** Rantai bayangan memerlukan keempat elemen aktif sekaligus (`renderer.shadowMap.enabled`, `light.castShadow`, `mesh.castShadow`, dan `ground.receiveShadow`); jika satu saja terlewat, bayangan tidak akan tampil sama sekali.
6. **Manfaat Delta Time:** Delta time menjamin bahwa kecepatan perpindahan dan rotasi grafika sepenuhnya independen terhadap fluktuasi frame-rate perangkat pengguna.
7. **Masalah Debugging:** Mengatur batas frustum shadow camera (`shadow.camera.left/right/top/bottom`) krusial agar area bayangan tidak terpotong saat objek bergerak menjauh dari pusat origin.
