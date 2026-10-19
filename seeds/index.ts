// seeds/index.ts
// Ejecuta todos los seeds del proyecto, en orden, con un solo comando: npx tsx seeds/index.ts
// (o `npm run seed`). Es repetible: cada documento se busca por su clave natural (title, o el
// primer items.title del carrusel) y se actualiza en vez de duplicarse (seeds/lib/upsert.ts).
// El orden importa: heroCarrusel.seed.ts va después de home.seed.ts porque actualiza el mismo
// hero_carrusel con las imágenes definitivas. Conócenos se siembra en pages.seed.ts.
import { spawnSync } from 'child_process'
import path from 'path'

const SEEDS = [
  'layout.seed.ts',
  'home.seed.ts',
  'pages.seed.ts',
  'electronicResources.seed.ts',
  'investigation.seed.ts',
  'formation.seed.ts',
  'solicitudCompra.seed.ts',
  'heroCarrusel.seed.ts',
]

for (const seed of SEEDS) {
  const file = path.resolve(process.cwd(), 'seeds', seed)
  console.log(`\n▶ Ejecutando ${seed}...`)

  const result = spawnSync('npx', ['tsx', file], { stdio: 'inherit' })

  if (result.status !== 0) {
    console.error(`\n✖ ${seed} falló (exit code ${result.status}). Deteniendo.`)
    process.exit(result.status ?? 1)
  }
}

console.log('\n✓ Todos los seeds se ejecutaron correctamente.')
