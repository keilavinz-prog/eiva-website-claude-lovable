import { createFileRoute } from "@tanstack/react-router";
import { fetchHomeData } from "@/lib/home-data";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { FeaturedServices } from "@/components/site/FeaturedServices";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Testimonials } from "@/components/site/Testimonials";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  loader: () => fetchHomeData(),
  head: ({ loaderData }) => {
    const name = loaderData?.company.name ?? "Electrotecnia e Ingeniería Valencia S.L.";
    const description =
      loaderData?.company.slogan ?? "Soluciones integrales en ingeniería eléctrica en Valencia.";
    return {
      meta: [
        { title: `${name} | Soluciones integrales en ingeniería eléctrica` },
        { name: "description", content: description },
        { property: "og:title", content: name },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { company, services, projects, testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-canvas text-text">
      <Header />
      <main>
        <Hero company={company} />
        <TrustStrip foundedYear={company.founded_year} />
        <FeaturedServices services={services} />
        {projects.length > 0 ? <FeaturedProjects projects={projects} /> : null}
        {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
        <FinalCta />
      </main>
      <Footer company={company} />
    </div>
  );
}
