---
title: Mengenal Open Set Recognition
author: Mambaul Hisam
draft: true
publishedDate: 8 December 2024
description: "Pengenalan tentang Open-Set Recognition pada Machine Learning."
---
Yoo halooo, bertemu lagi sama aku.\
Btw, tulisan ini aku mau bahas tentang Open-Set Recognition atau bahasa sehari-harinya yaitu model klasifikasi yang bisa mendeteksi kelas yang tidak ada pada himpunan kelas pelatihan.

# Berawal dari salah input pada model
Pada saat itu, aku bikin pemodelan Machine Learning buat nylesein tugas salah satu mata kuliahku.
Singkat cerita, pas ngelakuin pengujian pake cara testing manual, aku ngga sengaja nih salah nginputin gambar.
Kek contoh, model buat ngeklasifikasiin anjing atau kucing kok bisa nglasifikasiin gambar KTP sebagai kucing?.
Kan ga realistis.
Pas cari-cari info masalah ini, pertama kali aku nemuin yaitu di Stack Overflow dengan ngetikin keyword di Google "detect unknown class".
Jawabannya bervariasi, ada yang menulis jawaban yang intinya menambahkan sampel yang merepresentasiin kelas "unknown" di model tersebut.
Tapi, solusi dengan nambahin data yang ngerepresentasiin sebagai "unknown" ga muasin rasa penasaranku nih.\
\
Setelah cari-cari dan baca-baca lagi, sampailah pada sebuah salah satu jawaban Stack Overflow yang ngarahin ke paper yang ditulis sama Abhijit Bendale dan koleganya dengan judul "Toward Open Set Deep Networks".
Pas baca abstraknya, aku nemuin nih satu kata kunci yang masih asing yaitu open set recognition. Dan ya, aku cari-cari lagi tentang apa sih itu OSR.
Sampailah pada sebuah paper survey tentang OSR ini yang judulnya "Recent Advances in Open Set Recognition: A Survey".
Di paper itulah dijelasin apa itu OSR dengan penjelasan yang bisa dipahami sama otakku.
Mulai dari awal mula penelitian di subjek ini, yang mana diawali dengan paper yang ditulis sama Walter J. Scheirer dkk. sampe benchmarking masing-masing metode.

# Jadi, apa itu OSR?
OSR itu singkatan dari Open-Set Recognition.
Kalo disuruh jelasin kurang dari 5 detik, OSR itu pendekatan yang mampu ngenalin sampel yang gak sesuai kelasnya. 
Ets tapi gak semudah itu ferguso, kalo ngeliat lebih dalem metode-metode yang ditemuin peneliti-peneliti, pada intinya itu buat ngereduksi open space risk.
Apaan tuh? nanti dibahas kok soal open space risk, ditulisan selanjutnya tapi hehehee.\
\
Kek contoh di poin diatas, model bakal buat kelas baru nih, khusus buat peranin 'blackhole'. 
Jadi, sampel yang masuk itu jadi ada kemungkinan baru, yaitu 'neither a or b or c or whatever training classes'.\
\
Balik lagi ke contoh yang di atas, model yang dibikin kan pake 2 kelas pas training, yaitu anjing sama kucing. 
Di pemodelan yang konvensional itu tetep cuma ada 2 kelas, ga peduli itu pas testing apa pas udah dideploy. 
Nah dengan ngimplementasiin OSR ini pas testing apa deploy itu total ada 3 kelas alias nambahin kelas baru satu. 
Kalo model yang ngimplementasiin OSR ini performa metriknya 100%, gambar KTP yang aku masukin itu pasti masuk ke kelas yang bukan kelas kucing ataupun anjing.

# Gimana caranya?
Caranya ada banyak ya, setiap metode itu caranya beda-beda. 
Tapi ada dua aku tangkep dari 2 penelitian, yaitu prosesnya dilakuin di features space, sama yang dilakuin di input space (pixel, kalo dikasus klasifikasi gambar). 
Tulisan ini aku singgung soal features space aja yaa (baca: skill issue penulis whehee).

Inget neural network itu punya hidden layer?
Nah dikatain feature karena itu udah bukan lagi sampel asli, tapi representasi dari sampel yang asli di layer tertentu. 
Disitulah feature itu jadi bahan buat modelin pemodelan OSR. 
Contoh yang pake pendekatan features space ini, itu OpenMax. 

# Kesimpulan 
Tulisan ini membahas pengenalan tentang OSR dan gimana cara kerjanya, salah satu metode yang bisa digunakan itu ya OpenMax. 
Bagi para pembaca kalo masih penasaran atau tertarik bisa ikutin series tulisan ini di blog ini tentunya. 
Kalo kalian ga sabar, bisa kalian baca paper-paper survey tentang OSR. 
Oh ya, sedikit tips, kalo kalian pengen nambah pengetahuan baru dan yang bisa dipertanggung jawabkan ilmunya, kalian bisa langsung lari aja ke Google Schoolar, baca-baca aja deh paper survey.
Udah dulu tulisan kali ini, dadaahhh.
