export interface GlobalArguments {
  config: string
  packagejson: {
    name: string
    version: string
    [_: string]: any
  }
}
