import { pathToFileURL } from 'node:url'
import { main } from './provision-branch.mjs'

export function provisionQld(options = {}) {
  return main({
    ...options,
    env: { ...process.env, ...options.env, BRANCH: 'qld' },
    args: ['--acl', 'public'],
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await provisionQld()
