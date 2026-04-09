import * as types from '../types'

export function LoginRequest(payload){
  return{
    type: types.LOGIN_REQUEST,
    payload
  }
}

export function LoginSuccess(payload){
  return{
    type: types.LOGIN_SUCCESS,
    payload
  }
}

export function LoginFailure(payload){
  return{
    type: types.LOGIN_FAILURE,
    payload
  }
}

export function RegisterRequest(payload){
  return {
    type: types.REGISTER_REQUEST,
    payload
  }
}

export function RegisterFailure(payload){
  return {
    type: types.REGISTER_FAILURE,
    payload
  }
}

export function RegisterUpdatedSuccess(payload){
  return {
    type: types.REGISTER_UPDATED_SUCCESS,
    payload
  }
}

export function RegisterCreatedSuccess(payload){
  return {
    type: types.REGISTER_CREATED_SUCCESS,
    payload
  }
}
