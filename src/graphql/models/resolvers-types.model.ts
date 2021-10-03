import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import {Context} from './context.model';
export type Maybe<T> = T | null;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & {[P in K]-?: NonNullable<T[P]>};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** `ISO 8601` date format. E.g: 2021-08-09T09:45:16.696Z */
  Date: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** Password scalar custom type */
  Password: any;
  /** Integers that will have a value greater than 0. */
  PositiveInt: any;
  /** Required string scalar custom type */
  RequiredString: any;
};

export type ActionInput = {
  name: Scalars['RequiredString'];
  permissions: Array<Scalars['RequiredString']>;
};

/** Authentication data model */
export type Auth = {
  __typename?: 'Auth';
  accessToken: Scalars['String'];
  accessTokenExpire?: Maybe<Scalars['Int']>;
  refreshToken: Scalars['String'];
  refreshTokenExpire?: Maybe<Scalars['Int']>;
};

/** Authentication input model */
export type AuthInput = {
  email: Scalars['EmailAddress'];
  password: Scalars['Password'];
};

export type Authorization = {
  __typename?: 'Authorization';
  actions?: Maybe<Array<Maybe<UserAction>>>;
  createdAt?: Maybe<Scalars['Date']>;
  id?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['Date']>;
  userId?: Maybe<Scalars['ID']>;
};

export type AuthorizationInput = {
  actions: Array<Maybe<ActionInput>>;
  userId?: Maybe<Scalars['ID']>;
};

export type CreateUserInput = {
  avatar?: Maybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password: Scalars['Password'];
};

/**
 * Input configuration to gather or arrange a list in their proper sequence. You can set filtering,sorting,paginating arguments for more specification.
 * This configuration applied on queries with a prefixed name of `list*`
 */
export type ListUsersCollateInput = {
  filter?: Maybe<UsersFilterInput>;
  paginate?: Maybe<PaginationInput>;
  sort?: Maybe<SortingByFieldInput>;
};

export type Message = {
  __typename?: 'Message';
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
  updateAuthorization?: Maybe<Authorization>;
  updateUser?: Maybe<User>;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationUpdateAuthorizationArgs = {
  input: AuthorizationInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

/**
 * Pagination input config. An object of `page`, `size` properties is required to apply pagination.
 *
 * Minimum number for `page` is 1.
 *
 * Min number for `size` is 10.
 *
 * Max number for `size` is 50.
 */
export type PaginationInput = {
  page: Scalars['PositiveInt'];
  size: Scalars['PositiveInt'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  clearTokens?: Maybe<Message>;
  createTokens?: Maybe<Auth>;
  getUser?: Maybe<User>;
  getUserAuthorization?: Maybe<Authorization>;
  listUsers?: Maybe<Array<Maybe<User>>>;
  refreshTokens?: Maybe<Auth>;
  verifyMe?: Maybe<VerifyToken>;
};

export type QueryCreateTokensArgs = {
  input: AuthInput;
};

export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type QueryGetUserAuthorizationArgs = {
  id: Scalars['ID'];
};

export type QueryListUsersArgs = {
  input?: Maybe<ListUsersCollateInput>;
};

/** Single sorting configuration by field name and direction. An object of `key` `direction` properties is required when applying for sorting. */
export type SortingByFieldInput = {
  createdAt?: Maybe<SortingEnum>;
  email?: Maybe<SortingEnum>;
  firstName?: Maybe<SortingEnum>;
  gender?: Maybe<SortingEnum>;
  id?: Maybe<SortingEnum>;
  lastName?: Maybe<SortingEnum>;
  updatedAt?: Maybe<SortingEnum>;
};

export enum SortingEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type UpdateUserInput = {
  avatar?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
};

/** User data model */
export type User = {
  __typename?: 'User';
  address?: Maybe<UserAddress>;
  authorizationId?: Maybe<Scalars['ID']>;
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  email?: Maybe<Scalars['EmailAddress']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isActive?: Maybe<Scalars['Boolean']>;
  isSuper?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Username>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type UserAction = {
  __typename?: 'UserAction';
  name?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** User address data model */
export type UserAddress = {
  __typename?: 'UserAddress';
  city?: Maybe<Scalars['String']>;
  house?: Maybe<Scalars['String']>;
  lane?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  subdivision?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

/** Username data model */
export type Username = {
  __typename?: 'Username';
  first?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['String']>;
};

export type UsernameInput = {
  first?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['String']>;
};

/** Filtering configuration by fields. */
export type UsersFilterInput = {
  _and?: Maybe<Array<Maybe<UsersFilterInput>>>;
  _eq?: Maybe<UsersFilterInput>;
  _gt?: Maybe<UsersFilterInput>;
  _gte?: Maybe<UsersFilterInput>;
  _in?: Maybe<Array<Maybe<UsersFilterInput>>>;
  _lt?: Maybe<UsersFilterInput>;
  _lte?: Maybe<UsersFilterInput>;
  _neq?: Maybe<UsersFilterInput>;
  _nin?: Maybe<Array<Maybe<UsersFilterInput>>>;
  _or?: Maybe<Array<Maybe<UsersFilterInput>>>;
  createAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['EmailAddress']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<UsernameInput>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type VerifyToken = {
  __typename?: 'VerifyToken';
  actions?: Maybe<Array<Maybe<UserAction>>>;
  id?: Maybe<Scalars['ID']>;
  isSuper?: Maybe<Scalars['Boolean']>;
};

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    {[key in TKey]: TResult},
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    {[key in TKey]: TResult},
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ActionInput: ActionInput;
  Auth: ResolverTypeWrapper<Auth>;
  AuthInput: AuthInput;
  Authorization: ResolverTypeWrapper<Authorization>;
  AuthorizationInput: AuthorizationInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateUserInput: CreateUserInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  ListUsersCollateInput: ListUsersCollateInput;
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInput: PaginationInput;
  Password: ResolverTypeWrapper<Scalars['Password']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>;
  Query: ResolverTypeWrapper<{}>;
  RequiredString: ResolverTypeWrapper<Scalars['RequiredString']>;
  SortingByFieldInput: SortingByFieldInput;
  SortingEnum: SortingEnum;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserAction: ResolverTypeWrapper<UserAction>;
  UserAddress: ResolverTypeWrapper<UserAddress>;
  Username: ResolverTypeWrapper<Username>;
  UsernameInput: UsernameInput;
  UsersFilterInput: UsersFilterInput;
  VerifyToken: ResolverTypeWrapper<VerifyToken>;
  _Service: ResolverTypeWrapper<_Service>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ActionInput: ActionInput;
  Auth: Auth;
  AuthInput: AuthInput;
  Authorization: Authorization;
  AuthorizationInput: AuthorizationInput;
  Boolean: Scalars['Boolean'];
  CreateUserInput: CreateUserInput;
  Date: Scalars['Date'];
  EmailAddress: Scalars['EmailAddress'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  ListUsersCollateInput: ListUsersCollateInput;
  Message: Message;
  Mutation: {};
  PaginationInput: PaginationInput;
  Password: Scalars['Password'];
  PositiveInt: Scalars['PositiveInt'];
  Query: {};
  RequiredString: Scalars['RequiredString'];
  SortingByFieldInput: SortingByFieldInput;
  String: Scalars['String'];
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserAction: UserAction;
  UserAddress: UserAddress;
  Username: Username;
  UsernameInput: UsernameInput;
  UsersFilterInput: UsersFilterInput;
  VerifyToken: VerifyToken;
  _Service: _Service;
}>;

export type ExtendsDirectiveArgs = {};

export type ExtendsDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = ExtendsDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ExternalDirectiveArgs = {};

export type ExternalDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = ExternalDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type KeyDirectiveArgs = {
  fields: Scalars['String'];
};

export type KeyDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = KeyDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ProvidesDirectiveArgs = {
  fields: Scalars['String'];
};

export type ProvidesDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = ProvidesDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RequiresDirectiveArgs = {
  fields: Scalars['String'];
};

export type RequiresDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = RequiresDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']
> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  accessTokenExpire?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshTokenExpire?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthorizationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Authorization'] = ResolversParentTypes['Authorization']
> = ResolversObject<{
  actions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['UserAction']>>>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export type MessageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']
> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  createUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >;
  updateAuthorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAuthorizationArgs, 'input'>
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >;
}>;

export interface PasswordScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Password'], any> {
  name: 'Password';
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _service?: Resolver<ResolversTypes['_Service'], ParentType, ContextType>;
  clearTokens?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType
  >;
  createTokens?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType,
    RequireFields<QueryCreateTokensArgs, 'input'>
  >;
  getUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUserArgs, 'id'>
  >;
  getUserAuthorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUserAuthorizationArgs, 'id'>
  >;
  listUsers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['User']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryListUsersArgs, never>
  >;
  refreshTokens?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType
  >;
  verifyMe?: Resolver<
    Maybe<ResolversTypes['VerifyToken']>,
    ParentType,
    ContextType
  >;
}>;

export interface RequiredStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['RequiredString'], any> {
  name: 'RequiredString';
}

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  address?: Resolver<
    Maybe<ResolversTypes['UserAddress']>,
    ParentType,
    ContextType
  >;
  authorizationId?: Resolver<
    Maybe<ResolversTypes['ID']>,
    ParentType,
    ContextType
  >;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<
    Maybe<ResolversTypes['EmailAddress']>,
    ParentType,
    ContextType
  >;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isActive?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  isSuper?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['Username']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserActionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['UserAction'] = ResolversParentTypes['UserAction']
> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAddressResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['UserAddress'] = ResolversParentTypes['UserAddress']
> = ResolversObject<{
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  house?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lane?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subdivision?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  zip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsernameResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Username'] = ResolversParentTypes['Username']
> = ResolversObject<{
  first?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VerifyTokenResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['VerifyToken'] = ResolversParentTypes['VerifyToken']
> = ResolversObject<{
  actions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['UserAction']>>>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isSuper?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _ServiceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['_Service'] = ResolversParentTypes['_Service']
> = ResolversObject<{
  sdl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Auth?: AuthResolvers<ContextType>;
  Authorization?: AuthorizationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Password?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RequiredString?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserAction?: UserActionResolvers<ContextType>;
  UserAddress?: UserAddressResolvers<ContextType>;
  Username?: UsernameResolvers<ContextType>;
  VerifyToken?: VerifyTokenResolvers<ContextType>;
  _Service?: _ServiceResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  extends?: ExtendsDirectiveResolver<any, any, ContextType>;
  external?: ExternalDirectiveResolver<any, any, ContextType>;
  key?: KeyDirectiveResolver<any, any, ContextType>;
  provides?: ProvidesDirectiveResolver<any, any, ContextType>;
  requires?: RequiresDirectiveResolver<any, any, ContextType>;
}>;
