import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import { Pie } from 'react-chartjs-2'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'

class PoliciesCard extends Component {
  state = {
    totalPolicies: 0,
    policiesLast7days: 0,
    wafPolicies: 0,
    authnPolicies: 0,
    authzPolicies: 0
  }

  async componentDidMount() {
    PolicyStore.setSearchPageObjectCount(1000)
    const policies = await PolicyStore.objectQuery()
    this.setState({ totalPolicies: policies.count })
    let last7Days = 0
    policies.data.forEach((policy) => {
      if (
        new Date(policy.tsCreate) >
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      ) {
        last7Days++
      }
    })
    this.setState({ policiesLast7days: last7Days })

    this.setState({
      wafPolicies: policies.data.filter(
        (policy) => policy.currentRevision.policy.type === 'WAF'
      ).length
    })
    this.setState({
      authnPolicies: policies.data.filter(
        (policy) => policy.currentRevision.policy.type === 'AUTHN'
      ).length
    })
    this.setState({
      authzPolicies: policies.data.filter(
        (policy) => policy.currentRevision.policy.type === 'AUTHZ'
      ).length
    })
  }

  render() {
    const details = {
      labels: ['AUTHN', 'AUTHZ', 'WAF'],
      datasets: [
        {
          label: 'Polices',
          backgroundColor: ['#76BA1B', '#68BB59', '#ACDF87'],
          data: [
            this.state.authnPolicies,
            this.state.authzPolicies,
            this.state.wafPolicies
          ]
        }
      ]
    }
    return (
      <Box
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box style={{ textAlign: 'center' }}>
          <Box style={{ fontSize: 18 }}>Policies</Box>
          <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
            {this.state.totalPolicies}
          </Box>
          <Box>
            <span style={{ color: '#00e300' }}>
              +{this.state.policiesLast7days}{' '}
            </span>
            in last 7 days
          </Box>
        </Box>
        <Box>
          <Pie
            width={200}
            height={100}
            data={details}
            options={{
              legend: {
                position: 'right',
                align: 'top',
                labels: {
                  boxWidth: 20
                }
              }
            }}
          />
        </Box>
      </Box>
    )
  }
}

export default observer(PoliciesCard)
