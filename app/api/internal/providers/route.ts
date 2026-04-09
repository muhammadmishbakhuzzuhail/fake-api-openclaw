import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Mengambil semua Data Provider Eksternal beserta produk yang terhubung ke mereka
    const providers = await prisma.provider.findMany({
      include: {
        products: {
            select: {
                code: true,
                name: true,
                sell_price: true,
                status: true
            }
        }
      }
    });

    return NextResponse.json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal mengambil daftar Provider dari sistem." }, { status: 500 });
  }
}
