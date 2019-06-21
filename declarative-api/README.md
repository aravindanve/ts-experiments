# Strongly Typed Declarative API

## Pattern

```ts
function getRoutes(store: PetStore) {
    return Route
        .path('/pets', getPetRoute(store))
        .path('/customers', getCustomerRoute(store))
}

function getPetRoute(store: PetStore) {
    return Route
        .fromBase(BaseRoute)
        .path('/', Route
            .get(Operation
                .fromBase(BaseOperation)
                .withHeader(CLIENT_HEADER, string)
                .withQuery(Optional(FetchPetQuery))
                .resolve(ctx => {
                    const { [CLIENT_HEADER]: clientId } = ctx.header
                    const { offset = 0, limit = 10 } = ctx.query

                    return store.fetchAll(clientId, { offset, limit })
                })
            )
            .post(Operation
                .fromBase(BaseOperation)
                .withHeader(CLIENT_HEADER, string)
                .guard(authGuards.allowElevatedUsers)
                .withBody(CreatePetBody)
                .guard(dataGuards.checkIfPetNameIsUnique)
                .resolve(ctx => {
                    const { [CLIENT_HEADER]: clientId } = ctx.header

                    return store.createOne(clientId, ctx.body)
                })
            )
        )
        .path('/:petId', Route
            .get(Operation
                .fromBase(BaseOperation)
                .withHeader(CLIENT_HEADER, string)
                .withParam('petId', integer)
                .resolve(ctx => {
                    const { [CLIENT_HEADER]: clientId } = ctx.header

                    return store.fetchOne(clientId, ctx.params.petId)
                })
            )
            .put(Operation
                .fromBase(BaseOperation)
                .withHeader(CLIENT_HEADER, string)
                .guard(authGuards.allowElevatedUsers)
                .withParam('petId', integer)
                .withBody(PetUpdateBody)
                .guard(dataGuards.checkIfPetNameIsUnique)
                .resolve(ctx => {
                    const { [CLIENT_HEADER]: clientId } = ctx.header

                    return store.updateOne(clientId, ctx.params.petId, ctx.body)
                })
            )
            .delete(Operation
                .fromBase(BaseOperation)
                .withHeader(CLIENT_HEADER, string)
                .guard(authGuards.allowElevatedUsers)
                .withParam('petId', integer)
                .resolve(ctx => {
                    const { [CLIENT_HEADER]: clientId } = ctx.header

                    return store.deleteOne(clientId, ctx.params.petId)
                })
            )
        )
}
```
