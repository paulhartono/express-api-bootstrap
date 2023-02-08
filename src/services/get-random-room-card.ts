import { getRoom } from './get-room'
import errcode from 'err-code'

export const getRandomRoomCard = async (roomCode: string) => {
  const room = await getRoom(roomCode)

  const availableCards = room.cards.filter(card => card.count > 0 || card.count === -1)
  if (availableCards.length === 0) {
    throw errcode(new Error(`No cards available in the room`), 'NoRoomCardsAvailable')
  }

  // generate random integer up to the number of availableCards length
  const random = Math.floor(Math.random() * (availableCards.length+1));

  return availableCards[random]
}
