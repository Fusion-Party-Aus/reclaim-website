import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { resolveBuildTarget } from '../../config/deployment-target.mjs'

if (process.env.DEPLOY_TARGET !== 'branch-agnostic-test')
  throw new Error('Explicit DEPLOY_TARGET=branch-agnostic-test required')
const target = resolveBuildTarget(process.env, {})
const output = path.resolve(target.outputDirectory, 'server')
await mkdir(output, { recursive: true })
const result = await build({
  entryPoints: ['src/workers/branch-agnostic-test.ts'],
  outfile: path.join(output, 'worker.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  logLevel: 'info',
  metafile: true,
  loader: { '.woff2': 'dataurl', '.svg': 'dataurl' },
})
await writeFile(path.join(output, 'metafile.json'), JSON.stringify(result.metafile, null, 2) + '\n')
// This landing-only Worker needs no assets, CMS credentials, sessions or CRM bindings.
await writeFile(
  path.join(output, 'wrangler.json'),
  JSON.stringify(
    {
      name: target.workerName,
      main: './worker.mjs',
      compatibility_date: '2025-01-29',
      compatibility_flags: ['nodejs_compat'],
    },
    null,
    2
  ) + '\n'
)
