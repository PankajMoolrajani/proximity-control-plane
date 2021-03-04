import { useEffect, useState } from 'react'
import GraphiQL from 'graphiql'
import { Box } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import 'graphiql/graphiql.min.css'
import Loader from '../../components/Loader'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'

const GraphqlDoc = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { id: databaseId } = useParams()
  const [database, setDatabase] = useState()

  const fetchDatabase = async () => {
    setIsLoading(true)
    try {
      const databaseResponse = await axiosMasterDataserviceInstance.get(
        `/database/${databaseId}`
      )
      if (databaseResponse && databaseResponse.status === 200) {
        setDatabase(databaseResponse.data)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDatabase()
  }, [databaseId])

  if (isLoading) {
    return <Loader />
  }

  if (!database) {
    return <Box>No Content</Box>
  }
  return (
    <GraphiQL
      fetcher={async (graphQLParams) => {
        const response = await axiosMasterDataserviceInstance.post(
          `/graphql/${database.shortId}/${database.databaseName}`,
          { ...graphQLParams }
        )
        return response.data
      }}
    />
  )
}

export default GraphqlDoc
