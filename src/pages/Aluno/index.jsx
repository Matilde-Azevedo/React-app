import React, { useState, useEffect} from 'react'
import { isEmail, isInt, isFloat } from 'validator'
import {get} from 'lodash'
import PropTypes from 'prop-types'

import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { FaUserCircle, FaEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './styled.jsx'

import axios from '../../services/axios.jsx'
import history from '../../services/history.jsx'
import { Container } from '../../styles/GlobalStyles.jsx'
import { Form, ProfilePicture, Title} from './styled.jsx'
import Loading from '../../components/Loading'
import * as actions from '../../store/modules/auth/actions.jsx'

function Aluno({ match }) {
  const dispatch = useDispatch()
  const id = get(match, 'params.id', '')
  const [nome, setNome] = useState('')
  const [sobrenome, setSobrenome] = useState('')
  const [email, setEmail] = useState('')
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [foto, setFoto] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect (() => {
    if(!id) return

    async function getData(){
      try {
        setIsLoading(true)
        const { data } = await axios.get(`/alunos/${id}`)
        const Foto = get(data, 'Fotos[0].url', '')

        setFoto(Foto)

        setNome(data.nome)
        setSobrenome(data.sobrenome)
        setEmail(data.email)
        setIdade(data.idade)
        setPeso(data.peso)
        setAltura(data.altura)

        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        const status = get(err, 'response.status', 0)
        const errors = get(err, 'response.data.errors', [])

        if(status === 400) errors.map(error => toast.error(error))
        history.push('/')
      }
    }

    getData()

  }, [id])

  const handleSubmit = async e => {
    e.preventDefault()

    let formErrors = false

    if (nome.length < 3 || nome.length > 20 ) {
      formErrors = true
      toast.error('Nome  precisa ter entre 3 a 20 caracteres')
    }

    if (sobrenome.length < 3 || sobrenome.length > 20 ) {
      formErrors = true
      toast.error('Sobrenome precisa ter entre 3 a 20 caracteres')
    }

    if(!isEmail(email)){
      formErrors = true
      toast.error('Email invalido')
    }

    if(!isInt(String(idade))){
      formErrors = true
      toast.error('Idade precisa ser um número')
    }

    if(!isInt(String(peso)) && !isFloat(String(peso))){
      formErrors = true
      toast.error('Peso precisa ser um número inteiro ou ')
    }

    if(!isInt(String(altura)) && !isFloat(String(altura))){
      formErrors = true
      toast.error('Altura precisa ser um número inteiro ou')
    }

    if(formErrors) return

    try {
      setIsLoading(true)
      if(id){
        //editando
        await axios.put(`/alunos/${id}`, {
          nome, sobrenome, email, idade, peso, altura
        })

        toast.success('Aluno/a editado/a com sucesso!')
        history.push('/')
      } else {
        //Criando
       const {data} = await axios.post(`/alunos/`, {
          nome, sobrenome, email, idade, peso, altura
        })

        toast.success('Aluno/a criado/a com sucesso!')
        history.push(`/aluno/${data.id}/edit`)
      }
      setIsLoading(false)
    } catch(err) {
      const status = get(err, 'reponse.status', 0)
      const data = get(err, 'response.data', [])
      const errors = get(data, 'errors', [])

      if(errors.length > 0 ) {
        errors.map(error => toast.error(error))
      } else {
        toast.error('Erro desconhecido')
      }

      if(status === 401) dispatch(actions.LoginFailure())
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Editar aluno' : 'Novo Aluno'}</Title>

      { id && (
        <ProfilePicture>
          {foto ? (
            <img src={foto} alt={nome} crossOrigin="anonymous"/>
          ) : (
            <FaUserCircle size={180} />
          )}
          <Link to={`/fotos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit} >
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder='Nome'
        />
        <input
          type="text"
          value={sobrenome}
          onChange={e => setSobrenome(e.target.value)}
          placeholder='Sobrenome'
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          type="text"
          inputMode='numeric'
          pattern="\d*"
          value={idade}
          onChange={e => setIdade(e.target.value)}
          placeholder='Idade'
        />
        <input
          type="text"
          inputMode='numeric'
          value={peso}
          onChange={e => setPeso(e.target.value)}
          placeholder='Peso'
        />
        <input
          type="text"
          inputMode='numeric'
          value={altura}
          onChange={e => setAltura(e.target.value)}
          placeholder='Altura'
        />
        <button type='submit'>Guardar</button>
      </Form>
    </ Container>
  )
}

Aluno.propTypes = {
  match: PropTypes.shape({}).isRequired,
}

export default Aluno
