/* eslint-disable */
/**************************************************/
/* This is an auto generated file. DO NOT Touch! */
import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from './types';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Card = {
  __typename?: 'Card';
  count: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  pictureUrl?: Maybe<Scalars['String']>;
};

export type CardInput = {
  count: Scalars['Int'];
  name: Scalars['String'];
  pictureUrl: Maybe<Scalars['String']>;
};

export type CreateDeckInput = {
  cards: Array<CardInput>;
  name: Scalars['String'];
  visibility: Visibility;
};

export type CreateRoomInput = {
  deckId: Scalars['ID'];
  name: Scalars['String'];
};

export type Deck = {
  __typename?: 'Deck';
  cards: Array<Card>;
  id: Scalars['ID'];
  name: Scalars['String'];
  visibility?: Maybe<Visibility>;
};

export type HealthCheck = {
  __typename?: 'HealthCheck';
  uptime: Scalars['Float'];
};

export type JoinRoomInput = {
  code: Scalars['String'];
  name: Scalars['String'];
};

export type Member = {
  __typename?: 'Member';
  card?: Maybe<Card>;
  name: Scalars['String'];
  userId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createDeck: Scalars['ID'];
  createRoom: Room;
  deleteDeck: Scalars['Boolean'];
  joinRoom: Room;
  pickCard: Card;
};


export type MutationCreateDeckArgs = {
  input: CreateDeckInput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationDeleteDeckArgs = {
  id: Scalars['ID'];
};


export type MutationJoinRoomArgs = {
  input: JoinRoomInput;
};


export type MutationPickCardArgs = {
  roomCode: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  deck: Deck;
  healthCheck: HealthCheck;
  room: Room;
};


export type QueryDeckArgs = {
  id: Scalars['ID'];
};


export type QueryRoomArgs = {
  code: Scalars['String'];
};

export type Room = {
  __typename?: 'Room';
  cards: Array<Card>;
  code: Scalars['String'];
  discardedCards?: Maybe<Array<Card>>;
  hostUserId: Scalars['String'];
  members?: Maybe<Array<Member>>;
};

export enum Visibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Card: ResolverTypeWrapper<Card>;
  CardInput: CardInput;
  CreateDeckInput: CreateDeckInput;
  CreateRoomInput: CreateRoomInput;
  Deck: ResolverTypeWrapper<Deck>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  HealthCheck: ResolverTypeWrapper<HealthCheck>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JoinRoomInput: JoinRoomInput;
  Member: ResolverTypeWrapper<Member>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Room: ResolverTypeWrapper<Room>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Visibility: Visibility;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Card: Card;
  CardInput: CardInput;
  CreateDeckInput: CreateDeckInput;
  CreateRoomInput: CreateRoomInput;
  Deck: Deck;
  Float: Scalars['Float'];
  HealthCheck: HealthCheck;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JoinRoomInput: JoinRoomInput;
  Member: Member;
  Mutation: {};
  Query: {};
  Room: Room;
  String: Scalars['String'];
};

export type CardResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = {
  count: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pictureUrl: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeckResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Deck'] = ResolversParentTypes['Deck']> = {
  cards: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visibility: Resolver<Maybe<ResolversTypes['Visibility']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthCheckResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HealthCheck'] = ResolversParentTypes['HealthCheck']> = {
  uptime: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  card: Resolver<Maybe<ResolversTypes['Card']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createDeck: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationCreateDeckArgs, 'input'>>;
  createRoom: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationCreateRoomArgs, 'input'>>;
  deleteDeck: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDeckArgs, 'id'>>;
  joinRoom: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationJoinRoomArgs, 'input'>>;
  pickCard: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationPickCardArgs, 'roomCode'>>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  deck: Resolver<ResolversTypes['Deck'], ParentType, ContextType, RequireFields<QueryDeckArgs, 'id'>>;
  healthCheck: Resolver<ResolversTypes['HealthCheck'], ParentType, ContextType>;
  room: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<QueryRoomArgs, 'code'>>;
};

export type RoomResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  cards: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  code: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  discardedCards: Resolver<Maybe<Array<ResolversTypes['Card']>>, ParentType, ContextType>;
  hostUserId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members: Resolver<Maybe<Array<ResolversTypes['Member']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Card: CardResolvers<ContextType>;
  Deck: DeckResolvers<ContextType>;
  HealthCheck: HealthCheckResolvers<ContextType>;
  Member: MemberResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Room: RoomResolvers<ContextType>;
};

