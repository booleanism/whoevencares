---
title: Deploy Landingpage di Cloudflare Pages
author: Mambaul Hisam
draft: true
publishedDate: 9 May 2024
description: "Berisi tutorial cara Mendeploy landingpage pada Cloudflare Pages serta hal yang diperlukan"
---
Yoo haloo!!\
Artikel kali ini adalah artikel pertama aku tentang teknologi yang akan membahas sesuai dengan judul. Jadi, ngomong-ngomong apa saja yang perlu dilakukan dan dipersiapkan?
# Akun Cloudlfare
Hal yang paling awal adalah membuat akun Cloudflare, jika kalian bisa mendaftar akun Instagram atau TikTok, pasti kalian bisa mendaftar akun Cloudflare. tidak ada perbedaan yang signifikan pada flow pendafataran. Mulai dari memasukan email sampai mengklik Sign Up. Untuk mendaftar, bisa klik [link ini](https://dash.cloudflare.com/sign-up).

# Wrangler
Wrangler adalah sebuah alat official dari Cloudflare untuk melakukan manajemen layanan Cloudflare dengan interface Command-Line. Jadi bagaimana caranya?

## Npm init
Setelah membuat akun Cloudflare, selanjutnya adalah membuat project dengan NPM. oh ya, sebelumnya harus mempunyai NPM ya, NPM ini sudah bundling pada saat install NodeJS (setidaknya di Linux begitu). Untuk cara install NodeJS, banyak artikel yang membahasnya, bertebaran. Lanjut, jalankan perintah ini di terminal atau cmd kalian yang sudah ditentukan folder/directory project kalian.
```sh
npm init
``` 
## Menginstall wrangler
Setelah inisiasi project, selanjutnya menambahkan dependency wrangler pada project development kalian dengan mengetikan
```sh
npm i --save-dev wrangler
```

# Landingpage
Jangan lupa landingpagenya yang akan dideploy. Landingpage ini bisa dibuat dengan raw HTML dan CSS atau bisa juga dengan Framework Front-end yang tersedia yang kemudian dibuild menjadi static HTML.

# Deploy
Seteleah semua poin diatas sudah diikuti, saatnya deploy.

## Wrangler login
Sambungkan wrangler dengan akun Cloudflare kalian
```sh
npx wrangler login
```
Command diatas akan membuka browser yang kemudian kalian akan disuruh login, setelah login, lalu klik Allow. Login berhasil!\
Selanjutnya membuat project pages

## Wrangler create project
```sh
npx wrangler pages project create landingpage
``` 
Teman saya mengalami error memakai Windows saat menjalankan command diatas (terima kasih [Andre](https://github.com/LordAndree) sudah melaporkan), jika kalian memakai Windows
```sh
npx wrangler pages project create landingpage --production-branch production
```
Pada tulisan 'landingpage' pada command tersebut bisa disesuaikan dengan project pages kalian. biarkan branch name secara default 'production'.\
\
Lalu buat folder/directory baru dengan nama public
```sh
mkdir public
```

## Landingpage
Di dalam directory public tersebut buat file baru yaitu index.html yang berisi kode landingpage kalian. Seperti contoh dibawah ini
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landingpage</title>
</head>
<body>
    <div style="display: flex; justify-content: center;">
        <p>
            Hallo World!
        </p>
    </div>
</body>
</html>
```

Sebelum deployment, kita bisa melihat preview dengan mengetikan
```sh
npx wrangler pages dev public
```
Tulisan 'public' adalah directory yang kalian buat yang berisi file index.html, jadi sesuaikan dengan project kalian. dan langkah terakhir untuk deployment.

## Deployment
```sh
npx wrangler pages deploy public
```
Perlu diingat, 'public' merujuk pada directory kalian. Selesai!

# Bonus
## Custom domain
Login akun Cloudflare kalian, setelah login tambahkan domain kalian dengan mengubah nameserver pada registry domain kalian sesuai dengan yang disediakan Cloudflare. Tunggu beberapa saat hingga mendapatkan notif diemail (aku lupa ada notif apa nggak) atau ada tulisan aktif dibawah domain kalian di dashboard akun Cloudflare kalian. Klik Workers & Pages.\
\
Setelah klik Workers & Pages, klik nama project pages kalian (landingpage), pada halaman ini berisi informasi tentang project pages kalian. Lalu klik custom domain > Set up a custom domain. masukan domain kalian sesuai dengan domain yang kalian tambahkan ke Cloudflare sebelumnya. atau bisa juga menggunakan subdomain dengan memasukan subdomain diikuti nama domain kalian (contoh: landingpage.example.com). Klik Continue > klik Activate domain. Selesai!

# Kesimpulan
Deployment Landingpage bisa dengan menggunakan Cloudflare Pages dan juga alat yang dibuat oleh Cloudflare (wrangler) yang mudah digunakan dan gratis untuk sebuah Landingpage dengan visitor relatif sedikit. 



