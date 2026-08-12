import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiChevronDown, FiFilter, FiShoppingCart } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa6";
import { useCart } from "@/contexts/cart-context";
import { useProducts } from "@/hooks/use-products";
import {
  DEFAULT_PRODUCT_SIZE,
  PRODUCT_SIZES,
  getProductSize,
  type ProductSize,
} from "@/data/product-sizes";
import { useSiteSettings } from "@/hooks/use-site-settings";

const categories = [
  { id: "animales", label: "Animales" },
  { id: "anime", label: "Anime" },
  { id: "dibujos", label: "Dibujos animados" },
  { id: "comics", label: "Comics" },
  { id: "bebes", label: "Bebés" },
];

const ITEMS_PER_PAGE = 16;

function Productos() {
  const { addItems } = useCart();
  const { products: dbProducts } = useProducts();
  const { settings } = useSiteSettings();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedSizes, setSelectedSizes] = useState<
    Record<number, ProductSize>
  >({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([20, 500]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const getQty = (productId: number) => quantities[productId] || 1;
  const getSelectedSize = (productId: number) =>
    selectedSizes[productId] ?? DEFAULT_PRODUCT_SIZE;
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

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = dbProducts;

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    if (onSaleOnly) {
      result = result.filter((p) => p.onSale);
    }

    if (newOnly) {
      result = result.filter((p) => p.isNew);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });

    return result;
  }, [dbProducts, selectedCategories, priceRange, onSaleOnly, newOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main>
      {/* PORTADA */}
      <section className="relative mx-auto mt-6 w-full max-w-400 px-4 pb-16 sm:mt-8 sm:px-6 lg:mt-6 lg:px-10 lg:pb-24">
        <div className="relative rounded-4xl overflow-hidden">
          <img
            src={settings.productsHeaderImage}
            alt="catálogo"
            className="h-72 w-full rounded-4xl object-cover sm:h-96 lg:h-124 2xl:h-140"
          />
          <div className="absolute bg-black/40 lg:bg-transparent inset-0 rounded-4xl" />
        </div>
        <div className="absolute inset-x-4 bottom-16 top-0 flex flex-col items-end justify-center px-6 sm:inset-x-6 sm:px-10 lg:inset-x-10 lg:bottom-24 lg:items-end lg:px-0 lg:pr-32 2xl:pr-42">
          <div className="flex w-full max-w-72 md:max-w-120 flex-col justify-end gap-2">
            <h1 className="font-trainone text-2xl text-white lg:text-gray-900 sm:text-3xl lg:text-5xl">
              NUESTRA COLECCIÓN
            </h1>
            <p className="mt-2 max-w-md text-sm text-white lg:text-gray-900 sm:text-lg lg:text-2xl">
              Descubre nuestra familia de amigurumis tejidos a mano con los
              hilos más suaves y cargados de amor.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto flex max-w-400 flex-col gap-8 px-4 pb-12 sm:px-6 lg:px-10 xl:flex-row xl:gap-12 xl:px-12">
        {/* SIDEBAR */}
        <aside className="w-full shrink-0 xl:w-64">
          <button
            type="button"
            aria-expanded={isFiltersOpen}
            aria-controls="product-filters"
            onClick={() => setIsFiltersOpen((open) => !open)}
            className="flex w-full cursor-pointer items-center justify-between rounded-full border border-border bg-gray-50 px-5 py-3 text-sm font-bold xl:hidden"
          >
            <span className="flex items-center gap-2">
              <FiFilter className="h-4 w-4" />
              Filtros
            </span>
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${
                isFiltersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            id="product-filters"
            className={`mt-4 gap-8 rounded-4xl border border-border bg-gray-50 p-6 sm:grid-cols-3 xl:mt-0 xl:flex xl:flex-col ${
              isFiltersOpen ? "grid" : "hidden xl:flex"
            }`}
          >
            {/* CATEGORÍAS */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Categorías</h3>
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCategories.includes(cat.id)}
                    onCheckedChange={() => toggleCategory(cat.id)}
                    className="bg-white"
                  />
                  <Label
                    htmlFor={`cat-${cat.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {cat.label}
                  </Label>
                </div>
              ))}
            </div>

            <hr className="hidden border-border xl:block" />

            {/* FILTROS */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Productos</h3>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="on-sale"
                  checked={onSaleOnly}
                  className="bg-white"
                  onCheckedChange={(checked) => {
                    setOnSaleOnly(checked === true);
                    setCurrentPage(1);
                  }}
                />
                <Label
                  htmlFor="on-sale"
                  className="text-sm font-normal cursor-pointer"
                >
                  Oferta / Promociones
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="new-products"
                  checked={newOnly}
                  className="bg-white"
                  onCheckedChange={(checked) => {
                    setNewOnly(checked === true);
                    setCurrentPage(1);
                  }}
                />
                <Label
                  htmlFor="new-products"
                  className="text-sm font-normal cursor-pointer"
                >
                  Productos nuevos
                </Label>
              </div>
            </div>

            <hr className="hidden border-border xl:block" />

            {/* PRECIO */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">Precio</h3>
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-muted-foreground">Desde</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      S/.
                    </span>
                    <input
                      type="number"
                      min={20}
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => {
                        setPriceRange([Number(e.target.value), priceRange[1]]);
                        setCurrentPage(1);
                      }}
                      className="w-full h-9 rounded-4xl border border-input bg-white pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <span className="text-muted-foreground mt-5">—</span>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs text-muted-foreground">Hasta</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      S/.
                    </span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max={500}
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([priceRange[0], Number(e.target.value)]);
                        setCurrentPage(1);
                      }}
                      className="w-full h-9 rounded-4xl border border-input bg-white pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsFiltersOpen(false)}
              className="w-fit cursor-pointer rounded-full bg-indigo-600 text-white hover:bg-indigo-700 sm:col-span-3 xl:hidden"
            >
              Aplicar filtros
            </Button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* HEADER */}
          <div className="flex gap-4 items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando{" "}
              <span className="font-semibold text-foreground">
                {paginatedProducts.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-foreground">
                {filteredProducts.length}
              </span>{" "}
              resultados
            </p>
            <Select
              value={sortBy}
              onValueChange={(v) => {
                setSortBy(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popularidad</SelectItem>
                <SelectItem value="name">Alfabéticamente</SelectItem>
                <SelectItem value="price-asc">Precio más bajo</SelectItem>
                <SelectItem value="price-desc">Precio más alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GRID DE PRODUCTOS */}
          {paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg">No se encontraron productos</p>
              <p className="text-sm">Intenta ajustar los filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 min-[800px]:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
              {paginatedProducts.map((product) => {
                const qty = getQty(product.id);
                const selectedSize = getSelectedSize(product.id);
                const sizeInfo = getProductSize(selectedSize);
                const productPrice = product.price + sizeInfo.priceMod;
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
                      {product.isNew && (
                        <Badge className="absolute bg-green-500 font-bold top-4 right-4 py-3">
                          Nuevo
                        </Badge>
                      )}
                      {product.onSale && (
                        <Badge className="absolute bg-red-500 font-bold top-4 right-4 py-3">
                          Oferta
                        </Badge>
                      )}
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
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor={`size-${product.id}`}
                          className="text-xs font-semibold text-muted-foreground"
                        >
                          Tamaño
                        </Label>
                        <Select
                          value={selectedSize}
                          onValueChange={(value) =>
                            setSelectedSizes((previous) => ({
                              ...previous,
                              [product.id]: value as ProductSize,
                            }))
                          }
                        >
                          <SelectTrigger
                            id={`size-${product.id}`}
                            className="w-full rounded-full bg-white"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_SIZES.map((size) => (
                              <SelectItem key={size.key} value={size.key}>
                                {size.label} · {size.dims}
                                {size.priceMod > 0
                                  ? ` (+S/. ${size.priceMod})`
                                  : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-bold text-lg">S/. {productPrice}</p>
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
                          addItems(product.id, qty, selectedSize);
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
          )}

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer pr-2 sm:pr-4"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`cursor-pointer ${
                    currentPage === i + 1
                      ? "w-8 h-8 flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "w-8 h-8 flex justify-center items-center hover:bg-indigo-200"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer pl-2 sm:pl-4"
              >
                <FaArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Productos;
