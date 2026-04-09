import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // CLEANUP
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.provider.deleteMany({});

  // 1. CREATE 3 PROVIDERS
  const providersData = [
    { code: "DIGIFLAZZ", name: "Digiflazz H2H", base_url: "https://api.digiflazz.com/v1", api_key: "dev-key-123", status: "ACTIVE" },
    { code: "VIP_PAYMENT", name: "VIP Developer", base_url: "https://vip-payment.co.id/api", api_key: "vip-key-xyz", status: "ACTIVE" },
    { code: "PAYFAZZ", name: "Payfazz Enterprise", base_url: "https://b2b.payfazz.com/api", api_key: "pay-key-456", status: "MAINTENANCE" }
  ];

  const providers = [];
  for (const prov of providersData) {
    const p = await prisma.provider.create({ data: prov });
    providers.push(p);
  }
  console.log(`Created ${providers.length} providers.`);

  // 2. CREATE 10 PRODUCTS PER PROVIDER (TOTAL 30 PRODUCTS)
  const productTypes = ['PULSA', 'GAME', 'PLN_TOKEN', 'EWALLET'];
  const merchants = ["120363424698388087@g.us", "120363423188530621@g.us"]; // Merchant 1 & 2
  
  let trxCounter = 1;
  let totalProducts = 0;
  let totalTransactions = 0;

  for (const provider of providers) {
    for (let i = 1; i <= 10; i++) {
      const pType = productTypes[i % 4];
      const prodCode = `${provider.code.substring(0, 3)}-PROD-${i}`;
      
      const product = await prisma.product.create({
        data: {
          code: prodCode,
          type: pType,
          name: `Mock ${pType} ${i * 10}K (${provider.name})`,
          provider_code: provider.code,
          cost_price: i * 9000,
          sell_price: i * 10000,
          status: provider.status === 'MAINTENANCE' ? 'GANGGUAN' : 'ACTIVE'
        }
      });
      totalProducts++;

      // 3. CREATE 3 TRANSACTIONS PER PRODUCT (TOTAL 90 TRANSACTIONS)
      const statuses = ['SUCCESS', 'PENDING', 'FAILED'];
      
      for (let j = 0; j < 3; j++) {
        const status = statuses[j];
        let sn = null;
        let notes = '';
        
        if (status === 'SUCCESS') {
          sn = `SN-${product.code}-${Math.floor(Math.random() * 1000000)}`;
          notes = 'Trx sukses terproses.';
        } else if (status === 'PENDING') {
          notes = 'Menunggu callback dari provider.';
        } else if (status === 'FAILED') {
          notes = 'Transaksi gagal / stok kosong.';
        }

        const trxCodeStr = `TRX-${trxCounter.toString().padStart(4, '0')}`;
        
        await prisma.transaction.create({
          data: {
            trx_code: trxCodeStr,
            product_code: product.code,
            customer_number: `0812${Math.floor(Math.random() * 100000000)}`,
            merchant_id: merchants[trxCounter % 2],
            status: status,
            sn: sn,
            provider_trx_code: `PRV-${provider.code}-${trxCodeStr}`,
            notes: notes
          }
        });
        
        totalTransactions++;
        trxCounter++;
      }
    }
  }

  console.log(`Created ${totalProducts} products (${providers.length} providers * 10).`);
  console.log(`Created ${totalTransactions} transactions (${totalProducts} products * 3).`);
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
