async function run() {
  const tests = [
    { name: "INTERNAL PROVIDERS", url: "http://localhost:3000/api/internal/providers" },
    { name: "INTERNAL CATALOG", url: "http://localhost:3000/api/internal/catalog" },
    { name: "DIGIFLAZZ PRICELIST", url: "http://localhost:3000/api/digiflazz/v1/price-list", method: "POST", body: { username: "bot", sign: "key123" } },
    { name: "DIGIFLAZZ TRX", url: "http://localhost:3000/api/digiflazz/v1/transaction", method: "POST", body: { buyer_sku_code: "TSEL10", customer_no: "081", ref_id: "TRX1" } },
    { name: "VIP PAYMENT PROFILE", url: "http://localhost:3000/api/vip-payment/game/profile?action=game" },
    { name: "VIP PAYMENT ORDER", url: "http://localhost:3000/api/vip-payment/game/order", method: "POST", body: { service: "ML", data_no: "123" } },
    { name: "PAYFAZZ PRODUCTS", url: "http://localhost:3000/api/payfazz/v1/products" },
    { name: "PAYFAZZ TRX", url: "http://localhost:3000/api/payfazz/v1/bill", method: "POST", body: { productID: "PLN", targetNumber: "123" } }
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method || "GET",
        headers: t.body ? { "Content-Type": "application/json" } : {},
        body: t.body ? JSON.stringify(t.body) : undefined
      });
      const data = await res.json();
      console.log(`[PASS] ${t.name}: HTTP ${res.status}`);
    } catch(e) {
      console.log(`[FAIL] ${t.name}: ${e.message}`);
    }
  }
}
run();
