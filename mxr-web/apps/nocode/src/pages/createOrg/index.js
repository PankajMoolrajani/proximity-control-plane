import { useState } from 'react'
import { axiosMonoxorDataserviceInstance } from '../../libs/axios/axios'
import Page from '../../layouts/page.react'
import { useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import userStore from '../../store/user.store'

const CreateOrg = () => {
  const [orgName, setOrgName] = useState()
  const { push } = useHistory()

  const createOrgAndAssignToUser = async () => {
    const user = userStore.getUser()
    const createOrgQuery = `
      mutation($org: OrgInput!) {
        createOrg(org: $org) {
          id
          name
        }
      }
    `
    const response = await axiosMonoxorDataserviceInstance.post('', {
      query: createOrgQuery,
      variables: {
        org: {
          name: orgName,
          isDefault: true,
          UserIds: [user.id]
        }
      }
    })
    userStore.setCurOrg(response.data.data.createOrg)
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
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <Button
          variant='contained'
          color='primary'
          disabled={!orgName}
          onClick={createOrgAndAssignToUser}
        >
          Create Org
        </Button>
      </Container>
    </Page>
  )
}

export default CreateOrg
