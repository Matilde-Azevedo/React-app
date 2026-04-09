/* eslint-disable react-refresh/only-export-components */
import { call, put, all, takeLatest } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import { get } from 'lodash'
import * as actions from './actions'
import * as types from '../types'
import axios from '../../../services/axios'
import history from '../../../services/history'


function* LoginRequest({payload}){
  try{
    const response = yield call(axios.post, '/tokens', payload)
    yield put(actions.LoginSuccess({ ...response.data }))

    toast.success('Você fez login')

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`

    history.push(payload.prevPath)
  // eslint-disable-next-line no-unused-vars
  } catch(e){
    toast.error('Usuario ou senha inválidos.')

    yield put(actions.LoginFailure())
  }

}

function LoginFailure(){
  delete axios.defaults.headers.Authorization
}

function persistRehydrate({ payload }){
  const token = get(payload, 'auth.token', '')
  if(!token) return
  axios.defaults.headers.Authorization = `Bearer ${token}`
}

function* RegisterRequest({ payload }){
  const {id, nome, email, password} = payload

  try{
    if (id){
      yield call(axios.put, `/users/${id}`, {
        email,
        nome,
        password: password || undefined,
      })

      toast.success('Conta alterada com sucesso')
      yield put(actions.RegisterUpdatedSuccess({ nome, email, password }))
    } else {
      yield call(axios.post, '/users', {
        email,
        nome,
        password,
      })

      toast.success('Conta criada com sucesso!')
      yield put(actions.RegisterCreatedSuccess({ nome, email, password }))
      history.push('/login')
    }
  } catch(e){
    const errors = get(e, 'response.data.error', [])

    const status = get(e, 'response.status', 0)

    if(status === 401){
      toast.error('Você precisa fazer login novamente.')
      yield put(actions.LoginFailure())
      return history.push('/login')
    }

    if(errors.length > 0){
      errors.map(error => toast.error(error))
    } else{
      toast.error('Erro desconhecido')
    }

    yield put(actions.RegisterFailure())
  }
}

export default function* auth(){
  yield all([
    takeLatest(types.LOGIN_REQUEST, LoginRequest),
    takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
    takeLatest(types.REGISTER_REQUEST, RegisterRequest),
    takeLatest(types.LOGIN_FAILURE, LoginFailure)
  ])
}

