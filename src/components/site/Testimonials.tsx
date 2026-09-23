import { Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import type { Testimonial } from "@/lib/home-data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-4 w-4 ${i < rating ? "fill-amber text-amber" : "text-line"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="opiniones" className="border-t border-line bg-base py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading kicker="// opiniones" title="Lo que dicen nuestros clientes" />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <figure className="card-tech flex h-full flex-col p-7">
                <Stars rating={t.rating} />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-text">
                  “{t.content}”
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5">
                  <p className="font-display font-semibold text-text">{t.author_name}</p>
                  {t.role_context ? (
                    <p className="mt-1 text-sm text-text-muted">{t.role_context}</p>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
