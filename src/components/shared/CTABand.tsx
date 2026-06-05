import { brand } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTABand() {
  return (
    <section className="border-t border-xinergy-charcoal/8 bg-xinergy-charcoal py-14 text-white">
      <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl text-balance sm:text-2xl">Eficiencias rentables para su negocio</h2>
          <p className="mt-2 text-sm text-white/55">
            Diagnóstico · Resultados verificables · Cash neutral
          </p>
        </div>
        <div className="cta-band-actions flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button href="/contacto" variant="primary" className="max-lg:w-full max-lg:justify-center">
            {brand.cta}
          </Button>
          <Button href="/diagnostico" variant="light" className="max-lg:w-full max-lg:justify-center">
            Calcular eficiencias
          </Button>
        </div>
      </Container>
    </section>
  );
}
