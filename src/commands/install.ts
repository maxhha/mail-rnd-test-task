import { writeFileSync } from "fs"
import { httpsPromise } from "../utils/https"
import { argv, CommandModule } from "yargs"
import { GlobalArguments } from "../global"
import chalk from "chalk"
import semver from "semver"

const NPM_REGISTER = "https://registry.npmjs.org"

const validateDependency = async (dep: string) => {
  const m = dep.match(/^(@[a-z0-9\-]+\/)?([a-z0-9_-]*)(@[.a-z0-9_-]+)?$/)

  if (!m) {
    throw new Error(
      `Invalid dependency "${dep}". Dependencies only in format [@scope/]<package>[@tag|semver] are supported`
    )
  }

  const scope = m[1]
  const pack = m[2]
  const tagOrSemver = m[3]

  const scopePackage = (scope || "") + pack

  const resp = await httpsPromise(
    `${NPM_REGISTER}/${encodeURIComponent(scopePackage)}`
  ).catch((error) => {
    throw new Error(`Cant find "${scopePackage}" in npm register`)
  })

  const data = JSON.parse(resp.body)

  const packageVerisions = Object.keys(data?.versions ?? {})
  const range = semver.validRange(tagOrSemver)
  const version = semver.valid(tagOrSemver)
  const ver = tagOrSemver
    ? (data?.["dist-tags"]?.[tagOrSemver] && tagOrSemver) ||
      (version && packageVerisions.includes(version) && version) ||
      (range && semver.maxSatisfying(packageVerisions, range) && range)
    : data?.["dist-tags"]?.["latest"] && "^" + data["dist-tags"].latest

  if (!ver) {
    throw new Error(`Cant find version for "${dep}"`)
  }

  return { ver, name: data.name }
}

interface Arguments extends GlobalArguments {
  packages: string[]
}

const command: CommandModule<GlobalArguments, Arguments> = {
  command: ["install <packages...>", "i"],
  describe: "add packages to your dependencies",
  handler: async (argv: Arguments) => {
    const parsed = argv.packagejson

    if (!parsed.dependencies) {
      parsed.dependencies = {}
    } else if (typeof parsed.dependencies !== "object") {
      throw new Error("Field 'dependencies' in config file is not an object")
    }

    const errors = []

    for await (let dep of argv.packages) {
      try {
        const { name, ver } = await validateDependency(dep)

        parsed.dependencies[name] = ver

        console.log(chalk.green(`✅ ${name}@${ver}`))
      } catch (err) {
        errors.push(err)

        console.log(chalk.red(`❌ ${dep}`))
      }
    }

    if (errors.length > 0) {
      for (let error of errors) {
        console.error(chalk.red(error.message))
      }
    } else {
      writeFileSync(argv.config, JSON.stringify(parsed, void 0, 2))
      console.log(chalk.green("\nSaved!"))
    }
  },
}

export default command
