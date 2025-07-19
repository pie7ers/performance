import { doesTheFileExist, writeFile } from './filesControl'
import path from 'path'
import pc from 'picocolors'
const ENV_PATH = path.join(__dirname, '../.env')

const ENV = `#Possible environments:
# 1 = local (mocks)
# 2 = dev 
# 3 = test (default)
# others
ENVIRONMENT=2#GLOBAL
API_KEY_API_ONE_DEV=
API_KEY_API_TWO_DEV=
API_KEY_API_ONE_TEST=
API_KEY_API_TWO_TEST=

#Turn on and of the handle summary report in the config is on by default
HANDLE_SUMMARY=1

#K6 TESTS, be sure to send a JSON
K6_ENV_OPTIONS='
{
  "scenarios": {
    "contacts": {
      "executor": "constant-vus",
      "vus": 10,
      "duration": "30s"
    }
  }
}
'
K6_WEB_DASHBOARD=true
`

if (!doesTheFileExist(ENV_PATH)) {
  writeFile(ENV_PATH, ENV)
  console.log(pc.green(`.env created`))
}
else console.log(pc.yellow(`.env already exits`))
