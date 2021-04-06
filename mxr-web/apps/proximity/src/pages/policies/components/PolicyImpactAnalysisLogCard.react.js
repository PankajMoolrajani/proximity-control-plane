import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import { axiosInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'
import JSONPretty from 'react-json-pretty'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
import 'react-json-pretty/themes/monikai.css'
const { policyStore } = stores

export class PolicyImpactAnalysisLogCard extends Component {
  state = {
    isLoading: false,
    decision: null,
    expanded: false
  }

  handleEvaluate = async () => {
    const policy = policyStore.getFormFields()
    if (!policy.rules.trim()) {
      return
    }
    const response = await axiosInstance.post(
      'opa/eval',
      {
        rules: policy.rules,
        input: policy.displayName.includes('EGRESS')
          ? { req: this.props.log.data.req, res: this.props.log.data.res }
          : { req: this.props.log.data.req }
      },
      {
        headers: {
          'Content-type': 'application/json'
        }
      }
    )
    if (response.status === 200) {
      this.setState({ decision: response.data.allow })
      if (this.props.log.data.decision.allow !== response.data.allow) {
        this.props.decisionChanged()
      }
      if (response.data.allow) {
        this.props.addAllowed()
      } else {
        this.props.addDenied()
      }
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      await this.handleEvaluate()
    } catch (error) {
      console.log('Error: Error in evaluation')
    }

    this.setState({ isLoading: false })
  }

  render() {
    const log = this.props.log
    return (
      <Accordion
        expanded={this.state.expanded}
        onChange={() =>
          this.setState((prevState) => ({ expanded: !prevState.expanded }))
        }
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
            Request-{this.props.count}
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
            {this.state.isLoading ? (
              <span style={{ color: 'var(--primaryColor)' }}>Checking...</span>
            ) : this.state.decision ? (
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
}

export default observer(PolicyImpactAnalysisLogCard)
