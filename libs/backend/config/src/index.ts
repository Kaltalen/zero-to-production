export { setupMiddleware } from './lib/global.middleware';
export {
  ServerConfig,
  EnvironnementConfig,
  GlobalConfig,
  ProductionConfig,
  DevOrTestConfig
} from './lib/config.interface';
export { getEnvVariableOrWarn, envToNumber } from './lib/utils';