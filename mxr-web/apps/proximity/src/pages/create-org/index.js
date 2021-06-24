import { useState } from 'react'
import PageLayout from '/mxr-web/apps/proximity/src/components/PageLayout'
import { useHistory } from 'react-router-dom'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box
} from '@material-ui/core'
import { getAxiosPdsInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import orgStore from '/mxr-web/apps/proximity/src/stores/org.store'
const axiosPdsInstance = getAxiosPdsInstance()

const CreateOrg = () => {
  const [orgName, setOrgName] = useState()
  const [isLoading, setIsLoading] = useState()
  const { push } = useHistory()

  const createOrgAndAssignToUser = async () => {
    const userOrgs = orgStore.getUserOrgs()
    try {
      setIsLoading(true)
      //Search unclaimed Orgs
      const unclaimedOrgResponse = await axiosPdsInstance.post('/org/search', {
        query: {
          where: {
            status: 'UNCLAIMED'
          },
          limit: 1
        }
      })
      let unclaimedOrg
      if (unclaimedOrgResponse && unclaimedOrgResponse.status === 200) {
        unclaimedOrg = unclaimedOrgResponse.data.rows[0]
      } else {
        throw new Error('Something went wrong!')
      }

      //Create User Org mapping
      const orgUserMapping = await axiosPdsInstance.post('/orgUser', {
        data: {
          UserId: userOrgs.id,
          OrgId: unclaimedOrg.id
        }
      })
      if (!orgUserMapping || orgUserMapping.status !== 200) {
        throw new Error('Something went wrong!')
      }
      //Update Org - change status to CLAIMED, name to new name and isDefault to true
      const updateOrgResponse = await axiosPdsInstance.put(
        `/org/${unclaimedOrg.id}`,
        {
          data: {
            name: orgName,
            status: 'CLAIMED',
            isDefault: true
          }
        }
      )
      if (!updateOrgResponse || updateOrgResponse.status !== 200) {
        throw new Error('Something went wrong!')
      }
      //Reload User and set state
      const query = encodeURIComponent(
        JSON.stringify([
          {
            model: 'Org'
          }
        ])
      )
      const userByIdResponse = await axiosPdsInstance.get(
        `/user/${userOrgs.id}?include=${query}`
      )
      if (userByIdResponse && userByIdResponse.status === 200) {
        orgStore.setUserOrgs(userByIdResponse.data)
        setIsLoading(false)
        push('/')
      } else {
        throw new Error('Something went wrong!')
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  if (isLoading) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  return (
    <PageLayout>
      <Container
        maxWidth='sm'
        style={{
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Typography variant='h5' align='left'>
          Create Org
        </Typography>
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
    </PageLayout>
  )
}

export default CreateOrg
