import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import { Pie } from 'react-chartjs-2'
import { MaterialBox, MaterialButton } from 'libs/material'
import PlatformLoaderCard from 'apps/platform/components/PlatformLoaderCard.react'
import PolicyImpactAnalysisLogCard from './PolicyImpactAnalysisLogCard.react'
import {
  virtualServiceStore,
  policyStore
} from 'apps/proximity/stores/proximity.store'
import { logStore } from 'apps/platform/stores/platform.store'

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
      return (
        <MaterialBox style={{ textAlign: 'center', marginTop: 20 }}>
          No Logs
        </MaterialBox>
      )
    }
    return (
      <React.Fragment>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 10
          }}
        >
          <MaterialBox>
            <MaterialBox className={this.props.classes.dashTitle}>
              Sample Requests
            </MaterialBox>
            <MaterialBox className={this.props.classes.dashNum}>
              {count}
            </MaterialBox>
          </MaterialBox>
          <MaterialBox>
            <MaterialBox className={this.props.classes.dashTitle}>
              Decision
            </MaterialBox>
            <MaterialBox>
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
            </MaterialBox>
          </MaterialBox>
          <MaterialBox>
            <MaterialBox className={this.props.classes.dashTitle}>
              Decision Changed
            </MaterialBox>
            <MaterialBox className={this.props.classes.dashNum}>
              {percentageChanged.toFixed(2)} %
            </MaterialBox>
          </MaterialBox>
        </MaterialBox>
        <MaterialBox
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
        </MaterialBox>
      </React.Fragment>
    )
  }


  render() {
    const showLoader = logStore.getShowProcessCard()
    if (showLoader) {
      return (
        <MaterialBox style={{ margin: 50 }}>
          <PlatformLoaderCard />
        </MaterialBox>
      )
    }
    return (
      <MaterialBox>
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: 5
          }}
        >
          <MaterialButton
            variant='contained'
            color='primary'
            size='small'
            onClick={this.handleFetchLog}
          >
            Run Impact Analysis
          </MaterialButton>
        </MaterialBox>
        {this._renderLogs()}
      </MaterialBox>
    )
  }
}


export default withStyles(classes)(observer(PolicyImpactAnalysisCard))
