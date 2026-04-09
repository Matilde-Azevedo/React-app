import React ,{ useState } from 'react'
import { toast } from 'react-toastify'
import { isEmail } from 'validator'
import { useDispatch, useSelector} from 'react-redux'
import { get } from 'lodash'
import './styled.jsx'

import { Container } from '../../styles/GlobalStyles.jsx'
import { Form } from './styled.jsx'
import * as actions from '../../store/modules/auth/actions.jsx'

import Loading from '../../components/Loading'

function Login(props) {
  const dispatch = useDispatch()

  const prevPath = get(props, 'location.state.prevPath', '/')

  const isLoading = useSelector(state => state.auth.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()

    let formErrors = false

    if(!isEmail(email)){
      formErrors = true
      toast.error('Credenciais inválidas')
    }

    if(password.length < 6 || password.length > 50){
      formErrors = true
      toast.error('Credenciais inválidas m')
    }

    if(formErrors) return


    dispatch(actions.LoginRequest({email, password, prevPath}))


  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1>Login</h1>

      <Form onSubmit={handleSubmit} >
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder='Seu email'/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Sua Senha'/>
        <button type='submit'>Acessar</button>
      </Form>
    </ Container>
  )
}

export default Login
