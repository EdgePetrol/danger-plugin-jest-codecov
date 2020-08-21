import jestCodecov from "./src/index"

jestCodecov(
  `https://circleci.com/api/v1.1/project/github/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}/${process.env.CIRCLE_BUILD_NUM}/artifacts?circle-token=${process.env.CIRCLE_TOKEN}`,
  `https://circleci.com/api/v1.1/project/github/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}/latest/artifacts?circle-token=${process.env.CIRCLE_TOKEN}&branch=staging`
)
