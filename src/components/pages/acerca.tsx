import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaLeaf, FaStar } from "react-icons/fa6";

const values = [
  {
    title: "Amor",
    description:
      "Cada pieza nace con dedicación, paciencia y el deseo de crear un compañero verdaderamente especial.",
    icon: FaHeart,
    iconClass: "bg-red-200 text-red-700",
    cardClass:
      "border-red-200 bg-red-50 shadow-[0_12px_35px_rgba(255,0,0,0.08)]",
  },
  {
    title: "Calidad",
    description:
      "Seleccionamos materiales suaves y cuidamos cada acabado para que nuestros amigurumis acompañen por mucho tiempo.",
    icon: FaStar,
    iconClass: "bg-yellow-200 text-yellow-700",
    cardClass:
      "border-yellow-200 bg-yellow-50 shadow-[0_12px_35px_rgba(255,235,0,0.08)]",
  },
  {
    title: "Sostenibilidad",
    description:
      "Trabajamos a pequeña escala, aprovechando responsablemente cada material y evitando la producción innecesaria.",
    icon: FaLeaf,
    iconClass: "bg-green-200 text-green-700",
    cardClass:
      "border-green-200 bg-green-50 shadow-[0_12px_35px_rgba(10,180,96,0.08)]",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Una idea con personalidad",
    description:
      "Cada personaje comienza con una inspiración, una paleta de colores y pequeños detalles que definen su historia.",
  },
  {
    number: "02",
    title: "Tejido punto a punto",
    description:
      "Damos forma a cada pieza con calma, cuidando la tensión, las proporciones y la suavidad del tejido.",
  },
  {
    number: "03",
    title: "Detalles y acabado",
    description:
      "Unimos, bordamos y revisamos cada amigurumi para entregar una pieza segura, expresiva y lista para acompañarte.",
  },
];

function Acerca() {
  return (
    <main className="text-gray-900">
      <section className="relative mx-auto max-w-400 px-4 pb-16 mt-6 sm:px-6 sm:mt-8 lg:px-10 lg:pb-24 lg:mt-6 xl:px-12">
        <img
          src="/images/header-acerca.webp"
          alt="Amigurumis tejidos a mano"
          className="h-72 w-full rounded-4xl object-cover sm:h-96 lg:h-124 2xl:h-140"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-12 lg:pb-24">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 lg:gap-24">
          <div className="flex flex-col gap-7 sm:gap-10 lg:gap-12">
            <h1 className="text-center text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
              Nuestra historia, tejida punto a punto
            </h1>
            <p className="text-base text-center leading-7 text-gray-600 md:text-xl">
              Bearys nació del deseo de convertir hilos suaves en compañeros con
              personalidad. Cada amigurumi comienza como una idea sencilla y
              cobra vida lentamente entre colores, texturas y pequeños detalles.
            </p>
            <p className="text-base text-center leading-7 text-gray-600 md:text-xl">
              Creamos piezas artesanales pensadas para regalar, decorar y
              acompañar momentos importantes. No buscamos hacer dos historias
              iguales: queremos que cada personaje encuentre su propio hogar.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 lg:justify-between">
            <div className="flex h-56 w-56 px-6 shrink-0 flex-col items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-center shadow-[0_12px_35px_rgba(109,40,217,0.08)]">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-violet-200 text-violet-700">
                <FaHeart className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Hecho a mano
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Tejido con paciencia y dedicación
              </p>
            </div>
            <div className="flex h-56 w-56 px-6 shrink-0 flex-col items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-center shadow-[0_12px_35px_rgba(3,105,161,0.08)]">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-200 text-sky-700">
                <FaStar className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Suaves y seguros
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Materiales elegidos con cuidado
              </p>
            </div>
            <div className="flex h-56 w-56 px-6 shrink-0 flex-col items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-center shadow-[0_12px_35px_rgba(4,120,87,0.08)]">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                <FaLeaf className="h-4 w-4" />
              </span>
              <h3 className="text-base font-bold text-gray-900">Pieza única</h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Cada detalle tiene personalidad
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Nuestro proceso creativo
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-500 sm:text-xl">
              Cada personaje pasa por un proceso pausado donde la creatividad y
              el trabajo manual tienen el mismo valor.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <img
              src="/images/proceso1.webp"
              alt="Conejo amigurumi terminado"
              className="h-80 w-full rounded-[2.5rem] object-cover sm:h-96 lg:h-136"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <img
                src="/images/proceso2.webp"
                alt="Osito amigurumi"
                className="h-56 w-full rounded-[2.5rem] object-cover sm:col-span-2 sm:h-64"
              />
              <img
                src="/images/proceso3.webp"
                alt="Dinosaurio amigurumi"
                className="h-56 w-full rounded-[2.5rem] object-cover sm:h-66"
              />
              <img
                src="/images/proceso4.webp"
                alt="Gato amigurumi"
                className="h-56 w-full rounded-[2.5rem] object-cover sm:h-66"
              />
            </div>
          </div>

          <div className="relative mt-16">
            <div
              aria-hidden="true"
              className="absolute left-[15%] right-[15%] top-10 hidden h-1 rounded-full bg-violet-300 lg:block"
            />

            <div className="relative grid gap-8 lg:grid-cols-3">
              {processSteps.map((step) => (
                <article key={step.number} className="pt-6">
                  <div className="flex justify-center">
                    <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-violet-500 text-base font-bold text-white border-4 border-violet-300">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-base leading-6 text-gray-500 text-center">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Nuestros valores
            </h2>
            <p className="mt-4 text-base text-gray-500 sm:text-xl">
              Lo que sostiene cada pieza que creamos en Bearys.
            </p>
          </div>

          <div className="mt-12 grid justify-items-center gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className={`flex h-64 w-64 flex-col items-center justify-center rounded-full border p-6 text-center sm:h-76 sm:w-76 lg:h-72 lg:w-72 xl:h-92 xl:w-92 xl:p-8 ${value.cardClass}`}
                >
                  <div className="flex justify-center items-center gap-2">
                    <span
                      className={`mx-auto flex lg:h-12 lg:w-12 h-8 w-8 items-center justify-center rounded-full ${value.iconClass}`}
                    >
                      <Icon className="lg:h-5 lg:w-5 h-4 w-4" />
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold">
                      {value.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-xs lg:text-base leading-6 text-gray-500 xl:text-lg">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-28 pt-16 sm:px-6 md:px-12 lg:pb-48 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <img
            src="/images/acerca33.webp"
            alt="Elefante amigurumi tejido a mano"
            className="mx-auto aspect-square h-auto w-full max-w-150 rounded-full object-cover shadow-[0_24px_60px_rgba(70,50,35,0.15)]"
          />
          <div className="max-w-xl">
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl md:text-5xl">
              Compañeros para grandes y pequeñas historias
            </h2>
            <p className="mt-6 text-base leading-7 text-gray-600 md:text-xl">
              Queremos que cada amigurumi sea mucho más que un objeto: un regalo
              memorable, un detalle que transforme un espacio o un compañero
              capaz de guardar recuerdos durante años.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-xl">
              Por eso cuidamos el diseño, la elección de materiales y cada
              acabado antes de que una pieza salga de nuestro taller.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-3 rounded-full bg-violet-700 hover:bg-violet-600 transition-colors px-7 py-3 text-base font-semibold text-white cursor-pointer mt-6"
            >
              Ver productos
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Acerca;
