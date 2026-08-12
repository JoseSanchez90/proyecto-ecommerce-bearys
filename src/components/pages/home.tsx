import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProducts } from "@/hooks/use-products";
import { useSiteSettings } from "@/hooks/use-site-settings";

const categorias = [
  {
    id: "animales",
    name: "Animales",
    colors: "bg-amber-800 hover:bg-amber-900",
    glow: "0 0 25px 8px rgba(217,119,6,0.5)",
    image: "/icons/animal.svg",
  },
  {
    id: "anime",
    name: "Animes",
    colors: "bg-yellow-400 hover:bg-yellow-500",
    glow: "0 0 25px 8px rgba(250,204,21,0.5)",
    image: "/icons/animes.svg",
  },
  {
    id: "dibujos",
    name: "Dibujos",
    colors: "bg-red-500 hover:bg-red-600",
    glow: "0 0 25px 8px rgba(239,68,68,0.5)",
    image: "/icons/cartoons.svg",
  },
  {
    id: "comics",
    name: "Comics",
    colors: "bg-orange-500 hover:bg-orange-600",
    glow: "0 0 25px 8px rgba(249,115,22,0.5)",
    image: "/icons/comics.svg",
  },
  {
    id: "bebes",
    name: "Bebés",
    colors: "bg-pink-500 hover:bg-pink-600",
    glow: "0 0 25px 8px rgba(236,72,153,0.5)",
    image: "/icons/bebe.svg",
  },
];

const reviews = [
  {
    id: 1,
    name: "María García",
    company: "Cliente frecuente",
    rating: 5,
    text: "Compré el osito amigurumi para mi sobrina y le encantó. La calidad de la lana es increíble y los detalles son hermosos. Definitivamente volveré a comprar.",
    rotate: "xl:-rotate-2",
    mt: "mt-0",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    company: "Cliente",
    rating: 5,
    text: "Excelente atención al cliente. El pedido llegó antes de lo esperado y el producto es tal cual se muestra en las fotos. Muy recomendado.",
    rotate: "xl:rotate-4",
    mt: "xl:mt-12",
  },
  {
    id: 3,
    name: "Ana López",
    company: "Cliente",
    rating: 4,
    text: "Los amigurumis son preciosos y se nota el trabajo artesanal. Compré el conejo y el pato, ambos hermosos. El envío fue rápido y bien empacado.",
    rotate: "rotate-0",
    mt: "mt-2",
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    company: "Cliente",
    rating: 5,
    text: "Regalé el dinosaurio amigurumi a mi hijo y no lo suelta ni para dormir. Materiales suaves y seguros para niños. ¡Muy feliz con mi compra!",
    rotate: "xl:-rotate-5",
    mt: "xl:mt-12",
  },
];

function Home() {
  const [desktopApi, setDesktopApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);
  const { products: dbProducts } = useProducts();
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!desktopApi) return;

    const onSelect = () => setDesktopCurrent(desktopApi.selectedScrollSnap());
    onSelect();
    desktopApi.on("select", onSelect);

    const timer = setInterval(() => desktopApi.scrollNext(), 8000);

    return () => {
      clearInterval(timer);
      desktopApi.off("select", onSelect);
    };
  }, [desktopApi]);

  useEffect(() => {
    if (!mobileApi) return;

    const onSelect = () => setMobileCurrent(mobileApi.selectedScrollSnap());
    onSelect();
    mobileApi.on("select", onSelect);

    const timer = setInterval(() => mobileApi.scrollNext(), 8000);

    return () => {
      clearInterval(timer);
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi]);

  const configuredFeatured = dbProducts.filter(
    (product) => product.isFeaturedMonth,
  );
  const featuredProducts =
    configuredFeatured.length > 0 ? configuredFeatured : dbProducts.slice(0, 8);

  return (
    <main>
      {/* PORTADA */}
      <section className="relative mx-auto mt-6 h-72 w-[calc(100%-2rem)] max-w-400 sm:mt-8 sm:h-96 lg:mt-6 lg:h-124 2xl:h-140">
        <div className="absolute inset-0 hidden md:block">
          <Carousel
            setApi={setDesktopApi}
            opts={{ loop: true }}
            className="h-full w-full **:data-[slot=carousel-content]:h-full"
          >
            <CarouselContent className="h-full">
              {settings.homeDesktopImages.map((image, index) => (
                <CarouselItem
                  key={`${image}-${index}`}
                  className="mr-4 h-full basis-[calc(100%-2rem)]"
                >
                  <img
                    src={image}
                    alt="portada amigurumis"
                    className="h-full w-full rounded-4xl object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="absolute inset-0 md:hidden">
          <Carousel
            setApi={setMobileApi}
            opts={{ loop: true }}
            className="h-full w-full **:data-[slot=carousel-content]:h-full"
          >
            <CarouselContent className="h-full">
              {settings.homeMobileImages.map((image, index) => (
                <CarouselItem
                  key={`${image}-${index}`}
                  className="mr-4 h-full basis-[calc(100%-2rem)]"
                >
                  <img
                    src={image}
                    alt="portada amigurumis"
                    className="h-full w-full rounded-4xl object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 gap-2 rounded-full bg-white p-2 md:flex">
          {settings.homeDesktopImages.map((_, i) => (
            <button
              key={i}
              onClick={() => desktopApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === desktopCurrent
                  ? "bg-blue-600 w-6"
                  : "bg-blue-300 hover:bg-blue-400"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-white p-2 md:hidden">
          {settings.homeMobileImages.map((_, i) => (
            <button
              key={i}
              onClick={() => mobileApi?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === mobileCurrent
                  ? "bg-blue-600 w-6"
                  : "bg-blue-300 hover:bg-blue-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Encuentra a tu Compañero Perfecto
          </h2>
          <p className="text-center text-base sm:text-xl">
            Explora nuestras categorias diseñadas para todas las edades y gustos
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 lg:gap-12">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/productos?categoria=${categoria.id}`}
              className={`flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-full border border-border transition-all duration-300 hover:scale-105 hover:shadow-(--glow) sm:h-32 sm:w-32 lg:h-38 lg:w-38 ${categoria.colors}`}
              style={{ "--glow": categoria.glow } as React.CSSProperties}
            >
              <img
                src={categoria.image}
                alt={categoria.name}
                className="h-14 w-14 object-cover sm:h-16 sm:w-16 lg:h-20 lg:w-20"
              />
              <strong className="text-center text-sm font-bold text-white sm:text-base lg:text-lg">
                {categoria.name}
              </strong>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DEL MES */}
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:gap-12 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Productos del mes
          </h2>
          <p className="text-center text-base sm:text-xl">
            Productos destacados este mes, no te los pierdas.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product) => {
            if (!product) return null;
            return (
              <Link
                key={product.id}
                to={`/producto/${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex flex-col gap-4 rounded-4xl border border-border bg-gray-50 p-4"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full rounded-4xl object-cover"
                  />
                  {product.popular && (
                    <Badge className="absolute right-4 top-4 bg-indigo-800 py-3 text-white">
                      Más pedido
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-2 px-1 pb-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={index}
                        className={`text-base ${
                          index < product.rating
                            ? "text-amber-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <p className="text-xl font-bold">S/. {product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ESPECIAL DE TEMPORADA */}
      <section className="relative mx-auto flex h-120 w-[calc(100%-2rem)] max-w-400 flex-col gap-12 sm:h-140 lg:h-160">
        <div className="absolute inset-0">
          <img
            src={settings.homePromotionImage}
            alt="ofertas"
            className="w-full h-full object-cover rounded-4xl"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 rounded-4xl"></div>
        <div className="relative z-10 flex h-full flex-col justify-center gap-2 px-5 text-white sm:px-10 lg:px-0">
          <div className="flex w-full max-w-140 flex-col items-center gap-4 text-center lg:ml-18">
            <h2 className="font-trainone text-2xl text-orange-300 sm:text-4xl lg:text-5xl">
              ESPECIAL DE TEMPORADA
            </h2>
            <p className="text-lg font-semibold sm:text-2xl">
              Aprovecha nuestras ofertas por tiempo limitado.
            </p>
            <span className="text-base sm:text-xl">
              Consigue un{" "}
              <p className="inline-block text-yellow-400 font-semibold">
                15% de descuento
              </p>{" "}
              en toda la colección de animalitos del bosque esta semana.
            </span>
            <Button className="mt-3 cursor-pointer rounded-full bg-blue-500 px-7 py-5 text-base shadow-lg hover:bg-blue-600 sm:mt-6 sm:px-10 sm:py-6 sm:text-xl">
              Ver ofertas
            </Button>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section className="mx-auto mb-8 flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:mb-12 lg:gap-12 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-center text-base text-muted-foreground sm:text-xl">
            Opiniones reales de personas que ya compraron
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`relative mx-auto flex w-full max-w-72 flex-col gap-4 rounded-3xl border border-gray-200 bg-amber-50 p-8 pt-14 shadow-lg transition-transform duration-300 hover:z-20 hover:scale-105 ${review.rotate} ${review.mt}`}
            >
              {/* Número de orden */}
              <div className="absolute top-4 left-5 w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Estrellas */}
              <div className="flex gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < review.rating ? "text-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Autor */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-4">
                <img
                  src="/images/osito.webp"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="">
                  <p className="text-base font-bold text-gray-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-500">{review.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
