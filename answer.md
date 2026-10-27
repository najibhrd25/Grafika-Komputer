# Jawaban Tugas & Pertanyaan Modul Praktikum 6
## Introduction to Three.js — Mini 3D Scene

**Mata Kuliah:** EF234504 — Grafika Komputer  
**Pertemuan:** 6  
**Nama Mahasiswa:** Mohammad Najib Bahrudin  
**NRP:** 5025241230  
**Dosen Pengampu:** Dr. Darlis Herumurti  

---

# Bagian 1: Jawaban Pertanyaan Pemahaman (#100)

### 1. Apa hubungan Three.js dan WebGL?
Three.js adalah *high-level JavaScript library* yang dibangun di atas WebGL API. Three.js bertindak sebagai lapisan abstraksi (*wrapper*) yang menyederhanakan interaksi langsung dengan WebGL dan GPU.

### 2. Mengapa Three.js disebut high-level library?
Karena Three.js menyembunyikan kompleksitas manajemen tingkat rendah (*low-level*) seperti alokasi buffer GPU (VBO/EBO/VAO), kompilasi kode GLSL shader string, *state machine* WebGL, serta perkalian matriks manual, dan menyajikannya dalam bentuk objek berorientasi objek yang intuitif seperti `Scene`, `Camera`, `Mesh`, `Geometry`, `Material`, dan `Light`.

### 3. Apakah Three.js menghilangkan konsep buffer dan shader?
Tidak. Three.js tidak menghilangkan konsep tersebut, melainkan mengelolanya secara otomatis di belakang layar. Setiap `BufferGeometry` tetap memegang buffer data vertex di GPU, dan setiap `Material` tetap di-compile menjadi pasangan Vertex Shader dan Fragment Shader WebGL.

### 4. Apa fungsi Scene?
`Scene` berfungsi sebagai kontainer utama (*scene graph*) yang menampung seluruh objek 3D, geometri, material, kamera, dan sumber cahaya. Objek hanya akan dirender jika telah ditambahkan ke dalam scene melalui `scene.add()`.

### 5. Apa komponen minimum agar Mesh dapat terlihat?
Komponen minimumnya adalah:
1. Sebuah `BufferGeometry` (definisi bentuk/titik-titik vertex).
2. Sebuah `Material` (definisi tampilan permukaan/shading).
3. Ditambahkan ke dalam `Scene` aktif.
4. Berada dalam *viewing frustum* kamera aktif.
5. Dipanggil melalui `renderer.render(scene, camera)`.
6. Jika materialnya bergantung pada pencahayaan (misal Lambert/Phong), harus ada sumber `Light` yang menyinarinya.

### 6. Apa fungsi PerspectiveCamera?
`PerspectiveCamera` mensimulasikan cara kerja mata manusia atau lensa kamera dunia nyata, di mana objek yang berada lebih jauh dari kamera akan tampak lebih kecil dibandingkan objek yang berada dekat dengan kamera (*perspektif kedalaman*).

### 7. Apa arti FOV (Field of View)?
FOV (*Field of View*) adalah sudut pandang vertikal kamera dalam derajat. Semakin besar nilai FOV, semakin luas area scene yang dapat ditangkap oleh kamera, namun dapat menimbulkan distorsi *fisheye* di tepian layar.

### 8. Apa fungsi aspect ratio?
Aspect ratio adalah rasio antara lebar (*width*) terhadap tinggi (*height*) viewport tampilan (`width / height`). Nilai ini digunakan oleh matriks proyeksi agar geometri objek yang dirender tidak mengalami peregangan (*stretch*) atau penyusutan tidak proporsional saat rasio layar berubah.

### 9. Apa fungsi near dan far?
`near` dan `far` menentukan bidang batas potong (*clipping planes*) terdekat dan terjauh dari kamera. Seluruh objek atau bagian geometri yang berada lebih dekat dari `near` atau lebih jauh dari `far` tidak akan dirender oleh GPU.

### 10. Apa fungsi `camera.lookAt()`?
Metode `lookAt(x, y, z)` mengorientasikan rotasi kamera secara otomatis sehingga sumbu pandang kamera selalu mengarah tepat ke koordinat target dunia yang ditentukan.

### 11. Apa fungsi WebGLRenderer?
`WebGLRenderer` adalah komponen mesin rendering yang bertugas menerjemahkan seluruh scene grafika, hierarki objek, material, dan kamera menjadi serangkaian *draw calls* WebGL yang dieksekusi oleh GPU dan ditampilkan pada elemen `<canvas>`.

### 12. Apa itu `renderer.domElement`?
`renderer.domElement` adalah elemen HTML `<canvas>` yang dibuat dan dikelola oleh instance Three.js renderer untuk menampilkan hasil render grafika 3D.

### 13. Apa fungsi Geometry?
`Geometry` mendefinisikan bentuk struktural dari sebuah objek 3D melalui kumpulan koordinat posisi titik-titik vertex, garis penghubung, serta permukaan bidang poligon/segitiga.

### 14. Apa hubungan BufferGeometry dengan vertex buffer?
`BufferGeometry` adalah representasi langsung dari *Vertex Buffer Object* (VBO) WebGL di memori GPU. Atribut di dalamnya disimpan dalam bentuk array typed mentah (`Float32Array`) sehingga pengiriman data ke GPU sangat cepat dan efisien.

### 15. Attribute apa yang umum tersedia pada BufferGeometry?
Atribut yang paling umum adalah:
- `position` (vektor koordinat vertex 3D $x, y, z$).
- `normal` (vektor normal tegak lurus bidang untuk kalkulasi pencahayaan).
- `uv` (koordinat pemetaan tekstur 2D $u, v$).
- `color` (warna per-vertex jika digunakan).

### 16. Apa fungsi Material?
`Material` menentukan bagaimana permukaan sebuah geometri bereaksi terhadap cahaya, warna, refleksi, transparansi, tekstur, dan kekasaran permukaan saat dirender oleh fragment shader.

### 17. Apa karakter `MeshBasicMaterial`?
`MeshBasicMaterial` adalah material sederhana tanpa kalkulasi pencahayaan (*unlit*). Warna atau teksturnya selalu tampak datar (*flat*) dengan intensitas penuh tanpa terpengaruh ada atau tidaknya sumber cahaya di scene.

### 18. Apa fungsi `MeshNormalMaterial`?
`MeshNormalMaterial` memetakan nilai vektor normal permukaan langsung menjadi nilai warna RGB ($x \to R, y \to G, z \to B$). Material ini sangat berguna untuk debugging orientasi permukaan poligon dan geometri tanpa memerlukan lampu.

### 19. Apa karakter `MeshLambertMaterial`?
`MeshLambertMaterial` menghitung pencahayaan difus (*diffuse reflectance*) berdasarkan hukum kosinus Lambert. Permukaannya tampak redup/matte tanpa titik pantulan kilap (*non-shiny/specular*), dan membutuhkan sumber cahaya agar dapat terlihat.

### 20. Apa karakter `MeshPhongMaterial`?
`MeshPhongMaterial` menghitung pencahayaan Blinn-Phong yang mencakup komponen *ambient*, *diffuse*, dan *specular highlight* (pantulan kilap cahaya mengkilap). Tingkat kilapnya dapat diatur melalui parameter `shininess`.

### 21. Apa hubungan Geometry + Material + Mesh?
`Geometry` menyediakan "kerangka bentuk" (posisi titik-titik), `Material` menyediakan "tampilan permukaan" (warna dan sifat shading), dan `Mesh` adalah objek visual konkret 3D yang menggabungkan geometri dan material tersebut sehingga memiliki posisi, orientasi, dan skala di ruang 3D.

### 22. Apa fungsi `scene.add()`?
Fungsi `scene.add(object)` mendaftarkan sebuah objek 3D (Mesh, Light, Camera, Helper) ke dalam hierarki *Scene Graph* sehingga objek tersebut dikenali oleh renderer pada saat frame digambar.

### 23. Apa fungsi `position`?
Properti `position` (`Vector3`) menentukan koordinat translasi lokasi lokal objek pada sumbu X, Y, dan Z relatif terhadap induknya.

### 24. Apa fungsi `rotation`?
Properti `rotation` (`Euler`) menentukan orientasi sudut perputaran objek dalam satuan radian pada sumbu X, Y, dan Z.

### 25. Apa fungsi `scale`?
Properti `scale` (`Vector3`) menentukan faktor perbesaran atau pengecilan ukuran objek pada sumbu X, Y, dan Z.

### 26. Bagaimana transform Three.js berhubungan dengan Model Matrix?
Setiap kali nilai `position`, `rotation`, atau `scale` pada suatu objek diubah, Three.js secara otomatis menghitung ulang *Model Matrix* ($4 \times 4$) objek tersebut ($M = T \times R \times S$). Matriks inilah yang kemudian dikirimkan ke vertex shader untuk mentransformasikan koordinat lokal vertex ke koordinat dunia (*World Space*).

### 27. Apa itu `Object3D`?
`Object3D` adalah *base class* (kelas induk) dari hampir seluruh objek di Three.js (termasuk `Scene`, `Camera`, `Mesh`, `Light`, dan `Group`). Kelas ini menyediakan fungsionalitas dasar transformasi spasial 3D (posisi, rotasi, skala, hierarki parent-child, dan matriks transformasi).

### 28. Apa fungsi AmbientLight?
`AmbientLight` menyinari seluruh objek dalam scene secara merata dari segala arah tanpa memiliki arah sumber tertentu (*omnidirectional*) dan tanpa menghasilkan bayangan (*cast shadow*). Tujuannya mencegah sisi objek yang tersembunyi dari cahaya langsung menjadi gelap gulita.

### 29. Apa fungsi DirectionalLight?
`DirectionalLight` memancarkan berkas cahaya sejajar dari arah tertentu dengan jarak tak terhingga, menyerupai sinar matahari. Lampu ini menghasilkan kontras pencahayaan terarah (*shading*) dan mampu menghasilkan bayangan proyeksi (*shadow mapping*).

### 30. Mengapa material tertentu membutuhkan Light?
Material seperti `MeshLambertMaterial` dan `MeshPhongMaterial` menggunakan rumus pencahayaan pada fragment shader yang melibatkan arah vektor datangnya cahaya ($\vec{L}$) dan normal bidang ($\vec{N}$). Jika tidak ada sumber cahaya, intensitas hasil kalkulasi bernilai 0 sehingga objek tampil hitam pekat.

### 31. Apa fungsi shadow?
Bayangan (*shadow*) memberikan persepsi spasial yang sangat penting pada grafika 3D, menunjukkan kedalaman ruang, posisi ketinggian relatif objek terhadap lantai, dan posisi sumber cahaya.

### 32. Apa arti `castShadow`?
`castShadow = true` menandakan bahwa objek tersebut bertindak sebagai penghalang cahaya (*caster*) yang akan menggambar kedalaman dirinya ke dalam *shadow map buffer* untuk memproyeksikan bayangan pada permukaan lain.

### 33. Apa arti `receiveShadow`?
`receiveShadow = true` menandakan bahwa permukaan objek tersebut bertindak sebagai penerima (*receiver*) yang akan mengecek *shadow map* untuk menentukan apakah sebagian permukaannya terhalang cahaya dan harus digelapkan.

### 34. Mengapa renderer shadow map harus diaktifkan?
Karena secara default fitur *shadow map* dimatikan (`renderer.shadowMap.enabled = false`) demi efisiensi performa GPU. Menghasilkan bayangan membutuhkan *render pass* ekstra dari sudut pandang cahaya (*shadow map generation pass*).

### 35. Apa fungsi animation loop?
Animation loop adalah mekanisme pemanggilan berulang fungsi render secara terus menerus agar frame visual layar diperbarui secara dinamis, memungkinkan terjadinya animasi objek, kamera, atau respons interaksi pengguna.

### 36. Mengapa menggunakan `requestAnimationFrame()`?
Karena `requestAnimationFrame()` dioptimalkan oleh browser web untuk disinkronkan langsung dengan *refresh rate* monitor, berjalan mulus tanpa *screen tearing*, dan otomatis dijeda (*pause*) saat tab browser sedang berada di latar belakang (*background*) sehingga menghemat daya CPU dan baterai.

### 37. Apa fungsi delta time?
Delta time adalah durasi waktu nyata (dalam detik) yang dibutuhkan antara frame saat ini dengan frame sebelumnya. Mengalikan kecepatan dengan delta time memastikan bahwa laju pergerakan objek konsisten pada kecepatan waktu nyata, terlepas dari apakah monitor berjalan di 30 FPS, 60 FPS, atau 144 FPS.

### 38. Mengapa renderer harus responsif?
Agar tampilan canvas grafika 3D selalu memenuhi ruang jendela browser dengan tajam tanpa terpotong atau menimbulkan scrollbar ketika pengguna mengubah ukuran jendela atau memutar orientasi layar perangkat.

### 39. Mengapa camera aspect harus diperbarui saat resize?
Jika aspect ratio kamera tidak diperbarui saat rasio lebar dan tinggi jendela berubah, proyeksi 3D akan terdistorsi (misal lingkaran bola tampak lonjong atau gepeng).

### 40. Mengapa `updateProjectionMatrix()` diperlukan?
Karena properti seperti `camera.aspect` atau `camera.fov` hanyalah variabel konfigurasi JavaScript. Untuk memperbarui matriks proyeksi $4 \times 4$ yang sebenarnya digunakan oleh GPU, fungsi `camera.updateProjectionMatrix()` harus dipanggil secara eksplisit.

---

# Bagian 2: Jawaban Pertanyaan Analisis (#101)

## A — Abstraction
* **Bandingkan kode WebGL manual untuk membuat cube dengan:**
  ```javascript
  new THREE.Mesh(geometry, material);
  ```
  **Apa pekerjaan yang disederhanakan Three.js?**
  * **Jawaban:** Three.js menyederhanakan puluhan langkah manual yang rumit:
    1. Tidak perlu mendefinisikan array posisi 24 atau 36 vertex float secara hardcoded.
    2. Tidak perlu mengelola `gl.createBuffer()`, `gl.bindBuffer()`, `gl.bufferData()`, dan `gl.enableVertexAttribArray()`.
    3. Tidak perlu menulis, meng-compile, dan me-link string kode GLSL Vertex Shader & Fragment Shader secara manual.
    4. Tidak perlu mencari lokasi uniform (`gl.getUniformLocation`) dan mengirimkan Model, View, serta Projection Matrix satu per satu.
    5. Seluruh kalkulasi matriks, upload state buffer, dan pemanggilan `gl.drawElements()` dienkapsulasi otomatis hanya dalam satu baris deklarasi objek.

## B — Material
* **Mengapa `MeshBasicMaterial` dapat terlihat tanpa Light, sedangkan `MeshLambertMaterial` membutuhkan Light?**
  * **Jawaban:** 
    * `MeshBasicMaterial` pada shader-nya hanya mengembalikan warna dasar atau tekstur yang ditentukan secara langsung ke `gl_FragColor = vec4(color, opacity);` tanpa memperhitungkan interaksi foton cahaya.
    * `MeshLambertMaterial` menggunakan algoritma *Lambertian Diffuse Shading*, di mana intensitas warna hasil ditentukan oleh perkalian dot product antara vektor normal permukaan ($\vec{N}$) dan vektor arah cahaya ($\vec{L}$): $I = \max(0, \vec{N} \cdot \vec{L})$. Jika tidak ada sumber cahaya di dalam scene, maka nilai $\vec{L}$ bernilai nol, sehingga intensitas warna yang dihasilkan adalah nol (hitam pekat).

## C — Geometry
* **Mengapa meningkatkan segment SphereGeometry membuat object lebih halus tetapi juga menambah beban geometry?**
  * **Jawaban:** 
    * Dalam grafika komputer 3D, permukaan kurva melengkung seperti bola tidak dapat digambar secara murni kontinu, melainkan didekati (*approximated*) melalui sekumpulan poligon segitiga (*triangular mesh*).
    * Semakin banyak segmen lebar dan tinggi (`widthSegments`, `heightSegments`), semakin kecil ukuran masing-masing poligon segitiga sehingga sudut antar-poligon mendekati mulus kontinu.
    * Namun, jumlah vertex dan segitiga meningkat secara kuadratik ($O(n \times m)$). Ini menambah konsumsi memori VBO di GPU dan menambah jumlah iterasi pemrosesan pada tahap *Vertex Shader* dan *Rasterizer*.

## D — Transform
* **Ketika menulis `mesh.position.x = 2;`, apakah vertex asli harus diubah satu per satu? Jelaskan hubungannya dengan Model Matrix.**
  * **Jawaban:**
    * **Tidak**, koordinat vertex asli yang tersimpan di dalam GPU buffer tidak pernah diubah sama sekali. Titik-titik vertex tetap tersimpan dalam koordinat lokal (*Local/Model Space*) di sekitar titik $(0,0,0)$.
    * Perubahan `position.x = 2` hanya mengubah elemen translasi pada **Model Matrix** ($4 \times 4$). Ketika proses render berlangsung, GPU pada Vertex Shader mengalikan posisi vertex lokal asli dengan Model Matrix:
      $$v_{\text{world}} = M_{\text{model}} \cdot v_{\text{local}}$$
    * Pendekatan ini jauh lebih cepat dan efisien daripada memodifikasi ribuan nilai vertex di CPU dan mengunggah ulang buffer ke GPU setiap frame.

## E — Shadow
* **Mengapa shadow memerlukan konfigurasi lebih dari sekadar menambahkan Light?**
  * **Jawaban:**
    * Pembuatan bayangan dalam grafika realtime menggunakan teknik **Shadow Mapping** (dua tahap render pass terpisah):
      1. *Pass 1 (Depth Pass):* Scene dirender dari sudut pandang sumber cahaya untuk merekam peta kedalaman (*Shadow Depth Map*).
      2. *Pass 2 (Color Pass):* Scene dirender dari sudut pandang kamera pengguna, membandingkan kedalaman setiap piksel dengan *Shadow Map* untuk menentukan apakah titik tersebut terhalang atau terkena sinar.
    * Oleh karena itu, sistem membutuhkan:
      - Renderer harus tahu apakah komputasi ekstra shadow map diizinkan (`renderer.shadowMap.enabled = true`).
      - Sumber cahaya harus memiliki kamera virtual bayangan dengan volume proyeksi tertentu (`light.castShadow = true`).
      - Objek harus ditentukan apakah ia menghalangi cahaya (`castShadow = true`) atau menjadi alas jatuhnya bayangan (`receiveShadow = true`).

## F — Responsive Rendering
* **Apa yang terjadi jika renderer resize tetapi aspect camera tidak diperbarui?**
  * **Jawaban:**
    * Objek 3D akan tampak terdistorsi secara visual (teregang melebar atau tertekan mengecil).
    * Jika jendela browser dilebarkan tanpa memperbarui rasio aspek kamera, matriks proyeksi masih berasumsi bahwa viewport berbentuk lebih sempit, sehingga geometri kubus akan tampak gepeng/melebar secara horizontal, merusak akurasi visual perspektif 3D.
