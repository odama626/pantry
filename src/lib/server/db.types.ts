/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Households = "households",
	Items = "items",
	Tags = "tags",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type HouseholdsRecord = {
	name?: string
	people?: RecordIdString[]
}

export type ItemsRecord = {
	name: string
	tags?: RecordIdString[]
	household?: RecordIdString
	code: string
	stored?: string
	description?: HTMLString
}

export type TagsRecord = {
	name?: string
	icon?: string
	custom?: boolean
}

export type UsersRecord = {
	name?: string
	avatar?: string
	invited?: boolean
	household: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type HouseholdsResponse<Texpand = unknown> = HouseholdsRecord & BaseSystemFields<Texpand>
export type ItemsResponse<Texpand = unknown> = ItemsRecord & BaseSystemFields<Texpand>
export type TagsResponse = TagsRecord & BaseSystemFields
export type UsersResponse<Texpand = unknown> = UsersRecord & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	households: HouseholdsRecord
	items: ItemsRecord
	tags: TagsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	households: HouseholdsResponse
	items: ItemsResponse
	tags: TagsResponse
	users: UsersResponse
}