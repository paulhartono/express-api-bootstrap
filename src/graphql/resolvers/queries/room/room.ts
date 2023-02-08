import { Resolvers } from '../../../generated'
import { getRoom } from '../../../../services/get-room'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const room: Resolvers['Query']['room'] = async (_parent, args) => {

  const { code } = args

  return await getRoom(code)

}
