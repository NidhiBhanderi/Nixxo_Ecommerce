import Link from "next/link";

export default function ProductCard({ product }) {
  const price = product.discountPrice ?? product.price;
  const primaryImage = product.imageUrls?.[0] ?? "/placeholder.png";

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <img src={primaryImage} alt={product.name} />
      <strong>{product.name}</strong>
      <span>
        {product.discountPrice && (
          <span style={{ textDecoration: "line-through", color: "#999", marginRight: 6 }}>
            ${product.price.toFixed(2)}
          </span>
        )}
        ${price.toFixed(2)}
      </span>
    </Link>
  );
}
