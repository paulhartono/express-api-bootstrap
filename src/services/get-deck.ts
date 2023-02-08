import { redisClient } from '../redis'
import errcode from 'err-code'
import { Deck } from '../graphql/generated'

export const getDeck = async (args: { id: string, userId: string}) => {

  const { userId, id } = args

  const client = redisClient()

  // Find deck
  const deckJson = await client.hget(`deck:${userId}`, id)
  if (!deckJson) {
    throw errcode(new Error(`Deck not found`), 'DeckNotFoundError')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...deck } = JSON.parse(deckJson) as Deck

  return deck

}
