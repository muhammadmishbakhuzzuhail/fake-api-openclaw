import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Digiflazz format mandates checking credentials in payload
    if (!body.username || !body.sign) {
      return NextResponse.json({
        data: null,
        message: "Key or sign is strictly required."
      }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      where: { provider_code: 'DIGIFLAZZ' }
    });

    const parsedData = products.map((p: any) => ({
      buyer_sku_code: p.code,
      product_name: p.name,
      category: p.type,
      brand: 'TELKOMSEL', // Mock
      type: 'Umum',
      seller_name: 'Mock Digiflazz H2H',
      price: p.cost_price, // Digiflazz returns base modal cost
      buyer_product_status: p.status === 'ACTIVE'
    }));

    return NextResponse.json({
      data: parsedData,
      message: "Success fetching Digiflazz pricelist"
    });
  } catch (error) {
    return NextResponse.json({ data: null, message: "Server Error" }, { status: 500 });
  }
}
