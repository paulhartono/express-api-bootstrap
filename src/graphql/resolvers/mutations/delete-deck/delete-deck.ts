import { Resolvers } from "../../../generated"
import { redisClient } from '../../../../redis'
import { config } from '../../../../config'

export const deleteDeck: Resolvers['Mutation']['deleteDeck'] = async (parent, args, context) => {

  const { id: userId } = context.user
  const { id } = args

  const client = redisClient()

  const cacheDeck = `deck:${userId}`

  const deleted = await client.hdel(cacheDeck, id)
  if (!deleted) {
    // throw errcode(new Error(`deck not found`), 'DeckNotFoundError')
    return false
  }

  // Extend expiry on this user's deck hash
  client.expire(cacheDeck, config.get('FREE_DECK_TTL_SECONDS'))

  return true
}
