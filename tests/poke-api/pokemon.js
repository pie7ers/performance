import http from 'k6/http'
import config, { scenarios } from '../../config.js'
import { buildTestData, handleSummary, buildSetupContext, successfulCodeResponsesByDefault, defaultStatusCheck, addTresholds } from '../../base/test-base.js'
import { SharedArray } from 'k6/data';
import { getScenario, getScenarioData } from '../../base/scenarios.js';
import { getRandomNumber } from '../../utils/commons.js'

//1. init stage
const baseUrl = config.API_ONE_HOST
const apiKey = config.API_KEY_API_ONE
const domain = config.domain
const testDataFile = '../../data/test/poke-api/pokemon.json'
const devDataFile = '../../data/dev/poke-api/pokemon.json'
const file = domain == 'test' ? testDataFile : devDataFile
const data = new SharedArray('trade data', function () {
  return JSON.parse(open(file))
});

let thresholds = {
  http_req_duration: ['p(95)<5000'],
}
thresholds = addTresholds(thresholds, scenarios.scenario, scenarios.target, scenarios.vus)

scenarios.vus = scenarios.vus ? scenarios.vus : data.length
export const options = getScenario(scenarios, thresholds)
const scenarioData = getScenarioData()

const testData = buildTestData({
  domain: domain,
  testName: "get-pokemon",
  dataFile: file,
  baseUrl: baseUrl,
  baseEndpoint: 'pokemon',
  testType: scenarios.testType,
  scenario: scenarios.scenario,
  config: scenarios,
  scenarioData: scenarioData,
  options: options,
  reportFolder: "poke-api",
})

successfulCodeResponsesByDefault()

//2. setup stage, this add setup_data to data = data.setup_data which will be shown in the reports
export function setup() {
  console.log(`tests running in ${testData.baseUrl}/${testData.baseEndpoint}, domain: ${domain}, test-type: ${scenarios.testType}`)
  return buildSetupContext(testData)
}

//3. VU stage
export default function () {

  const pokemonId = data[getRandomNumber(0, data.length - 1)]?.id
  const url = `${baseUrl}/pokemon/${pokemonId}`
  const params = {
    headers: {
      Authorization: apiKey
    }
  }

  const res = http.get(url, params)

  const validStatuses = [200, 404, 400];
  defaultStatusCheck(res, validStatuses)
}

export { handleSummary }