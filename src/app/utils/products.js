// Product definitions with canonical IDs for orders and reviews
export const PRODUCTS = {
  CHICKEN_PICKLE: {
    id: "devi-spicy-chicken-pickle",
    slug: "chicken-pickle",
    sku: "chicken-pickle",
    name: "Devi Spicy Chicken Pickle",
    description: "Boneless chicken pickle slow-cooked in cold-pressed groundnut oil",
  },
  MUTTON_PICKLE: {
    id: "devi-spicy-mutton-pickle",
    slug: "mutton-pickle",
    sku: "mutton-pickle",
    name: "Devi Spicy Mutton Pickle",
    description: "Tender mutton pieces in a bold blend of Telangana spices",
  },
};

export const getProductById = (id) => {
  return Object.values(PRODUCTS).find((p) => p.id === id);
};

export const getProductBySku = (sku) => {
  return Object.values(PRODUCTS).find((p) => p.sku === sku);
};
