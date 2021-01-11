import React, { useState } from 'react'
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

const PageBuilder = () => {
  const [enabled] = useState(true)
  const base64 =
    'eyJST09UIjp7InR5cGXECHJlc29sdmVkTmFtZSI6IkNvbnRhaW5lciJ9LCJpc0NhbnZhcyI6dHJ1ZSwicHJvcHPENWZsZXhEaXJlY3Rpb24iOiJjb2x1bW4iLCJhbGlnbkl0ZW1zIjrFJi1zdGFydCIsImp1c3RpZnnEYGVudNAeZmlsbFNwYWPkAINubyIsInBhZGRpbmciOlsiNDAiLM4FXSwibWFyZ2luxB/EFMoEXSwiYmFja2dyb3VuZOUA4CI6MjU1LCJnxwhixwhhIjoxfSzkALpvcscoMMUmMMUkMMkic2hhZG93xRJyYWRpdXPFC3dpZHRoIjoiODAwcHgiLCJoZWlnaOQA12F1dG/kATxkaXNwbGF58QFXLCJjdXN0b23EdM4kQXBwxDloaWRkZW4iOmZhbHNlLCJub2RlcyI6W10sImxpbmtlZE7GEXt95AElcuUBTG51bGx9LCJEZ1ExSEV6Z3ZhY/sB4k9ubHlCdXR0b25z/AHk8QDDRWxlbcRu6wDB+gCuInNqb0E0dmMtemdDIiwiVlJUZmFkSW9xNTnkAaL5AMnFQC1jY3lPdm41MXRM5AChzEr6ANbmANLuANHnAJTpArb/AhnHCGEiOjAuNe8CGzkyxSk55gIdxAfnAh5ixXhTdHls5ACGZnVsbCIsInRleOQAzecAlOwCrTXnAqnGCF3GK0NvbXBvbuUBAXsiZm9udFNpesROMcQmxCFB5ANW5ANnZW505QJDxCVX6AJyNTDEUv8AruYArukAiTAsxQJd7QLf5wC3VMQHffECAOkAzv8B//8CrTrtAqd97gIc/wHg/wHg/wHg/AHg2CryAeNvdXRsaW5l/wHm/wHm/wHm/wHm/wHm/wHm/wHm/wHm/wHm+QHmYmM1TmxzRC1OSDf8Bn7FdTJWaWRlb0Ryb+UFEP8Eof8EofkEoUNpN2U3aV94dTJV/wST5ASTUmxJTTN5cDhVdeQAk8w8+gDN5QDG/gKydsQjSWQiOiJJd3pVczFJTWR5UfIGPsZK/wDY/wGU5ADL7AGF5ADHcnBydUZyQ3hKev8BlG9tM0J0bv8Bkv8Bkv8AulsiYVJvalhSOVdLRv8GJcQyLS1SQV9TWV9KRXTkAJPMPP8ERf8ERfEERTE4NOYEGzQ35gQbxAjzCD7/BiP/BiP/BD3/BD3/BD3/BD3/BD3/BD3/BD3/Aqn2AeLsApp9fQ=='
  const uint8array = lz.decodeBase64(base64)
  const json = lz.decompress(uint8array)
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
        enabled={enabled}
        onRender={RenderNode}
        onNodesChange={(query) => {
          const newjson = query.serialize()
          console.log(lz.encodeBase64(lz.compress(newjson)))
          localStorage.setItem(
            'customComponent',
            lz.encodeBase64(lz.compress(newjson))
          )
        }}
      >
        <Viewport>
          <Frame data={json}></Frame>
        </Viewport>
      </Editor>
    </div>
  )
}

export default PageBuilder
