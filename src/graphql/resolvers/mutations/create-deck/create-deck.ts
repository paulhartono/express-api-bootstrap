import { Card, Resolvers } from "../../../generated"
import { redisClient } from '../../../../redis'
import { config } from "../../../../config"
import { v4 as uuidv4 } from 'uuid'
import errcode from 'err-code'

export const createDeck: Resolvers['Mutation']['createDeck'] = async (parent, args, context) => {

  const { id: userId } = context.user
  const { name, cards: inputCards, visibility } = args.input

  const cards = inputCards.map<Card>(card => {
    return { ...card, id: uuidv4() }
  })

  const client = redisClient()

  const cacheDeck = `deck:${userId}`

  const countCacheDeck = await client.hlen(cacheDeck)
  if (countCacheDeck > config.get('MAX_CACHE_DECK')) {
    throw errcode(new Error(`Deck max limit has been reached`), 'DeckMaxLimitError')
  }

  // create deck instance
  const deckId = uuidv4()
  const newDeck = {id: deckId, name, cards, visibility}

  // Insert to user's deck hash
  client.hset(cacheDeck, deckId, JSON.stringify(newDeck))

  // Reset expiry on this user's deck hash
  client.expire(cacheDeck, config.get('FREE_DECK_TTL_SECONDS'))

  return deckId
}
