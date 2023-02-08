import { Member, Resolvers, Room } from "../../../generated"
import { redisClient } from '../../../../redis'
import { config } from "../../../../config"
import { getDeck } from "../../../../services"

export const createRoom: Resolvers['Mutation']['createRoom'] = async (parent, args, context) => {

  const { id: userId } = context.user
  const { deckId, name } = args.input

  const client = redisClient()
  const deck = await getDeck({userId, id: deckId})

  const { cards } = deck

  // Generate Room Code
  let code = ''
  let exist = true
  while (exist) {
    code = Math.random().toString(36).substr(2, 6).toUpperCase()
    const currentRoom = await client.get(`room:${code}`)
    if (!currentRoom) {
      exist = false
    }
  }

  const room: Room = {
    code,
    hostUserId: userId,
    cards,
    members: [{
      name,
      userId
    } as Member]
  }

  // run redis in "transaction"
  await client.multi()
    .setex(`room:${code}`,config.get('ROOM_TTL_SECONDS'), JSON.stringify(room))
    .setex(`user-room:${userId}`, config.get('ROOM_TTL_SECONDS'), code)
    .exec()

  return room

}
