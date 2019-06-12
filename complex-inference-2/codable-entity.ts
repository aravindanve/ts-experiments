type EntityDescriptor =
  PrimitiveEntityDescriptor |
  ArrayDescriptor<EntityDescriptorArray> |
  ObjectDescriptor<EntityDescriptorMap>

type EntityDescriptorMap = { [key: string]: EntityDescriptor }
type EntityDescriptorArray = { items: EntityDescriptor }

type PrimitiveEntityDescriptor =
  BooleanDescriptor |
  NumberDescriptor |
  StringDescriptor

type BooleanDescriptor = { booleanType: true }
type NumberDescriptor = { numberType: true }
type StringDescriptor = { stringType: true }
type ObjectDescriptor<T extends EntityDescriptorMap> = { objectType: true, properties: T }
type ArrayDescriptor<T extends EntityDescriptorArray> = { arrayType: true, items: T['items'] }

type Optional<T> = T & { optional: true }
type Nullable<T> = T & { nullable: true }

type MetaDescriptor = {
  optional?: boolean
  nullable?: boolean
}

type TypeFromDescriptor<T> =
  T extends Optional<Nullable<T>> ? ComplexTypeFromDescriptor<T> | undefined | null :
  T extends Optional<T> ? ComplexTypeFromDescriptor<T> | undefined :
  T extends Nullable<T> ? ComplexTypeFromDescriptor<T> | null :
  ComplexTypeFromDescriptor<T>

type PrimitiveTypeFromDescriptor<T> =
  T extends BooleanDescriptor ? boolean :
  T extends NumberDescriptor ? number :
  T extends StringDescriptor ? string :
  unknown

type ComplexTypeFromDescriptor<T> =
  T extends ArrayDescriptor<infer I> ? ComplexTypeFromDescriptorMap<I>['items'][] :
  T extends ObjectDescriptor<infer M> ? ComplexTypeFromDescriptorMap<M> :
  PrimitiveTypeFromDescriptor<T>

type ComplexTypeFromDescriptorMap<T> =
  T extends object ? { [K in keyof T]: TypeFromDescriptor<T[K]> } : unknown

type TypeFromMeta<M extends MetaDescriptor, T> =
  M extends { optional: true, nullable: true } ? Optional<Nullable<T>> :
  M extends { optional: true } ? Optional<T> :
  M extends { nullable: true } ? Nullable<T> :
  T

type EntityFactory<T> = { (): T }

type EntityConfiguratorReturnType<M extends MetaDescriptor, T> =
  TypeFromMeta<M, T> & EntityFactory<TypeFromDescriptor<TypeFromMeta<M, T>>>

namespace Entity {
  export function Boolean<M extends MetaDescriptor>(meta?: M): EntityConfiguratorReturnType<M, BooleanDescriptor> {
    throw new Error('Not implemented')
  }

  export function Number<M extends MetaDescriptor>(meta?: M): EntityConfiguratorReturnType<M, NumberDescriptor> {
    throw new Error('Not implemented')
  }

  export function String<M extends MetaDescriptor>(meta?: M): EntityConfiguratorReturnType<M, StringDescriptor> {
    throw new Error('Not implemented')
  }

  export function Object<T extends EntityDescriptorMap, M extends MetaDescriptor>(
    descriptors: T, meta?: M): EntityConfiguratorReturnType<M, ObjectDescriptor<T>> {
    throw new Error('Not implemented')
  }

  export function Array<T extends EntityDescriptor, M extends MetaDescriptor>(
    descriptor: T, meta?: M): EntityConfiguratorReturnType<M, ArrayDescriptor<{ items: T }>> {
    throw new Error('Not implemented')
  }
}

const someBoolean /* :boolean */ = Entity.Boolean()()
const someOptionalBoolean /* :boolean | undefined */ = Entity.Boolean({ optional: true })()
const someNullableBoolean /* :boolean | null */ = Entity.Boolean({ nullable: true })()
const someOptionalNullableBoolean /* :boolean | null | undefined */ = Entity.Boolean({ optional: true, nullable: true })()

const someNumber /* :number */ = Entity.Number()()
const someOptionalNumber /* :number | undefined */ = Entity.Number({ optional: true })()
const someNullableNumber /* :number | null */ = Entity.Number({ nullable: true })()
const someOptionalNullableNumber /* :number | null | undefined */ = Entity.Number({ optional: true, nullable: true })()

const someString /* :string */ = Entity.String()()
const someOptionalString /* :string | undefined */ = Entity.String({ optional: true })()
const someNullableString /* :string | null */ = Entity.String({ nullable: true })()
const someOptionalNullableString /* :string | null | undefined */ = Entity.String({ optional: true, nullable: true })()

const someObject /* :{ name: string } */ = Entity.Object({ name: Entity.String() })()
const someObjectWithOptionalProperty /* :{ name: string | undefined } */ = Entity.Object({ name: Entity.String({ optional: true }) })()
const someObjectWithNullableProperty /* :{ name: string | null } */ = Entity.Object({ name: Entity.String({ nullable: true }) })()
const someObjectWithOptionalNullableProperty /* :{ name: string | undefined | null } */ = Entity.Object({ name: Entity.String({ optional: true, nullable: true }) })()
const someOptionalObject /* :{ name: string } | undefined */ = Entity.Object({ name: Entity.String() }, { optional: true })()
const someNullableObject /* :{ name: string } | null */ = Entity.Object({ name: Entity.String() }, { nullable: true })()
const someOptionalNullableObject /* :{ name: string } | undefined | null */ = Entity.Object({ name: Entity.String() }, { optional: true, nullable: true })()

const someStringArray /* :string[] */ = Entity.Array(Entity.String())()
const someOptionalStringArray /* :FIXME */ = Entity.Array(Entity.String(), { optional: true })()
const someNullableStringArray /* :FIXME */ = Entity.Array(Entity.String(), { nullable: true })()
const someOptionalNullableStringArray /* :FIXME */ = Entity.Array(Entity.String(), { optional: true, nullable: true })()

const SomeEntity = Entity.Object({
  id: Entity.Number(),
  displayName: Entity.String(),
  isDefault: Entity.Boolean(),
  isPrivate: Entity.Boolean({ optional: true, nullable: true }),
  info: Entity.Object({
    phone: Entity.String()
  }),
  roles: Entity.Array(Entity.Object({
    id: Entity.Number(),
    displayName: Entity.String(),
    isPrivate: Entity.Boolean({ optional: true, nullable: true })
  }))
})

const someEntity /* :FIXME */ = SomeEntity()
