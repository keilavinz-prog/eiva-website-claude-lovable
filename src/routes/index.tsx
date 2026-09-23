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
    const name = loaderData?.company.name ?? "EEIVA Instalaciones Eléctricas S.L.";
    const description =
      loaderData?.company.slogan ?? "Instalaciones eléctricas de precisión en Valencia.";
    return {
      meta: [
        { title: `${name} | Instalaciones eléctricas en Valencia` },
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
        <FeaturedProjects projects={projects} />
        <Testimonials testimonials={testimonials} />
        <FinalCta />
      </main>
      <Footer company={company} />
    </div>
  );
}
