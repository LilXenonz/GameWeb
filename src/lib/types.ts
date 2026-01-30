import type { User, Character, Game } from '@prisma/client';

export type UserWithRelations = User & {
  characters: Character[];
  games: Game[];
};