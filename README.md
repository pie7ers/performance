# PERFORMANCE TESTING

Execute the following steps:

- npm i
- npm run make-env

## Install k6

https://grafana.com/docs/k6/latest/set-up/install-k6/

## setting reports folder
- mkdir -p ./reports/api-name-1 ./reports/api-name-2 ...
    - mkdir -p ./reports/poke-api ./reports/placeholder-api

## steps to Run with .env file
- npm install -g dotenv-cli
- execute the command `dotenv -e .env -- k6 run file.js`

## Run tests:

```shell
dotenv -e .env -- k6 run tests/poke-api/pokemon.js
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=vus -e VUS=40 -e ITERATIONS=5 -e MAX_DURATION=60s
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=personalized_stage -e TEST_TYPE=load -e DURATION1=1m -e DURATION2=5m -e DURATION3=1m -e TARGET=50
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=personalized_stage -e TEST_TYPE=stress -e DURATION1=1m -e DURATION2=5m -e DURATION3=1m -e TARGET=200
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=constant_arrival_rate -e TEST_TYPE=stress -e RATE=10 -e TIME_UNIT=1s -e DURATION=1m -e PRE_ALLOCATED_VUS=100 -e MAX_VUS=200
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=custom_constant_arrival_rate -e TEST_TYPE=stress -e RATE=5 -e TIME_UNIT=1s -e DURATION=1m -e STAGE_QUANTITY=3 -e ADD_RATE=5 -e MAX_VUS=15 -e MULTIPLIER_MAX_VUS=1
dotenv -e .env -- k6 run tests/poke-api/pokemon.js -e SCENARIO=custom_arrival_rate -e TEST_TYPE=stress -e RATE=1 -e TIME_UNIT=1s -e DURATION=1m -e STAGE_QUANTITY=3 -e ADD_TARGET=100
```

## Type of performance tests

- Smoke Tets: Validate the script works and the system performs adequately under minimal load
- Load tests: assess how the system performs under expected normal conditions
```js
const options = {
  load: {
    stages: [
      { duration: duration1 || "1m", target: target || 50 },
      { duration: duration2 || "5m", target: target || 50 },
      { duration: duration3 || "1m", target: 0 },
    ]
  }
}
```
- Stress tests: assess how the system performs at its limits when load exceeds the expected average
```js
const options = {
  stress: {
    stages: [
      { duration: duration1 || "1m", target: target || 200 },
      { duration: duration2 || "5m", target: target || 200 },
      { duration: duration3 || "1m", target: 0 },
    ]
  }
}
```
- Soak tests: assess the reliability and performance of the system over extended periods
```js
const options = {
  soak: {
    stages: [
      { duration: duration1 || "5m", target: target || 100 },
      { duration: duration2 || "3h", target: target || 100 },
      { duration: duration3 || "5m", target: 0 }
    ]
  },
}
```
- Breakpoint tests: gradually increase load to identify the capacity limits of the system


## other capabilities

- `thresholds`: is an object into the options to set acceptance criterias by metrics, https://grafana.com/docs/k6/latest/using-k6/thresholds/
- `setup()`: initializes data and set connections, useful to run others requests that generate tokens or data as precondition to run the test script, this function also might return an object which set setup_data into data object it means data.setup_data
- `export default function ()`: code block that runs the tests
- `teardown()`: cleans data and closes connections or perform other steps that need to be run after the test script finishes
- `handleSummary(data)`: this function is used to create reports and wiht `htmlReport`, and `textSummary` to can create html reports.
- VUs: are virtual users, they simulate a user
    - VUs will execute the main test repeatedly during the duration of the test
    - Iterations limits the executions of the test
- Executors: determine how to schedule the tests:
    - per-vu-iterations: determines how many iterations each VU will execute
    - others: https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/
- Browser: https://grafana.com/docs/k6/latest/using-k6-browser/
- Dropped iterations: https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/

## Calculate Total expected requests for simpler cases

> [!NOTE]
> bear in mind the http_req_duration valuse may vary dependiong on the number of requests made

- Calculate iterations per second per VU (IPSPVU)

    - http_req_duration average = average iteration duration
    - iterations per second per vu (IPSPVU)= 1/http_req_duration avg

- Calculate total requests (TR)
    ```
    VUs = total VUs as they are in the script options
    duration = duration as it is in the script options
    ```
    - request per second (RPS) = VUs * IPSPVU
    - total request (TR) = RPS * duration

- example: 

```js
//VUs = total VUs as they are in the script options
//duration = duration as it is in the script options
export const options = {
    vus: 5,
    duration: '5s'
}
```
if the http_req_duration avg = 312.63ms = 0,312s, then:
```
IPSPVU = 1/0,312s ≈ 3,2051282051 s/vus
RPS = 5vus * 3,205 s/vus ≈ 16,025 r/s
TR = 16,025 r/s * 5s = 80,125 r ≈ 80 requests
```

##

```shell
dotenv -e .env -- k6 run tests/poke-api/pokemon.js
```