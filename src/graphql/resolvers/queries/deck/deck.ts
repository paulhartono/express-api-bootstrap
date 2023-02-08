import { Resolvers } from '../../../generated'
import { getDeck } from '../../../../services'

export const deck: Resolvers['Query']['deck'] = async (_parent, args, context) => {

  const { id: userId } = context.user
  const { id } = args

  console.log(userId)

  return getDeck({userId, id})
}
