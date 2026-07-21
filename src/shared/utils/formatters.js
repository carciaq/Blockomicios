/**
 * Utilidades de formato reutilizadas por las distintas vistas de la app.
 */

/** Formatea un número entero con separadores de miles (ej. 6580 -> "6,580"). */
export function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('es-CO');
}

/** Formatea un valor decimal como porcentaje con 1 decimal (ej. 65.8 -> "65.8%"). */
export function formatPercent(value, decimals = 1) {
  return `${Number(value ?? 0).toFixed(decimals)}%`;
}

/** Trunca una clave privada u otro dato sensible dejando solo el inicio visible. */
export function maskSecret(value, visibleChars = 10) {
  if (!value) return '';
  return `${value.substring(0, visibleChars)}...`;
}

/** Genera un hash hexadecimal simulado de longitud arbitraria (solo para demo/mocks). */
export function generateMockHash(length = 64) {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/** Genera un hash corto simulado con formato "0xabc123...def4", usado en el ledger. */
export function generateShortMockHash() {
  return `0x${Math.random().toString(16).substr(2, 6)}...${Math.random()
    .toString(16)
    .substr(2, 4)}`;
}

/** Pequeña promesa de espera, útil para simular latencia de red en mocks. */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
