import { createDeck } from "./create-deck";
import { createRoom } from "./create-room";
import { deleteDeck } from './delete-deck';
import { joinRoom } from './join-room';
import { pickCard } from './pick-card';

export const Mutation = {
  createRoom,
  joinRoom,
  createDeck,
  deleteDeck,
  pickCard
}
