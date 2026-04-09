import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const reducePersist = reducers => {
  const persistedReducers = persistReducer({
      key: 'CONSUMO-API',
      storage,
      whitelist: ['auth'],
    },
    reducers,
  )

  return persistedReducers
}

export default reducePersist
