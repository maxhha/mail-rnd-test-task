import { readFileSync, writeFileSync } from "fs"
import { httpsPromise } from "../utils/https"
import { CommandModule } from "yargs"
import { GlobalArguments } from "./global"

interface Arguments extends GlobalArguments {
  packages: string[]
}

const command: CommandModule<GlobalArguments, Arguments> = {
  command: ["install <packages...>", "i"],
  describe: "add packages to your dependencies",
  handler: async (argv: Arguments) => {
    console.debug(`Read data from config "${argv.config}"`)
    const data = readFileSync(argv.config, "utf8")

    console.debug("Parse json")
    const parsed = JSON.parse(data)

    console.debug("Add new dependencies")
    if (!parsed.dependencies) {
      parsed.dependencies = {}
    }

    for await (let dep of argv.packages) {
      const m = dep.match(/^(.+)@(.+)$/)
      const pack = m?.[1] ?? dep
      const tag = m?.[2] ?? "latest"

      const resp = await httpsPromise(`https://registry.npmjs.org/${pack}`)
      const data = JSON.parse(resp.body)

      const ver = data["dist-tags"][tag] ?? tag

      parsed.dependencies[pack] = ver
    }

    console.debug("Save file")
    writeFileSync(argv.config, JSON.stringify(parsed, void 0, 2))
  },
}

export default command
