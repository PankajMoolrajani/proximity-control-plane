import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import PlatformSuccessCard from '/mxr-web/apps/proximity/src/components/platform/PlatformSuccessCard.react'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import NavTabsCard from '/mxr-web/apps/proximity/src/components/PageLayout/NavTabsCard'
import VirtualServiceDetailsCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDetailsCard.react'
import VirtualServiceDeploymentCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDeploymentCard.react'
import VirtualServicePoliciesCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePoliciesCard.react'
import VirtualServiceDecisionLogs from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDecisionLogs.react'
import VirtualServiceMonitor from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceMonitor.react'
import VirtualServicePolicyRecommendationCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePolicyRecommendationCard.react'
import { VirtualServiceAccessLogs } from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAccessLogs.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const {
  policyStore,
  virtualServiceStore,
  logStore,
  policyRecommendationStore
} = stores

export class VirtualServiceStdObjCard extends Component {
  componentDidMount() {
    virtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
  }

  async handleRevisionsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('REVISIONS')
    virtualServiceStore.setShowProcessCard(true)
    try {
      const selectedVirtualService = virtualServiceStore.getSelectedObject()
      const virtualService = await virtualServiceStore.objectQueryById(
        selectedVirtualService.id,
        true
      )
      virtualServiceStore.setSelectedObject(virtualService)
      virtualServiceStore.setShowProcessCard(false)
    } catch (error) {
      console.log('Error: getting virtual service', error)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  async handleDecisionLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('DECISION_LOGS')
    const virtualService = virtualServiceStore.getSelectedObject()
    virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchPageObjectCount(10)
    logStore.setSearchQuery({
      VirtualServiceId: virtualService.id,
      type: 'PROXIMITY_DECISION_LOG'
    })
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.rows)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  async handleAccessLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('ACCESS_LOGS')
    const virtualService = virtualServiceStore.getSelectedObject()
    virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchPageObjectCount(10)
    logStore.setSearchQuery({
      VirtualServiceId: virtualService.id,
      type: 'PROXIMITY_ACCESS_LOG'
    })
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.rows)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  async handlePolicyRecommendationsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('RECOMMENDATIONS')
    virtualServiceStore.setShowProcessCard(true)
    try {
      const poilcyRecommendations = await policyRecommendationStore.objectQuery()
      policyRecommendationStore.setSearchResultsObjectCount(
        poilcyRecommendations.count
      )
      policyRecommendationStore.setObjects(poilcyRecommendations.rows)
    } catch (error) {
      console.log(`Error: Getting poilcy recommendations`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  async handleMonitorLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('MONITOR')
    const virtualService = virtualServiceStore.getSelectedObject()
    virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchPageObjectCount(10)
    logStore.setSearchQuery({
      VirtualServiceId: virtualService.id,
      type: 'PROXIMITY_DP_HEALTH_LOG'
    })
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.rows)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  _renderTitleDetailsCard() {
    const virtualService = virtualServiceStore.getSelectedObject()
    return (
      <Box
        style={{
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'top'
        }}
      >
        <Box
          style={{
            color: 'green',
            marginRight: 20
          }}
        >
          <CheckCircleIcon color='inherit' />
        </Box>
        <Box>
          <Box>{virtualService.name}</Box>
          <Box style={{ marginTop: 10 }}>
            <b>URL:</b> https://proximity.monoxor.com/{virtualService.slug}
          </Box>
        </Box>
      </Box>
    )
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
          virtualServiceStore.setShowProcessCard(true)
          try {
            await virtualServiceStore.objectCreate()
            virtualServiceStore.setShowProcessCard(false)
            virtualServiceStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            virtualServiceStore.setShowSuccessCard(false)
            virtualServiceStore.resetAllFields()
          } catch (error) {
            console.log('Error: Creating Virtual Service', error)
          }
          virtualServiceStore.setShowProcessCard(false)
        }}
      >
        Create
      </Button>
    )
  }

  _renderUpdateButton() {
    return (
      <Button
        variant='contained'
        color='primary'
        style={{
          marginRight: 20
        }}
        onClick={async () => {
          virtualServiceStore.setShowProcessCard(true)
          try {
            const updatedVirtualService = await virtualServiceStore.objectUpdate()
            virtualServiceStore.setSelectedObject(updatedVirtualService)
            virtualServiceStore.setShowProcessCard(false)
            virtualServiceStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            virtualServiceStore.setShowSuccessCard(false)
          } catch (error) {
            console.log('Error: Updating Virtual Service', error)
          }
          virtualServiceStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }

  _renderOpButtons() {
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <Box style={{ marginTop: 20 }}>
        {viewMode === 'CREATE' ? this._renderCreateButton() : null}
        {viewMode === 'UPDATE' ? this._renderUpdateButton() : null}
        <Button color='primary' onClick={() => this.props.onClose()}>
          Back
        </Button>
      </Box>
    )
  }

  _renderStdObjCard() {
    const selectedTab = virtualServiceStore.getShowObjectViewModeSecondary()
    switch (selectedTab) {
      case 'DETAILS':
        return (
          <VirtualServiceDetailsCard actionButtons={this._renderOpButtons()} />
        )
        break
      case 'DEPLOY':
        return <VirtualServiceDeploymentCard />
        break
      case 'POLICIES':
        return <VirtualServicePoliciesCard />
        break
      case 'DECISION_LOGS':
        return (
          <VirtualServiceDecisionLogs
            fetchDecisionLogs={this.handleDecisionLogsFetch}
          />
        )
        break
      case 'ACCESS_LOGS':
        return (
          <VirtualServiceAccessLogs
            fetchAccessLogs={this.handleAccessLogsFetch}
          />
        )
        break
      case 'MONITOR':
        return (
          <VirtualServiceMonitor
            fetchMonitorLogs={this.handleMonitorLogsFetch}
          />
        )
        break
      case 'RECOMMENDATIONS':
        return (
          <VirtualServicePolicyRecommendationCard
            fetchPolicyRecommendations={this.handlePolicyRecommendationsFetch}
          />
        )
        break
      default:
        return (
          <VirtualServiceDetailsCard actionButtons={this._renderOpButtons()} />
        )
    }
  }

  render() {
    const showSuccess = virtualServiceStore.getShowSuccessCard()
    const showLoader = virtualServiceStore.getShowProcessCard()
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    const selectedTab = virtualServiceStore.getShowObjectViewModeSecondary()
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
    const buttons = [
      {
        title: 'DETAILS',
        click: () => {
          virtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
        },
        isActive: selectedTab === 'DETAILS'
      },
      {
        title: 'DEPLOY',
        click: () => {
          virtualServiceStore.setShowObjectViewModeSecondary('DEPLOY')
        },
        isActive: selectedTab === 'DEPLOY'
      },
      {
        title: 'POLICIES',
        click: () => {
          virtualServiceStore.setShowObjectViewModeSecondary('POLICIES')
        },
        isActive: selectedTab === 'POLICIES'
      },
      {
        title: 'ACCESS LOGS',
        click: async () => {
          logStore.setSearchPageObjectCount(10)
          logStore.setSearchPageNum(0)
          await this.handleAccessLogsFetch()
        },
        isActive: selectedTab === 'ACCESS_LOGS'
      },
      {
        title: 'DECISION LOGS',
        click: async () => {
          logStore.setSearchPageObjectCount(10)
          logStore.setSearchPageNum(0)
          await this.handleDecisionLogsFetch()
        },
        isActive: selectedTab === 'DECISION_LOGS'
      },
      {
        title: 'MONITOR',
        click: async () => {
          const virtualService = virtualServiceStore.getSelectedObject()
          logStore.setSearchPageObjectCount(10)
          logStore.setSearchPageNum(0)
          logStore.setSearchQuery({
            type: 'PROXIMITY_DP_HEALTH_LOG',
            'data.virtualServiceId': virtualService.id,
            tsCreate: {
              $gt: new Date().getTime() - 1 * 60 * 60 * 1000,
              $lt: new Date().getTime()
            }
          })
          await this.handleMonitorLogsFetch()
        },
        isActive: selectedTab === 'MONITOR'
      },
      {
        title: 'RECOMMENDATIONS',
        click: async () => {
          policyRecommendationStore.setSearchPageObjectCount(10)
          policyRecommendationStore.setSearchPageNum(0)
          await this.handlePolicyRecommendationsFetch()
        },
        isActive: selectedTab === 'RECOMMENDATIONS'
      }
    ]
    return (
      <Box>
        {viewMode === 'UPDATE' ? (
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

export default observer(VirtualServiceStdObjCard)
