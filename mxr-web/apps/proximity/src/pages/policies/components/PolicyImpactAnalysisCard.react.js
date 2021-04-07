import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import { Pie } from 'react-chartjs-2'
import { Box, Button } from '@material-ui/core'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import PolicyImpactAnalysisLogCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyImpactAnalysisLogCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { logStore, policyStore, virtualServiceStore } = stores

const classes = {
  dashTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  dashNum: {
    fontSize: 32
  }
}

export class PolicyImpactAnalysisCard extends Component {
  state = {
    allowed: 0,
    denied: 0,
    decisionChanged: 0
  }
  chartRef = React.createRef()

  componentWillUnmount() {
    logStore.resetAllFields()
  }

  handleDecisionChanged = () => {
    this.setState((prevState) => ({
      decisionChanged: prevState.decisionChanged + 1
    }))
  }

  handleAddAllowed = () => {
    this.setState((prevState) => ({ allowed: prevState.allowed + 1 }))
  }

  handleAddDenied = () => {
    this.setState((prevState) => ({ denied: prevState.denied + 1 }))
  }

  handleFetchLog = async () => {
    this.setState({
      allowed: 0,
      denied: 0,
      decisionChanged: 0
    })
    const policy = policyStore.getSelectedObject()
    const virtualService = virtualServiceStore.getSelectedObject()
    logStore.setShowProcessCard(true)
    const searchQuery = {}
    if (virtualService) {
      searchQuery['data.virtualServiceId'] = virtualService.id
    }
    if (policy) {
      searchQuery['data.policyId'] = policy.id
    }
    logStore.setSearchQuery(searchQuery)
    logStore.setSearchPageObjectCount(100)
    logStore.setSortQuery({ _id: -1 })
    try {
      const logs = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(logs.count)
      logStore.setObjects(logs.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    logStore.setShowProcessCard(false)
  }

  _renderLogs() {
    const logs = logStore.getObjects()
    const count = logs ? logs.length : 0
    const percentageChanged = (100 * this.state.decisionChanged) / count

    if (!logs || logs.length === 0) {
      return <Box style={{ textAlign: 'center', marginTop: 20 }}>No Logs</Box>
    }
    return (
      <React.Fragment>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 10
          }}
        >
          <Box>
            <Box className={this.props.classes.dashTitle}>Sample Requests</Box>
            <Box className={this.props.classes.dashNum}>{count}</Box>
          </Box>
          <Box>
            <Box className={this.props.classes.dashTitle}>Decision</Box>
            <Box>
              <Pie
                ref={this.chartRef}
                width={150}
                height={75}
                data={{
                  labels: ['ALLOW', 'DENY'],
                  datasets: [
                    {
                      data: [this.state.allowed, this.state.denied],
                      backgroundColor: ['#6FCF97', '#E57372']
                    }
                  ],
                  position: 'right'
                }}
                options={{
                  maintainAspectRatio: true,
                  legend: {
                    position: 'right',
                    align: 'center',
                    fullWidth: false,
                    labels: {
                      boxWidth: 20
                    }
                  }
                }}
              />
            </Box>
          </Box>
          <Box>
            <Box className={this.props.classes.dashTitle}>Decision Changed</Box>
            <Box className={this.props.classes.dashNum}>
              {percentageChanged.toFixed(2)} %
            </Box>
          </Box>
        </Box>
        <Box
          className='hideScroll'
          style={{
            maxHeight: 300,
            overflowY: 'auto',
            padding: '10px 0'
          }}
        >
          {logs.map((log, index) => (
            <PolicyImpactAnalysisLogCard
              key={log.id}
              log={log}
              count={index + 1}
              addAllowed={this.handleAddAllowed}
              addDenied={this.handleAddDenied}
              decisionChanged={this.handleDecisionChanged}
            />
          ))}
        </Box>
      </React.Fragment>
    )
  }

  render() {
    const showLoader = logStore.getShowProcessCard()
    if (showLoader) {
      return (
        <Box style={{ margin: 50 }}>
          <PlatformLoaderCard />
        </Box>
      )
    }
    return (
      <Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 5
          }}
        >
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={this.handleFetchLog}
          >
            Run Impact Analysis
          </Button>
        </Box>
        {this._renderLogs()}
      </Box>
    )
  }
}

export default withStyles(classes)(observer(PolicyImpactAnalysisCard))
