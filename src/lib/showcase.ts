import { redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * "Modo escaparate" para hacer una demo guiada de la web a alguien sin exponer la
 * parte de gestión (login, registro, reservas, paneles). Se activa visitando
 * /presentacion, dura mientras la pestaña siga abierta (sessionStorage, no
 * localStorage) y no requiere ningún cambio de código para usarse: es solo una
 * URL más.
 */
const KEY = "eeiva_showcase_mode";

/** Activa el modo escaparate para esta pestaña. */
export function enableShowcaseMode() {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    // Sin almacenamiento disponible: no se activa, pero no rompe nada.
  }
}

export function isShowcaseMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * beforeLoad reutilizable para rutas de cuenta (login, registro, reservar): en
 * modo escaparate, redirige a "/" en vez de mostrar la página. Como el modo se
 * guarda en sessionStorage (solo en el navegador), en la primera carga de una
 * URL directa el servidor no lo sabe todavía; la redirección se aplica en
 * cuanto el cliente toma el control, justo después.
 */
export function blockInShowcaseMode() {
  if (isShowcaseMode()) throw redirect({ to: "/" });
}

/** Para ocultar en la cabecera "Iniciar sesión"/"Registrarse" mientras dura el modo escaparate. */
export function useShowcaseMode(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(isShowcaseMode());
  }, []);
  return active;
}
