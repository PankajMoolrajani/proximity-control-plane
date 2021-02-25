import React, { useState, useEffect } from 'react'
import './styles/style.css'
import { Container, Text } from './components/selectors'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Custom1, OnlyButtons } from './components/selectors/Custom1'
import { Custom2, Custom2VideoDrop } from './components/selectors/Custom2'
import { Custom3, Custom3BtnDrop } from './components/selectors/Custom3'
import { Button } from './components/selectors/Button'
import { Video } from './components/selectors/Video'
import { Viewport, RenderNode } from './components/editor'
import lz from 'lzutf8'
import { useParams } from 'react-router-dom'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'

const View = () => {
  const [pageData, setPageData] = useState(null)
  const { id, dbName } = useParams()
  console.log(id, dbName)

  const fetchPageData = async () => {
    const response = await axiosMasterDataserviceInstance.get(
      `/data/${dbName}/page/${id}`
    )
    setPageData(response.data.base64Json)
  }

  useEffect(() => {
    fetchPageData()
  }, [])

  if (!pageData) {
    return <div>Loading...</div>
  }

  return (
    <div className='h-full h-screen'>
      <Editor
        resolver={{
          Container,
          Text,
          Custom1,
          Custom2,
          Custom2VideoDrop,
          Custom3,
          Custom3BtnDrop,
          OnlyButtons,
          Button,
          Video
        }}
        enabled={false}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame data={lz.decompress(lz.decodeBase64(pageData))}></Frame>
        </Viewport>
      </Editor>
    </div>
  )
}

export default View
