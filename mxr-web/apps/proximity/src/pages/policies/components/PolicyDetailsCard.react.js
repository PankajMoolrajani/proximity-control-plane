import { useEffect, useState, Fragment } from 'react'
import { observer } from 'mobx-react'
import { v4 as uuid } from 'uuid'
import {
  axiosInstance,
  axiosServiceInstance
} from '../../../libs/axios/axios.lib'
import { useHistory } from 'react-router-dom'
import JSONPretty from 'react-json-pretty'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
  Switch,
  IconButton,
  ButtonGroup
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import PlatformSuccessCard from '../../../components/platform/PlatformSuccessCard.react'
import PolicyImpactAnalysisCard from './PolicyImpactAnalysisCard.react'
import stores from '../../../stores/proximity.store'

import 'codemirror-rego/mode'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror-rego/key-map'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'

const { policyStore, virtualServiceStore, policyRevisionStore } = stores

const useStyles = makeStyles((theme) => ({
  codeMirrorFull: {
    height: '500px',
    '& .CodeMirror': {
      height: '100%'
    }
  },
  codeMirrorHalf: {
    height: '209px',
    '& .CodeMirror': {
      height: '100%'
    }
  },
  codeMirrorTitle: {
    padding: 10,
    color: 'var(--primaryColor)',
    fontSize: 18,
    fontWeight: 700
  }
}))

const PolicyDetailsCard = ({ policyId, hideOpsButton }) => {
  const [opaInput, setOpaInput] = useState('')
  const [opaOutput, setOpaOutput] = useState('')
  const [showEvaluateCard, setShowEvaluateCard] = useState(true)
  const [showImpactAnalysisCard, setShowImactAnalysisCard] = useState(false)
  const { push } = useHistory()
  const [selectedServices, setSelectedServices] = useState([])
  const classes = useStyles()
  const showSuccess = policyStore.getShowSuccessCard()
  const showLoader = policyStore.getShowProcessCard()
  const formFields = policyStore.getFormFields()
  const policy = policyStore.getSelectedObject()
  const viewMode = policyId ? 'UPDATE' : 'CREATE'

  const fetchPolicyById = async () => {
    policyStore.setShowProcessCard(true)
    try {
      const policy = await policyStore.objectQueryById(policyId, [
        {
          model: 'PolicyRevision'
        }
      ])
      if (policy) {
        policyStore.setSelectedObject(policy)
        policyStore.setFormFields({
          id: policy.id,
          name: policy.name,
          displayName: policy.displayName,
          type: policy.type,
          rules: policy.rules
        })
      }
    } catch (error) {
      policyStore.setShowProcessCard(false)
      console.log(error)
    }
    policyStore.setShowProcessCard(false)
  }

  useEffect(() => {
    return () => {
      policyStore.setFormFields({
        name: '',
        displayName: '',
        type: '',
        rules: ''
      })
    }
  }, [])

  useEffect(() => {
    if (policyId) {
      fetchPolicyById()
    } else {
      policyStore.setSelectedObject(null)
    }
  }, [policyId])

  if (showSuccess) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformSuccessCard iconColor='green' msg='Success !' />
      </Box>
    )
  }
  if (showLoader || (!policy && !formFields)) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  let policyName
  if (viewMode === 'CREATE') {
    policyName = formFields ? formFields.name : ''
  }

  if (viewMode === 'UPDATE') {
    policyName = policy ? policy.name : ''
  }

  const handleEvaluate = async () => {
    const policy = policyStore.getFormFields()
    const response = await axiosServiceInstance.post(
      'opa/eval',
      {
        rules: policy.rules,
        input: JSON.parse(opaInput)
      },
      {
        headers: {
          'Content-type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      setOpaOutput(JSON.stringify(response.data))
    }
  }

  const isJson = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  const _renderIOCard = () => {
    return (
      <Fragment>
        <Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box className={classes.codeMirrorTitle}>Input</Box>
            <Button
              variant='contained'
              color='primary'
              startIcon={<PlayArrowIcon />}
              size='small'
              onClick={handleEvaluate}
            >
              Evaluate
            </Button>
          </Box>
          <CodeMirror
            className={classes.codeMirrorHalf}
            value={opaInput}
            options={{
              theme: 'idea',
              lineNumbers: true,
              matchBrackets: true,
              mode: 'application/json'
            }}
            onBeforeChange={(editor, data, value) => {
              setOpaInput(value)
            }}
            onChange={(editor, value) => {}}
          />
        </Box>
        <Box>
          <Box className={classes.codeMirrorTitle}>Output</Box>
          <JSONPretty
            className='hideScroll'
            style={{ maxHeight: 200, overflowY: 'auto' }}
            data={opaOutput}
          ></JSONPretty>
        </Box>
      </Fragment>
    )
  }

  const _renderTabs = () => {
    return (
      <Box>
        <ButtonGroup size='medium' variant='text'>
          <Button
            style={{
              fontWeight: showEvaluateCard ? 700 : 400,
              padding: '6px 15px'
            }}
            onClick={() => {
              setShowEvaluateCard(true)
              setShowImactAnalysisCard(false)
            }}
          >
            Evaluate
          </Button>
          <Button
            style={{
              fontWeight: showImpactAnalysisCard ? 700 : 400,
              padding: '6px 15px'
            }}
            onClick={() => {
              const policy = policyStore.getSelectedObject()
              if (!policy.id) {
                return
              }
              setShowEvaluateCard(false)
              setShowImactAnalysisCard(true)
            }}
          >
            Impact Analytsis
          </Button>
        </ButtonGroup>
      </Box>
    )
  }

  const _renderPlayGround = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'AUTHZ') {
      return <Box></Box>
    }
    return (
      <Box>
        <Grid container>
          <Grid item xs={6}>
            <Box>
              <CodeMirror
                className={classes.codeMirrorFull}
                value={formFields.rules}
                options={{
                  theme: 'idea',
                  lineNumbers: true,
                  matchBrackets: true,
                  mode: 'rego',
                  height: '600px'
                }}
                onBeforeChange={(editor, data, value) => {
                  policyStore.setFormFields({
                    ...formFields,
                    rules: value
                  })
                }}
                onChange={(editor, value) => {}}
                style={{ height: 600 }}
              />
            </Box>
          </Grid>
          <Grid
            style={{
              borderLeft: '1px solid gray'
            }}
            item
            xs={6}
          >
            {_renderTabs()}
            <Divider />
            {showEvaluateCard ? _renderIOCard() : null}
            {showImpactAnalysisCard ? <PolicyImpactAnalysisCard /> : null}
          </Grid>
        </Grid>
        <Divider />
      </Box>
    )
  }

  const _renderWAFOps = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'WAF') {
      return <Box></Box>
    }

    return (
      <Box>
        <Box
          style={{
            fontSize: 24,
            marginTop: 20
          }}
        >
          Protections
        </Box>
        <Box
          style={{
            fontSize: 15,
            marginTop: 5,
            marginBottom: 20
          }}
        >
          All protections enabled by default.
        </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <Switch
            color='primary'
            checked={
              formFields.rules &&
              isJson(formFields.rules) &&
              JSON.parse(formFields.rules).sql_injection_enabled
                ? JSON.parse(formFields.rules).sql_injection_enabled
                : false
            }
            onChange={(e) => {
              policyStore.setFormFields({
                ...formFields,
                rules: JSON.stringify({
                  ...JSON.parse(formFields.rules),
                  sql_injection_enabled: e.target.checked
                })
              })
            }}
          />
          <Box>SQL Injection</Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <Switch
            color='primary'
            checked={
              formFields.rules &&
              isJson(formFields.rules) &&
              JSON.parse(formFields.rules).local_file_inclusion
                ? JSON.parse(formFields.rules).local_file_inclusion
                : false
            }
            onChange={(e) => {
              policyStore.setFormFields({
                ...formFields,
                rules: JSON.stringify({
                  ...JSON.parse(formFields.rules),
                  local_file_inclusion: e.target.checked
                })
              })
            }}
          />
          <Box>Local file inclusion</Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <Switch
            color='primary'
            checked={
              formFields.rules &&
              isJson(formFields.rules) &&
              JSON.parse(formFields.rules).shell_injection_enabled
                ? JSON.parse(formFields.rules).shell_injection_enabled
                : false
            }
            onChange={(e) => {
              policyStore.setFormFields({
                ...formFields,
                rules: JSON.stringify({
                  ...JSON.parse(formFields.rules),
                  shell_injection_enabled: e.target.checked
                })
              })
            }}
          />
          <Box>Shell Injection</Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <Switch
            color='primary'
            checked={
              formFields.rules &&
              isJson(formFields.rules) &&
              JSON.parse(formFields.rules).shell_shock_enabled
                ? JSON.parse(formFields.rules).shell_shock_enabled
                : false
            }
            onChange={(e) => {
              policyStore.setFormFields({
                ...formFields,
                rules: JSON.stringify({
                  ...JSON.parse(formFields.rules),
                  shell_shock_enabled: e.target.checked
                })
              })
            }}
          />
          <Box>Shell Shock</Box>
        </Box>
      </Box>
    )
  }

  const _renderDynamicDefence = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'DYNAMIC') {
      return <Box></Box>
    }

    return (
      <Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <Switch
            color='primary'
            checked={
              formFields.rules &&
              isJson(formFields.rules) &&
              JSON.parse(formFields.rules).dynamic_defence_enabled
                ? JSON.parse(formFields.rules).dynamic_defence_enabled
                : false
            }
            onChange={(e) => {
              policyStore.setFormFields({
                ...formFields,
                rules: JSON.stringify({
                  ...JSON.parse(formFields.rules),
                  dynamic_defence_enabled: e.target.checked
                })
              })
            }}
          />
          <Box>Dynamic Defence</Box>
        </Box>
      </Box>
    )
  }

  const generateKey = async () => {
    const formFields = policyStore.getFormFields()
    policyStore.setFormFields({
      ...formFields,
      rules: JSON.stringify({
        ...JSON.parse(formFields.rules),
        authData: {
          ...JSON.parse(formFields.rules).authData,
          apiKey: uuid().replaceAll('-', '')
        }
      })
    })
  }

  const _renderAuthNConfig = () => {
    const formFields = policyStore.getFormFields()
    const type = JSON.parse(formFields.rules).type
    if (!type) {
      return <Box></Box>
    }

    switch (type) {
      case 'BASIC':
        return (
          <Box>
            <Box>
              <TextField
                fullWidth
                label='User Name'
                variant='outlined'
                size='small'
                value={
                  formFields.rules &&
                  isJson(formFields.rules) &&
                  JSON.parse(formFields.rules).authData &&
                  JSON.parse(formFields.rules).authData.username
                    ? JSON.parse(formFields.rules).authData.username
                    : ''
                }
                onChange={(event) => {
                  policyStore.setFormFields({
                    ...formFields,
                    rules: JSON.stringify({
                      ...JSON.parse(formFields.rules),
                      authData: {
                        ...JSON.parse(formFields.rules).authData,
                        username: event.target.value
                      }
                    })
                  })
                }}
              />
            </Box>
            <Box
              style={{
                marginTop: 20
              }}
            >
              <TextField
                fullWidth
                label='Password'
                variant='outlined'
                size='small'
                type='password'
                value={
                  formFields.rules &&
                  isJson(formFields.rules) &&
                  JSON.parse(formFields.rules).authData &&
                  JSON.parse(formFields.rules).authData.password
                    ? JSON.parse(formFields.rules).authData.password
                    : ''
                }
                onChange={(event) => {
                  policyStore.setFormFields({
                    ...formFields,
                    rules: JSON.stringify({
                      ...JSON.parse(formFields.rules),
                      authData: {
                        ...JSON.parse(formFields.rules).authData,
                        password: event.target.value
                      }
                    })
                  })
                }}
              />
            </Box>
          </Box>
        )
        break
      case 'API_KEY':
        return (
          <Box>
            <Box>
              <TextField
                fullWidth
                label='Api Key'
                variant='outlined'
                size='small'
                value={
                  formFields.rules &&
                  isJson(formFields.rules) &&
                  JSON.parse(formFields.rules).authData &&
                  JSON.parse(formFields.rules).authData.apiKey
                    ? JSON.parse(formFields.rules).authData.apiKey
                    : ''
                }
                onChange={(event) => {}}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label='generate api key'
                      onClick={generateKey}
                      onMouseDown={generateKey}
                    >
                      <VpnKeyIcon />
                    </IconButton>
                  )
                }}
              />
            </Box>
          </Box>
        )
        break
      case 'OAUTH2':
        return <Box> </Box>
        break
      default:
        return <Box>Please select Auth type</Box>
    }
  }

  const _renderAuthN = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'AUTHN') {
      return <Box></Box>
    }
    return (
      <Box>
        <Box
          style={{
            width: '100%',
            marginTop: 30,
            textAlign: 'left'
          }}
        >
          <Box style={{ maxWidth: 700, marginTop: 20 }}>
            <FormControl fullWidth variant='outlined' size='small'>
              <InputLabel id='auth-lable-id'>Auth Type</InputLabel>
              <Select
                ref={null}
                labelId='auth-lable-id'
                label='Auth Type'
                value={
                  formFields.rules &&
                  isJson(formFields.rules) &&
                  JSON.parse(formFields.rules).type
                    ? JSON.parse(formFields.rules).type
                    : ''
                }
                onChange={(event) => {
                  let authData
                  switch (event.target.value) {
                    case 'BASIC':
                      authData = {
                        username: '',
                        password: ''
                      }
                      break
                    case 'API_KEY':
                      authData = {
                        apiKey: ''
                      }
                      break
                    case 'OAUTH2':
                      authData = {
                        appId: '',
                        appKey: ''
                      }
                      break
                    default:
                      authData = {
                        username: '',
                        password: ''
                      }
                  }
                  policyStore.setFormFields({
                    ...formFields,
                    rules: JSON.stringify({
                      ...JSON.parse(formFields.rules),
                      type: event.target.value,
                      authData: authData
                    })
                  })
                }}
              >
                <MenuItem value='BASIC'>BASIC</MenuItem>
                <MenuItem value='API_KEY'>API KEY</MenuItem>
                <MenuItem value='OAUTH2'>OAUTH2</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box style={{ maxWidth: 700, marginTop: 20 }}>
            {_renderAuthNConfig()}
          </Box>
        </Box>
      </Box>
    )
  }

  const _renderCreateButton = () => {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{
          marginRight: 20
        }}
        onClick={async () => {
          policyStore.setShowProcessCard(true)
          try {
            const createdPolicy = await policyStore.objectCreate()
            policyRevisionStore.setFormFields({
              name: createdPolicy.name,
              displayName: createdPolicy.displayName,
              type: createdPolicy.type,
              rules: createdPolicy.rules,
              PolicyId: createdPolicy.id
            })
            const createdPolicyRevision = await policyRevisionStore.objectCreate()
            policyStore.setShowProcessCard(false)
            policyStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            policyStore.setShowSuccessCard(false)
            policyStore.resetAllFields()
            policyRevisionStore.resetAllFields()
            push('/policies')
          } catch (error) {
            console.log('Error: Creating Policy', error)
          }
          policyStore.setShowProcessCard(false)
        }}
      >
        Create
      </Button>
    )
  }

  const _renderUdateButton = () => {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{
          marginRight: 20
        }}
        onClick={async () => {
          policyStore.setShowProcessCard(true)
          try {
            const updatedPolicy = await policyStore.objectUpdate()
            policyRevisionStore.setFormFields({
              name: updatedPolicy.name,
              displayName: updatedPolicy.displayName,
              type: updatedPolicy.type,
              rules: updatedPolicy.rules,
              PolicyId: updatedPolicy.id
            })
            const createdPolicyRevision = await policyRevisionStore.objectCreate()
            await fetchPolicyById()
            policyStore.setShowProcessCard(false)
            policyStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            policyStore.setShowSuccessCard(false)
          } catch (error) {
            console.log('Error: Updating Policy', error)
          }
          policyStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }

  return (
    <Box
      style={{
        padding: 24,
        marginBottom: 40
      }}
    >
      <Box style={{ maxWidth: 700 }}>
        <TextField
          fullWidth
          label='Name'
          variant='outlined'
          size='small'
          value={policyName ? policyName : ''}
          onChange={(event) => {
            if (viewMode !== 'CREATE') {
              return
            }
            policyStore.setFormFields({
              ...formFields,
              name: event.target.value
            })
          }}
        />
      </Box>
      <Box style={{ maxWidth: 700, marginTop: 20 }}>
        <TextField
          fullWidth
          label='Display name'
          variant='outlined'
          size='small'
          value={formFields ? formFields.displayName : ''}
          onChange={(event) => {
            policyStore.setFormFields({
              ...formFields,
              displayName: event.target.value
            })
          }}
        />
      </Box>
      <Box style={{ maxWidth: 700, marginTop: 20 }}>
        <FormControl fullWidth variant='outlined' size='small'>
          <InputLabel id='policy-lable-id'>Type</InputLabel>
          <Select
            ref={null}
            labelId='policy-lable-id'
            label='Type'
            value={formFields ? formFields.type : ''}
            onChange={(event) => {
              let rules
              switch (event.target.value) {
                case 'AUTHN':
                  rules = JSON.stringify({
                    type: 'BASIC',
                    authData: {
                      key: ''
                    }
                  })
                  break
                case 'AUTHZ':
                  rules = ''
                  break
                case 'WAF':
                  rules = JSON.stringify({
                    sql_injection_enabled: true,
                    local_file_inclusion: true,
                    shell_injection_enabled: true,
                    shell_shock_enabled: true
                  })
                  break
                case 'DYNAMIC':
                  rules = JSON.stringify({
                    dynamic_defence_enabled: true
                  })
                  break
                default:
                  rules = ''
              }
              policyStore.setFormFields({
                ...formFields,
                type: event.target.value,
                rules: rules
              })
            }}
          >
            <MenuItem value='AUTHN'>AUTHN</MenuItem>
            <MenuItem value='AUTHZ'>AUTHZ</MenuItem>
            <MenuItem value='WAF'>WAF</MenuItem>
            <MenuItem value='DYNAMIC'>DYNAMIC</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {!hideOpsButton ? (
        <Box my={2}>
          {viewMode === 'CREATE' ? _renderCreateButton() : _renderUdateButton()}
        </Box>
      ) : (
        ''
      )}

      <Divider style={{ marginTop: 20 }} />
      {_renderAuthN()}
      {_renderPlayGround()}
      {_renderWAFOps()}
      {_renderDynamicDefence()}
    </Box>
  )
}

export default observer(PolicyDetailsCard)
