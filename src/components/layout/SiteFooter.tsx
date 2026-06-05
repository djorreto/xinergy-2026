import Link from "next/link";
import Image from "next/image";
import { brand, nav, presenceLabel, officesLabel, careersNav } from "@/lib/content";
import { ttForsDisplay } from "@/lib/fonts";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-xinergy-charcoal/10 bg-xinergy-charcoal text-white">
      {/* Móvil: copyright */}
      <div className="px-5 py-6 lg:hidden">
        <p className="text-center text-[11px] text-white/35">
          © {year} {brand.name}
        </p>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:block lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/brand/logo-white.png"
              alt="Xinergy"
              width={200}
              height={24}
              className="h-8 w-auto object-contain object-left"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              {brand.promise}
            </p>
            <p className={`${ttForsDisplay.className} mt-6 text-lg text-xinergy-orange`}>
              {brand.claim}
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Navegación
            </p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-xinergy-orange"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={careersNav.href}
                  className="text-sm text-white/60 hover:text-xinergy-orange"
                >
                  {careersNav.label}
                </Link>
              </li>
              <li>
                <Link
                  href="/diagnostico"
                  className="text-sm font-medium text-xinergy-orange hover:underline"
                >
                  Diagnóstico de eficiencia
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Contacto
            </p>
            <p className="mt-4 text-sm text-white/55">{brand.address}</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-3 inline-block text-sm text-xinergy-orange hover:underline"
            >
              {brand.email}
            </a>
            <a
              href={brand.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm text-white/60 hover:text-xinergy-orange"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.062 2.062 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs tracking-wide text-white/40">{presenceLabel}</p>
          <p className="mt-2 text-xs text-white/30">
            Oficinas en {officesLabel}
          </p>
          <p className="mt-6 text-[11px] text-white/30">
            © {year} {brand.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
