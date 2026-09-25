import { createFileRoute } from "@tanstack/react-router";
import { fetchCompany } from "@/lib/site-data";
import { CompanyValue, LegalLayout, LegalSection } from "@/components/site/LegalLayout";
import { PageSkeleton } from "@/components/site/Skeletons";

export const Route = createFileRoute("/politica-privacidad")({
  loader: () => fetchCompany(),
  head: () => ({
    meta: [
      { title: "Política de Privacidad | EEIVA" },
      {
        name: "description",
        content:
          "Cómo trata Electrotecnia e Ingeniería Valencia S.L. los datos personales de quienes contactan, piden cita o solicitan una llamada.",
      },
    ],
  }),
  pendingComponent: () => <PageSkeleton variant="detail" />,
  component: PrivacyPage,
});

function PrivacyPage() {
  const company = Route.useLoaderData();
  const email = company.email;
  return (
    <LegalLayout
      company={company}
      title="Política de Privacidad"
      updated="25 de septiembre de 2026"
    >
      <p className="leading-relaxed text-text-muted">
        Esta política explica cómo tratamos los datos personales que nos facilitas a través de este
        sitio web, de acuerdo con el Reglamento (UE) 2016/679 General de Protección de Datos (RGPD)
        y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos
        digitales (LOPDGDD).
      </p>

      <LegalSection title="1. Responsable del tratamiento">
        <ul className="list-disc space-y-1 pl-5">
          <li>Razón social: {company.name}</li>
          <li>
            CIF: <CompanyValue value={company.cif} label="CIF" />
          </li>
          <li>
            Domicilio: <CompanyValue value={company.address} label="Domicilio" />
          </li>
          <li>
            Email: <CompanyValue value={email} label="Email" />
          </li>
          <li>
            Teléfono: <CompanyValue value={company.phone} label="Teléfono" />
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Qué datos tratamos">
        <p>Solo los que nos facilitas voluntariamente en los formularios del sitio:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Datos identificativos y de contacto: nombre, email y teléfono.</li>
          <li>
            Datos de tu solicitud: servicio de interés, mensaje, fecha y franja horaria preferidas y
            tipo de cita.
          </li>
          <li>Si te registras: los datos de tu cuenta de usuario (nombre y email).</li>
        </ul>
        <p>No solicitamos ni tratamos categorías especiales de datos.</p>
      </LegalSection>

      <LegalSection title="3. Finalidades">
        <ul className="list-disc space-y-1 pl-5">
          <li>Atender y responder las solicitudes de contacto y de presupuesto.</li>
          <li>Gestionar las citas que reservas (presenciales o por videollamada).</li>
          <li>Devolverte la llamada cuando lo solicitas en el horario que indicas.</li>
          <li>Gestionar tu cuenta y el área de cliente, si te registras.</li>
        </ul>
        <p>No elaboramos perfiles ni tomamos decisiones automatizadas con tus datos.</p>
      </LegalSection>

      <LegalSection title="4. Base legal">
        <p>
          El tratamiento se basa en tu consentimiento (art. 6.1.a RGPD), que prestas al marcar la
          casilla de aceptación de esta política antes de enviar cualquier formulario. Puedes
          retirarlo en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.
        </p>
      </LegalSection>

      <LegalSection title="5. Plazo de conservación">
        <p>
          Conservamos tus datos mientras exista relación comercial o una obligación legal que lo
          exija, y como máximo 5 años tras el último contacto. Después se suprimen o anonimizan.
        </p>
      </LegalSection>

      <LegalSection title="6. Destinatarios y encargados del tratamiento">
        <p>No cedemos tus datos a terceros, salvo obligación legal.</p>
        <p>Para prestar el servicio contamos con proveedores que actúan como encargados:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Supabase Inc.: base de datos y gestión de cuentas. Los datos se alojan en servidores de
            la Unión Europea (Fráncfort, Alemania). Al ser una empresa estadounidense, cualquier
            acceso desde EE. UU. se ampara en las cláusulas contractuales tipo de la Comisión
            Europea.
          </li>
          <li>Proveedor de alojamiento del sitio web, que presta la infraestructura técnica.</li>
        </ul>
        <p>
          Si decides usar WhatsApp, añadir una cita a Google Calendar o unirte a una videollamada de
          Jitsi Meet, esos servicios son de terceros y se rigen por sus propias políticas de
          privacidad. Solo se activan si tú los utilizas.
        </p>
      </LegalSection>

      <LegalSection title="7. Tus derechos">
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación del
          tratamiento, portabilidad y oposición, así como retirar tu consentimiento, escribiendo a{" "}
          {email ? (
            <a href={`mailto:${email}`} className="font-medium text-electric hover:underline">
              {email}
            </a>
          ) : (
            <CompanyValue value={null} label="Email" />
          )}{" "}
          con el asunto «Protección de datos». Indica qué derecho ejerces y acompaña una copia de un
          documento que acredite tu identidad. Te responderemos en el plazo máximo de un mes.
        </p>
        <p>
          Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar una
          reclamación ante la Agencia Española de Protección de Datos (
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-electric hover:underline"
          >
            www.aepd.es
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="8. Seguridad">
        <p>
          Aplicamos medidas técnicas y organizativas para proteger tus datos: comunicaciones
          cifradas (HTTPS), control de acceso por roles y permisos en la base de datos que impiden
          que un usuario vea información de otros.
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies">
        <p>
          Este sitio solo utiliza almacenamiento técnico necesario para su funcionamiento (la sesión
          de usuario y tu preferencia sobre este aviso). No usamos cookies de analítica ni de
          publicidad de terceros.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
