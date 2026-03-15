import { describe, it, expect } from "vitest";

// Test cart store logic
describe("Cart Store Logic", () => {
  it("should calculate cart total correctly", () => {
    const items = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 3 },
    ];
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBe(3500);
  });

  it("should handle empty cart", () => {
    const items: { price: number; quantity: number }[] = [];
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBe(0);
  });

  it("should not exceed max quantity", () => {
    const MAX_QUANTITY = 10;
    const requested = 15;
    const quantity = Math.min(requested, MAX_QUANTITY);
    expect(quantity).toBe(10);
  });
});

// Test product filtering
describe("Product Filtering", () => {
  const mockProducts = [
    { id: "1", name: "iPhone", category: "electronics", brand: "Apple", price: 100000, rating: 4.5 },
    { id: "2", name: "Nike Shoes", category: "fashion", brand: "Nike", price: 5000, rating: 4.0 },
    { id: "3", name: "Samsung TV", category: "electronics", brand: "Samsung", price: 50000, rating: 4.3 },
    { id: "4", name: "Book", category: "books", brand: "Penguin", price: 300, rating: 4.8 },
  ];

  it("should filter by category", () => {
    const filtered = mockProducts.filter(p => p.category === "electronics");
    expect(filtered).toHaveLength(2);
  });

  it("should filter by price range", () => {
    const filtered = mockProducts.filter(p => p.price >= 1000 && p.price <= 60000);
    expect(filtered).toHaveLength(2);
  });

  it("should filter by minimum rating", () => {
    const filtered = mockProducts.filter(p => p.rating >= 4.3);
    expect(filtered).toHaveLength(3);
  });

  it("should sort by price ascending", () => {
    const sorted = [...mockProducts].sort((a, b) => a.price - b.price);
    expect(sorted[0].name).toBe("Book");
    expect(sorted[sorted.length - 1].name).toBe("iPhone");
  });

  it("should handle search query", () => {
    const query = "iphone";
    const results = mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    expect(results).toHaveLength(1);
    expect(results[0].brand).toBe("Apple");
  });
});

// Test coupon validation logic
describe("Coupon Validation", () => {
  const coupons: Record<string, { discount: number; type: "percent" | "flat"; minOrder: number; maxDiscount?: number }> = {
    SAVE10: { discount: 10, type: "percent", minOrder: 1000, maxDiscount: 2000 },
    FLAT500: { discount: 500, type: "flat", minOrder: 3000 },
  };

  it("should apply percentage discount correctly", () => {
    const coupon = coupons["SAVE10"];
    const cartTotal = 5000;
    const discount = Math.min(Math.round(cartTotal * coupon.discount / 100), coupon.maxDiscount || Infinity);
    expect(discount).toBe(500);
  });

  it("should cap percentage discount at maxDiscount", () => {
    const coupon = coupons["SAVE10"];
    const cartTotal = 50000;
    const discount = Math.min(Math.round(cartTotal * coupon.discount / 100), coupon.maxDiscount || Infinity);
    expect(discount).toBe(2000);
  });

  it("should apply flat discount correctly", () => {
    const coupon = coupons["FLAT500"];
    const discount = coupon.discount;
    expect(discount).toBe(500);
  });

  it("should reject coupon below minimum order", () => {
    const coupon = coupons["FLAT500"];
    const cartTotal = 2000;
    const valid = cartTotal >= coupon.minOrder;
    expect(valid).toBe(false);
  });

  it("should reject invalid coupon code", () => {
    const coupon = coupons["INVALID"];
    expect(coupon).toBeUndefined();
  });
});

// Test order splitting logic
describe("Order Splitting", () => {
  const cartItems = [
    { product: { id: "1", vendorId: "v-1", vendorName: "Vendor A", price: 1000 }, quantity: 1 },
    { product: { id: "2", vendorId: "v-1", vendorName: "Vendor A", price: 2000 }, quantity: 2 },
    { product: { id: "3", vendorId: "v-2", vendorName: "Vendor B", price: 500 }, quantity: 3 },
  ];

  it("should group items by vendor", () => {
    const groups = cartItems.reduce<Record<string, typeof cartItems>>((g, item) => {
      const key = item.product.vendorId;
      if (!g[key]) g[key] = [];
      g[key].push(item);
      return g;
    }, {});

    expect(Object.keys(groups)).toHaveLength(2);
    expect(groups["v-1"]).toHaveLength(2);
    expect(groups["v-2"]).toHaveLength(1);
  });

  it("should calculate vendor subtotals correctly", () => {
    const groups = cartItems.reduce<Record<string, typeof cartItems>>((g, item) => {
      const key = item.product.vendorId;
      if (!g[key]) g[key] = [];
      g[key].push(item);
      return g;
    }, {});

    const vendorATot = groups["v-1"].reduce((s, i) => s + i.product.price * i.quantity, 0);
    const vendorBTot = groups["v-2"].reduce((s, i) => s + i.product.price * i.quantity, 0);

    expect(vendorATot).toBe(5000);
    expect(vendorBTot).toBe(1500);
  });
});

// Test recently viewed deduplication
describe("Recently Viewed", () => {
  it("should deduplicate and maintain order", () => {
    let viewed: string[] = ["a", "b", "c"];
    const addProduct = (id: string) => {
      viewed = [id, ...viewed.filter(x => x !== id)].slice(0, 10);
    };

    addProduct("b"); // b already exists, should move to front
    expect(viewed).toEqual(["b", "a", "c"]);

    addProduct("d");
    expect(viewed).toEqual(["d", "b", "a", "c"]);
  });

  it("should cap at 10 items", () => {
    let viewed: string[] = [];
    for (let i = 0; i < 15; i++) {
      viewed = [String(i), ...viewed.filter(x => x !== String(i))].slice(0, 10);
    }
    expect(viewed).toHaveLength(10);
    expect(viewed[0]).toBe("14");
  });
});
