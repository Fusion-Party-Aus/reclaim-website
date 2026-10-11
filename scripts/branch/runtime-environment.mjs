export function branchRuntimeEnvironment(env, siteId, command = []) {
  return {
    SITE_ID: siteId,
    SITE_RUNTIME_MODE:
      env.SITE_RUNTIME_MODE ||
      (command.includes('astro') && command.includes('dev') ? 'development' : 'production'),
  }
}
