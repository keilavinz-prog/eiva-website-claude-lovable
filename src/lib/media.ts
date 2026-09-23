/**
 * Vídeos de fondo (Pexels, licencia gratuita). Cada vídeo lleva varias fuentes en
 * orden de preferencia: el navegador usa la primera que cargue.
 *  1) Descarga original de Pexels → máxima calidad disponible (4K cuando existe).
 *  2) Versión 1080p verificada (si la hay) como respaldo.
 * Para usar vídeos propios de EEIVA basta con sustituir las URLs de este archivo.
 */
export type BackgroundVideo = {
  id: string;
  label: string;
  sources: string[];
  poster?: string;
};

const original = (id: number) => `https://www.pexels.com/download/video/${id}/`;

export const HERO_VIDEOS: BackgroundVideo[] = [
  {
    id: "cuadro-electrico",
    label: "Cuadros eléctricos",
    sources: [
      original(28886877),
      "https://videos.pexels.com/video-files/28886877/12504681_1920_1080_30fps.mp4",
    ],
    poster:
      "https://images.pexels.com/videos/28886877/electrical-panel-28886877.jpeg?auto=compress&w=1920",
  },
  {
    id: "instalacion",
    label: "Instalaciones",
    sources: [original(34572318)],
  },
  {
    id: "industria",
    label: "Industria",
    sources: [original(35552709)],
  },
  {
    id: "alta-tension",
    label: "Alta tensión",
    sources: [
      original(10151854),
      "https://videos.pexels.com/video-files/10151854/10151854-hd_1920_1080_24fps.mp4",
    ],
    poster:
      "https://images.pexels.com/videos/10151854/pexels-photo-10151854.jpeg?auto=compress&w=1920",
  },
];

export const TRUST_VIDEO: BackgroundVideo = {
  id: "lineas",
  label: "Líneas eléctricas",
  sources: [original(30567734)],
};
