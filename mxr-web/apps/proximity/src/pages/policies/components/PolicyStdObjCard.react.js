import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import PlatformSuccessCard from '/mxr-web/apps/proximity/src/components/platform/PlatformSuccessCard.react'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import NavTabsCard from '/mxr-web/apps/proximity/src/components/PageLayout/NavTabsCard'
import PolicyDetailsCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyDetailsCard.react'
import PolicyRevisionsCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyRevisionsCard.react'
import PolicyDecisionLogsCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyDecisionLogsCard.react'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store'

export class PolicyStdObjCard extends Component {
  async handleDecisionLogsFetch() {
    PolicyStore.setShowObjectViewModeSecondary('DECISION_LOGS')
    const policy = PolicyStore.getSelectedObject()
    PolicyStore.setShowProcessCard(true)
    LogStore.setSearchQuery({ 'data.policyId': policy.id })
    try {
      const logs = await LogStore.objectQuery()
      LogStore.setSearchResultsObjectCount(logs.count)
      LogStore.setObjects(logs.data)
    } catch (error) {
      console.log(`Error: Getting Logs`)
    }
    PolicyStore.setShowProcessCard(false)
  }

  _renderCreateButton() {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{
          marginRight: 20
        }}
        onClick={async () => {
          PolicyStore.setShowProcessCard(true)
          try {
            await PolicyStore.objectCreate()
            PolicyStore.setShowProcessCard(false)
            PolicyStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            PolicyStore.setShowSuccessCard(false)
            PolicyStore.resetAllFields()
          } catch (error) {
            console.log('Error: Creating Policy', error)
          }
          PolicyStore.setShowProcessCard(false)
        }}
      >
        Create
      </Button>
    )
  }

  _renderUdateButton() {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{
          marginRight: 20
        }}
        onClick={async () => {
          PolicyStore.setShowProcessCard(true)
          try {
            const updatedPolicy = await PolicyStore.objectUpdate()
            PolicyStore.setSelectedObject(updatedPolicy)
            PolicyStore.setShowProcessCard(false)
            PolicyStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            PolicyStore.setShowSuccessCard(false)
          } catch (error) {
            console.log('Error: Updating Policy', error)
          }
          PolicyStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }

  _renderOpButtons() {
    const viewMode = PolicyStore.getShowObjectViewMode()
    if (this.props.hideOpsButton) {
      return <Box></Box>
    }
    return (
      <Box style={{ marginTop: 20 }}>
        {viewMode === 'CREATE' ? this._renderCreateButton() : null}
        {viewMode === 'UPDATE' ? this._renderUdateButton() : null}
        <Button color='primary' onClick={() => this.props.onClose()}>
          Back
        </Button>
      </Box>
    )
  }

  _renderStdObjCard() {
    const selectedTab = PolicyStore.getShowObjectViewModeSecondary()
    switch (selectedTab) {
      case 'DETAILS':
        return <PolicyDetailsCard actionButtons={this._renderOpButtons()} />
        break
      case 'REVISIONS':
        return <PolicyRevisionsCard />
        break
      case 'DECISION_LOGS':
        return (
          <PolicyDecisionLogsCard
            fetchDecisionLogs={this.handleDecisionLogsFetch}
          />
        )
        break
      default:
        return <PolicyDetailsCard actionButtons={this._renderOpButtons()} />
    }
  }

  render() {
    const showSuccess = PolicyStore.getShowSuccessCard()
    const showLoader = PolicyStore.getShowProcessCard()
    const viewMode = PolicyStore.getShowObjectViewMode()
    if (showSuccess) {
      return (
        <Box style={{ margin: 50 }}>
          Success
          <PlatformSuccessCard iconColor='green' msg='Success !' />
        </Box>
      )
    }
    if (showLoader) {
      return <Box style={{ margin: 50 }}>Loading...</Box>
    }
    const selectedTab = PolicyStore.getShowObjectViewModeSecondary()
    const buttons = [
      {
        title: 'DETAILS',
        click: () => {
          PolicyStore.setShowObjectViewModeSecondary('DETAILS')
        },
        isActive: selectedTab === 'DETAILS'
      },
      {
        title: 'REVISIONS',
        click: async () => {
          PolicyStore.setShowProcessCard(true)
          try {
            const selectedPolicy = PolicyStore.getSelectedObject()
            const policy = await PolicyStore.objectQueryById(
              selectedPolicy.id,
              true
            )
            PolicyStore.setSelectedObject(policy)
            PolicyStore.setShowProcessCard(false)
          } catch (error) {
            console.log('Error: getting Policy', error)
          }
          PolicyStore.setShowProcessCard(false)
          PolicyStore.setShowObjectViewModeSecondary('REVISIONS')
        },
        isActive: selectedTab === 'REVISIONS'
      },
      {
        title: 'DECISION LOGS',
        click: async () => {
          PolicyStore.setShowObjectViewModeSecondary('DECISION_LOGS')
          this.handleDecisionLogsFetch()
        },
        isActive: selectedTab === 'DECISION_LOGS'
      }
    ]

    return (
      <Box>
        {!this.props.hideTabs ? (
          <React.Fragment>
            <NavTabsCard buttons={buttons} />
            <Divider />
          </React.Fragment>
        ) : null}
        {this._renderStdObjCard()}
      </Box>
    )
  }
}

export default observer(PolicyStdObjCard)
