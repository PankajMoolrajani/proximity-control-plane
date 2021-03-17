import { useEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Container, Grid } from '@material-ui/core'
import ListItem from './components/listItem.react'
import { useHistory } from 'react-router-dom'
import {
  axiosMonoxorDataserviceInstance,
  axiosMasterDataserviceInstance
} from '../../../libs/axios/axios'
import Page from '../../../layouts/page.react'
import Loader from '../../../components/Loader'
import { ReactComponent as DatabaseIcon } from '../../../assets/icons/database.svg'
import userStore from '../../../store/user.store'
import databaseStore from '../../../store/database.store'

const List = () => {
  const curOrg = userStore.getCurOrg()
  const databases = databaseStore.getDatabases()
  const isLoading = databaseStore.getIsLoading()
  const { push } = useHistory()
  const fetchDatabases = useCallback(async () => {
    if (!curOrg) {
      return
    }
    try {
      databaseStore.setIsLoading(true)
      //Fetch all databaseIds from Org id
      const dbIdsQuery = `
        query($query: JSON!) {
          mxrdataservices(query: $query) {
            count
            rows {
              id
              DatabaseId
            }
          }
        }
      `

      const dbIdsVariables = {
        query: {
          where: {
            OrgId: curOrg.id
          }
        }
      }

      const response = await axiosMonoxorDataserviceInstance.post('', {
        query: dbIdsQuery,
        variables: dbIdsVariables
      })

      const mxrdataservices = response.data.data.mxrdataservices.rows

      //Fetch all databases by Id
      const databases = []
      await Promise.all(
        mxrdataservices.map(async (mxrdataservice) => {
          const response = await axiosMasterDataserviceInstance.get(
            `/database/${mxrdataservice.DatabaseId}`
          )
          databases.push(response.data)
        })
      )
      databaseStore.setDatabases(databases)
    } catch (error) {
      console.log(error)
    }
    databaseStore.setIsLoading(false)
  }, [curOrg])

  useEffect(() => {
    fetchDatabases()
  }, [curOrg, fetchDatabases])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Page
      icon={<DatabaseIcon />}
      title='Data Sources'
      onCreate={() => push(`/data-sources/create`)}
    >
      <Container maxWidth='xl'>
        <Grid container spacing={2}>
          {databases.map((database) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={database.id}>
              <ListItem database={database} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  )
}

export default observer(List)
