import { resolveDeployment } from '../../config/deployment.mjs'

export const DEPLOYMENT = resolveDeployment(import.meta.env)
