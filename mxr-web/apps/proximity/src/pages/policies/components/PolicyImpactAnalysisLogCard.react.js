import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import JSONPretty from 'react-json-pretty'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { axiosServiceInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
import 'react-json-pretty/themes/monikai.css'
const { policyStore } = stores

const PolicyImpactAnalysisLogCard = ({
  log,
  count,
  addAllowed,
  addDenied,
  decisionChanged
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [decision, setDecision] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const handleEvaluate = async () => {
    setIsLoading(true)
    try {
      const policy = policyStore.getFormFields()
      if (!policy.rules.trim()) {
        return
      }
      const response = await axiosServiceInstance.post(
        'proximity/eval',
        {
          rules: policy.rules,
          input: policy.displayName.includes('EGRESS')
            ? { req: log.data.req, res: log.data.res }
            : { req: log.data.req }
        },
        {
          headers: {
            'Content-type': 'application/json'
          }
        }
      )
      if (response.status === 200) {
        setDecision(response.data.allow)
        if (log.data.decision.allow !== response.data.allow) {
          decisionChanged()
        }
        if (response.data.allow) {
          addAllowed()
        } else {
          addDenied()
        }
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    handleEvaluate()
  }, [])

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded((value) => !value)}
    >
      <AccordionSummary
        style={{
          display: 'flex',
          padding: '0 5px',
          alignItems: 'center'
        }}
        expandIcon={<ExpandMoreIcon />}
        IconButtonProps={{
          size: 'small'
        }}
      >
        <Box style={{ flex: 6, alignSelf: 'center', marginLeft: 10 }}>
          Request-{count}
        </Box>
        <Box style={{ flex: 2, alignSelf: 'center' }}>
          {log.data.decision.allow ? (
            <span style={{ color: '#6FCF97' }}>ALLOW</span>
          ) : (
            <span style={{ color: '#E57372' }}>DENY</span>
          )}
        </Box>
        <Box style={{ flex: 1, alignSelf: 'center' }}>
          <ArrowRightAltIcon />
        </Box>
        <Box style={{ flex: 2, alignSelf: 'center' }}>
          {isLoading ? (
            <span style={{ color: 'var(--primaryColor)' }}>Checking...</span>
          ) : decision ? (
            <span style={{ color: '#6FCF97' }}>ALLOW</span>
          ) : (
            <span style={{ color: '#E57372' }}>DENY</span>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box style={{ width: '100%', overflow: 'auto' }}>
          <JSONPretty data={log.data}></JSONPretty>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default observer(PolicyImpactAnalysisLogCard)
