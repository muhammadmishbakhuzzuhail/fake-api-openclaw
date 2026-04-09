import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Endpoint Pengecekan Transaksi (Read-Only)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trx_code = searchParams.get('trx');

  if (!trx_code) {
    return NextResponse.json({ 
      success: false, 
      message: "Parameter 'trx' (Kode Transaksi) wajib diisi. Contoh: ?trx=TRX-001" 
    }, { status: 400 });
  }

  // Pencarian transaksi (Case Insensitive) di Database SQLite
  const transaction = await prisma.transaction.findUnique({
    where: { trx_code: trx_code.toUpperCase() },
    include: { 
      product: {
        include: { provider: true } // Akan mengembalikan info Katalog Produk dan Provider di payload
      } 
    }
  });

  if (!transaction) {
    return NextResponse.json({ 
      success: false, 
      message: `Transaksi dengan kode ${trx_code} tidak ditemukan di sistem database PPOB.` 
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: transaction
  });
}

// Endpoint Perubahan Transaksi (Write-Action) ke Prisma Database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ------- STRATEGI OTORISASI PROTEKSI API --------
    // API memblokir request langsung jika caller bukan dari Pintu PPOB.
    if (body.caller_role !== 'PPOB_CORE') {
      return NextResponse.json({
        success: false,
        message: "❌ Akses Ditolak (403 Forbidden). Hanya Tim PPOB_CORE yang memiliki izin (authorities) untuk memodifikasi transaksi. Merchant atau Supplier DILARANG masuk."
      }, { status: 403 });
    }
    // ------------------------------------------------

    const { trx_code, status, sn, notes } = body;

    // Validate params mandatory
    if (!trx_code || !status) {
      return NextResponse.json({
        success: false,
        message: "Payload wajib memiliki 'trx_code' dan tindakan ('status')."
      }, { status: 400 });
    }

    // Proses Real Update ke SQLite Database via Prisma
    const transaction = await prisma.transaction.update({
      where: { trx_code: trx_code.toUpperCase() },
      data: {
        status: status.toUpperCase(),
        sn: sn !== undefined ? sn : undefined,
        notes: notes !== undefined ? notes : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: `🟢 Command Dieksekusi: Transaksi ${trx_code} berhasil dioverride via Manual Inject dan disimpan ke Database Prisma.`,
      data: transaction
    });
  } catch (err: any) {
    // Handling Prisma Not Found Error (Record to update not found)
    if (err.code === 'P2025') {
       return NextResponse.json({ success: false, message: `Gagal diproses. Transaksi tidak ada di Database.` }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: "Invalid JSON format body." }, { status: 400 });
  }
}
