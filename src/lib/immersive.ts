/** Rutas a pantalla completa (sin header, footer ni WhatsApp). */
export function isImmersivePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname.includes("/aniversario");
}
