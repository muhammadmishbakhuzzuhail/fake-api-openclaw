import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.productID || !body.targetNumber) {
        return NextResponse.json({ status: 400, message: "Bad Request: No targetNumber or productID" }, { status: 400 });
    }

    const mockBillID = `PF-TRX-XX${Math.floor(Math.random() * 999999)}`;

    return NextResponse.json({
        status: 201, // Created
        message: "Transaksi Payfazz Sedang Diproses",
        content: {
            orderID: mockBillID,
            productID: body.productID,
            targetNumber: body.targetNumber,
            transactionStatus: "PENDING",
            serialNumber: null
        }
    });
  } catch (error) {
     return NextResponse.json({ status: 500, message: "Payfazz H2H Error" }, { status: 500 });
  }
}
