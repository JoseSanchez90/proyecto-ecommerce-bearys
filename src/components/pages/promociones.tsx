import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/contexts/cart-context";
import { useProducts } from "@/hooks/use-products";
import { useSiteSettings } from "@/hooks/use-site-settings";

function Promociones() {
  const { addItems } = useCart();
  const { products: dbProducts } = useProducts();
  const { settings } = useSiteSettings();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const getQty = (productId: number) => quantities[productId] || 1;
  const incQty = (productId: number) =>
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  const decQty = (productId: number) =>
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));

  const promoProducts = dbProducts.filter((p) => p.onSale);
  const promotionDate = new Date(settings.promotionEndAt);
  const promotionDay = String(promotionDate.getDate()).padStart(2, "0");
  const promotionMonth = promotionDate
    .toLocaleDateString("es-PE", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  const promotionYear = promotionDate.getFullYear();

  return (
    <main>
      {/* HERO */}
      <section className="relative mx-auto max-w-400 px-4 pb-16 mt-6 sm:px-6 sm:mt-8 lg:px-10 lg:pb-24 lg:mt-6 2xl:mt-12 xl:px-12">
        <div className="relative overflow-hidden rounded-4xl">
          <img
            src={settings.promotionsHeaderImage}
            alt="promociones desktop"
            className="hidden h-72 w-full object-cover sm:h-96 lg:h-136 2xl:h-140 md:block"
          />
          <img
            src={settings.promotionsMobileImage}
            alt="promociones mobile"
            className="h-72 w-full object-cover sm:h-96 lg:h-140 md:hidden"
          />
        </div>
      </section>

      {/* LA PROMOCIÓN TERMINA EN */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
            La promoción termina en:
          </h2>
          <div className="flex items-center justify-center gap-2 sm:gap-6">
            <div>
              <div className="flex h-18 w-20 flex-col items-center justify-center rounded-4xl bg-green-500 sm:h-24 sm:w-34">
                <p className="text-3xl font-bold text-white sm:text-5xl">
                  {promotionDay}
                </p>
              </div>
              <p className="text-base text-center uppercase font-semibold tracking-wider mt-1">
                Dia
              </p>
            </div>
            <div>
              <div className="flex h-18 w-20 flex-col items-center justify-center rounded-4xl bg-green-500 sm:h-24 sm:w-34">
                <p className="text-3xl font-bold text-white sm:text-5xl">
                  {promotionMonth}
                </p>
              </div>
              <p className="text-base text-center uppercase font-semibold tracking-wider mt-1">
                Mes
              </p>
            </div>
            <div>
              <div className="flex h-18 w-20 flex-col items-center justify-center rounded-4xl bg-green-500 sm:h-24 sm:w-34">
                <p className="text-2xl font-bold text-white sm:text-4xl lg:text-5xl">
                  {promotionYear}
                </p>
              </div>
              <p className="text-base text-center uppercase font-semibold tracking-wider mt-1">
                Año
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS EN PROMOCIÓN */}
      <section
        id="promociones"
        className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:gap-12 lg:px-8 lg:pb-24"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
            Selección destacada
          </h2>
          <p className="text-center text-base text-muted-foreground sm:text-xl">
            Los favoritos de la comunidad a precios especiales.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {promoProducts.map((product) => {
            const qty = getQty(product.id);
            const discount = Math.round(product.price * 0.3);
            const originalPrice = product.price;
            const salePrice = originalPrice - discount;
            return (
              <div
                key={product.id}
                className="border border-border bg-gray-50 rounded-4xl p-4 flex flex-col justify-between gap-2"
              >
                <div className="relative">
                  <Link
                    to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-4xl cursor-pointer"
                    />
                  </Link>
                  <Badge className="absolute bg-red-500 font-bold top-4 right-4 py-3">
                    -30%
                  </Badge>
                </div>
                <div className="h-full flex flex-col gap-1 pt-2">
                  <h3 className="text-base font-semibold truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < product.rating
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-lg text-blue-600">
                        S/. {salePrice}
                      </p>
                      <p className="text-sm text-muted-foreground line-through">
                        S/. {originalPrice}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => decQty(product.id)}
                        disabled={qty === 1}
                        className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 cursor-pointer rounded-full"
                      >
                        -
                      </Button>
                      <span className="w-12 h-8 flex items-center justify-center border border-border bg-white rounded-xl font-semibold">
                        {qty}
                      </span>
                      <Button
                        onClick={() => incQty(product.id)}
                        className="w-8 h-8 bg-indigo-500 hover:bg-indigo-600 cursor-pointer rounded-full"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      addItems(product.id, qty);
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: 1,
                      }));
                    }}
                    size="lg"
                    className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full cursor-pointer"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    <p>Agregar al carrito</p>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Promociones;
