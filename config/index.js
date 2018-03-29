import { default as devConfig } from './dev'
import { default as dockerConfig } from './docker'

const baseConfig = {
  port: 3003
}

let envConfig = {}

switch (process.env.NODE_ENV) {
  case 'docker':
    envConfig = dockerConfig
    break
  default:
    envConfig = devConfig
}

export default { ...baseConfig, ...envConfig }
