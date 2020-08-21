import jestCodecov from "./index"

declare const global: any

describe("jestCodecov()", () => {
  beforeEach(() => {
    global.warn = jest.fn()
    global.message = jest.fn()
    global.fail = jest.fn()
    global.markdown = jest.fn()
  })

  afterEach(() => {
    global.warn = undefined
    global.message = undefined
    global.fail = undefined
    global.markdown = undefined
  })

  it("Checks for a that message has been called", () => {
    global.danger = {
      github: { pr: { title: "My Test Title" } },
    }

    jestCodecov(
      "https://circleci.com/api/v1.1/project/github/EdgePetrol/scraper-adaptors-v2/281/artifacts?circle-token=" +
        process.env.CIRCLE_TOKEN,
      "https://circleci.com/api/v1.1/project/github/EdgePetrol/scraper-adaptors-v2/163/artifacts?circle-token=" +
        process.env.CIRCLE_TOKEN
    )

    expect(global.message).toHaveBeenCalledWith("PR Title: My Test Title")
  })
})
