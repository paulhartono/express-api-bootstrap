import { ErrorRequestHandler } from 'express'

interface Logger {
  info(message: string, data: any): any

  error(message: string, data: any): any
}

export const defaultErrorHandler = (logger: Logger): ErrorRequestHandler => {

  return (err, req, res, next) => {

    if (res.headersSent) {
      return next(err)
    }

    const { code, name, message } = err

    if (name === 'UnauthorizedError') {

      res.status(401)

      if (req.method === 'HEAD') {
        return res.end()
      }

      return res.json({
        errors: [{
          code: name,
          message,
        }],
      })
    }

    if (code === 'InvalidPermissionError') {

      res.status(403)

      if (req.method === 'HEAD') {
        return res.end()
      }

      return res.json({
        errors: [{
          code,
          message,
        }],
      })
    }

    if (name === 'PayloadTooLargeError') {

      res.status(413)

      if (req.method === 'HEAD') {
        return res.end()
      }

      return res.json({
        errors: [{
          code: name,
          message,
        }],
      })
    }

    if (typeof code === 'string' && code.includes('NotFoundError')) {

      res.status(404)

      if (req.method === 'HEAD') {
        return res.end()
      }

      return res.json({
        errors: [{
          code,
          message,
        }],
      })
    }

    logger.error('unknown error occurred', { err, traceToken: (req as any).traceToken, errcode: code })

    if (req.method === 'HEAD') {
      return res.status(500).end()
    }

    return res.status(500).json({
      errors: [{
        code: 'ServerError',
        message,
      }],
    })

  }

}
