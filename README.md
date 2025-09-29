# OpenMusic API v3

## Submission: Proyek OpenMusic API versi 3

Dokumentasi ini berisi kriteria implementasi **OpenMusic API versi 3**, melanjutkan dari versi sebelumnya dengan tambahan fitur baru.

---

## Kriteria 1: Ekspor Lagu pada Playlist

API harus memiliki fitur ekspor lagu pada playlist melalui route berikut:

* **Method**: `POST`
* **URL**: `/export/playlists/{playlistId}`
* **Body Request**:

```json
{
  "targetEmail": "string"
}
```

### Ketentuan

* Wajib menggunakan **message broker** dengan **RabbitMQ**.
* Nilai host server RabbitMQ wajib menggunakan environment variable:

  * `RABBITMQ_SERVER`
* Hanya pemilik playlist yang boleh mengekspor lagu.
* Data yang dikirimkan dari **producer** ke **consumer** hanya berupa:

  * `playlistId` dan `targetEmail`
* Wajib mengirimkan program consumer.
* Hasil ekspor berupa data **JSON**, dikirimkan melalui email menggunakan **Nodemailer**.
* Kredensial email pengirim harus menggunakan environment variable:

  * `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`

### Response

* **Status Code**: `201`
* **Response Body**:

```json
{
  "status": "success",
  "message": "Permintaan Anda sedang kami proses"
}
```

### Contoh Struktur Data JSON

```json
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Song",
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      },
      {
        "id": "song-poax5Oy7L8WKllqw",
        "title": "Cemeteries of London",
        "performer": "Coldplay"
      },
      {
        "id": "song-Qalokam7L8WKf74l",
        "title": "Lost!",
        "performer": "Coldplay"
      }
    ]
  }
}
```

---

## Kriteria 2: Mengunggah Sampul Album

API harus dapat mengunggah sampul album melalui route berikut:

* **Method**: `POST`
* **URL**: `/albums/{id}/covers`
* **Body Request**: (Form-data)

```json
{
  "cover": "file"
}
```

### Ketentuan

* File harus berupa **MIME type image**.
* Ukuran maksimal: **512000 Bytes (500 KB)**.
* Penyimpanan dapat menggunakan:

  * **File System lokal**, atau
  * **S3 Bucket** dengan env variable:

    * `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

### Response

* **Status Code**: `201`
* **Response Body**:

```json
{
  "status": "success",
  "message": "Sampul berhasil diunggah"
}
```

### Respons GET `/albums/{id}`

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "coverUrl": "http://...."
    }
  }
}
```

### Catatan

* `coverUrl` harus bisa diakses publik.
* Jika album belum memiliki sampul → `coverUrl = null`.
* Jika album sudah memiliki sampul → sampul lama akan **digantikan**.

---

## Kriteria 3: Menyukai Album

API harus memiliki fitur:

* Menyukai album
* Batal menyukai album
* Melihat jumlah like pada album

### Ketentuan

* Resource **strict** → membutuhkan **autentikasi**.
* Pengguna hanya bisa menyukai 1 kali untuk album yang sama.

  * Jika mencoba menyukai ulang, response **400**.

---

## Kriteria 4: Server-Side Cache

Implementasi cache pada jumlah like album (`GET /albums/{id}/likes`).

### Ketentuan

* Cache bertahan **30 menit**.
* Respons dari cache harus memiliki custom header:

  * `X-Data-Source: cache`
* Cache dihapus setiap ada perubahan jumlah like.
* Engine caching menggunakan **Redis** atau **Memurai (Windows)**.
* Nilai host Redis wajib menggunakan environment variable:

  * `REDIS_SERVER`

---

## Kriteria 5: Pertahankan Fitur Versi 2 & 1

Fitur dari versi sebelumnya harus tetap ada:

* Pengelolaan Data Album
* Pengelolaan Data Song
* Registrasi & Autentikasi Pengguna
* Pengelolaan Data Playlist
* Foreign Key
* Data Validation
* Error Handling

---

##  Kesimpulan

OpenMusic API versi 3 menambahkan fitur ekspor playlist, unggah sampul album, like album dengan cache, sekaligus mempertahankan fitur dari versi 1 & 2.
