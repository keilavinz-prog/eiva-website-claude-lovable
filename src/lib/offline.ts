import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Resiliencia offline básica de formularios (Fase 9): si no hay conexión al enviar, el
 * envío se guarda en localStorage y se reintenta al volver la conexión. No es un service worker.
 */
export const PENDING_KEYS = {
  contact: "eeiva_pending_contact",
  callback: "eeiva_pending_callback",
  booking: "eeiva_pending_booking",
} as const;
export type PendingKey = (typeof PENDING_KEYS)[keyof typeof PENDING_KEYS];

export const OFFLINE_MESSAGE =
  "Sin conexión. Guardaremos tu solicitud y la enviaremos en cuanto vuelva la conexión.";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** Estado de conexión del navegador (en el servidor se asume conectado). */
export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/** ¿El error es de red (sin conexión / petición fallida) y no de validación del servidor? */
export function isNetworkError(error: { message?: string } | null | undefined): boolean {
  if (isOffline()) return true;
  return /failed to fetch|networkerror|load failed|network request failed/i.test(
    error?.message ?? "",
  );
}

export function readPending<T>(key: PendingKey): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ((JSON.parse(raw) as { payload: T }).payload ?? null) : null;
  } catch {
    return null;
  }
}

export function savePending<T>(key: PendingKey, payload: T) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ payload, savedAt: new Date().toISOString() }),
    );
  } catch {
    // Sin almacenamiento disponible: el formulario conserva los datos en pantalla igualmente
  }
}

export function clearPending(key: PendingKey) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // nada que limpiar
  }
}

/** Ejecuta `handler` cada vez que el navegador recupera la conexión. */
export function useOnReconnect(handler: () => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const onOnline = () => ref.current();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);
}
