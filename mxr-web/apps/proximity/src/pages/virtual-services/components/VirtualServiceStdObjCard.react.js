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
import VirtualServiceRevisionsCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceRevisionsCard.react'
import VirtualServicePoliciesCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePoliciesCard.react'
import VirtualServiceDecisionLogs from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceDecisionLogs.react'
import VirtualServiceMonitor from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceMonitor.react'
import VirtualServicePolicyRecommendationCard from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServicePolicyRecommendationCard.react'
import { VirtualServiceAccessLogs } from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAccessLogs.react'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store'
import PolicyRecommendation from '/mxr-web/apps/proximity/src/stores/PolicyRecommendation.store'

export class VirtualServiceStdObjCard extends Component {
  componentDidMount() {
    VirtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
  }


  async handleRevisionsFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('REVISIONS')
    VirtualServiceStore.setShowProcessCard(true)
    try {
      const selectedVirtualService = VirtualServiceStore.getSelectedObject()
      const virtualService = await VirtualServiceStore.objectQueryById(
        selectedVirtualService.id,
        true
      )
      VirtualServiceStore.setSelectedObject(virtualService)
      VirtualServiceStore.setShowProcessCard(false)
    } catch (error) {
      console.log('Error: getting virtual service', error)
    }
    VirtualServiceStore.setShowProcessCard(false)
  }


  async handlePoliciesFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('POLICIES')
    const selectedVirtualService = VirtualServiceStore.getSelectedObject()

    const policiesMetaData =
      selectedVirtualService.currentRevision.virtualService.policiesMetadata
    if (!policiesMetaData || policiesMetaData.length === 0) {
      return
    }
    VirtualServiceStore.setShowProcessCard(true)
    const policies = []
    try {
      await Promise.all(
        policiesMetaData.map(async (policyMetaData) => {
          const policy = await PolicyStore.objectQueryById(
            policyMetaData.id,
            true
          )
          policies.push(policy)
        })
      )
      VirtualServiceStore.setRelatedObjects(policies)
    } catch (error) {
      console.log('Error: Getting Policies')
    }
    VirtualServiceStore.setShowProcessCard(false)
  }


  async handleDecisionLogsFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('DECISION_LOGS')
    const virtualService = VirtualServiceStore.getSelectedObject()
    VirtualServiceStore.setShowProcessCard(true)
    LogStore.setSearchQuery(
      { 
        'type': 'PROXIMITY_DECISION_LOG',
        'data.virtualServiceId': virtualService.id 
      })
    try {
      const virtualServices = await LogStore.objectQuery()
      LogStore.setSearchResultsObjectCount(virtualServices.count)
      LogStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    VirtualServiceStore.setShowProcessCard(false)
  }


  async handleAccessLogsFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('ACCESS_LOGS')
    const virtualService = VirtualServiceStore.getSelectedObject()
    VirtualServiceStore.setShowProcessCard(true)
    LogStore.setSearchQuery(
      { 
        'type': 'PROXIMITY_ACCESS_LOG',
        'data.virtualServiceId': virtualService.id 
      })
    try {
      const virtualServices = await LogStore.objectQuery()
      LogStore.setSearchResultsObjectCount(virtualServices.count)
      LogStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    VirtualServiceStore.setShowProcessCard(false)
  }


  async handlePolicyRecommendationsFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('RECOMMENDATIONS')
    VirtualServiceStore.setShowProcessCard(true) 
    try {
      const poilcyRecommendations = await PolicyRecommendation.objectQuery()
      PolicyRecommendation.setSearchResultsObjectCount(poilcyRecommendations.count)
      PolicyRecommendation.setObjects(poilcyRecommendations.data)
    } catch (error) {
      console.log(`Error: Getting poilcy recommendations`)
    }
    VirtualServiceStore.setShowProcessCard(false)
  }


  async handleMonitorLogsFetch() {
    VirtualServiceStore.setShowObjectViewModeSecondary('MONITOR')
    // VirtualServiceStore.setShowProcessCard(true)
    LogStore.setSearchPageObjectCount(10000)
    LogStore.setSortQuery({tsCreate: -1})
    try {
      const virtualServices = await LogStore.objectQuery()
      LogStore.setSearchResultsObjectCount(virtualServices.count)
      LogStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    // VirtualServiceStore.setShowProcessCard(false)
  }


  _renderTitleDetailsCard() {
    const virtualService = VirtualServiceStore.getSelectedObject()
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
          VirtualServiceStore.setShowProcessCard(true)
          try {
            await VirtualServiceStore.objectCreate()
            VirtualServiceStore.setShowProcessCard(false)
            VirtualServiceStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            VirtualServiceStore.setShowSuccessCard(false)
            VirtualServiceStore.resetAllFields()
          } catch (error) {
            console.log('Error: Creating Virtual Service', error)
          }
          VirtualServiceStore.setShowProcessCard(false)
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
          VirtualServiceStore.setShowProcessCard(true)
          try {
            const updatedVirtualService = await VirtualServiceStore.objectUpdate()
            VirtualServiceStore.setSelectedObject(updatedVirtualService)
            VirtualServiceStore.setShowProcessCard(false)
            VirtualServiceStore.setShowSuccessCard(true)
            await new Promise((res) => setTimeout(res, 2000))
            VirtualServiceStore.setShowSuccessCard(false)
          } catch (error) {
            console.log('Error: Updating Virtual Service', error)
          }
          VirtualServiceStore.setShowProcessCard(false)
        }}
      >
        Update
      </Button>
    )
  }


  _renderOpButtons() {
    const viewMode = VirtualServiceStore.getShowObjectViewMode()
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
    const selectedTab = VirtualServiceStore.getShowObjectViewModeSecondary()
    switch (selectedTab) {
      case 'DETAILS':
        return (
          <VirtualServiceDetailsCard actionButtons={this._renderOpButtons()} />
        )
        break
      case 'DEPLOY':
        return <VirtualServiceDeploymentCard />
        break 
      case 'REVISIONS':
        return <VirtualServiceRevisionsCard />
        break
      case 'POLICIES':
        return (
          <VirtualServicePoliciesCard
            fetchPolicies={this.handlePoliciesFetch}
          />
        )
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
        return <VirtualServiceMonitor fetchMonitorLogs={this.handleMonitorLogsFetch}/>
        break
      case 'RECOMMENDATIONS':
        return <VirtualServicePolicyRecommendationCard fetchPolicyRecommendations={this.handlePolicyRecommendationsFetch}/>
        break;
      default:
        return (
          <VirtualServiceDetailsCard actionButtons={this._renderOpButtons()} />
        )
    }
  }
  

  render() {
    const showSuccess = VirtualServiceStore.getShowSuccessCard()
    const showLoader = VirtualServiceStore.getShowProcessCard()
    const viewMode = VirtualServiceStore.getShowObjectViewMode()
    const selectedTab = VirtualServiceStore.getShowObjectViewModeSecondary()
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
          VirtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
        },
        isActive: selectedTab === 'DETAILS'
      },
      {
        title: 'DEPLOY',
        click: () => {
          VirtualServiceStore.setShowObjectViewModeSecondary('DEPLOY')
        },
        isActive: selectedTab === 'DEPLOY'
      },
      {
        title: 'REVISIONS',
        click: async () => {
          this.handleRevisionsFetch()
        },
        isActive: selectedTab === 'REVISIONS'
      },
      {
        title: 'POLICIES',
        click: async () => {
          this.handlePoliciesFetch()
        },
        isActive: selectedTab === 'POLICIES'
      },
      {
        title: 'ACCESS LOGS',
        click: async () => {
          LogStore.setSearchPageObjectCount(10)
          LogStore.setSearchPageNum(0)
          await this.handleAccessLogsFetch()
        },
        isActive: selectedTab === 'ACCESS_LOGS'
      },
      {
        title: 'DECISION LOGS',
        click: async () => {
          LogStore.setSearchPageObjectCount(10)
          LogStore.setSearchPageNum(0)
          await this.handleDecisionLogsFetch()
        },
        isActive: selectedTab === 'DECISION_LOGS'
      },
      {
        title: 'MONITOR',
        click: async () => {
          const virtualService = VirtualServiceStore.getSelectedObject()
          LogStore.setSearchPageObjectCount(10)
          LogStore.setSearchPageNum(0)
          LogStore.setSearchQuery(
            { 
              'type': 'PROXIMITY_DP_HEALTH_LOG',
              'data.virtualServiceId': virtualService.id,
              'tsCreate': {
                $gt: new Date().getTime() - 1 * 60 * 60 *1000,
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
          PolicyRecommendation.setSearchPageObjectCount(10)
          PolicyRecommendation.setSearchPageNum(0)
          await this.handlePolicyRecommendationsFetch()
        },
        isActive: selectedTab === 'RECOMMENDATIONS'
      }
    ]
    return (
      <Box>
        {viewMode === 'UPDATE' ? (
          <React.Fragment>
            <NavTabsCard buttons={buttons}/>
            <Divider />
          </React.Fragment>
        ) : null}
        {this._renderStdObjCard()}
      </Box>
    )
  }
}


export default observer(VirtualServiceStdObjCard)
