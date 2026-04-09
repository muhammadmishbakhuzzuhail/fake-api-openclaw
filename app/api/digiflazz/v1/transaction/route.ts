import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.buyer_sku_code || !body.customer_no || !body.ref_id) {
       return NextResponse.json({ data: { status: "Gagal", message: "Missing buyer_sku_code, customer_no, or ref_id" } }, { status: 400 });
    }

    // Simulasi Digiflazz Transaction Response
    const mockRefID = `DGF-ID-${Math.floor(Math.random() * 100000000)}`;

    return NextResponse.json({
      data: {
        ref_id: body.ref_id, // Yang dikirim agent
        customer_no: body.customer_no,
        buyer_sku_code: body.buyer_sku_code,
        message: "Transaksi Sedang Diproses",
        status: "Pending",     // Digiflazz format
        rc: "00",              // Responce code Digiflazz
        sn: "",
        buyer_last_saldo: 450000,
        price: 10100,
        tele: `TRX-${mockRefID}` // ID Trx Di Sisi Provider!
      }
    });

  } catch (err) {
    return NextResponse.json({ data: { status: "Gagal", message: "Server Exception" } }, { status: 500 });
  }
}
