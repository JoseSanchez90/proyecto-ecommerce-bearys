import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/use-product";
import { useCart } from "@/contexts/cart-context";
import { products as allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaStar,
  FaTruck,
  FaHandPaper,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaWhatsapp,
  FaBox,
  FaWeight,
  FaTag,
} from "react-icons/fa";
import { RiBearSmileFill } from "react-icons/ri";
import { BsBoxFill } from "react-icons/bs";
import { FaHandHoldingHeart } from "react-icons/fa";
import {
  DEFAULT_PRODUCT_SIZE,
  PRODUCT_SIZES,
  getProductSize,
  type ProductSize,
} from "@/data/product-sizes";

export default function DetalleProducto() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug ?? "");
  const { addItems } = useCart();
  const [selectedSize, setSelectedSize] =
    useState<ProductSize>(DEFAULT_PRODUCT_SIZE);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryImages = product
    ? [product.image, ...(product.galleryImages ?? [])].filter(Boolean)
    : [];

  useEffect(() => {
    setSelectedImage(product?.image ?? "");
  }, [product?.id, product?.image]);

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-zinc-500 font-sans">
          Cargando producto...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-zinc-500 font-sans">Producto no encontrado.</p>
        <Link to="/productos">
          <Button variant="outline">
            <FaArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Button>
        </Link>
      </div>
    );
  }

  const sizeInfo = getProductSize(selectedSize);
  const finalPrice = product.price + sizeInfo.priceMod;
  const total = finalPrice * qty;

  const handleWhatsApp = () => {
    const phone = "51987654321";
    const sizeLabel = sizeInfo.label;
    const msg = encodeURIComponent(
      `Hola Bearys 😊\n\nMe interesa este producto:\n\n*${product.name}* — S/. ${finalPrice}\nTamaño: ${sizeLabel}\nCantidad: ${qty}\nSubtotal: S/. ${total} \n\n¿Me das más información?`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const relatedProducts = (() => {
    if (allProducts.length <= 1) return [];

    const currentIndex = allProducts.findIndex((p) => p.id === product.id);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;
    const rotatedProducts = Array.from(
      { length: allProducts.length },
      (_, offset) =>
        allProducts[(startIndex + offset + 1) % allProducts.length],
    ).filter((p) => p.id !== product.id);

    const sameCategory = rotatedProducts.filter(
      (p) => p.category === product.category,
    );
    const otherCategories = rotatedProducts.filter(
      (p) => p.category !== product.category,
    );

    return [...sameCategory, ...otherCategories].slice(0, 4);
  })();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-32 lg:pt-12">
      <Link
        to="/productos"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-foreground mb-6 transition-colors font-sans"
      >
        <FaArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-18">
        {/* Imagen */}
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-zinc-100">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {galleryImages.slice(0, 5).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square overflow-hidden rounded-3xl border-2 bg-zinc-100 p-0.5 transition-colors ${
                    (selectedImage || product.image) === image
                      ? "border-blue-500"
                      : "border-transparent hover:border-blue-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} vista ${index + 1}`}
                    className="h-full w-full rounded-3xl object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-wider text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < product.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-500 font-sans">
                {product.rating}/5 ({product.reviews} reseñas)
              </span>
            </div>
          </div>

          <p className="text-zinc-600 leading-relaxed font-sans">
            {product.desc}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {product.isNew && (
              <Badge className="bg-emerald-500 py-3">Nuevo</Badge>
            )}
            {product.onSale && (
              <Badge className="bg-red-500 py-3">En oferta</Badge>
            )}
            {product.artesanal && (
              <Badge className="bg-amber-500 text-white py-3">
                <FaHandPaper className="mr-1 h-3 w-3" />
                Artesanal
              </Badge>
            )}
          </div>

          {/* Tamaño */}
          <div className="mt-2">
            <h3 className="text-sm font-semibold text-foreground mb-3 font-sans">
              Tamaño
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRODUCT_SIZES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSize(s.key)}
                  className={`rounded-xl border-2 px-4 py-3 text-left cursor-pointer transition-all ${
                    selectedSize === s.key
                      ? "border-blue-500 bg-blue-100"
                      : "border-blue-200 hover:border-blue-500"
                  }`}
                >
                  <span className="block text-sm font-semibold font-sans">
                    {s.label}
                  </span>
                  <div className="flex flex-col text-xs text-zinc-500 font-sans">
                    <span>{s.dims} </span>
                    {s.priceMod > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <FaPlus className="w-2 h-2" /> S/. {s.priceMod}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="mt-2">
            <h3 className="text-sm font-semibold text-foreground mb-3 font-sans">
              Cantidad
            </h3>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-full"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <FaMinus className="h-4 w-4" />
                </Button>
                <span className="w-14 h-8 flex items-center justify-center border border-border bg-gray-100 rounded-xl font-semibold">
                  {qty}
                </span>
                <Button
                  size="icon"
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-full"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                >
                  <FaPlus className="h-4 w-4" />
                </Button>
              </div>

              {/* Precio */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground sm:text-4xl">
                  S/. {total}
                </span>
                {qty > 1 && (
                  <span className="text-xs text-zinc-400 font-sans">
                    (S/. {finalPrice} c/u)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => addItems(product.id, qty, selectedSize)}
              className="flex-1 gap-4 bg-blue-600 hover:bg-blue-700 py-3 lg:py-6 font-sans text-base cursor-pointer"
            >
              <FaShoppingCart className="h-6 w-6" />
              <p>Agregar al carrito</p>
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="flex-1 gap-4 bg-green-500 hover:bg-green-600 py-3 lg:py-6 font-sans text-base cursor-pointer"
            >
              <FaWhatsapp className="h-6 w-6" />
              <p>Comprar ahora</p>
            </Button>
          </div>

          {/* Detalles */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-4 font-sans">
              Detalles del producto
            </h2>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-4xl grid grid-cols-1 gap-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                <div className="flex items-center gap-2 sm:col-span-2">
                  <FaBox className="h-4 w-4 text-blue-600" />
                  <p className="font-bold text-sm">Material:</p>
                </div>
                <p className="font-sans text-sm sm:col-span-3">
                  {product.material}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                <div className="flex items-center gap-2 sm:col-span-2">
                  <FaWeight className="h-4 w-4 text-blue-600" />
                  <p className="font-bold text-sm">Peso:</p>
                </div>
                <p className="font-sans text-sm sm:col-span-3">
                  {product.peso}g
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-4">
                <div className="flex items-center gap-2 sm:col-span-2">
                  <FaTag className="h-4 w-4 text-blue-600" />
                  <p className="font-bold text-sm">Categoría:</p>
                </div>
                <p className="font-sans text-sm sm:col-span-3">
                  {product.category}
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-5 sm:gap-4">
                <div className="flex items-center gap-2 sm:col-span-2">
                  <FaHandHoldingHeart className="h-4 w-4 text-blue-600" />
                  <p className="font-bold text-sm">Cuidado:</p>
                </div>
                <p className="font-sans text-sm sm:col-span-3">
                  {product.instruccionesCuidado}
                </p>
              </div>
            </div>
          </div>

          {/* Info extra */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 flex flex-col justify-center items-center gap-1 bg-orange-100 rounded-4xl p-4">
              <FaTruck className="h-5 w-5 text-orange-500" />
              <span className="text-xs text-orange-500 font-sans text-center">
                Envío en {product.diasEntrega} días
              </span>
            </div>
            <div className="h-24 flex flex-col justify-center items-center gap-1 bg-purple-100 rounded-4xl p-4">
              <BsBoxFill className="h-5 w-5 text-purple-500" />
              <span className="text-xs text-purple-500 font-sans text-center">
                Envio seguro
              </span>
            </div>
            <div className="h-24 flex flex-col justify-center items-center gap-1 bg-cyan-100 rounded-4xl p-4">
              <RiBearSmileFill className="h-5 w-5 text-cyan-500" />
              <span className="text-xs text-cyan-500 font-sans text-center">
                {product.stock} disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TAL VEZ TE GUSTARÍA */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-xl font-bold sm:text-2xl">
              Tal vez te gustaría ver...
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="border border-border bg-gray-50 rounded-4xl p-4 flex flex-col justify-between gap-2"
              >
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-square object-cover rounded-4xl cursor-pointer"
                  />
                  {p.isNew && (
                    <Badge className="absolute bg-green-500 font-bold top-4 right-4 py-3">
                      Nuevo
                    </Badge>
                  )}
                  {p.onSale && (
                    <Badge className="absolute bg-red-500 font-bold top-4 right-4 py-3">
                      Oferta
                    </Badge>
                  )}
                </div>
                <div className="h-full flex flex-col gap-1 pt-2">
                  <h3 className="text-base font-semibold truncate">{p.name}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < p.rating ? "text-amber-400" : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({p.reviews})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">S/. {p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
