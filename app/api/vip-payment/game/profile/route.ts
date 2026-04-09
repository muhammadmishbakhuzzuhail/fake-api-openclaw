import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// VIP Menggunakan Format GET untuk cek Profile dan Harga
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action !== 'profile' && action !== 'game') {
      return NextResponse.json({ result: false, message: "Invalid VIP Action" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { provider_code: 'VIP_PAYMENT' }
  });

  const vipData = products.map((p: any) => ({
     code: p.code,
     game: "Mobile Legends / Free Fire",
     name: p.name,
     price: p.cost_price,
     status: p.status === "ACTIVE" ? 1 : 0 // VIP pake 1 dan 0
  }));

  return NextResponse.json({
    result: true,
    data: vipData,
    message: "Data game berhasil diambil"
  });
}
