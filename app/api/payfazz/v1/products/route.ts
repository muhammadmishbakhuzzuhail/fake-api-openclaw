import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // Payfazz mock for products
  const products = await prisma.product.findMany({
    where: { provider_code: 'PAYFAZZ' }
  });

  const pfData = products.map(p => ({
     productID: p.code,
     productName: p.name,
     priceInfo: { base: p.cost_price, admin: 1500 },
     isActive: p.status === 'ACTIVE'
  }));

  return NextResponse.json({
    status: 200,
    message: "Success",
    content: pfData
  });
}
