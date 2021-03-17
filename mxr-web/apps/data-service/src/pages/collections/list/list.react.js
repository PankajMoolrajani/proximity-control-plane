import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { axiosMasterDataserviceInstance } from '../../../libs/axios/axios'
import { Container, Grid } from '@material-ui/core'
import Loader from '../../../components/Loader/'
import ListItem from './components/listItem.react'
import collectionStore from '../../../store/collection.store'

const CollectionList = ({ databaseId }) => {
  const collections = collectionStore.getCollections()
  const isLoading = collectionStore.getIsLoading()
  const fetchCollections = async () => {
    const query = collectionStore.getQuery()
    collectionStore.setIsLoading(true)
    try {
      const response = await axiosMasterDataserviceInstance.post(
        '/collection/search',
        {
          query: query,
          databaseId: databaseId
        }
      )
      if (response && response.status === 200) {
        collectionStore.setCollections(response.data.rows)
        collectionStore.setTotal(response.data.count)
      }
    } catch (error) {
      console.log(error)
    }
    collectionStore.setIsLoading(false)
  }

  useEffect(() => {
    collectionStore.setQuery({
      limit: 10,
      offset: 0,
      where: {
        DatabaseId: databaseId
      }
    })
    fetchCollections()
  }, [databaseId])

  if (isLoading) {
    return <Loader />
  }
  return (
    <Container maxWidth='xl'>
      <Grid container spacing={2}>
        {collections.map((collection) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={collection.id}>
            <ListItem collection={collection} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default observer(CollectionList)
