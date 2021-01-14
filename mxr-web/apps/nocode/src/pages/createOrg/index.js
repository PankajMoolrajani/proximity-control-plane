import { useState } from 'react'
import axiosSecureInstance from '../../libs/axios/axios'
import Page from '../../layouts/page.react'
import { useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import userStore from '../../store/user.store'

const CreateOrg = () => {
  const [org, setOrg] = useState()
  const { push } = useHistory()

  const createOrg = async () => {
    const response = await axiosSecureInstance.post('/org/create', {
      orgName: org
    })
    userStore.setCurOrg(response.data)
    push('/')
  }
  return (
    <Page title='Create Org'>
      <Container maxWidth='sm'>
        <TextField
          fullWidth
          size='small'
          variant='outlined'
          id='organization'
          label='Organization Name'
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <Button
          variant='contained'
          color='primary'
          disabled={!org}
          onClick={createOrg}
        >
          Create Org
        </Button>
      </Container>
    </Page>
  )
}

export default CreateOrg
