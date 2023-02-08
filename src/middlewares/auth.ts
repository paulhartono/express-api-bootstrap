import * as jwt from "jsonwebtoken"
import { RequestHandler } from "express"
import { config } from "../config"

interface JwtPayload {
  aud: string
  email: string
  type: string
  homepageUrl: string
}

export const auth: RequestHandler = (req, res, next) => {
  const { tenantCode, authCode, redirectUri, userDeviceToken } = req.body

  // @ts-ignore
  return getUserIdentity({ tenantCode, authCode, redirectUri, traceToken: req.traceToken, userDeviceToken })
    .then((userIdentity) => {
      const token = jwt.sign(
        {
          aud: `${config.get("APP_NAME")}`,
          email: userIdentity.email,
          type: userIdentity.type,
          homepageUrl: userIdentity.homepageUrl,
        } as JwtPayload,
        config.get("JWT_SECRET"),
        {
          expiresIn: config.get("JWT_TTL_SECONDS"),
        }
      )

      res.json({ token })
    })
    .catch(next)
}
