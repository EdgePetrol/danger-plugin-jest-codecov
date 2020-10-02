// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { JSDOM } from "jsdom"
import * as _ from "lodash"
import fetch from "node-fetch"
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"

declare var danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * Similar to codecov bot, it will print the code coverage difference on each PR
 */
export async function jestCodecov(currentUrl: string, previousUrl: string) {
  const currentReport = await getReport(currentUrl)
  const previousReport = await getReport(previousUrl)

  const currentCoverage = getCoverage(currentReport)
  const previousCoverage = getCoverage(previousReport)

  markdown(outputReport(currentCoverage, previousCoverage, getPreviousBranchName(previousUrl)))
}

const getReport = async (url: string) => {
  try {
    const coverageResponse = await fetch(url)
    const coverageData = await coverageResponse.text()

    return coverageData
  } catch (error) {
    return undefined
  }
}

const getCoverage = (report: string|undefined) => {
  const { window } = new JSDOM(report)
  const data = window.document.getElementsByClassName("fl pad1y space-right2")

  return _.map(data, node => {
    return [node.children[1].textContent, node.children[0].textContent, node.children[2].textContent]
  })
}

// tslint:disable: no-shadowed-variable
const outputReport = (results: any, masterResults: any, previousBranchName: string) => {
  let message = ["```diff\n@@            Coverage Diff             @@"]
  message = message.concat([
    `## ${justifyText(previousBranchName, 18)} ${justifyText(
      "#" + (process.env.CIRCLE_PULL_REQUEST || "NaN").split("/").pop(),
      8
    )} ${justifyText("+/-", 7)} ${justifyText("##", 3)}`,
  ])
  message = message.concat(separatorLine())
  message = message.concat(
    _.map(results, (lineResult, index) => {
      return newLine(lineResult, masterResults?.[index]?.[1] || "-", "%")
    })
  )

  message = message.concat(separatorLine())
  message = message.concat(["```"])

  return message.join("\n")
}

const separatorLine = () => {
  return ["=========================================="]
}

const newLine = (lineData: any, masterLineData: string, symbol: string) => {
  const [prep, diff] = getPrependDiff(masterLineData, lineData[1], symbol)

  return `${prep} ${justifyText(lineData[0], 11, "left")} ${justifyText(masterLineData, 8)}${justifyText(
    lineData[1],
    9
  )} ${justifyText(diff, 5)}`
}

const getPrependDiff = (oldValue: string, newValue: string, symbol: string) => {
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

const justifyText = (data: string, adjust: number, position: string = "right") => {
  return position === "right" ? rjust(data, adjust) : ljust(data, adjust)
}

const ljust = (data: string, width: number, padding: string = " ") => {
  padding = padding.substr(0, 1)

  return data.length < width ? data + padding.repeat(width - data.length) : data
}

const rjust = (data: string, width: number, padding: string = " ") => {
  padding = padding.substr(0, 1)

  return data.length < width ? padding.repeat(width - data.length) + data : data
}

const getPreviousBranchName = (url: any) => {
  return (
    url
      ?.split("?")
      ?.pop()
      ?.split("&")
      ?.filter(element => element.includes("branch="))
      ?.pop()
      ?.split("=")
      ?.pop() || "master"
  )
}
