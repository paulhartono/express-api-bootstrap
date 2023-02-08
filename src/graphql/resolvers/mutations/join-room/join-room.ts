import { Resolvers } from "../../../generated"
import * as service from '../../../../services'

export const joinRoom: Resolvers['Mutation']['joinRoom'] = async (parent, args, context) => {

  const { id: userId } = context.user
  const { name, code } = args.input

  const room = await service.joinRoom({code, name, userId})

  return room

}
