import { jestCodecov } from "./index"
import fetch from "node-fetch"

declare const global: any

let mockFetchPromise

jest.mock('node-fetch', () => ({
  default: jest.fn().mockImplementation((url: string) => mockFetchPromise(url)),
}))

describe("#jestCodecov()", () => {
  beforeEach(() => {
    global.markdown = jest.fn()
  })

  afterEach(() => {
    global.markdown = undefined
  })

  describe("valid reports", () => {
    it("returns an invalid report", async () => {
      expect(await jestCodecov("http://localhost/index.html", "http://localhost/old-index.html")).toBe(undefined)
    })
  })

  describe("valid reports", () => {
    beforeEach(() => {
      const newHtml = require('./test-files/index.html')
      const oldHtml = require('./test-files/old-index.html')

      const mockSuccessResponse = (url: string) => {
        if (url.match(/old-index/)) {
          return newHtml
        }
        return oldHtml
      }
      const mockHtmlPromise = (url: string) => Promise.resolve(mockSuccessResponse(url))

      mockFetchPromise = (url: string) => Promise.resolve({
        text: () => mockHtmlPromise(url),
      })
    })

    describe("with difference", () => {
      it("returns the correct report with positive values", async () => {
        await jestCodecov("http://localhost/index.html", "http://localhost/old-index.html")
        
        expect(global.markdown).toHaveBeenCalled()
        expect(global.markdown).toHaveBeenCalledTimes(1) 
      })

      it("returns the correct report with negative values", async () => {
        await jestCodecov("http://localhost/old-index.html", "http://localhost/index.html")
        
        expect(global.markdown).toHaveBeenCalled()
        expect(global.markdown).toHaveBeenCalledTimes(1)
      })

      it("returns the correct report with the same values", async () => {
        await jestCodecov("http://localhost/index.html", "http://localhost/index.html")
        
        expect(global.markdown).toHaveBeenCalled()
        expect(global.markdown).toHaveBeenCalledTimes(1)
      })
    })
  })
})
