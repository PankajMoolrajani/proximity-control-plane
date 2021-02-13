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
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore, logStore, policyRevisionStore } = stores

export class PolicyStdObjCard extends Component {
  async handleDecisionLogsFetch() {
    policyStore.setShowObjectViewModeSecondary('DECISION_LOGS')
    const policy = policyStore.getSelectedObject()
    policyStore.setShowProcessCard(true)
    logStore.setSearchQuery({
      type: 'PROXIMITY_DECISION_LOG',
      PolicyRevisionId: {
        $in: policy.PolicyRevisions.map((policyRevision) => policyRevision.id)
      }
    })
    try {
      const logs = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(logs.count)
      logStore.setObjects(logs.rows)
    } catch (error) {
      console.log(`Error: Getting Logs`)
    }
    policyStore.setShowProcessCard(false)
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
          } catch (error) {
            console.log('Error: Creating Policy', error)
          }
          policyStore.setShowProcessCard(false)
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
            policyStore.setSelectedObject(updatedPolicy)
            policyStore.setShowProcessCard(false)
            policyStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            policyStore.setShowSuccessCard(false)
          } catch (error) {
            console.log('Error: Updating Policy', error)
          }
          policyStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }

  _renderOpButtons() {
    const viewMode = policyStore.getShowObjectViewMode()
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
    const selectedTab = policyStore.getShowObjectViewModeSecondary()
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
    const showSuccess = policyStore.getShowSuccessCard()
    const showLoader = policyStore.getShowProcessCard()
    const viewMode = policyStore.getShowObjectViewMode()
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
    const selectedTab = policyStore.getShowObjectViewModeSecondary()
    const buttons = [
      {
        title: 'DETAILS',
        click: () => {
          policyStore.setShowObjectViewModeSecondary('DETAILS')
        },
        isActive: selectedTab === 'DETAILS'
      },
      {
        title: 'REVISIONS',
        click: () => {
          policyStore.setShowObjectViewModeSecondary('REVISIONS')
        },
        isActive: selectedTab === 'REVISIONS'
      },
      {
        title: 'DECISION LOGS',
        click: async () => {
          policyStore.setShowObjectViewModeSecondary('DECISION_LOGS')
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
