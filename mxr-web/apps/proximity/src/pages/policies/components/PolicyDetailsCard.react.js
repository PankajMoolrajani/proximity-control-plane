import { useEffect, useState, Fragment } from 'react'
import { observer } from 'mobx-react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import JSONPretty from 'react-json-pretty'
import {
  Box,
  TextField,
  FormControl,
  FormHelperText,
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
import { useAuth0 } from '@auth0/auth0-react'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getAxiosServiceInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import { createCrudLog } from '/mxr-web/apps/proximity/src/libs/logs/log.lib'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import PlatformSuccessCard from '/mxr-web/apps/proximity/src/components/platform/PlatformSuccessCard.react'
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

const { policyStore, policyRevisionStore, virtualServiceStore } = stores

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

const PolicyDetailsCard = ({
  policyId,
  createCallback,
  updateCallback,
  finalCallback
}) => {
  const [opaInput, setOpaInput] = useState('')
  const [opaOutput, setOpaOutput] = useState('')
  const [showEvaluateCard, setShowEvaluateCard] = useState(true)
  const [showImpactAnalysisCard, setShowImactAnalysisCard] = useState(false)
  const { user } = useAuth0()
  const { push } = useHistory()
  const [selectedServices, setSelectedServices] = useState([])
  const classes = useStyles()
  const showSuccess = policyStore.getShowSuccessCard()
  const showLoader = policyStore.getShowProcessCard()
  const formFields = policyStore.getFormFields()
  const policy = policyStore.getSelectedObject()
  const viewMode = policyId ? 'UPDATE' : 'CREATE'
  let authz_rules = ''
  let authn_type = ''
  let authn_basic_username = ''
  let authn_basic_password = ''
  let authn_apikey = ''
  let authn_oauth2_appId = ''
  let authn_oauth2_appKey = ''
  let waf_sql_injection_enabled = true
  let waf_local_file_inclusion = true
  let waf_shell_injection_enabled = true
  let waf_shell_shock_enabled = true
  let dynamic_dynamic_defence_enabled = true
  let policyName
  if (viewMode === 'CREATE') {
    policyName = formFields ? formFields.name : ''
    authz_rules = formFields ? formFields.rules : ''
  }

  if (viewMode === 'UPDATE') {
    policyName = policy ? policy.name : ''

    if (formFields) {
      if (formFields && formFields.type === 'AUTHZ') {
        authz_rules = formFields.rules
      }

      if (formFields.type === 'AUTHN') {
        const authNRules = JSON.parse(formFields.rules)
        authn_type = authNRules.type
        if (authn_type === 'BASIC') {
          authn_basic_username = authNRules.authData.username
          authn_basic_password = authNRules.authData.password
        } else if (authn_type === 'API_KEY') {
          authn_apikey = authNRules.authData.apiKey
        } else if (authn_type === 'OAUTH2') {
          authn_oauth2_appId = authNRules.authData.appId
          authn_oauth2_appKey = authNRules.authData.appKey
        }
      }

      if (formFields.type === 'WAF') {
        const wafRules = JSON.parse(formFields.rules)
        if (wafRules) {
          waf_sql_injection_enabled = wafRules.sql_injection_enabled
          waf_local_file_inclusion = wafRules.local_file_inclusion
          waf_shell_injection_enabled = wafRules.shell_injection_enabled
          waf_shell_shock_enabled = wafRules.shell_shock_enabled
        }
      }

      if (formFields.type === 'DYNAMIC') {
        const dynamicRules = JSON.parse(formFields.rules)
        if (dynamicRules) {
          dynamic_dynamic_defence_enabled = dynamicRules.dynamic_defence_enabled
        }
      }
    }
  }

  const getRules = (values) => {
    const type = values.type
    let rules = {}
    if (type === 'AUTHN') {
      rules.type = values.authn_type
      switch (rules.type) {
        case 'BASIC':
          rules.authData = {
            username: values.authn_basic_username,
            password: values.authn_basic_password
          }
          rules = JSON.stringify(rules)
          break
        case 'API_KEY':
          rules.authData = {
            apiKey: values.authn_apikey
          }
          rules = JSON.stringify(rules)
          break
        case 'OAUTH2':
          rules.authData = {
            appId: values.authn_oauth2_appId,
            appKey: values.authn_oauth2_appKey
          }
          rules = JSON.stringify(rules)
          break
        default:
          rules.authData = JSON.stringify({})
      }
    } else if (type === 'AUTHZ') {
      rules = policyForm.values.authz_rules
    } else if (type === 'WAF') {
      rules = JSON.stringify({
        sql_injection_enabled: policyForm.values.waf_sql_injection_enabled,
        local_file_inclusion: policyForm.values.waf_local_file_inclusion,
        shell_injection_enabled: policyForm.values.waf_shell_injection_enabled,
        shell_shock_enabled: policyForm.values.waf_shell_shock_enabled
      })
    } else if (type === 'DYNAMIC') {
      rules = JSON.stringify({
        dynamic_defence_enabled:
          policyForm.values.dynamic_dynamic_defence_enabled
      })
    }

    return rules
  }
  const createPolicy = async () => {
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
      createCrudLog(
        `${user.name ? user.name : user.email} Created Policy - ${
          createdPolicy.displayName
        }`
      )
      if (createCallback) {
        await createCallback()
      } else {
        push('/policies')
      }
    } catch (error) {
      console.log('Error: Creating Policy', error)
    }
    policyStore.setShowProcessCard(false)
  }

  const updatePolicy = async () => {
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
      policyRevisionStore.setFormFields(createdPolicyRevision)
      await fetchPolicyById()
      if (updateCallback) {
        await updateCallback()
      }
      policyStore.setShowProcessCard(false)
      policyStore.setShowSuccessCard(true)
      await new Promise((res) => setTimeout(res, 2000))
      policyStore.setShowSuccessCard(false)
      createCrudLog(
        `${user.name ? user.name : user.email} Updated Policy - ${
          updatedPolicy.displayName
        }`
      )
    } catch (error) {
      console.log('Error: Updating Policy', error)
    }
    policyStore.setShowProcessCard(false)
  }

  const initialValues = {
    name: policyName,
    displayName: formFields ? formFields.displayName : '',
    type: formFields ? formFields.type : '',
    authz_rules: authz_rules,
    authn_type: authn_type,
    authn_basic_username: authn_basic_username,
    authn_basic_password: authn_basic_password,
    authn_apikey: authn_apikey,
    authn_oauth2_appId: authn_oauth2_appId,
    authn_oauth2_appKey: authn_oauth2_appKey,
    waf_sql_injection_enabled: waf_sql_injection_enabled,
    waf_local_file_inclusion: waf_local_file_inclusion,
    waf_shell_injection_enabled: waf_shell_injection_enabled,
    waf_shell_shock_enabled: waf_shell_shock_enabled,
    dynamic_dynamic_defence_enabled: dynamic_dynamic_defence_enabled
  }
  
  const validationSchema = {
    name: Yup.string().required('Required!').min(5),
    displayName: Yup.string().required('Required!').min(5),
    type: Yup.string()
      .required('Required!')
      .oneOf(['AUTHN', 'AUTHZ', 'WAF', 'DYNAMIC']),
    authz_rules: Yup.string().when('type', {
      is: (type) => type === 'AUTHZ',
      then: Yup.string().required('Required!').min(10),
      otherwise: Yup.string()
    }),
    authn_type: Yup.string().when('type', {
      is: (type) => type === 'AUTHN',
      then: Yup.string()
        .required('Required!')
        .oneOf(['BASIC', 'API_KEY', 'OAUTH2']),
      otherwise: Yup.string()
    }),
    authn_basic_username: Yup.string().when(['type', 'authn_type'], {
      is: (type, authn_type) => type === 'AUTHN' && authn_type === 'BASIC',
      then: Yup.string().required('Required!'),
      otherwise: Yup.string()
    }),
    authn_basic_password: Yup.string().when(['type', 'authn_type'], {
      is: (type, authn_type) => type === 'AUTHN' && authn_type === 'BASIC',
      then: Yup.string().required('Required!'),
      otherwise: Yup.string()
    }),
    authn_apikey: Yup.string().when(['type', 'authn_type'], {
      is: (type, authn_type) => type === 'AUTHN' && authn_type === 'API_KEY',
      then: Yup.string().required('Required!'),
      otherwise: Yup.string()
    }),
    authn_oauth2_appId: Yup.string().when(['type', 'authn_type'], {
      is: (type, authn_type) => type === 'AUTHN' && authn_type === 'OAUTH2',
      then: Yup.string().required('Required!'),
      otherwise: Yup.string()
    }),
    authn_oauth2_appKey: Yup.string().when(['type', 'authn_type'], {
      is: (type, authn_type) => type === 'AUTHN' && authn_type === 'OAUTH2',
      then: Yup.string().required('Required!'),
      otherwise: Yup.string()
    }),
    waf_sql_injection_enabled: Yup.boolean().when('type', {
      is: (type) => type === 'WAF',
      then: Yup.boolean().required('Required!'),
      otherwise: Yup.boolean()
    }),
    waf_local_file_inclusion: Yup.boolean().when('type', {
      is: (type) => type === 'WAF',
      then: Yup.boolean().required('Required!'),
      otherwise: Yup.boolean()
    }),
    waf_shell_injection_enabled: Yup.boolean().when('type', {
      is: (type) => type === 'WAF',
      then: Yup.boolean().required('Required!'),
      otherwise: Yup.boolean()
    }),
    waf_shell_shock_enabled: Yup.boolean().when('type', {
      is: (type) => type === 'WAF',
      then: Yup.boolean().required('Required!'),
      otherwise: Yup.boolean()
    }),
    dynamic_dynamic_defence_enabled: Yup.boolean().when('type', {
      is: (type) => type === 'DYNAMIC',
      then: Yup.boolean().required('Required!'),
      otherwise: Yup.boolean()
    })
  }

  const policyForm = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({ ...validationSchema }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(JSON.parse(JSON.stringify(policyStore.getFormFields())))
      if (viewMode === 'CREATE') {
        policyStore.setFormFields({
          name: values.name,
          displayName: values.displayName,
          type: values.type,
          rules: getRules(values)
        })
        await createPolicy()
      } else if (viewMode === 'UPDATE') {
        policyStore.setFormFields({
          id: policyId,
          name: values.name,
          displayName: values.displayName,
          type: values.type,
          rules: getRules(values)
        })
        await updatePolicy()
      }
      if (finalCallback) {
        await finalCallback()
      }
    }
  })

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

  if (showLoader) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  const handleEvaluate = async () => {
    const policy = policyStore.getFormFields()
    const axiosServiceInstance = getAxiosServiceInstance()
    const response = await axiosServiceInstance.post(
      '/proximity/eval',
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
    const virtualService = virtualServiceStore.getSelectedObject()
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
          {virtualService ? (
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
          ) : (
            ''
          )}
        </ButtonGroup>
      </Box>
    )
  }

  const _renderPlayGround = () => {
    if (policyForm.values.type !== 'AUTHZ') {
      return <Box></Box>
    }
    return (
      <Box>
        <Grid container>
          <Grid item xs={6}>
            <Box>
              <CodeMirror
                className={classes.codeMirrorFull}
                value={policyForm.values.authz_rules}
                options={{
                  theme: 'idea',
                  lineNumbers: true,
                  matchBrackets: true,
                  mode: 'rego',
                  height: '600px'
                }}
                onBeforeChange={(editor, data, value) => {
                  policyForm.setFieldValue('authz_rules', value)
                  policyForm.handleChange('authz_rules')
                  policyForm.handleBlur('authz_rules')
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
            {showImpactAnalysisCard ? (
              <PolicyImpactAnalysisCard rules={policyForm.values.authz_rules} />
            ) : null}
          </Grid>
        </Grid>
        <Divider />
      </Box>
    )
  }

  const _renderWAFOps = () => {
    if (policyForm.values.type !== 'WAF') {
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
            name='waf_sql_injection_enabled'
            id='waf_sql_injection_enabled'
            checked={policyForm.values.waf_sql_injection_enabled}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
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
            name='waf_local_file_inclusion'
            id='waf_local_file_inclusion'
            checked={policyForm.values.waf_local_file_inclusion}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
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
            name='waf_shell_injection_enabled'
            id='waf_shell_injection_enabled'
            checked={policyForm.values.waf_shell_injection_enabled}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
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
            name='waf_shell_shock_enabled'
            id='waf_shell_shock_enabled'
            checked={policyForm.values.waf_shell_shock_enabled}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
          />
          <Box>Shell Shock</Box>
        </Box>
      </Box>
    )
  }

  const _renderDynamicDefence = () => {
    if (policyForm.values.type !== 'DYNAMIC') {
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
            id='dynamic_dynamic_defence_enabled'
            name='dynamic_dynamic_defence_enabled'
            checked={policyForm.values.dynamic_dynamic_defence_enabled}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
          />
          <Box>Dynamic Defence</Box>
        </Box>
      </Box>
    )
  }

  const generateKey = async () => {
    await policyForm.setFieldValue('authn_apikey', uuid().replaceAll('-', ''))
    policyForm.handleChange('authn_apikey')
    policyForm.handleBlur('authn_apikey')
  }

  const _renderAuthNConfig = () => {
    const authn_type = policyForm.values.authn_type
    if (!authn_type) {
      return <Box></Box>
    }

    switch (authn_type) {
      case 'BASIC':
        return (
          <Box>
            <Box>
              <TextField
                fullWidth
                label='User Name'
                variant='outlined'
                size='small'
                id='authn_basic_username'
                name='authn_basic_username'
                value={policyForm.values.authn_basic_username}
                onChange={policyForm.handleChange}
                onBlur={policyForm.handleBlur}
                error={
                  policyForm.touched.authn_basic_username &&
                  Boolean(policyForm.errors.authn_basic_username)
                }
                helperText={
                  policyForm.touched.authn_basic_username &&
                  policyForm.errors.authn_basic_username
                }
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
                id='authn_basic_password'
                name='authn_basic_password'
                value={policyForm.values.authn_basic_password}
                onChange={policyForm.handleChange}
                onBlur={policyForm.handleBlur}
                error={
                  policyForm.touched.authn_basic_password &&
                  Boolean(policyForm.errors.authn_basic_password)
                }
                helperText={
                  policyForm.touched.authn_basic_password &&
                  policyForm.errors.authn_basic_password
                }
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
                id='authn_apikey'
                name='authn_apikey'
                value={policyForm.values.authn_apikey}
                error={
                  policyForm.touched.authn_apikey &&
                  Boolean(policyForm.errors.authn_apikey)
                }
                helperText={
                  policyForm.touched.authn_apikey &&
                  policyForm.errors.authn_apikey
                }
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
        return (
          <Box>
            <Box>
              <TextField
                fullWidth
                label='App ID'
                variant='outlined'
                size='small'
                id='authn_oauth2_appId'
                name='authn_oauth2_appId'
                value={policyForm.values.authn_oauth2_appId}
                onChange={policyForm.handleChange}
                onBlur={policyForm.handleBlur}
                error={
                  policyForm.touched.authn_oauth2_appId &&
                  Boolean(policyForm.errors.authn_oauth2_appId)
                }
                helperText={
                  policyForm.touched.authn_oauth2_appId &&
                  policyForm.errors.authn_oauth2_appId
                }
              />
            </Box>
            <Box
              style={{
                marginTop: 20
              }}
            >
              <TextField
                fullWidth
                label='App Key'
                variant='outlined'
                size='small'
                type='password'
                id='authn_oauth2_appKey'
                name='authn_oauth2_appKey'
                value={policyForm.values.authn_oauth2_appKey}
                onChange={policyForm.handleChange}
                onBlur={policyForm.handleBlur}
                error={
                  policyForm.touched.authn_oauth2_appKey &&
                  Boolean(policyForm.errors.authn_oauth2_appKey)
                }
                helperText={
                  policyForm.touched.authn_oauth2_appKey &&
                  policyForm.errors.authn_oauth2_appKey
                }
              />
            </Box>
          </Box>
        )
        break
      default:
        return <Box>Please select Auth type</Box>
    }
  }

  const _renderAuthN = () => {
    if (policyForm.values.type !== 'AUTHN') {
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
                name='authn_type'
                id='authn_type'
                value={policyForm.values.authn_type}
                onChange={policyForm.handleChange}
                onBlur={policyForm.handleBlur}
                error={
                  policyForm.touched.authn_type &&
                  Boolean(policyForm.errors.authn_type)
                }
              >
                <MenuItem value='BASIC'>BASIC</MenuItem>
                <MenuItem value='API_KEY'>API_KEY</MenuItem>
                <MenuItem value='OAUTH2'>OAUTH2</MenuItem>
              </Select>
              {policyForm.touched.authn_type && policyForm.errors.authn_type ? (
                <FormHelperText>{policyForm.errors.authn_type}</FormHelperText>
              ) : (
                ''
              )}
            </FormControl>
          </Box>
          <Box style={{ maxWidth: 700, marginTop: 20 }}>
            {_renderAuthNConfig()}
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      style={{
        padding: 24,
        marginBottom: 40
      }}
    >
      <form onSubmit={policyForm.handleSubmit}>
        <Box style={{ maxWidth: 700 }}>
          <TextField
            fullWidth
            label='Name'
            variant='outlined'
            size='small'
            id='name'
            name='name'
            value={policyForm.values.name}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
            disabled={viewMode !== 'CREATE'}
            error={policyForm.touched.name && Boolean(policyForm.errors.name)}
            helperText={policyForm.touched.name && policyForm.errors.name}
          />
        </Box>
        <Box style={{ maxWidth: 700, marginTop: 20 }}>
          <TextField
            fullWidth
            label='Display name'
            variant='outlined'
            size='small'
            id='displayName'
            name='displayName'
            value={policyForm.values.displayName}
            onChange={policyForm.handleChange}
            onBlur={policyForm.handleBlur}
            error={
              policyForm.touched.displayName &&
              Boolean(policyForm.errors.displayName)
            }
            helperText={
              policyForm.touched.displayName && policyForm.errors.displayName
            }
          />
        </Box>
        <Box style={{ maxWidth: 700, marginTop: 20 }}>
          <FormControl fullWidth variant='outlined' size='small'>
            <InputLabel id='policy-lable-id'>Type</InputLabel>
            <Select
              ref={null}
              labelId='policy-lable-id'
              label='Type'
              id='type'
              name='type'
              value={policyForm.values.type}
              onChange={policyForm.handleChange}
              onBlur={policyForm.handleBlur}
              error={
                policyForm.touched.displayName &&
                Boolean(policyForm.errors.displayName)
              }
            >
              <MenuItem value='AUTHN'>AUTHN</MenuItem>
              <MenuItem value='AUTHZ'>AUTHZ</MenuItem>
              <MenuItem value='WAF'>WAF</MenuItem>
              <MenuItem value='DYNAMIC'>DYNAMIC</MenuItem>
            </Select>
            {policyForm.touched.type && policyForm.errors.type ? (
              <FormHelperText>{policyForm.errors.type}</FormHelperText>
            ) : (
              ''
            )}
          </FormControl>
        </Box>
        <Box my={2}>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={policyForm.dirty && !policyForm.isValid}
          >
            {viewMode === 'CREATE' ? 'Create' : 'Update'}
          </Button>
        </Box>

        <Divider style={{ marginTop: 20 }} />
        {_renderAuthN()}
        {_renderPlayGround()}
        {_renderWAFOps()}
        {_renderDynamicDefence()}
      </form>
    </Box>
  )
}

export default observer(PolicyDetailsCard)
