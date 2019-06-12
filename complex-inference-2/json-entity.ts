namespace Entity {
  export type Descriptor =
    PrimitiveDescriptor |
    ArrayDescriptor<UnkeyedContainerDescriptor> |
    ObjectDescriptor<KeyedContainerDescriptor>

  export type KeyedContainerDescriptor = { [key: string]: Descriptor }
  export type UnkeyedContainerDescriptor = { items: Descriptor }

  export type PrimitiveDescriptor =
    BooleanDescriptor |
    NumberDescriptor |
    StringDescriptor

  export type BooleanDescriptor = { booleanType: true }
  export type NumberDescriptor = { numberType: true }
  export type StringDescriptor = { stringType: true }
  export type ObjectDescriptor<T extends KeyedContainerDescriptor> = { objectType: true, properties: T }
  export type ArrayDescriptor<T extends UnkeyedContainerDescriptor> = { arrayType: true } & T

  export type Optional<T> = T & { optional: true }
  export type Nullable<T> = T & { nullable: true }

  export type MetaDescriptor = {
    optional?: boolean
    nullable?: boolean
  }

  export type TypeFromDescriptor<T> =
    T extends Optional<Nullable<infer T1>> ? ComplexTypeFromDescriptor<T1> | undefined | null :
    T extends Optional<infer T2> ? ComplexTypeFromDescriptor<T2> | undefined :
    T extends Nullable<infer T3> ? ComplexTypeFromDescriptor<T3> | null :
    ComplexTypeFromDescriptor<T>

  export type PrimitiveTypeFromDescriptor<T> =
    T extends BooleanDescriptor ? boolean :
    T extends NumberDescriptor ? number :
    T extends StringDescriptor ? string :
    unknown

  export type ComplexTypeFromDescriptor<T> =
    T extends ArrayDescriptor<infer T1> ? ComplexTypeFromDescriptorMap<T1>['items'][] :
    T extends ObjectDescriptor<infer T2> ? ComplexTypeFromDescriptorMap<T2> :
    PrimitiveTypeFromDescriptor<T>

  export type ComplexTypeFromDescriptorMap<T> =
    T extends object ? { [K in keyof T]: TypeFromDescriptor<T[K]> } : unknown

  export type DescriptorWithMeta<M extends MetaDescriptor, T> =
    M extends { optional: true, nullable: true } ? Optional<Nullable<T>> :
    M extends { optional: true } ? Optional<T> :
    M extends { nullable: true } ? Nullable<T> :
    T

  export type Factory<T> = { (): T }

  export type MetaFactoryReturnType<M extends MetaDescriptor, T> =
    DescriptorWithMeta<M, T> &
    Factory<TypeFromDescriptor<DescriptorWithMeta<M, T>>>

  export function Boolean<M extends MetaDescriptor>(meta?: M): MetaFactoryReturnType<M, BooleanDescriptor> {
    throw new Error('Not implemented')
  }

  export function Number<M extends MetaDescriptor>(meta?: M): MetaFactoryReturnType<M, NumberDescriptor> {
    throw new Error('Not implemented')
  }

  export function String<M extends MetaDescriptor>(meta?: M): MetaFactoryReturnType<M, StringDescriptor> {
    throw new Error('Not implemented')
  }

  export function Object<T extends KeyedContainerDescriptor, M extends MetaDescriptor>(
    descriptors: T, meta?: M): MetaFactoryReturnType<M, ObjectDescriptor<T>> {
    throw new Error('Not implemented')
  }

  export function Array<T extends Descriptor, M extends MetaDescriptor>(
    descriptor: T, meta?: M): MetaFactoryReturnType<M, ArrayDescriptor<{ items: T }>> {
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
const someOptionalStringArray /* :string[] | undefined */ = Entity.Array(Entity.String(), { optional: true })()
const someNullableStringArray /* :string[] | null */ = Entity.Array(Entity.String(), { nullable: true })()
const someOptionalNullableStringArray /* :string[] | null | undefined */ = Entity.Array(Entity.String(), { optional: true, nullable: true })()

const someObjectArray /* :{ name: string }[] */ = Entity.Array(Entity.Object({ name: Entity.String() }))()
const someOptionalObjectArray /* :{ name: string }[] | undefined */ = Entity.Array(Entity.Object({ name: Entity.String() }), { optional: true })()
const someNullableObjectArray /* :{ name: string }[] | null */ = Entity.Array(Entity.Object({ name: Entity.String() }), { nullable: true })()
const someOptionalNullableObjectArray /* :{ name: string }[] | undefined | null */ = Entity.Array(Entity.Object({ name: Entity.String() }), { optional: true, nullable: true })()

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

const someEntity /* :{
    id: number;
    displayName: string;
    isDefault: boolean;
    isPrivate: boolean | null | undefined;
    info: {
        phone: string;
    };
    roles: {
        id: number;
        displayName: string;
        isPrivate: boolean | null | undefined;
    }[];
} */ = SomeEntity()
