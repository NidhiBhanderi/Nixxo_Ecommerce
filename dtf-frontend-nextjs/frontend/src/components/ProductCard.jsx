import Link from "next/link";

export default function ProductCard({ product }) {
  const price = product.discountPrice ?? product.price;
  const primaryImage = product.imageUrls?.[0] ?? "/placeholder.png";

  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <img className="product-image" src={primaryImage} alt={product.name} />
      <div className="product-details">
        <strong className="product-name">{product.name}</strong>
        <span className="price">
        {product.discountPrice && (
          <span className="old-price">
            ${product.price.toFixed(2)}
          </span>
        )}
        ${price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
