import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { axiosMasterDataserviceInstance } from '../../libs/axios/axios'
import userStore from '../../store/user.store'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

const Create = () => {
  const [pageName, setPageName] = useState('')
  const { push } = useHistory()
  const curOrg = userStore.getCurOrg()
  const defaultDb = `${curOrg.name}_default`
  const createPage = async () => {
    const response = await axiosMasterDataserviceInstance.post(
      `data/${defaultDb}/page`,
      {
        data: {
          path: pageName,
          base64Json:
            'eyJST09UIjp7InR5cGXECHJlc29sdmVkTmFtZSI6IkNvbnRhaW5lciJ9LCJpc0NhbnZhcyI6dHJ1ZSwicHJvcHPENWZsZXhEaXJlY3Rpb24iOiJjb2x1bW4iLCJhbGlnbkl0ZW1zIjrFJi1zdGFydCIsImp1c3RpZnnEYGVudNAeZmlsbFNwYWPkAINubyIsInBhZGRpbmciOlsiNDAiLM4FXSwibWFyZ2luxB/EFMoEXSwiYmFja2dyb3VuZOUA4CI6MjU1LCJnxwhixwhhIjoxfSzkALpvcscoMMUmMMUkMMkic2hhZG93xRJyYWRpdXPFC3dpZHRoIjoiODAwcHgiLCJoZWlnaOQA12F1dG/kATxkaXNwbGF58QFXLCJjdXN0b23EdM4kQXBwxDloaWRkZW4iOmZhbHNlLCJub2RlcyI6W10sImxpbmtlZE7GEXt95AElcuUBTG51bGx9LCJEZ1ExSEV6Z3ZhY/sB4k9ubHlCdXR0b25z/AHk8QDDRWxlbcRu6wDB+gCuInNqb0E0dmMtemdDIiwiVlJUZmFkSW9xNTnkAaL5AMnFQC1jY3lPdm41MXRM5AChzEr6ANbmANLuANHnAJTpArb/AhnHCGEiOjAuNe8CGzkyxSk55gIdxAfnAh5ixXhTdHls5ACGZnVsbCIsInRleOQAzecAlOwCrTXnAqnGCF3GK0NvbXBvbuUBAXsiZm9udFNpesROMcQmxCFB5ANW5ANnZW505QJDxCVX6AJyNTDEUv8AruYArukAiTAsxQJd7QLf5wC3VMQHffECAOkAzv8B//8CrTrtAqd97gIc/wHg/wHg/wHg/AHg2CryAeNvdXRsaW5l/wHm/wHm/wHm/wHm/wHm/wHm/wHm/wHm/wHm+QHmYmM1TmxzRC1OSDf8Bn7FdTJWaWRlb0Ryb+UFEP8Eof8EofkEoUNpN2U3aV94dTJV/wST5ASTUmxJTTN5cDhVdeQAk8w8+gDN5QDG/gKydsQjSWQiOiJJd3pVczFJTWR5UfIGPsZK/wDY/wGU5ADL7AGF5ADHcnBydUZyQ3hKev8BlG9tM0J0bv8Bkv8Bkv8AulsiYVJvalhSOVdLRv8GJcQyLS1SQV9TWV9KRXTkAJPMPP8ERf8ERfEERTE4NOYEGzQ35gQbxAjzCD7/BiP/BiP/BD3/BD3/BD3/BD3/BD3/BD3/BD3/Aqn2AeLsApp9fQ=='
        }
      }
    )
    push('/pages')
  }

  return (
    <Container maxWidth='sm'>
      <Typography variant='h4'>Create New Page</Typography>
      <Divider style={{ margin: '20px 0' }} />
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        id='page'
        label='Page'
        value={pageName}
        onChange={(e) => setPageName(e.target.value)}
        style={{ marginTop: 20, marginBottom: 20 }}
      />
      <Button
        variant='contained'
        color='primary'
        disabled={!pageName}
        onClick={createPage}
      >
        Create Page
      </Button>
    </Container>
  )
}

export default observer(Create)
