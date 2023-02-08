import { redisClient } from '../redis'
import errcode from 'err-code'
import { Room } from '../graphql/generated'

export const getRoom = async (code: string) => {

  const client = redisClient()

  // Find deck
  const roomJson = await client.get(`room:${code}`)
  if (!roomJson) {
    throw errcode(new Error(`Room not found`), 'RoomNotFoundError')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...roomObj } = JSON.parse(roomJson) as Room

  return roomObj

}
