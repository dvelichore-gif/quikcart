import { useRouter } from 'next/router'
import { useCart, useCurrency } from '../pages/_app'

export default function ProductCard({ product, onAddToCart }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { formatPrice } = useCurrency()
  const save = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0
  const badgeMap = { hot:['badge-hot','Hot'], deal:['badge-deal','Deal'], new:['badge-new','New'], 'best seller':['badge-best','Best Seller'] }
  const [badgeClass, badgeLabel] = badgeMap[product.badge?.toLowerCase()] || []

  function handleAdd(e) {
    e.stopPropagation()
    addItem(product)
    if (onAddToCart) onAddToCart(product.name)
  }

  return (
    <div className="product-card" onClick={() => router.push(`/product/${product.id}`)}>
      <div className="product-card__img">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'contain',padding:8 }} loading="lazy" />
          : <span>{product.emoji || '📦'}</span>
        }
        <div className="product-card__badges">
          {badgeClass && <span className={`badge ${badgeClass}`}>{badgeLabel}</span>}
        </div>
        {save > 0 && <span className="product-card__save">-{save}%</span>}
      </div>
      <div className="product-card__body">
        <div className="product-card__name">{product.name}</div>
        <div className="product-card__stars">
          {'★'.repeat(Math.floor(product.rating||4))}{'☆'.repeat(5-Math.floor(product.rating||4))}
          <span> ({(product.reviews||0).toLocaleString()})</span>
        </div>
        <div>
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.original_price && <span className="product-card__was">{formatPrice(product.original_price)}</span>}
        </div>
        <div className="product-card__free">✓ Free delivery</div>
        <button className="product-card__atc" onClick={handleAdd}>Add to cart</button>
      </div>
    </div>
  )
}
