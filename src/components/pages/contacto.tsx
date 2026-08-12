import {
  FaArrowRight,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";

const contactMethods = [
  {
    title: "Correo electrónico",
    value: "hola@bearys.pe",
    href: "mailto:hola@bearys.pe",
    icon: FaEnvelope,
    colorClass: "bg-violet-200 text-violet-700",
  },
  {
    title: "Nuestra ubicación",
    value: "Lima, Perú",
    icon: FaLocationDot,
    colorClass: "bg-sky-200 text-sky-700",
  },
  {
    title: "Atención al cliente",
    value: "+51 999 999 999",
    href: "tel:+51999999999",
    icon: FaPhone,
    colorClass: "bg-emerald-200 text-emerald-700",
  },
];

const fieldClass =
  "mt-2 w-full border-0 border-b border-gray-300 bg-transparent px-0 pb-3 text-base text-gray-900 outline-none placeholder:text-gray-400 focus:border-violet-600 focus:ring-0";

function Contacto() {
  return (
    <main className="text-gray-900">
      <section className="relative mx-auto max-w-400 px-4 pb-16 mt-6 sm:px-6 sm:mt-8 lg:px-10 lg:pb-24 lg:mt-6 xl:px-12">
        <div className="relative rounded-4xl overflow-hidden">
          <img
            src="/images/contact.webp"
            alt="Amigurumis Bearys hechos a mano"
            className="h-72 w-full rounded-4xl object-cover sm:h-96 lg:h-124 2xl:h-140"
          />
          <div className="absolute bg-black/40 lg:bg-transparent inset-0 rounded-4xl" />
        </div>
        <div className="absolute inset-x-4 bottom-16 top-0 flex flex-col items-start justify-center px-6 sm:inset-x-6 sm:px-10 lg:inset-x-10 lg:bottom-24 lg:pl-32 2xl:pl-42">
          <div className="flex w-full max-w-120 flex-col justify-end gap-2">
            <h1 className="font-trainone text-2xl text-white lg:text-gray-900 sm:text-4xl lg:text-5xl">
              CONTACTAME
            </h1>
            <p className="mt-2 max-w-md text-sm text-white lg:text-gray-900 sm:text-lg lg:text-2xl">
              ¿Necesitas ayuda, tienes una consulta o quieres contarnos algo?
              ¡Estamos aquí para escucharte!
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-12 lg:pb-24">
        <div className="rounded-[2.5rem] border border-zinc-100 bg-zinc-50 px-6 py-10 shadow-[0_18px_55px_rgba(245,201,71,0.08)] sm:px-10 md:py-14 lg:px-14">
          <div className="max-w-2xl">
            <h1 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
              Hablemos de tu próximo amigurumi
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
              Cuéntanos qué necesitas. Podemos ayudarte con productos, pedidos y
              cualquier consulta sobre nuestras piezas hechas a mano.
            </p>
          </div>

          <form
            className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label className="text-sm font-semibold" htmlFor="contact-name">
                Nombre completo
              </label>
              <input
                className={fieldClass}
                id="contact-name"
                name="name"
                placeholder="Escribe tu nombre"
                type="text"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="contact-email">
                Correo electrónico <span className="text-violet-700">*</span>
              </label>
              <input
                className={fieldClass}
                id="contact-email"
                name="email"
                placeholder="tu@correo.com"
                required
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="contact-phone">
                Teléfono
              </label>
              <input
                className={fieldClass}
                id="contact-phone"
                name="phone"
                placeholder="+51 999 999 999"
                type="tel"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="contact-order">
                Número de pedido
              </label>
              <input
                className={fieldClass}
                id="contact-order"
                name="order"
                placeholder="Si ya realizaste una compra"
                type="text"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="contact-reason">
                Motivo de consulta <span className="text-violet-700">*</span>
              </label>
              <select
                className={fieldClass}
                defaultValue=""
                id="contact-reason"
                name="reason"
                required
              >
                <option disabled value="">
                  Selecciona una opción
                </option>
                <option value="producto">Consulta sobre un producto</option>
                <option value="pedido">Estado de mi pedido</option>
                <option value="personalizado">Amigurumi personalizado</option>
                <option value="otro">Otra consulta</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="contact-method">
                Medio de contacto preferido
              </label>
              <select
                className={fieldClass}
                defaultValue="email"
                id="contact-method"
                name="preferredMethod"
              >
                <option value="email">Correo electrónico</option>
                <option value="phone">Llamada telefónica</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                className="text-sm font-semibold"
                htmlFor="contact-message"
              >
                Tu mensaje <span className="text-violet-700">*</span>
              </label>
              <textarea
                className={[
                  fieldClass,
                  "resize-none h-32 overflow-y-hidden",
                ].join(" ")}
                id="contact-message"
                name="message"
                placeholder="Cuéntanos cómo podemos ayudarte..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                className="inline-flex items-center gap-3 rounded-full bg-violet-700 hover:bg-violet-600 transition-colors px-7 py-3.5 text-base font-bold text-white cursor-pointer"
                type="submit"
              >
                Enviar mensaje
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:px-12 lg:pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl">
            Formas de contactarnos
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-500">
            Elige el medio que te resulte más cómodo. Estaremos encantados de
            escucharte.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const content = (
              <>
                <span
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    method.colorClass,
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-12">
                  <p className="text-sm text-gray-500">{method.title}</p>
                  <p className="mt-1 wrap-break-word text-lg font-bold text-gray-900">
                    {method.value}
                  </p>
                </div>
              </>
            );

            return method.href ? (
              <a
                className="rounded-3xl border border-gray-200 bg-white p-7"
                href={method.href}
                key={method.title}
              >
                {content}
              </a>
            ) : (
              <article
                className="rounded-3xl border border-gray-200 bg-white p-7"
                key={method.title}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Contacto;
