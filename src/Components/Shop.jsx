import ProductCard from "./ProductCard";
import products from "./data/products";

function Shop() {
  return (
    <section
      id="shop"
      className="w-full py-28 px-8 md:px-24"
      style={{ backgroundColor: "#F7F1E6" }}
    >
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h2
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ color: "#234B3B", marginBottom: "16px" }}
        >
          The Collection
        </h2>
        <p
          className="text-base md:text-lg max-w-xl mx-auto"
          style={{ color: "#2A2118", opacity: 0.75, lineHeight: 1.6 }}
        >
          Paint-it-yourself kits, brush and colours included.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-14">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Shop;
