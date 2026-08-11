const footerSections = [
  {
    title: "Tienda",
    links: ["Productos", "Ofertas", "Promociones"],
  },
  {
    title: "Empresa",
    links: ["Sobre nosotros", "Contacto"],
  },
  {
    title: "Ayuda",
    links: ["Envíos", "Devoluciones", "Preguntas Frecuentes"],
  },
];

function Footer() {
  return (
    <footer className="w-full bg-violet-600 px-4 pb-8 pt-14 text-white sm:px-6 md:px-12 md:pb-12 md:pt-20 lg:px-16">
      <div className="mx-auto max-w-360">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(20rem,1.5fr)_repeat(3,minmax(8rem,0.55fr))] lg:gap-10">
          <div className="max-w-md">
            <p className="text-3xl font-bold uppercase tracking-[-0.04em]">
              Bearys
            </p>
            <p className="mt-5 text-sm leading-6 text-white/70 md:text-base">
              Descubre el encanto de lo hecho a mano con nuestros adorables
              amigurumis. Cada pieza tejida con dedicación, perfecta para
              regalar, coleccionar o decorar tus espacios favoritos.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-white">
                {section.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-white/65">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between md:mt-20 md:text-sm">
          <p>Todos los derechos reservados © 2026 Bearys</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end lg:gap-x-12">
            <a href="#" className="transition-colors hover:text-white">
              Privacidad
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Términos
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Envíos
            </a>
          </div>
        </div>

        <div
          aria-label="Bearys"
          className="mt-10 select-none overflow-hidden text-center text-[clamp(5rem,17.5vw,16rem)] font-black uppercase leading-[0.72] tracking-[-0.09em] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #ffffff 0%, #E7E7E7 12%, #CFCFCF 50%, #E7E7E7 88%, #ffffff 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          Bearys
        </div>
      </div>
    </footer>
  );
}

export default Footer;
