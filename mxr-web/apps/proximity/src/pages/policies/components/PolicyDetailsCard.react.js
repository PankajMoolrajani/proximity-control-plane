import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import axios from 'libs/axios/axios'
import JSONPretty from 'react-json-pretty'
import {
  MaterialBox,
  MaterialTextField,
  MaterialFormControl,
  MaterialInputLabel,
  MaterialSelect,
  MaterialMenuItem,
  MaterialButton,
  MaterialGrid,
  MaterialDivider,
  MaterialButtonGroup,
  MaterialSwitch,
  MaterialInputAdornment,
  MaterialIconButton
} from 'libs/material'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PolicyImpactAnalysisCard from 'apps/proximity/policies/components/PolicyImpactAnalysisCard.react'
import {
  policyStore,
  virtualServiceStore
} from 'apps/proximity/stores/proximity.store'
import 'codemirror-rego/mode'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror-rego/key-map'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import { toJS } from 'mobx'


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
    const response = await axios.post(
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
        <MaterialBox>
          <MaterialBox
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <MaterialBox className={this.props.classes.codeMirrorTitle}>
              Input
            </MaterialBox>
            <MaterialButton
              variant='contained'
              color='primary'
              startIcon={<PlayArrowIcon />}
              size='small'
              onClick={this.handleEvaluate}
            >
              Evaluate
            </MaterialButton>
          </MaterialBox>
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
        </MaterialBox>
        <MaterialBox>
          <MaterialBox className={this.props.classes.codeMirrorTitle}>
            Output
          </MaterialBox>
          <JSONPretty
            className='hideScroll'
            style={{ maxHeight: 200, overflowY: 'auto' }}
            data={this.state.opaOutput}
          ></JSONPretty>
        </MaterialBox>
      </React.Fragment>
    )
  }


  _renderTabs() {
    return (
      <MaterialBox>
        <MaterialButtonGroup size='medium' variant='text'>
          <MaterialButton
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
          </MaterialButton>
          <MaterialButton
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
          </MaterialButton>
        </MaterialButtonGroup>
      </MaterialBox>
    )
  }
  

  _renderPlayGround = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'AUTHZ') {
      return <MaterialBox></MaterialBox>
    }
    return (
      <MaterialBox>
        <MaterialGrid container>
          <MaterialGrid item xs={6}>
            <MaterialBox>
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
            </MaterialBox>
          </MaterialGrid>
          <MaterialGrid
            style={{
              borderLeft: '1px solid gray'
            }}
            item
            xs={6}
          >
            {this._renderTabs()}
            <MaterialDivider />
            {this.state.showEvaluateCard ? this._renderIOCard() : null}
            {this.state.showImpactAnalysisCard ? (
              <PolicyImpactAnalysisCard />
            ) : null}
          </MaterialGrid>
        </MaterialGrid>
        <MaterialDivider />
      </MaterialBox>
    )
  }


  _renderWAFOps = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'WAF') {
      return <MaterialBox></MaterialBox>
    }

    return (
      <MaterialBox>
        <MaterialBox
          style={{
            fontSize: 24,
            marginTop: 20
          }}
        >
          Protections
        </MaterialBox>
        <MaterialBox
          style={{
            fontSize: 15,
            marginTop: 5,
            marginBottom: 20
          }}
        >
          All protections enabled by default.
        </MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <MaterialSwitch
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
          <MaterialBox>SQL Injection</MaterialBox>
        </MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <MaterialSwitch
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
          <MaterialBox>Local file inclusion</MaterialBox>
        </MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <MaterialSwitch
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
          <MaterialBox>Shell Injection</MaterialBox>
        </MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <MaterialSwitch
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
          <MaterialBox>Shell Shock</MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  _renderDynamicDefence = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'DYNAMIC') {
      return <MaterialBox></MaterialBox>
    }

    return (
      <MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center'
          }}
        >
          <MaterialSwitch
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
          <MaterialBox>Dynamic Defence</MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  generateKey = async () => {
    const formFields = policyStore.getFormFields()
    const response = await axios.get('/crypto/apikey')
    policyStore.setFormFields({
      ...formFields,
      rules: JSON.stringify({
        ...JSON.parse(formFields.rules),
        authData: {
          ...JSON.parse(formFields.rules).authData,
          apiKey: response.data.apikey
        }
      })
    })
  }


  _renderAuthNConfig = () => {
    const formFields = policyStore.getFormFields()
    const type = JSON.parse(formFields.rules).type
    if (!type) {
      return <MaterialBox></MaterialBox>
    }

    switch (type) {
      case 'BASIC':
        return (
          <MaterialBox>
            <MaterialBox>
              <MaterialTextField
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
            </MaterialBox>
            <MaterialBox
              style={{
                marginTop: 20
              }}
            >
              <MaterialTextField
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
            </MaterialBox>
          </MaterialBox>
        )
        break
      case 'API_KEY':
        return (
          <MaterialBox>
            <MaterialBox>
              <MaterialTextField
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
                    <MaterialIconButton
                      aria-label='generate api key'
                      onClick={this.generateKey}
                      onMouseDown={this.generateKey}
                    >
                      <VpnKeyIcon />
                    </MaterialIconButton>
                  )
                }}
              />
            </MaterialBox>
          </MaterialBox>
        )
        break
      case 'OAUTH2':
        return <MaterialBox> </MaterialBox>
        break
      default:
        return <MaterialBox>Please select Auth type</MaterialBox>
    }
  }


  _renderAuthN = () => {
    const formFields = policyStore.getFormFields()
    if (formFields.type !== 'AUTHN') {
      return <MaterialBox></MaterialBox>
    }
    return (
      <MaterialBox>
        <MaterialBox
          style={{
            width: '100%',
            marginTop: 30,
            textAlign: 'left'
          }}
        >
          <MaterialBox style={{ maxWidth: 700, marginTop: 20 }}>
            <MaterialFormControl fullWidth variant='outlined' size='small'>
              <MaterialInputLabel id='auth-lable-id'>
                Auth Type
              </MaterialInputLabel>
              <MaterialSelect
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
                <MaterialMenuItem value='BASIC'>BASIC</MaterialMenuItem>
                <MaterialMenuItem value='API_KEY'>API KEY</MaterialMenuItem>
                <MaterialMenuItem value='OAUTH2'>OAUTH2</MaterialMenuItem>
              </MaterialSelect>
            </MaterialFormControl>
          </MaterialBox>
          <MaterialBox style={{ maxWidth: 700, marginTop: 20 }}>
            {this._renderAuthNConfig()}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
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
      <MaterialBox
        style={{
          padding: 24,
          marginBottom: 40
        }}
      >
        <MaterialBox style={{ maxWidth: 700 }}>
          <MaterialTextField
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
        </MaterialBox>
        <MaterialBox style={{ maxWidth: 700, marginTop: 20 }}>
          <MaterialTextField
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
        </MaterialBox>
        <MaterialBox style={{ maxWidth: 700, marginTop: 20 }}>
          <MaterialFormControl fullWidth variant='outlined' size='small'>
            <MaterialInputLabel id='policy-lable-id'>Type</MaterialInputLabel>
            <MaterialSelect
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
              <MaterialMenuItem value='AUTHN'>AUTHN</MaterialMenuItem>
              <MaterialMenuItem value='AUTHZ'>AUTHZ</MaterialMenuItem>
              <MaterialMenuItem value='WAF'>WAF</MaterialMenuItem>
              <MaterialMenuItem value='DYNAMIC'>DYNAMIC</MaterialMenuItem>
            </MaterialSelect>
          </MaterialFormControl>
        </MaterialBox>
        {this.props.actionButtons}
        <MaterialDivider style={{ marginTop: 20 }} />
        {this._renderAuthN()}
        {this._renderPlayGround()}
        {this._renderWAFOps()}
        {this._renderDynamicDefence()}
      </MaterialBox>
    )
  }
}


export default withStyles(classes)(observer(PolicyDetailsCard))
