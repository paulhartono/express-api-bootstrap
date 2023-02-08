import { redisClient } from '../redis'
import errcode from 'err-code'
import { Room } from '../graphql/generated'
import { config } from '../config'

export const joinRoom = async (args: { code: string, userId: string, name: string}) => {

  const { code, userId, name } = args

  const client = redisClient()

  // Find Room
  const roomKey = `room:${code}`
  const roomJson = await client.get(roomKey)
  if (!roomJson) {
    throw errcode(new Error(`Join room not found`), 'RoomNotFoundError')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...room } = JSON.parse(roomJson) as Room
  console.log(`userId = `,userId)
  console.log(`room.members = `,room.members)

  const existingMember = room.members?.find(member => member.userId === userId)

  // add to members if this user has not been added
  if (!existingMember) {

    room.members?.push({userId, name})

    await client.multi()
      .setex(roomKey, config.get('ROOM_TTL_SECONDS'), JSON.stringify(room))
      .setex(`user-room:${userId}`, config.get('ROOM_TTL_SECONDS'), code)
      .exec()
  } else {
    await client.setex(`user-room:${userId}`, config.get('ROOM_TTL_SECONDS'), code)
  }

  return room

}
