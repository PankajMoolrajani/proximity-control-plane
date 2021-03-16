import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { axiosMasterDataserviceInstance } from '../../../libs/axios/axios'
import { Container, Grid } from '@material-ui/core'
import Loader from '../../../components/Loader/'
import ListItem from './components/listItem.react'
import relationStore from '../../../store/relation.store'

const RelationList = ({ databaseId }) => {
  const relations = relationStore.getRelations()
  const isLoading = relationStore.getIsLoading()
  const fetchRelations = async () => {
    const query = relationStore.getQuery()
    relationStore.setIsLoading(true)
    try {
      const response = await axiosMasterDataserviceInstance.post(
        'collection/relation/search',
        {
          query: query,
          databaseId: databaseId
        }
      )
      if (response && response.status === 200) {
        relationStore.setRelations(response.data.rows)
        relationStore.setTotal(response.data.count)
      }
    } catch (error) {
      console.log(error)
    }
    relationStore.setIsLoading(false)
  }

  useEffect(() => {
    relationStore.setQuery({
      limit: 10,
      offset: 0,
      where: {
        DatabaseId: databaseId
      }
    })
    fetchRelations()
  }, [databaseId])

  if (isLoading) {
    return <Loader />
  }
  return (
    <Container maxWidth='xl'>
      <Grid container spacing={2}>
        {relations.map((relation) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={relation.id}>
            <ListItem relation={relation} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default observer(RelationList)
