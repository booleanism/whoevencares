---
title: Mengenal Open Set Recognition
author: Mambaul Hisam
draft: true
publishedDate: 8 December 2024
description: "Pengenalan tentang Open-Set Recognition pada Machine Learning."
---
Yoo halooo, bertemu lagi sama aku.\
Btw, tulisan ini aku mau bahas tentang Open-Set Recognition atau bahasa sehari-harinya yaitu model klasifikasi yang bisa mendeteksi kelas yang tidak ada pada himpunan kelas pelatihan.\

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

