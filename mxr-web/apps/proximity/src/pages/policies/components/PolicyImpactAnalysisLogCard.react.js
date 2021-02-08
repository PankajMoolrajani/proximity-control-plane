import React, { Component } from 'react'
import { observer } from 'mobx-react'
import axios from 'libs/axios/axios'
import JSONPretty from 'react-json-pretty'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import {
  MaterialBox,
  MaterialAccordion,
  MaterialAccordionSummary,
  MaterialAccordionDetails
} from 'libs/material'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { policyStore } from 'apps/proximity/stores/proximity.store'
import 'react-json-pretty/themes/monikai.css'


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
    const response = await axios.post(
      'opa/eval',
      {
        rules: policy.rules,
        input: policy.displayName.includes('EGRESS') ? { req: this.props.log.data.req, res: this.props.log.data.res } : {req: this.props.log.data.req}
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
      <MaterialAccordion
        expanded={this.state.expanded}
        onChange={() =>
          this.setState((prevState) => ({ expanded: !prevState.expanded }))
        }
      >
        <MaterialAccordionSummary
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
          <MaterialBox style={{ flex: 6, alignSelf: 'center', marginLeft: 10 }}>
            Request-{this.props.count}
          </MaterialBox>
          <MaterialBox style={{ flex: 2, alignSelf: 'center' }}>
            {log.data.decision.allow ? (
              <span style={{ color: '#6FCF97' }}>ALLOW</span>
            ) : (
              <span style={{ color: '#E57372' }}>DENY</span>
            )}
          </MaterialBox>
          <MaterialBox style={{ flex: 1, alignSelf: 'center' }}>
            <ArrowRightAltIcon />
          </MaterialBox>
          <MaterialBox style={{ flex: 2, alignSelf: 'center' }}>
            {this.state.isLoading ? (
              <span style={{ color: 'var(--primaryColor)' }}>Checking...</span>
            ) : this.state.decision ? (
              <span style={{ color: '#6FCF97' }}>ALLOW</span>
            ) : (
              <span style={{ color: '#E57372' }}>DENY</span>
            )}
          </MaterialBox>
        </MaterialAccordionSummary>
        <MaterialAccordionDetails>
          <MaterialBox style={{ width: '100%', overflow: 'auto' }}>
            <JSONPretty data={log.data}></JSONPretty>
          </MaterialBox>
        </MaterialAccordionDetails>
      </MaterialAccordion>
    )
  }
}


export default observer(PolicyImpactAnalysisLogCard)
