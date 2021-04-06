import path from "path"
import chalk from "chalk"
import { CommandModule } from "yargs"
import { GlobalArguments } from "./global"

const DEPENDENCIES_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "bundledDependencies",
  "optionalDependencies",
]

const command: CommandModule<GlobalArguments, GlobalArguments> = {
  command: ["info", "*"],
  describe: "list info of a project",
  handler: (argv) => {
    console.log(chalk.gray(`${path.resolve(argv.config)}:`))

    const parsed = argv.packagejson

    console.log(`${parsed.name}@${parsed.version}\n`)

    let showedAtLeastOnce = false

    for (let depsField of DEPENDENCIES_FIELDS) {
      const deps = parsed[depsField]

      if (!deps) continue

      showedAtLeastOnce = true
      console.log(chalk.yellow(`${depsField}:`))

      for (let [dep, ver] of Object.entries(deps)) {
        console.log(`  ${dep}@${ver}`)
      }
      console.log()
    }

    if (!showedAtLeastOnce) {
      console.log(chalk.gray(`no dependencies`))
    }
  },
}

export default command
