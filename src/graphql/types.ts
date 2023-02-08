export enum UserType {
  Anonymous = 'anonymous',
  Free = 'free',
}

export interface JwtPayload {
  aud: string
  email: string
  type: UserType
  id: string
}

export type GraphQLContext = {
  user: JwtPayload
  traceToken: string
  ipAddress: string
}
