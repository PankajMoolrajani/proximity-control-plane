import React, { useState, useEffect } from 'react'
import './styles/style.css'
import MaterialButton from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import { Container, Text } from './components/selectors'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Custom1, OnlyButtons } from './components/selectors/Custom1'
import { Custom2, Custom2VideoDrop } from './components/selectors/Custom2'
import { Custom3, Custom3BtnDrop } from './components/selectors/Custom3'
import { Button } from './components/selectors/Button'
import { Video } from './components/selectors/Video'
import { Viewport, RenderNode } from './components/editor'
import lz from 'lzutf8'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'
import userStore from '../../store/user.store'

const PageBuilder = () => {
  const [enabled] = useState(true)
  const [json, setJson] = useState()
  const location = useLocation()
  console.log(location.state.pagedata)
  const pagedata = location.state.pagedata
  if (!pagedata.base64Json) {
    return <div>Loading...</div>
  }

  return (
    <div className='h-full h-screen'>
      <Box textAlign='right' marginBottom={2}>
        <MaterialButton
          color='primary'
          variant='outlined'
          onClick={() => {
            const curOrg = userStore.getCurOrg()
            const defaultDb = `${curOrg.name}_default`
            window.open(`/view/${defaultDb}/${pagedata.id}`, '_blank')
          }}
          style={{
            marginRight: 20
          }}
        >
          Preview
        </MaterialButton>
        <MaterialButton
          color='primary'
          variant='contained'
          onClick={async () => {
            const curOrg = userStore.getCurOrg()
            const defaultDb = `${curOrg.name}_default`
            const updatedBase64 = lz.encodeBase64(lz.compress(json))
            await axiosMasterDataserviceInstance.put(
              `data/${defaultDb}/page/${pagedata.id}`,
              {
                data: {
                  path: pagedata.path,
                  base64Json: updatedBase64
                }
              }
            )
          }}
        >
          Save
        </MaterialButton>
      </Box>

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
        enabled={enabled}
        onRender={RenderNode}
        onNodesChange={(query) => {
          const newjson = query.serialize()
          setJson(newjson)
        }}
      >
        <Viewport editMode>
          <Frame
            data={lz.decompress(lz.decodeBase64(pagedata.base64Json))}
          ></Frame>
        </Viewport>
      </Editor>
    </div>
  )
}

export default observer(PageBuilder)
