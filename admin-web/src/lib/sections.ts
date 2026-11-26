export const sections = [
  "overview",
  "orders",
  "sales",
  "inventory",
  "products",
  "users",
  "reports",
  "settings",
] as const

export type Section = (typeof sections)[number]

export function getSectionFromHash(hash: string): Section {
  const value = hash.replace(/^#/, "") as Section
  return sections.includes(value) ? value : "overview"
}
