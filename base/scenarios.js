import { isValidJSON } from "../utils/commons.js";
import { accumulator } from "./test-base.js";

export const scenariosType = {
  smoke: "smoke",
  smokeVUS: "smokeVUS",
  vus: "vus",
  load: "load",
  stress: "stress",
  soak: "soak",
  stage: "stage",
};

export const validHttpReqsScenarios = [
  scenariosType.load,
  scenariosType.stress,
  scenariosType.soak,
  scenariosType.stage,
];

let scenarioDataStore = {
  scenario: null,
  vus: null,
  iterations: null,
  maxDuration: null,
  thresholds: null,
};

export function getPerVuIterationsScenario(vus, iterations, maxDuration = "1m") {
  const config = {
    scenarios: {
      contacts: {
        executor: "per-vu-iterations",
        vus,
        iterations,
        maxDuration,
      }
    }
  }
  return config;
}

export function getPersonalizedStages(target = 20, duration1 = "1m", duration2 = "5m", duration3 = "1m") {
  return {
    stages: [
      { duration: duration1, target },
      { duration: duration2, target },
      { duration: duration3, target: 0 },
    ]
  }
}

export function getConstantArrivalRate(rate = 5, timeUnit = "1s", duration = "1m", preAllocatedVUs, maxVUs, gracefulStop) {
  const config = {
    scenarios: {
      contacts: {
        executor: "constant-arrival-rate",
        rate: rate,// define the rate of requests to send per time unit
        timeUnit: timeUnit,// define Measured rate per time defined then if rate:5 and timeUnit:1s then 5 requests per second
        duration: duration,// define the duration of the test
        preAllocatedVUs: preAllocatedVUs || rate * 2,// define the number of VUs to pre-allocate before the test starts
        maxVUs: maxVUs || rate * 3, // define the maximum number of VUs to allow during the test
        gracefulStop, // is a period at the end of the test in which k6 lets iterations in progress finish, void interrupted requests
      }
    }
  }
  if (startTime) config.arrival_rate.startTime = startTime // define the time to start the scenario
  return config
}

export function getCustomConstantArrivalRates(rate, timeUnit, duration, stageQuantity = 1, addRate = 10, multiplierMaxVus = 1, gracefulStop) {
  const stages = { scenarios: {} };
  const durationAccumulator = accumulator();
  let setDuration = duration;
  let getRate = rate;
  let getMaxVUs = rate * multiplierMaxVus;

  for (let i = 1; i <= stageQuantity; i++) {
    const [time, unit] = [Number(setDuration.slice(0, -1)), setDuration.slice(-1)];
    durationAccumulator.add(time);
    setDuration = durationAccumulator.getTotal() + unit;
    const startTime = i > 1 ? durationAccumulator.getTotal() - time + unit : undefined;

    stages.scenarios[`stage_${i}`] = {
      executor: "constant-arrival-rate",
      rate: getRate,
      timeUnit,
      duration,
      preAllocatedVUs: getRate,
      maxVUs: getMaxVUs,
      ...(startTime && { startTime }),
      gracefulStop,
    };

    getRate += addRate;
    getMaxVUs = getRate * multiplierMaxVus;
  }
  return stages;
}

function getStagesForRampingArrivalRates(startRate, duration = "1m", stageQuantity = 1, addTarget = 10) {
  const stages = []
  let target = startRate

  for (let i = 1; i <= stageQuantity; i++) {
    stages.push({ duration, target })
    target += addTarget
  }
  return stages
}

export function getCustomArrivalRates(startRate = 5, timeUnit = "1s", preAllocatedVUs = 5, maxVUs, duration, stagesQuantity, addTarget) {
  const config = {
    scenarios: {
      ramping_arrival_rate: {
        executor: "ramping-arrival-rate",
        startRate,// define the rate of requests to send initially
        timeUnit,//define Measured rate per time defined then if startRate:5 and timeUnit:1s then 5 requests per second
        preAllocatedVUs,// define the number of VUs to pre-allocate before the test starts
        maxVUs: addTarget * stagesQuantity + startRate, // define the maximum number of VUs to allow during the test
      }
    }
  }
  config.scenarios.ramping_arrival_rate.stages = getStagesForRampingArrivalRates(startRate, duration, stagesQuantity, addTarget)
  return config
}

export function validateK6Scenario(string) {
  const customError = "Invalid k6_env_options attribute check the value is a valid JSON"
  if (isValidJSON(string)) return JSON.parse(string);
  else throw new Error(customError);
}

export function setScenarioData(scenarioData) {
  scenarioDataStore = { ...scenarioData }
}

export function getScenarioData() {
  return scenarioDataStore;
}

export function getScenario(
  {
    scenario = "smoke",
    vus = 5,
    iterations = 1,
    maxDuration,
    target,
    duration1,
    duration2,
    duration3,
    rate,
    timeUnit,
    duration,
    preAllocatedVUs,
    maxVUs,
    stageQuantity,
    addTarget,
    addRate,
    multiplierMaxVus,
    multiplier2,
    multiplier3,
    k6_env_options,
    gracefulStop,
  },
  thresholds
) {
  //if you add a new attribute to scenarioData and you want to show it in the report, you must add it to the rebuildConfig function in test-base.js
  const scenarioData = {
    scenario,
    vus,
    iterations,
    maxDuration,
    thresholds,
    target,
    duration1,
    duration2,
    duration3,
    rate,
    timeUnit,
    maxVUs,
    duration,
    preAllocatedVUs,
    stageQuantity,
    addTarget,
    addRate,
    multiplierMaxVus,
    multiplier2,
    multiplier3,
    k6_env_options,
    gracefulStop,
  }
  setScenarioData(scenarioData)
  const scenarios = {
    smoke: {
      vus: vus || 10,
      duration: "5s"
    },
    smokeVUS: {
      scenarios: {
        contacts: {
          executor: "per-vu-iterations",
          vus: vus,
          iterations: iterations,
          maxDuration: "1m"
        }
      }
    },
    vus: () => getPerVuIterationsScenario(vus, iterations, maxDuration),
    personalized_stage: () => getPersonalizedStages(target, duration1, duration2, duration3),
    constant_arrival_rate: () => getConstantArrivalRate(rate, timeUnit, duration, preAllocatedVUs, maxVUs, gracefulStop),
    custom_constant_arrival_rate: () => getCustomConstantArrivalRates(rate, timeUnit, duration, stageQuantity, addRate, multiplierMaxVus, gracefulStop),
    custom_arrival_rate: () => getCustomArrivalRates(rate, timeUnit, preAllocatedVUs, maxVUs, duration, stageQuantity, addTarget),
    k6_env_options: validateK6Scenario(k6_env_options)
  }

  if (thresholds) {
    scenarios[scenario].thresholds = thresholds;
  }
  return typeof scenarios[scenario] === "function" ? scenarios[scenario]() : scenarios[scenario];
}
