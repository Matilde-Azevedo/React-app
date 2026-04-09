import {React,  useState , useEffect} from 'react'
import {get } from 'lodash'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import './styled.jsx'

import { Container } from '../../styles/GlobalStyles.jsx'
import Loading from '../../components/Loading'
import { Title, Form } from './styled.jsx'
import * as actions from '../../store/modules/auth/actions.jsx'
import axios from '../../services/axios.jsx'
import history from '../../services/history.jsx'

function Fotos({ match }) {
  const dispatch = useDispatch()
  const id = get(match, 'params.id', '')
  const [isLoading, setIsLoading] = useState(false)
  const [foto, setFoto] = useState('')

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const {data} = await axios.get(`/alunos/${id}`)
        setFoto(get(data, 'Fotos[0}.url', ''))

        setIsLoading(false)
      } catch {
        toast.error('Erro ao obter imagem')
        setIsLoading(false)
        history.push('/')
      }
    }

    getData()
  }, [id])

  const handleChange = async e => {
    const foto = e.target.files[0]
    const fotoURL = URL.createObjectURL(foto)

    setFoto(fotoURL)

    const formData = new FormData()
    formData.append('aluno_id', id)
    formData.append('foto', foto)

    try {
      setIsLoading(true)

      await axios.post('/fotos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })

      toast.success('Foto enviada com succeso')

      setIsLoading(false)
      history.push(`/aluno/${id}/edit`)
    } catch(err){
      setIsLoading(false)

      const { status } = get(err, 'response', '')
      toast.error('Erro ao enviar a foto')

      if(status === 401) dispatch(actions.LoginFailure())

    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>Fotos</Title>

      <Form>
        <label htmlFor="foto">
          {foto ? <img src={foto} alt='Foto' crossOrigin="anonymous"/> : 'Selecionar'}
          <input type="file" name="" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </ Container>
  )
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
}

export default Fotos
