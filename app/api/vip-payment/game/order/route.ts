import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Asumsi VIP butuh parameter berbeda: service, no_id, zone_id
    if (!body.service || !body.data_no) {
       return NextResponse.json({ result: false, message: "Parameter VIP Tidak Lengkap" }, { status: 400 });
    }

    const mockVIPTrxID = `VIP-${Math.floor(Math.random() * 1000000)}`;

    return NextResponse.json({
        result: true,
        data: {
            trxid: mockVIPTrxID, // ID Provider VIP
            data: body.data_no,
            zone: body.data_zone || "",
            service: body.service, // ML86, dll.
            status: "pending",
            note: "Pesanan masuk antrian VIP",
            balance: 50000,
            price: 22000
        },
        message: "Pesanan berhasil dibuat"
    });

  } catch (err) {
    return NextResponse.json({ result: false, message: "Internal VIP Server Error" }, { status: 500 });
  }
}
