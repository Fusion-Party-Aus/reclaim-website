import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { branchManifest } from '../../config/branches.mjs'
import { resolveBranch } from '../../config/branch/resolver.mjs'
import { verifyLeakage, verifyParity } from '../../config/branch/verify.mjs'

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))

function reportFailure(slug, message) {
  console.error(`[${slug}] ${message}`)
}

function runBranchCommand(args) {
  const requestedBranch =
    process.env.BRANCH || process.env.PUBLIC_BRANCH || branchManifest.defaultBranch
  const entry = branchManifest.branches[requestedBranch]
  if (!entry) {
    reportFailure(
      requestedBranch,
      `Unknown branch. Registered branches: ${Object.keys(branchManifest.branches).join(', ')}`
    )
    process.exitCode = 1
    return
  }

  const child = spawnSync(args[0], args.slice(1), {
    cwd: repoRoot,
    env: {
      ...process.env,
      BRANCH: requestedBranch,
      PUBLIC_BRANCH: requestedBranch,
      PUBLIC_SANITY_DATASET: entry.sanity.dataset,
    },
    stdio: 'inherit',
  })
  if (child.error) throw child.error
  process.exitCode = child.status ?? 1
}

function collectBuiltOutput(directory) {
  const contents = []
  const visit = (current) => {
    for (const item of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, item.name)
      if (item.isDirectory()) visit(fullPath)
      else if (
        item.isFile() &&
        (/\.(?:html|json|webmanifest|txt|xml)$/.test(item.name) || item.name === 'sw.js')
      ) {
        contents.push(
          `${path.relative(directory, fullPath)}\n${fs.readFileSync(fullPath).toString('utf8')}`
        )
      }
    }
  }
  visit(directory)
  return contents.join('\n')
}

function verifyBuilds() {
  // Keep output beneath the repository root: the Cloudflare prerender runtime
  // resolves project-relative paths from there, while mkdtemp gives this run an
  // isolated directory that is safe to remove afterwards.
  const buildRoot = fs.mkdtempSync(path.join(repoRoot, '.branch-builds-'))
  const failures = []

  try {
    for (const slug of Object.keys(branchManifest.branches)) {
      const entry = branchManifest.branches[slug]
      const outputDirectory = path.join(buildRoot, slug)
      const env = {
        ...process.env,
        BRANCH: slug,
        PUBLIC_BRANCH: slug,
        PUBLIC_SANITY_DATASET: entry.sanity.dataset,
        ASTRO_BRANCH_BUILD_OUT_DIR: outputDirectory,
      }

      console.log(`\n[${slug}] Building ${entry.sanity.dataset} into ${outputDirectory}`)
      const build = spawnSync('npm', ['run', 'build'], {
        cwd: repoRoot,
        env,
        stdio: 'inherit',
      })

      if (build.error) {
        failures.push({ slug, message: `Build could not start: ${build.error.message}` })
        continue
      }
      if (build.status !== 0) {
        failures.push({
          slug,
          message: `Build failed with exit status ${build.status ?? 'unknown'}.`,
        })
        continue
      }
      if (!fs.statSync(outputDirectory, { throwIfNoEntry: false })?.isDirectory()) {
        failures.push({
          slug,
          message: `Build did not create expected output directory '${outputDirectory}'.`,
        })
        continue
      }

      try {
        const resolved = resolveBranch(branchManifest, env)
        verifyParity(resolved, branchManifest)
        verifyLeakage(resolved, branchManifest, () => collectBuiltOutput(outputDirectory))
        console.log(`[${slug}] Parity and built-output leakage verification passed.`)
      } catch (error) {
        failures.push({ slug, message: `${error.code ? `${error.code}: ` : ''}${error.message}` })
      }
    }
  } finally {
    fs.rmSync(buildRoot, { recursive: true, force: true })
  }

  if (failures.length > 0) {
    for (const failure of failures) reportFailure(failure.slug, failure.message)
    process.exitCode = 1
  } else {
    console.log(`\nVerified ${Object.keys(branchManifest.branches).length} manifest branches.`)
  }
}

const runIndex = process.argv.indexOf('--run')
if (runIndex !== -1) {
  const command = process.argv.slice(runIndex + 1)
  if (command.length === 0) {
    console.error('--run requires a command and arguments.')
    process.exitCode = 2
  } else {
    runBranchCommand(command)
  }
} else {
  verifyBuilds()
}
