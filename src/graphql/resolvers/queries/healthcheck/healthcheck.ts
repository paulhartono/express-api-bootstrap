import { HealthCheck } from "../../../generated"

export const healthCheck = async (): Promise<HealthCheck> => {

  return {
    uptime: process.uptime()
  }

}
