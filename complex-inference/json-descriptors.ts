type Constructor<T> = Function & { new(...args: any[]): T }

type NullDescriptor = { readonly type: 'null' }
type BooleanDescriptor = { readonly type: 'boolean' }
type NumberDescriptor = { readonly type: 'number' }
type StringDescriptor = { readonly type: 'string' }
type ObjectDescriptor<T extends EntityDescriptorMap> = { readonly type: 'object'; properties: T }
type ArrayDescriptor<T extends EntityDescriptor> = { readonly type: 'array'; items: T }

type EntityDescriptor =
  PrimitiveEntityDescriptor |
  EntityArrayDescriptor |
  ObjectDescriptor<EntityDescriptorMap>

type PrimitiveEntityDescriptor =
  NullDescriptor |
  BooleanDescriptor |
  NumberDescriptor |
  StringDescriptor

interface EntityArrayDescriptor extends ArrayDescriptor<EntityDescriptor> { }

type EntityDescriptorMap = {
  [key: string]: EntityDescriptor | ArrayDescriptor<EntityDescriptor>;
}

type TypeFromDescriptor<T> =
  T extends ArrayDescriptor<infer I> ? ArrayTypeFromDescriptor<I> :
  T extends ObjectDescriptor<infer M> ? TypeFromDescriptorMap<M> :
  PrimitiveTypeFromDescriptor<T>

interface ArrayTypeFromDescriptor<T> extends Array<TypeFromDescriptor<T>> { }
// type ArrayTypeFromDescriptor<T> =
//   T extends object ? { [k: number]: TypeFromDescriptor<T> } : unknown

type TypeFromDescriptorMap<T> =
  T extends object ? { [K in keyof T]: TypeFromDescriptor<T[K]> } : unknown

type PrimitiveTypeFromDescriptor<T> =
  T extends NullDescriptor ? null :
  T extends BooleanDescriptor ? boolean :
  T extends NumberDescriptor ? number :
  T extends StringDescriptor ? string :
  unknown

type SomeDescriptorMap = {
  someNull: NullDescriptor;
  someBoolean: BooleanDescriptor;
  someNumber: NumberDescriptor;
  someString: StringDescriptor;
  someObject: ObjectDescriptor<{
    someNull: NullDescriptor;
    someBoolean: BooleanDescriptor;
    someNumber: NumberDescriptor;
    someString: StringDescriptor;
    someObject: ObjectDescriptor<{
      someNull: NullDescriptor;
      someBoolean: BooleanDescriptor;
      someNumber: NumberDescriptor;
      someString: StringDescriptor;
    }>;
  }>;
  someArray: ArrayDescriptor<StringDescriptor>;
}

type InferredType = TypeFromDescriptorMap<SomeDescriptorMap>

let inferredType!: InferredType /* = {
    someNull: null;
    someBoolean: boolean;
    someNumber: number;
    someString: string;
    someObject: {
        someNull: null;
        someBoolean: boolean;
        someNumber: number;
        someString: string;
        someObject: {
            someNull: null;
            someBoolean: boolean;
            someNumber: number;
            someString: string;
        };
    };
    someArray: ArrayTypeFromDescriptor<...>; // UGLY
} */

function Entity<M extends EntityDescriptorMap>(entityDescriptorMap: M) {
  return <T extends Constructor<U>, U>(target?: T): T & Constructor<TypeFromDescriptorMap<M>> => {
    throw new Error('Not implemented')
  }
}

const SomeEntityA = Entity({
  displayName: {
    type: 'string'
  }
})()

const SomeEntityB = Entity({
  displayName: {
    type: 'string'
  }

})(class {
  constructor() { }
  static staticMethod() { }
  method() { }
})

SomeEntityB /* = {
  staticMethod()
  ...
} */

const a = new SomeEntityA() /* = {
    displayName: string;
} */

const b = new SomeEntityB() /* = {
    displayName: string;
    method()
} */
