import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import config, { HANDLE_SUMMARY } from "../config.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { getDateMMDDYYYY } from "../utils/date.js";
import http from 'k6/http'
import { check } from 'k6'
import { scenariosType, validHttpReqsScenarios } from "./scenarios.js";
import { getCustomHandleSummaryReport } from "./custom-report.js";

function shallowMerge(objects) {
  const result = {};
  objects.forEach((obj) => Object.keys(obj).forEach((key) => result[key] = obj[key]));
  return result;
}

export function buildTestData(testData) {
  return shallowMerge([{
    testName: 'test',
  }, testData]);
}

export function rebuildConfig(testData) {
  return {
    vus: testData?.config?.vus || testData?.scenarioData?.vus || testData?.options?.vus || testData?.options?.scenarios?.contacts?.vus,
    iterations: testData?.config?.iterations || testData?.scenarioData?.iterations || testData?.options?.iterations || testData?.options?.scenarios?.contacts?.iterations,
    maxDuration: testData?.config?.maxDuration || testData?.scenarioData?.maxDuration || testData?.options?.maxDuration || testData?.options?.scenarios?.contacts?.maxDuration,
    thresholds: testData?.config?.thresholds || testData?.scenarioData?.thresholds || testData?.options?.thresholds || testData?.options?.scenarios?.contacts?.thresholds,
    target: testData?.config?.target || testData?.scenarioData?.target || testData?.options?.target || testData?.options?.scenarios?.contacts?.target,
    duration1: testData?.config?.duration1 || testData?.scenarioData?.duration1 || testData?.options?.duration1 || testData?.options?.scenarios?.contacts?.duration1,
    duration2: testData?.config?.duration2 || testData?.scenarioData?.duration2 || testData?.options?.duration2 || testData?.options?.scenarios?.contacts?.duration2,
    duration3: testData?.config?.duration3 || testData?.scenarioData?.duration3 || testData?.options?.duration3 || testData?.options?.scenarios?.contacts?.duration3,
    rate: testData?.config?.rate || testData?.scenarioData?.rate || testData?.options?.rate || testData?.options?.scenarios?.contacts?.rate,
    timeUnit: testData?.config?.timeUnit || testData?.scenarioData?.timeUnit || testData?.options?.timeUnit || testData?.options?.scenarios?.contacts?.timeUnit,
    maxVUs: testData?.config?.maxVUs || testData?.scenarioData?.maxVUs || testData?.options?.maxVUs || testData?.options?.scenarios?.contacts?.maxVUs,
    duration: testData?.config?.duration || testData?.scenarioData?.duration || testData?.options?.duration || testData?.options?.scenarios?.contacts?.duration,
    preAllocatedVUs: testData?.config?.preAllocatedVUs || testData?.scenarioData?.preAllocatedVUs || testData?.options?.preAllocatedVUs || testData?.options?.scenarios?.contacts?.preAllocatedVUs,
    stageQuantity: testData?.config?.stageQuantity || testData?.scenarioData?.stageQuantity || testData?.options?.stageQuantity || testData?.options?.scenarios?.contacts?.stageQuantity,
    addRate: testData?.config?.addRate || testData?.scenarioData?.addRate || testData?.options?.addRate || testData?.options?.scenarios?.contacts?.addRate,
    addTarget: testData?.config?.addTarget || testData?.scenarioData?.addTarget || testData?.options?.addTarget || testData?.options?.scenarios?.contacts?.addTarget,
    multiplierMaxVus: testData?.config?.multiplierMaxVus || testData?.scenarioData?.multiplierMaxVus || testData?.options?.multiplierMaxVus || testData?.options?.scenarios?.contacts?.multiplierMaxVus,
    multiplier2: testData?.config?.multiplier2 || testData?.scenarioData?.multiplier2 || testData?.options?.multiplier2 || testData?.options?.scenarios?.contacts?.multiplier2,
    multiplier3: testData?.config?.multiplier3 || testData?.scenarioData?.multiplier3 || testData?.options?.multiplier3 || testData?.options?.scenarios?.contacts?.multiplier3,
    gracefulStop: testData?.config?.gracefulStop || testData?.scenarioData?.gracefulStop || testData?.options?.gracefulStop || testData?.options?.scenarios?.contacts?.gracefulStop,
  }
}

export function buildSetupContext(testData) {
  const context = {
    domain: testData.domain,
    baseEndpoint: testData.baseEndpoint,
    baseUrl: testData.baseUrl,
    dataFile: testData.dataFile,
    testName: testData.testName || 'test',
    testType: testData.testType || 'performance',
    scenario: testData.scenario || 'smoke',
    reportFolder: testData.reportFolder,
    options: testData.options,
    config: rebuildConfig(testData),
  };

  return context;
}

export function handleSummary(data) {
  if (HANDLE_SUMMARY) {
    let report = {
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
    const testName = data?.setup_data?.testName
    const testType = data?.setup_data?.testType
    const scenario = data?.setup_data?.scenario
    const path = 'reports'
    const reportFolder = data?.setup_data?.reportFolder
    const fileName = reportFolder ? `${path}/${reportFolder}/${testName}-${testType}-${config.domain}`
      : `${path}/${testName}-${testType}-${config.domain}`
    const fullFileName = `${fileName}-${getDateMMDDYYYY()}-${new Date().getTime()}`
    const htmleReport = `${fullFileName}.html`
    const jsonReport = `${fullFileName}.json`

    let htmlContent = htmlReport(data);
    htmlContent = getCustomHandleSummaryReport(htmlContent, data, testName, testType);

    report[htmleReport] = htmlContent
    report[jsonReport] = JSON.stringify(data, null, 2)
    return report
  }
}

export function addTresholds(thresholds, scenario, target, vus) {
  if ((validHttpReqsScenarios.includes(scenario) && target >= 20) || scenario == scenariosType.vus && vus >= 30) {
    thresholds.http_reqs = ['rate>=5']//requests per second
  }
  return thresholds
}

export function successfulCodeResponsesByDefault() {
  http.setResponseCallback(http.expectedStatuses({ min: 200, max: 399 }, 400, 404));
}

export function defaultStatusCheck(res, validStatuses = [200]) {
  check(res, {
    [`response codes expected [${validStatuses}] - got ${res.status}`]: (res) => validStatuses.includes(res.status),
  })
}

export function getTimeFixed(k6timeUnit, multiplier = 1) {
  const k6time = k6timeUnit.slice(0, - 1)
  const k6Unit = k6timeUnit.slice(-1)
  return `${k6time * multiplier}${k6Unit}`
}

export function accumulator() {
  let total = 0;
  return {
    add: function (value) {
      total += value;
      return total;
    },
    getTotal: function () {
      return total;
    }
  }
}