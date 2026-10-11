/** Run after build:test; verify the actual native test artifact's dependency boundary. */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const directory = path.resolve(process.argv[2] || 'dist-branch-agnostic-test/server')
const config = JSON.parse(await readFile(path.join(directory, 'wrangler.json'), 'utf8'))
assert.equal(config.name, 'branch-agnostic-test')
assert.equal(config.main, './worker.mjs')
for (const key of [
  'routes',
  'route',
  'secrets',
  'account_id',
  'kv_namespaces',
  'assets',
  'vars',
  'services',
  'd1_databases',
  'r2_buckets',
  'durable_objects',
]) {
  assert.equal(config[key], undefined, `Native shared base must not acquire ${key}`)
}
const metadata = JSON.parse(await readFile(path.join(directory, 'metafile.json'), 'utf8'))
const inputs = Object.keys(metadata.inputs)
assert.ok(
  inputs.some((name) => name.endsWith('config/shared-branch-base.mjs')),
  'Actual bundle must contain approved shared source'
)
for (const input of inputs) {
  assert.doesNotMatch(
    input,
    /(?:node_modules\/.*sanity|src\/lib\/(?:site-context|sanity|content|preview)|config\/(?:sites|deployment)\.mjs)/i,
    `Unexpected CMS/content/deployment dependency: ${input}`
  )
  for (const dependency of metadata.inputs[input].imports || []) {
    assert.equal(dependency.external, undefined, `Unbundled runtime dependency: ${dependency.path}`)
  }
}
console.log(
  `PASS native shared base artifact: ${inputs.length} inputs; no CMS dependencies or deployment bindings`
)
