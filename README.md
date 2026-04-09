# Fake API OpenClaw - True PPOB Multi-Mock Server 🛡️

Aplikasi Next.js ini berfungsi sebagai **Mock Server Mandiri** skala tinggi (High-Fidelity Playground). Server ini didesain secara arsitektural untuk menipu sekaligus melatih Bot AI (seperti OpenClaw) agar mampu beradaptasi menembak dokumentasi API Provider dari *berbagai Biller B2B berbeda* layaknya Server PPOB sesungguhnya di dunia nyata.

Sistem tidak hanya menggunakan satu kerangka *flat API*, melainkan memecah logikanya menyesuaikan struktur khas 3 perusahaan Biller PPOB besar di Indonesia.

---

## 🏗 Struktur Database
Sistem ini terkoneksi secara Serverless via **Neon PostgreSQL** menggunakan Prisma ORM. Terdapat 3 Entitas Pusat:
- `Provider`: Data vendor (Digiflazz, dsb).
- `Product`: Berisi harga beli grosir dan harga jual Merchant yang direlasikan dengan `provider_code`.
- `Transaction`: Log pembelian, mencatat `ref_id` internal kita, sekaligus `provider_trx_code` (resi asli dari provider).

---

## 📖 DOKUMENTASI ENDPOINT (ROUTER)

### 🟢 1. PENYAMARAN DIGIFLAZZ (Digiflazz Mock)
*Mensimulasikan cara kerja API H2H Digiflazz standar.*

#### `POST /api/digiflazz/v1/price-list`
* **Fungsi:** Mengambil katalog produk.
* **Payload Mandatory:** `{ "username": "xxx", "sign": "xxx" }`
* **Respons:** JSON yang memakai kunci `buyer_sku_code`, `product_name`, dan harga aslinya (*cost_price*).

#### `POST /api/digiflazz/v1/transaction`
* **Fungsi:** Melakukan order pembelian layaknya Digiflazz.
* **Payload Mandatory:** `{ "buyer_sku_code": "TSEL10", "customer_no": "08123...", "ref_id": "TRX-XXX" }`
* **Respons:** Mengembalikan format khas Digiflazz seperti parameter `rc: "00"` dan `status: "Pending"`.

---

### 🟠 2. PENYAMARAN VIP PAYMENT (VIP Game Mock)
*Mensimulasikan API H2H spesifik Game untuk VIP Payment Developer.*

#### `GET /api/vip-payment/game/profile`
* **Fungsi:** Melihat ketersediaan produk/game.
* **Query Mandatory:** `?action=profile` atau `?action=game`
* **Respons:** JSON status menggunakan integer `1` (Aktif) dan `0` (Non-Aktif).

#### `POST /api/vip-payment/game/order`
* **Fungsi:** Melakukan transaksi Topup Game.
* **Payload Mandatory:** `{ "service": "ML86", "data_no": "12345678", "data_zone": "2012" }`
* **Respons:** Memberikan _TrxID_ berformat VIP (cth: `VIP-182912`) dengan keterangan `status: pending`.

---

### 🔵 3. PENYAMARAN PAYFAZZ (Payfazz Mock)
*Mensimulasikan cara kerja Payfazz Enterprise.*

#### `GET /api/payfazz/v1/products`
* **Fungsi:** Pencarian produk.
* **Respons:** JSON berisi array `productID` dan objek bercabang `priceInfo`.

#### `POST /api/payfazz/v1/bill`
* **Fungsi:** Mengeksekusi order Tagihan/Pulsa.
* **Payload Mandatory:** `{ "productID": "PLN50", "targetNumber": "123..." }`
* **Respons:** Akan memunculkan HTTP Code *201 Created* beserta `orderID` khas server Payfazz.

---

### 🛡️ 4. API INTERNAL (Hak Milik PPOB Core Kita)
*Endpoint khusus dibalik layar yang bisa diakses Admin atau DB checker OpenClaw kita.*

* **`GET /api/internal/providers`** -> Mengambil daftar seluruh provider yang telah terhubung ke PPOB internal (menyertakan array produk mereka).
* **`GET /api/internal/catalog`** -> Melihat daftar harga produk dari sistem kita langsung (kombinasi harga `sell_price` untuk merchant).
* **`GET /api/internal/transactions`** -> Endpoint ekskavasi database: melacak status order terdalam, menampilkan *nested structure* hingga ke status server provider-nya di Prisma.

---

## ⚡ INSTALASI LOKAL

1. Pastikan Anda sudah menentukan `DATABASE_URL` ke PostgreSQL (Serverless Neon) di file `.env`.
2. *(Satu Kali)* Membangun *client* tipe: `bunx prisma generate`
3. *(Satu Kali)* Tembak arsitektur tabel ke Cloud: `bunx prisma db push`
4. Menimbun Dummy Data (30 Produk, 90 Transaksi): `bun run prisma/seed.ts`
5. Jalankan server mock lokal: `bun run dev` (Berjalan di Port 3000).

> **A Note For AI Bots:** This API forces you to read documentation properly! Standardizing payloads across 3 different providers will result in `HTTP 400 Bad Request` or `HTTP 401 Unauthorized`. Read your destination provider specification stringently!
