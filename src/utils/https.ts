import https, { RequestOptions } from "https"
import { IncomingHttpHeaders } from "http"
import { URL } from "url"

export const httpsPromise = (
  urlOptions: RequestOptions | string | URL,
  data?: any
) => {
  return new Promise<{
    statusCode: number
    headers: IncomingHttpHeaders
    body: string
  }>((resolve, reject) => {
    const req = https.request(urlOptions, (res) => {
      let body = ""
      res.on("data", (chunk) => (body += chunk.toString()))
      res.on("error", reject)
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          })
        } else {
          reject(
            new Error(
              "Request failed. status: " + res.statusCode + ", body: " + body
            )
          )
        }
      })
    })
    req.on("error", reject)
    if (data) req.write(data, "binary")
    req.end()
  })
}
