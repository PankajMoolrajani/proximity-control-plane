import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import { v4 as uuid } from 'uuid'
import {
  axiosInstance,
  axiosServiceInstance
} from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import JSONPretty from 'react-json-pretty'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Switch from '@material-ui/core/Switch'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PolicyImpactAnalysisCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyImpactAnalysisCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
import 'codemirror-rego/mode'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror-rego/key-map'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import { toJS } from 'mobx'
const { policyStore, virtualServiceStore } = stores
const classes = {
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
}

export class PolicyDetailsCard extends Component {
  state = {
    opaInput: '',
    opaOutput: '',
    showEvaluateCard: true,
    showImpactAnalysisCard: false,
    selectedServices: []
  }

  handleEvaluate = async () => {
    const policy = policyStore.getFormFields()
    const response = await axiosServiceInstance.post(
      'opa/eval',
      {
        rules: policy.rules,
        input: JSON.parse(this.state.opaInput)
      },
      {
        headers: {
          'Content-type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      this.setState({ opaOutput: JSON.stringify(response.data) })
    }
  }

  isJson = (str) => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  _renderIOCard() {
    return (
      <React.Fragment>
        <Box>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box className={this.props.classes.codeMirrorTitle}>Input</Box>
            <Button
              variant='contained'
              color='primary'
              startIcon={<PlayArrowIcon />}
              size='small'
              onClick={this.handleEvaluate}
            >
              Evaluate
            </Button>
          </Box>
          <CodeMirror
            className={this.props.classes.codeMirrorHalf}
            value={this.state.opaInput}
            options={{
              theme: 'idea',
              lineNumbers: true,
              matchBrackets: true,
              mode: 'application/json'
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ opaInput: value })
            }}
            onChange={(editor, value) => {}}
          />
        </Box>
        <Box>
          <Box className={this.props.classes.codeMirrorTitle}>Output</Box>
          <JSONPretty
            className='hideScroll'
            style={{ maxHeight: 200, overflowY: 'auto' }}
            data={this.state.opaOutput}
          ></JSONPretty>
        </Box>
      </React.Fragment>
    )
  }

  _renderTabs() {
    return (
      <Box>
        <ButtonGroup size='medium' variant='text'>
          <Button
            style={{
              fontWeight: this.state.showEvaluateCard ? 700 : 400,
              padding: '6px 15px'
            }}
            onClick={() => {
              this.setState({
                showEvaluateCard: true,
                showImpactAnalysisCard: false
              })
            }}
          >
            Evaluate
          </Button>
          <Button
            style={{
              fontWeight: this.state.showImpactAnalysisCard ? 700 : 400,
              padding: '6px 15px'
            }}
            onClick={() => {
              const policy = policyStore.getSelectedObject()
              if (!policy.id) {
                return
              }
              this.setState({
                showEvaluateCard: false,
                showImpactAnalysisCard: true
              })
            }}
          >
            Impact Analytsis
          </Button>
        </ButtonGroup>
      </Box>
    )
  }

  _renderPlayGround = () => {
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
                className={this.props.classes.codeMirrorFull}
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
            {this._renderTabs()}
            <Divider />
            {this.state.showEvaluateCard ? this._renderIOCard() : null}
            {this.state.showImpactAnalysisCard ? (
              <PolicyImpactAnalysisCard />
            ) : null}
          </Grid>
        </Grid>
        <Divider />
      </Box>
    )
  }

  _renderWAFOps = () => {
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
              this.isJson(formFields.rules) &&
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
              this.isJson(formFields.rules) &&
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
              this.isJson(formFields.rules) &&
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
              this.isJson(formFields.rules) &&
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

  _renderDynamicDefence = () => {
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
              this.isJson(formFields.rules) &&
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

  generateKey = async () => {
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

  _renderAuthNConfig = () => {
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
                  this.isJson(formFields.rules) &&
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
                  this.isJson(formFields.rules) &&
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
                  this.isJson(formFields.rules) &&
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
                      onClick={this.generateKey}
                      onMouseDown={this.generateKey}
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

  _renderAuthN = () => {
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
                  this.isJson(formFields.rules) &&
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
            {this._renderAuthNConfig()}
          </Box>
        </Box>
      </Box>
    )
  }

  render() {
    const formFields = policyStore.getFormFields()
    const policy = policyStore.getSelectedObject()
    const viewMode = policyStore.getShowObjectViewMode()
    let policyName
    if (viewMode === 'CREATE') {
      policyName = formFields.name ? formFields.name : ''
    }

    if (viewMode === 'UPDATE') {
      policyName = policy.name ? policy.name : ''
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
            value={formFields.displayName ? formFields.displayName : ''}
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
              value={formFields.type ? formFields.type : ''}
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
        {this.props.actionButtons}
        <Divider style={{ marginTop: 20 }} />
        {this._renderAuthN()}
        {this._renderPlayGround()}
        {this._renderWAFOps()}
        {this._renderDynamicDefence()}
      </Box>
    )
  }
}

export default withStyles(classes)(observer(PolicyDetailsCard))
