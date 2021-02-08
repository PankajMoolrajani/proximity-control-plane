import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox, MaterialButton, MaterialDivider } from 'libs/material'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import PlatformSuccessCard from 'apps/platform/components/PlatformSuccessCard.react'
import PlatformLoaderCard from 'apps/platform/components/PlatformLoaderCard.react'
import NavTabsCard from 'apps/proximity/components/PageLayout/NavTabsCard'
import VirtualServiceDetailsCard from 'apps/proximity/virtual-services/components/VirtualServiceDetailsCard.react'
import VirtualServiceDeploymentCard from 'apps/proximity/virtual-services/components/VirtualServiceDeploymentCard.react'
import VirtualServiceRevisionsCard from 'apps/proximity/virtual-services/components/VirtualServiceRevisionsCard.react'
import VirtualServicePoliciesCard from 'apps/proximity/virtual-services/components/VirtualServicePoliciesCard.react'
import VirtualServiceDecisionLogs from 'apps/proximity/virtual-services/components/VirtualServiceDecisionLogs.react'
import VirtualServiceMonitor from 'apps/proximity/virtual-services/components/VirtualServiceMonitor.react'
import VirtualServicePolicyRecommendationCard from 'apps/proximity/virtual-services/components/VirtualServicePolicyRecommendationCard.react'
import { VirtualServiceAccessLogs } from './VirtualServiceAccessLogs.react'
import {
  virtualServiceStore,
  policyStore,
  policyRecommendationStore
} from 'apps/proximity/stores/proximity.store'
import { logStore } from 'apps/platform/stores/platform.store'


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


  async handlePoliciesFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('POLICIES')
    const selectedVirtualService = virtualServiceStore.getSelectedObject()

    const policiesMetaData =
      selectedVirtualService.currentRevision.virtualService.policiesMetadata
    if (!policiesMetaData || policiesMetaData.length === 0) {
      return
    }
    virtualServiceStore.setShowProcessCard(true)
    const policies = []
    try {
      await Promise.all(
        policiesMetaData.map(async (policyMetaData) => {
          const policy = await policyStore.objectQueryById(
            policyMetaData.id,
            true
          )
          policies.push(policy)
        })
      )
      virtualServiceStore.setRelatedObjects(policies)
    } catch (error) {
      console.log('Error: Getting Policies')
    }
    virtualServiceStore.setShowProcessCard(false)
  }


  async handleDecisionLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('DECISION_LOGS')
    const virtualService = virtualServiceStore.getSelectedObject()
    virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchQuery(
      { 
        'type': 'PROXIMITY_DECISION_LOG',
        'data.virtualServiceId': virtualService.id 
      })
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }


  async handleAccessLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('ACCESS_LOGS')
    const virtualService = virtualServiceStore.getSelectedObject()
    virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchQuery(
      { 
        'type': 'PROXIMITY_ACCESS_LOG',
        'data.virtualServiceId': virtualService.id 
      })
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.data)
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
      policyRecommendationStore.setSearchResultsObjectCount(poilcyRecommendations.count)
      policyRecommendationStore.setObjects(poilcyRecommendations.data)
    } catch (error) {
      console.log(`Error: Getting poilcy recommendations`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }


  async handleMonitorLogsFetch() {
    virtualServiceStore.setShowObjectViewModeSecondary('MONITOR')
    // virtualServiceStore.setShowProcessCard(true)
    logStore.setSearchPageObjectCount(10000)
    logStore.setSortQuery({tsCreate: -1})
    try {
      const virtualServices = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(virtualServices.count)
      logStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    // virtualServiceStore.setShowProcessCard(false)
  }


  _renderTitleDetailsCard() {
    const virtualService = virtualServiceStore.getSelectedObject()
    return (
      <MaterialBox
        style={{
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'top'
        }}
      >
        <MaterialBox
          style={{
            color: 'green',
            marginRight: 20
          }}
        >
          <CheckCircleIcon color='inherit' />
        </MaterialBox>
        <MaterialBox>
          <MaterialBox>{virtualService.name}</MaterialBox>
          <MaterialBox style={{ marginTop: 10 }}>
            <b>URL:</b> https://proximity.monoxor.com/{virtualService.slug}
          </MaterialBox>
        </MaterialBox>
      </MaterialBox>
    )
  }


  _renderCreateButton() {
    return (
      <MaterialButton
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
      </MaterialButton>
    )
  }


  _renderUpdateButton() {
    return (
      <MaterialButton
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
      </MaterialButton>
    )
  }


  _renderOpButtons() {
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    return (
      <MaterialBox style={{ marginTop: 20 }}>
        {viewMode === 'CREATE' ? this._renderCreateButton() : null}
        {viewMode === 'UPDATE' ? this._renderUpdateButton() : null}
        <MaterialButton color='primary' onClick={() => this.props.onClose()}>
          Back
        </MaterialButton>
      </MaterialBox>
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
    const showSuccess = virtualServiceStore.getShowSuccessCard()
    const showLoader = virtualServiceStore.getShowProcessCard()
    const viewMode = virtualServiceStore.getShowObjectViewMode()
    const selectedTab = virtualServiceStore.getShowObjectViewModeSecondary()
    if (showSuccess) {
      return (
        <MaterialBox style={{ margin: 50 }}>
          <PlatformSuccessCard iconColor='green' msg='Success !' />
        </MaterialBox>
      )
    }
    if (showLoader) {
      return (
        <MaterialBox style={{ margin: 50 }}>
          <PlatformLoaderCard />
        </MaterialBox>
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
          logStore.setSearchQuery(
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
          policyRecommendationStore.setSearchPageObjectCount(10)
          policyRecommendationStore.setSearchPageNum(0)
          await this.handlePolicyRecommendationsFetch()
        },
        isActive: selectedTab === 'RECOMMENDATIONS'
      }
    ]
    return (
      <MaterialBox>
        {viewMode === 'UPDATE' ? (
          <React.Fragment>
            <NavTabsCard buttons={buttons}/>
            <MaterialDivider />
          </React.Fragment>
        ) : null}
        {this._renderStdObjCard()}
      </MaterialBox>
    )
  }
}


export default observer(VirtualServiceStdObjCard)
