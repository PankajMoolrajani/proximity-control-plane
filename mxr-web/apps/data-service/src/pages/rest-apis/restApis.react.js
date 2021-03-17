import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import { Box } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'

import 'swagger-ui-react/swagger-ui.css'
import Loader from '../../components/Loader'

const RestApiDoc = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [swaggerDocs, setSwaggerDocs] = useState()
  const { id: databaseId } = useParams()

  const fetchSwaggerDocs = async () => {
    setIsLoading(true)
    try {
      const databaseResponse = await axiosMasterDataserviceInstance.get(
        `/database/${databaseId}`
      )
      if (databaseResponse && databaseResponse.status === 200) {
        const database = databaseResponse.data
        const swaggerDocResponse = await axiosMasterDataserviceInstance.get(
          `/database/${database.shortId}/${database.databaseName}/swagger-docs`
        )
        if (swaggerDocResponse && swaggerDocResponse.status === 200) {
          setSwaggerDocs(swaggerDocResponse.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSwaggerDocs()
  }, [databaseId])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Box style={{ textAlign: 'left' }}>
      {swaggerDocs ? (
        <SwaggerUI spec={JSON.parse(swaggerDocs.docs)} />
      ) : (
        <Box>no content</Box>
      )}
    </Box>
  )
}

export default RestApiDoc
