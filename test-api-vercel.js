async function run() {
  const baseUrl = "https://fake-api-openclaw-qwxigo0h1-muhammadmishbakhuzzuhails-projects.vercel.app";
  const tests = [
    { name: "INTERNAL PROVIDERS", url: `${baseUrl}/api/internal/providers` },
    { name: "INTERNAL CATALOG", url: `${baseUrl}/api/internal/catalog` },
    { name: "DIGIFLAZZ PRICELIST", url: `${baseUrl}/api/digiflazz/v1/price-list`, method: "POST", body: { username: "bot", sign: "key123" } },
    { name: "DIGIFLAZZ TRX", url: `${baseUrl}/api/digiflazz/v1/transaction`, method: "POST", body: { buyer_sku_code: "TSEL10", customer_no: "081", ref_id: "TRX1" } },
    { name: "VIP PAYMENT PROFILE", url: `${baseUrl}/api/vip-payment/game/profile?action=game` },
    { name: "VIP PAYMENT ORDER", url: `${baseUrl}/api/vip-payment/game/order`, method: "POST", body: { service: "ML", data_no: "123" } },
    { name: "PAYFAZZ PRODUCTS", url: `${baseUrl}/api/payfazz/v1/products` },
    { name: "PAYFAZZ TRX", url: `${baseUrl}/api/payfazz/v1/bill`, method: "POST", body: { productID: "PLN", targetNumber: "123" } }
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, {
        method: t.method || "GET",
        headers: t.body ? { "Content-Type": "application/json" } : {},
        body: t.body ? JSON.stringify(t.body) : undefined
      });
      const text = await res.text();
      console.log(`[HTTP ${res.status}] ${t.name}`);
      if(res.status >= 400 && res.status < 600) {
          console.log(`       Preview: ${text.substring(0, 100)}`);
      }
    } catch(e) {
      console.log(`[FAIL] ${t.name}: ${e.message}`);
    }
  }
}
run();
