const ENVIRONMENT = +__ENV.ENVIRONMENT ?? 3
const API_ONE_PORT = __ENV.API_ONE_PORT || 8082
const API_TWO_PORT = __ENV.API_TWO_PORT || 8083
const MOCKS_ON = __ENV.MOCKS_ON || 1
const IS_MOCKS_ON = MOCKS_ON == "1" ? "-mocks-on" : "mocks-off"
let API_ONE_HOST,
API_TWO_HOST,
API_KEY_API_ONE,
API_KEY_API_TWO,
domain

export const HANDLE_SUMMARY = +__ENV.HANDLE_SUMMARY ?? 1


if (ENVIRONMENT == 1) {
  domain = `local${IS_MOCKS_ON}`
  API_ONE_HOST = `http://localhost:${API_ONE_PORT}/api/v1`
  API_KEY_API_ONE = __ENV.API_KEY_API_ONE_DEV
  API_TWO_HOST = `http://localhost:${API_TWO_PORT}/api/v1`
  API_KEY_API_TWO = __ENV.API_KEY_API_TWO_DEV
} else if (ENVIRONMENT == 2) {
  domain = "dev"
  API_ONE_HOST = "https://pokeapi.co/api/v2"
  API_KEY_API_ONE = __ENV.API_KEY_API_ONE_DEV
  API_TWO_HOST = "https://jsonplaceholder.typicode.com"
  API_KEY_API_TWO = __ENV.API_KEY_API_TWO_DEV
} else {
  domain = "test"
  API_ONE_HOST = "https://pokeapi.co/api/v2"
  API_KEY_API_ONE = __ENV.API_KEY_API_ONE_TESTE_DEV
  API_TWO_HOST = "https://jsonplaceholder.typicode.com"
  API_KEY_API_TWO = __ENV.API_KEY_API_TWO_TEST
}

export default {
  domain,
  API_ONE_HOST,
  API_TWO_HOST,
  API_KEY_API_TWO,
  API_KEY_API_ONE,
}
export const scenarios = {
  testType: __ENV.TEST_TYPE,
  scenario: __ENV.SCENARIO,
  vus: +__ENV.VUS,
  iterations: __ENV.ITERATIONS,
  maxDuration: __ENV.MAX_DURATION,
  target: __ENV.TARGET,
  duration1: __ENV.DURATION1,
  duration2: __ENV.DURATION2,
  duration3: __ENV.DURATION3,
  rate: +__ENV.RATE,
  timeUnit: __ENV.TIME_UNIT,
  duration: __ENV.DURATION,
  preAllocatedVUs: __ENV.PRE_ALLOCATED_VUS,
  maxVUs: __ENV.MAX_VUS,
  stageQuantity: __ENV.STAGE_QUANTITY,
  addTarget: +__ENV.ADD_TARGET,
  addRate: +__ENV.ADD_RATE,
  multiplierMaxVus: __ENV.MULTIPLIER_MAX_VUS,
  multiplier2: __ENV.MULTIPLIER2,
  multiplier3: __ENV.MULTIPLIER3,
  k6_env_options: __ENV.K6_ENV_OPTIONS,
  gracefulStop: __ENV.GRACEFUL_STOP,
}