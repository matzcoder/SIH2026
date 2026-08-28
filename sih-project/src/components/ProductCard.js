import ComplianceBadge from "./ComplianceBadge";
import "./ProductCard.css";

function ProductIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function ProductCard({
  product,
  onView,
}) {
  if (!product) {
    return null;
  }

  const {
    name,
    category = "Uncategorized",
    description = "No description available.",
    status = "review",
    score = 0,
    image,
  } = product;

  const safeScore = Math.min(100, Math.max(0, score));

  return (
    <article className="product-card">
      <div className="product-card-top">
        <div className="product-image">
          {image ? (
            <img
              src={image}
              alt={name}
            />
          ) : (
            <ProductIcon />
          )}
        </div>

        <ComplianceBadge status={status} />
      </div>

      <div className="product-card-content">
        <span className="product-category">
          {category}
        </span>

        <h3>{name}</h3>

        <p>{description}</p>
      </div>

      <div className="product-score">
        <div className="score-header">
          <span>Compliance Score</span>
          <strong>{safeScore}%</strong>
        </div>

        <div className="score-track">
          <div
            className={`score-bar ${
              safeScore >= 80
                ? "score-good"
                : safeScore >= 50
                  ? "score-medium"
                  : "score-low"
            }`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      </div>

      <div className="product-card-footer">
        <button
          type="button"
          className="product-view-button"
          onClick={() => onView?.(product)}
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default ProductCard;