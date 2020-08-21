// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { JSDOM } from "jsdom"
import * as _ from "lodash"
import fetch from "node-fetch"
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"

// const fetch = require("node-fetch")

declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * Similar to codecov bot, it will print the code coverage difference on each PR
 */
export default async function jestCodecov(currentUrl: string, masterUrl: string) {
  const currentReport = await getReport(currentUrl)
  const masterReport = await getReport(masterUrl)

  const currentCoverage = getCoverage(currentReport)
  const masterCoverage = getCoverage(masterReport)

  markdown(outputReport(currentCoverage, masterCoverage))
}

const getReport = async url => {
  let coverageUrl

  try {
    const response = await fetch(url)
    const data = await response.json()

    coverageUrl = _.find(data, artifact => {
      if (!artifact.hasOwnProperty("url")) {
        return undefined
      }

      return artifact.url.endsWith("lcov-report/index.html")
    })
  } catch (error) {
    // tslint:disable-next-line no-console
    console.error("Error fetching circleCI url: ", error)
    return undefined
  }

  if (coverageUrl === undefined) {
    return undefined
  }

  try {
    const coverageResponse = await fetch(`${coverageUrl.url}?circle-token=${process.env.CIRCLE_TOKEN}`)
    const coverageData = await coverageResponse.text()

    return coverageData
  } catch (error) {
    // tslint:disable-next-line no-console
    console.error("Error fetching circleCI artifact url: ", error)
    return undefined
  }
}

const getCoverage = report => {
  const { window } = new JSDOM(report)
  const data = window.document.getElementsByClassName("fl pad1y space-right2")

  return _.map(data, node => {
    return [node.children[1].textContent, node.children[0].textContent, node.children[2].textContent]
  })
}

// tslint:disable: no-shadowed-variable
const outputReport = (results, masterResults) => {
  let message = ["```diff\n@@            Coverage Diff             @@"]
  message = message.concat([
    `## ${justifyText("master", 18)} ${justifyText(
      "#" + (process.env.CIRCLE_PULL_REQUEST || "NaN").split("/").pop(),
      8
    )} ${justifyText("+/-", 7)} ${justifyText("##", 3)}`,
  ])
  message = message.concat(separatorLine())
  message = message.concat(
    _.map(results, (lineResult, index) => {
      let masterValue = "-"
      if (typeof masterResults[index] === "object") {
        masterValue = masterResults[index][1]
      }
      return newLine(lineResult, masterValue, "%")
    })
  )

  message = message.concat(separatorLine())
  message = message.concat(["```"])

  return message.join("\n")
}

const separatorLine = () => {
  return ["=========================================="]
}

const newLine = (lineData, masterLineData, symbol) => {
  const [prep, diff] = getPrependDiff(masterLineData, lineData[1], symbol)

  return `${prep} ${justifyText(lineData[0], 11, "left")} ${justifyText(masterLineData, 8)}${justifyText(
    lineData[1],
    9
  )} ${justifyText(diff, 5)}`
}

const getPrependDiff = (oldValue, newValue, symbol) => {
  let prep = " "
  let value = (parseFloat(newValue) - parseFloat(oldValue)).toFixed(2).toString()

  if (parseFloat(value) > 0) {
    prep = "+"
  } else if (parseFloat(value) < 0) {
    prep = "-"
  }

  value = parseFloat(value) === 0 || isNaN(parseFloat(value)) ? "" : value + symbol

  return [prep, value]
}

const justifyText = (data, adjust, position = "right") => {
  return position === "right" ? rjust(data, adjust) : ljust(data, adjust)
}

const ljust = (data, width, padding = " ") => {
  padding = padding.substr(0, 1)

  return data.length < width ? data + padding.repeat(width - data.length) : data
}

const rjust = (data, width, padding = " ") => {
  padding = padding.substr(0, 1)

  return data.length < width ? padding.repeat(width - data.length) + data : data
}
