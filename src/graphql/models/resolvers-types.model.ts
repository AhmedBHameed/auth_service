import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import {Context} from './context.model';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  EmailAddress: any;
  Password: any;
  PositiveInt: any;
  RequiredString: any;
  _Any: any;
};

export type ActionInput = {
  name?: InputMaybe<Scalars['RequiredString']>;
  permissions?: InputMaybe<Array<Scalars['RequiredString']>>;
};

/** Authentication data model */
export type Auth = {
  __typename?: 'Auth';
  accessToken: Scalars['String'];
  accessTokenExpire?: Maybe<Scalars['Int']>;
  refreshToken: Scalars['String'];
  refreshTokenExpire?: Maybe<Scalars['Int']>;
};

export type AuthInput = {
  email: Scalars['EmailAddress'];
  password: Scalars['Password'];
  rememberMe?: InputMaybe<Scalars['Boolean']>;
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
  actions: Array<ActionInput>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type CreateUserInput = {
  avatar?: InputMaybe<Scalars['String']>;
  email: Scalars['EmailAddress'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['Password'];
};

export type Message = {
  __typename?: 'Message';
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
  forgotPassword?: Maybe<Message>;
  /** Set user access to forbidden. User in this case should reset their password to reactivate and change password. */
  invalidateUserToken?: Maybe<Message>;
  mutator?: Maybe<Mutator>;
  resetPassword?: Maybe<Message>;
  signup?: Maybe<Message>;
  updateUser?: Maybe<User>;
  upsertAuthorization?: Maybe<Authorization>;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars['EmailAddress'];
};

export type MutationInvalidateUserTokenArgs = {
  userId: Scalars['ID'];
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationSignupArgs = {
  input: SignupInput;
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type MutationUpsertAuthorizationArgs = {
  input: AuthorizationInput;
};

export type Mutator = {
  __typename?: 'Mutator';
  about?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isSuper?: Maybe<Scalars['Boolean']>;
  occupation?: Maybe<Scalars['String']>;
  userActionsAsJson: Scalars['String'];
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
  number: Scalars['PositiveInt'];
  size: Scalars['PositiveInt'];
};

export type Querier = {
  __typename?: 'Querier';
  about?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isSuper?: Maybe<Scalars['Boolean']>;
  occupation?: Maybe<Scalars['String']>;
  userActionsAsJson: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  clearTokens?: Maybe<Message>;
  createTokens?: Maybe<Auth>;
  getUser?: Maybe<User>;
  getUserAuthorization?: Maybe<Authorization>;
  githubLogin?: Maybe<Auth>;
  listUsers?: Maybe<Array<Maybe<User>>>;
  querier?: Maybe<Querier>;
  refreshTokens?: Maybe<Auth>;
  verifyMe?: Maybe<User>;
};

export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
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

export type QueryGithubLoginArgs = {
  code: Scalars['ID'];
};

export type QueryListUsersArgs = {
  query?: InputMaybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  hash: Scalars['String'];
  newPassword: Scalars['Password'];
};

export type SignupInput = {
  email: Scalars['EmailAddress'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['Password'];
};

/** Single sorting configuration by field name and direction. An object of `key` `direction` properties is required when applying for sorting. */
export type SortingByFieldInput = {
  createdAt?: InputMaybe<SortingEnum>;
  email?: InputMaybe<SortingEnum>;
  firstName?: InputMaybe<SortingEnum>;
  gender?: InputMaybe<SortingEnum>;
  id?: InputMaybe<SortingEnum>;
  lastName?: InputMaybe<SortingEnum>;
  updatedAt?: InputMaybe<SortingEnum>;
};

export enum SortingEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
};

/** User data model */
export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<UserAddress>;
  authorization?: Maybe<Authorization>;
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  email?: Maybe<Scalars['EmailAddress']>;
  gender?: Maybe<Scalars['String']>;
  githubUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isSuper?: Maybe<Scalars['Boolean']>;
  lastSeenAt?: Maybe<Scalars['Date']>;
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
  first?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['String']>;
};

/** Filtering configuration by fields. */
export type UsersFilterInput = {
  _and?: InputMaybe<Array<InputMaybe<UsersFilterInput>>>;
  _eq?: InputMaybe<UsersFilterInput>;
  _gt?: InputMaybe<UsersFilterInput>;
  _gte?: InputMaybe<UsersFilterInput>;
  _in?: InputMaybe<Array<InputMaybe<UsersFilterInput>>>;
  _lt?: InputMaybe<UsersFilterInput>;
  _lte?: InputMaybe<UsersFilterInput>;
  _neq?: InputMaybe<UsersFilterInput>;
  _nin?: InputMaybe<Array<InputMaybe<UsersFilterInput>>>;
  _or?: InputMaybe<Array<InputMaybe<UsersFilterInput>>>;
  createAt?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['EmailAddress']>;
  gender?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<UsernameInput>;
  updatedAt?: InputMaybe<Scalars['String']>;
};

export type _Entity = Mutator | Querier | User;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  Message: ResolverTypeWrapper<Message>;
  Mutation: ResolverTypeWrapper<{}>;
  Mutator: ResolverTypeWrapper<Mutator>;
  PaginationInput: PaginationInput;
  Password: ResolverTypeWrapper<Scalars['Password']>;
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>;
  Querier: ResolverTypeWrapper<Querier>;
  Query: ResolverTypeWrapper<{}>;
  RequiredString: ResolverTypeWrapper<Scalars['RequiredString']>;
  ResetPasswordInput: ResetPasswordInput;
  SignupInput: SignupInput;
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
  _Any: ResolverTypeWrapper<Scalars['_Any']>;
  _Entity:
    | ResolversTypes['Mutator']
    | ResolversTypes['Querier']
    | ResolversTypes['User'];
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
  Message: Message;
  Mutation: {};
  Mutator: Mutator;
  PaginationInput: PaginationInput;
  Password: Scalars['Password'];
  PositiveInt: Scalars['PositiveInt'];
  Querier: Querier;
  Query: {};
  RequiredString: Scalars['RequiredString'];
  ResetPasswordInput: ResetPasswordInput;
  SignupInput: SignupInput;
  SortingByFieldInput: SortingByFieldInput;
  String: Scalars['String'];
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserAction: UserAction;
  UserAddress: UserAddress;
  Username: Username;
  UsernameInput: UsernameInput;
  UsersFilterInput: UsersFilterInput;
  _Any: Scalars['_Any'];
  _Entity:
    | ResolversParentTypes['Mutator']
    | ResolversParentTypes['Querier']
    | ResolversParentTypes['User'];
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
  forgotPassword?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<MutationForgotPasswordArgs, 'email'>
  >;
  invalidateUserToken?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<MutationInvalidateUserTokenArgs, 'userId'>
  >;
  mutator?: Resolver<Maybe<ResolversTypes['Mutator']>, ParentType, ContextType>;
  resetPassword?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, 'input'>
  >;
  signup?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<MutationSignupArgs, 'input'>
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >;
  upsertAuthorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpsertAuthorizationArgs, 'input'>
  >;
}>;

export type MutatorResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Mutator'] = ResolversParentTypes['Mutator']
> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSuper?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  occupation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  userActionsAsJson?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface PasswordScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Password'], any> {
  name: 'Password';
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt';
}

export type QuerierResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Querier'] = ResolversParentTypes['Querier']
> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSuper?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  occupation?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  userActionsAsJson?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _entities?: Resolver<
    Array<Maybe<ResolversTypes['_Entity']>>,
    ParentType,
    ContextType,
    RequireFields<Query_EntitiesArgs, 'representations'>
  >;
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
  githubLogin?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType,
    RequireFields<QueryGithubLoginArgs, 'code'>
  >;
  listUsers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['User']>>>,
    ParentType,
    ContextType,
    Partial<QueryListUsersArgs>
  >;
  querier?: Resolver<Maybe<ResolversTypes['Querier']>, ParentType, ContextType>;
  refreshTokens?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType
  >;
  verifyMe?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export interface RequiredStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['RequiredString'], any> {
  name: 'RequiredString';
}

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<
    Maybe<ResolversTypes['UserAddress']>,
    ParentType,
    ContextType
  >;
  authorization?: Resolver<
    Maybe<ResolversTypes['Authorization']>,
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
  githubUrl?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  isSuper?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastSeenAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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

export interface _AnyScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['_Any'], any> {
  name: '_Any';
}

export type _EntityResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes['_Entity'] = ResolversParentTypes['_Entity']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'Mutator' | 'Querier' | 'User',
    ParentType,
    ContextType
  >;
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
  Mutator?: MutatorResolvers<ContextType>;
  Password?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  Querier?: QuerierResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RequiredString?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserAction?: UserActionResolvers<ContextType>;
  UserAddress?: UserAddressResolvers<ContextType>;
  Username?: UsernameResolvers<ContextType>;
  _Any?: GraphQLScalarType;
  _Entity?: _EntityResolvers<ContextType>;
  _Service?: _ServiceResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Context> = ResolversObject<{
  extends?: ExtendsDirectiveResolver<any, any, ContextType>;
  external?: ExternalDirectiveResolver<any, any, ContextType>;
  key?: KeyDirectiveResolver<any, any, ContextType>;
  provides?: ProvidesDirectiveResolver<any, any, ContextType>;
  requires?: RequiresDirectiveResolver<any, any, ContextType>;
}>;
