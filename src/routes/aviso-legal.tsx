import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany } from "@/lib/site-data";
import { CompanyValue, LegalLayout, LegalSection } from "@/components/site/LegalLayout";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/aviso-legal")({
  loader: () => fetchCompany(),
  head: () => ({
    meta: [
      { title: "Aviso Legal | EEIVA" },
      {
        name: "description",
        content: "Datos identificativos y condiciones de uso del sitio web de EEIVA.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  component: LegalNoticePage,
});

function LegalNoticePage() {
  const company = Route.useLoaderData();
  return (
    <LegalLayout company={company} title="Aviso Legal" updated="25 de septiembre de 2026">
      <LegalSection title="1. Datos identificativos">
        <p>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de
          Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Titular: {company.name}</li>
          <li>
            CIF: <CompanyValue value={company.cif} label="CIF" />
          </li>
          <li>
            Domicilio: <CompanyValue value={company.address} label="Domicilio" />
          </li>
          <li>
            Email: <CompanyValue value={company.email} label="Email" />
          </li>
          <li>
            Teléfono: <CompanyValue value={company.phone} label="Teléfono" />
          </li>
          <li>
            Datos registrales:{" "}
            <CompanyValue value={null} label="Inscripción en el Registro Mercantil" />
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Condiciones de uso">
        <p>
          El acceso a este sitio web es gratuito y atribuye la condición de usuario, que acepta
          estas condiciones. El usuario se compromete a hacer un uso adecuado de los contenidos y
          servicios, a no emplearlos para actividades ilícitas o contrarias a la buena fe, y a no
          dañar los sistemas del titular ni de terceros.
        </p>
        <p>
          La información facilitada en el sitio tiene carácter orientativo. Los presupuestos y
          condiciones de cada servicio se concretan de forma individual con cada cliente.
        </p>
      </LegalSection>

      <LegalSection title="3. Propiedad intelectual e industrial">
        <p>
          Los contenidos de este sitio (textos, diseño, logotipos, imágenes y código) son
          titularidad de {company.name} o de terceros que han autorizado su uso, y están protegidos
          por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción,
          distribución o transformación sin autorización expresa, salvo para uso personal y privado.
        </p>
      </LegalSection>

      <LegalSection title="4. Enlaces externos y exclusión de responsabilidad">
        <p>
          El sitio puede incluir enlaces a páginas de terceros (por ejemplo, WhatsApp, Google
          Calendar o Jitsi Meet). El titular no controla ni se responsabiliza de sus contenidos,
          políticas o disponibilidad. Tampoco garantiza la ausencia de interrupciones o errores en
          el acceso al sitio, aunque pondrá los medios razonables para evitarlos y corregirlos.
        </p>
      </LegalSection>

      <LegalSection title="5. Protección de datos">
        <p>
          El tratamiento de datos personales se rige por la{" "}
          <a href="/politica-privacidad" className="font-medium text-electric hover:underline">
            Política de Privacidad
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Legislación aplicable y jurisdicción">
        <p>
          Estas condiciones se rigen por la legislación española. Para cualquier controversia, las
          partes se someten a los Juzgados y Tribunales de Valencia, salvo que la normativa de
          consumidores y usuarios establezca otro fuero.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
