import * as jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import { config } from '../../config'

interface JwtPayload {
  aud: string
  email: string
  type: string
}

export const post: RequestHandler = async (req: any, res, next) => {
  const { traceToken } = req

  const { email } = req.body

  console.info('authenticate.post called')

  // do authenticate logic here, ie: call firebase auth or check DB

  const token = jwt.sign(
    {
      aud: config.get('APP_NAME'),
      email,
      type: 'anonymous',
    } as JwtPayload,
    config.get('JWT_SECRET'),
    {
      expiresIn: config.get('JWT_TTL_SECONDS'),
    },
  )

  res.json({ token })


  next()
}
