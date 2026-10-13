// seeds/index.ts
// Ejecuta todos los seeds del proyecto, en orden, con un solo comando: npx tsx seeds/index.ts
// (o `npm run seed`). El orden importa: cada seed es independiente entre sí salvo
// heroCarrusel.seed.ts, que debe ir después de home.seed.ts porque sustituye el
// hero_carrusel de contenido de broma que crea ese seed.
import { spawnSync } from 'child_process'
import path from 'path'

const SEEDS = [
  'layout.seed.ts',
  'home.seed.ts',
  'aboutUs.seed.ts',
  'electronicResources.seed.ts',
  'quienesSomos.seed.ts',
  'investigation.seed.ts',
  'formation.seed.ts',
  'horarios.seed.ts',
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
