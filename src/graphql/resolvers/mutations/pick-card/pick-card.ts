import { Resolvers } from "../../../generated"
import * as service from '../../../../services'
import errcode from 'err-code'
import { redisClient } from '../../../../redis'
import { config } from '../../../../config'

export const pickCard: Resolvers['Mutation']['pickCard'] = async (parent, args, context) => {

  const { id: userId } = context.user
  const { roomCode } = args

  const room = await service.getRoom(roomCode)

  if (!room.members) {
    throw errcode(new Error(`Room has no member`), 'NoMembersInRoomError')
  }

  const pickedCard = await service.getRandomRoomCard(roomCode)

  const userMember = room.members.find(member => member.userId === userId)
  if (!userMember) {
    throw errcode(new Error(`User member not found in room`), 'UserMemberNotFoundError')
  }

  // Update member's card in the room
  const updatedRoomMembers = room.members.map(member => {
    if (member.userId === userMember.userId) member.card = pickedCard
    return member
  })
  room.members = updatedRoomMembers

  // deduct card count that has been picked
  const updatedRoomCards = room.cards.map(card => {
    if (card.id === pickedCard.id && card.count > 0) {
      card.count = card.count - 1

      // remove from cards to discard
      if (card.count === 0) {
      }
    }
    return card
  })
  room.cards = updatedRoomCards

  // update room
  const client = redisClient()
  client.setex(`room:${room.code}`,config.get('ROOM_TTL_SECONDS'), JSON.stringify(room))

  return pickedCard
}
