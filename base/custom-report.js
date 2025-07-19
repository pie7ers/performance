function addRow(title, value) {
  return `
          <tr>
            <td><b>${title}</b></td>
            <td>${value}</td>
          </tr>
  `
}

function getTestOptionsTable(config) {
  const target = config.target ? addRow("target", config.target): ""
  const rate = config.rate ? addRow("rate", config.rate): ""
  const addRate = config.addRate ? addRow("add rate", config.addRate): ""
  const addTarget = config.addTarget ? addRow("add rate", config.addTarget): ""
  const vus = config.vus ? addRow("vus", config.vus): ""
  const maxVUs = config.maxVUs ? addRow("max vus", config.maxVUs): ""
  const stageQuantity = config.stageQuantity ? addRow("stage quantity", config.stageQuantity): ""
  const maxDuration = config.maxDuration ? addRow("max duration", config.maxDuration): ""
  const multiplierMaxVus = config.multiplierMaxVus ? addRow("multiplierMaxVus", config.multiplierMaxVus): ""
  const duration = config.duration ? addRow("duration", config.duration): ""
  const duration1 = config.duration1 ? addRow("duration1", config.duration1): ""
  const duration2 = config.duration2 ? addRow("duration2", config.duration2): ""
  const duration3 = config.duration3 ? addRow("duration3", config.duration3): ""
  const iterations = config.iterations ? addRow("iterations", config.iterations): ""
  const multiplier2 = config.multiplier2 ? addRow("multiplier2", config.multiplier2): ""
  const multiplier3 = config.multiplier3 ? addRow("multiplier3", config.multiplier3): ""
  const preAllocatedVUs = config.preAllocatedVUs ? addRow("preAllocatedVUs", config.preAllocatedVUs): ""
  const timeUnit = config.timeUnit ? addRow("timeUnit", config.timeUnit): ""
  const gracefulStop = config.gracefulStop ? addRow("gracefulStop", config.gracefulStop): ""
  return `
      <table class="pure-table pure-table-striped" style="width: auto;">
        <tbody>
          <thead>
            <tr>
              <th colspan="2" style="text-align: center;">OPTIONS</th>
            </tr>
          </thead>
          ${target}
          ${rate}
          ${addRate}
          ${addTarget}
          ${vus}
          ${maxVUs}
          ${stageQuantity}
          ${maxDuration}
          ${multiplierMaxVus}
          ${duration}
          ${duration1}
          ${duration2}
          ${duration3}
          ${iterations}
          ${multiplier2}
          ${multiplier3}
          ${preAllocatedVUs}
          ${timeUnit}
          ${gracefulStop}
        </tbody>
      </table>
  `
}

export function getCustomHandleSummaryReport(htmlContent, data, testName, testType) {
  
  const scenario = data?.setup_data?.scenario
  const config = data?.setup_data?.config
  
  //TITLE
  let customTitle = testType.toLowerCase();
  customTitle = customTitle[0].toUpperCase() + customTitle.slice(1);
  const formattedTitle = `<title>K6 ${customTitle} - ${testName}`;
  htmlContent = htmlContent.replaceAll(
    `<title>K6 Load Test:`,
    formattedTitle
  );

  //H1
  const svgRegex = /<svg[^>]*>.*?<\/svg>/s;
  const svgMatch = htmlContent.match(svgRegex);
  const svgContent = svgMatch ? svgMatch[0] : null;

  const dateRegex = /&nbsp; K6 Load Test:\s*(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/;
  const dateMatch = htmlContent.match(dateRegex);
  const dateContent = dateMatch ? dateMatch[1] : null;

  const newh1 = `<h1>${svgContent} &nbsp; K6 Load Test: ${dateContent}</h1>`;

  htmlContent = htmlContent.replace(/<h1>.*?<\/h1>/s, newh1);

  //DETAIL TABLE
  const detailTable = `
    </h1>
    <div class="row" style="display: flex; gap: 20px;">
      <table class="pure-table pure-table-striped" style="width: auto;">
        <tbody>
          <tr>
            <td><b>ENVIRONMENT</b></td>
            <td>${data?.setup_data?.domain}</td>
          </tr>
          <tr>
            <td><b>ENDPOINT</b></td>
            <td>${data?.setup_data?.baseEndpoint}</td>
          </tr>
          <tr>
            <td><b>TYPE</b></td>
            <td>${data?.setup_data?.testType}</td>
          </tr>
          <tr>
            <td><b>SCENARIO</b></td>
            <td>${scenario}</td>
          </tr>
          <tr>
            <td><b>NAME</b></td>
            <td>${data?.setup_data?.testName}</td>
          </tr>
        </tbody>
      </table>
      <!---->
      ${getTestOptionsTable(config)}
    </div>
  `
  htmlContent = htmlContent.replaceAll(
    `</h1>`,
    detailTable
  );

  return htmlContent
}