import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  MaterialBox,
  MaterialAccordion,
  MaterialAccordionSummary,
  MaterialAccordionDetails
} from 'libs/material'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { virtualServiceStore } from 'apps/proximity/stores/proximity.store'
import PlatformUser from 'apps/platform/stores/PlatformUser.store'


export class VirtualServiceDeploymentCard extends Component {
  render() {
    const virtualService = virtualServiceStore.getSelectedObject()
    const user = PlatformUser.getUser()
    const servicePort = virtualService.currentRevision.virtualService.proximityUrl.split(':')[2].split('/')[0]
    return (
      <MaterialBox style={{ maxWidth: 800, padding: 24 }}>
        <MaterialAccordion
          defaultExpanded
          style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
        >
          <MaterialAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MaterialBox style={{ fontSize: 18 }}>
              Docker Deployment on VM
            </MaterialBox>
          </MaterialAccordionSummary>
          <MaterialAccordionDetails style={{ padding: '0 16px 16px' }}>
            <MaterialBox style={{ fontWeight: 300, opacity: 0.8 }}> 
              #] docker run -d -p {servicePort}:5005 -e ORG_ID={user.defaultOrgId} -e VIRTUAL_SERVICE_ID={virtualService.id} -e VIRUTAL_SERVICE_AUTH_KEY={virtualService.authKey} esque/mxr-proximity-dp:latest 
            </MaterialBox>
          </MaterialAccordionDetails>
        </MaterialAccordion>
        <MaterialAccordion
          style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
        >
          <MaterialAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MaterialBox style={{ fontSize: 18 }}>K8s Deployment</MaterialBox>
          </MaterialAccordionSummary>
          <MaterialAccordionDetails style={{ padding: '0 16px 16px' }}>
            <MaterialBox style={{ fontWeight: 300, opacity: 0.8 }}>
              <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
            </MaterialBox>
          </MaterialAccordionDetails>
        </MaterialAccordion>
        <MaterialAccordion
          style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
        >
          <MaterialAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MaterialBox style={{ fontSize: 18 }}>
              AWS EC2 Deployment
            </MaterialBox>
          </MaterialAccordionSummary>
          <MaterialAccordionDetails style={{ padding: '0 16px 16px' }}>
            <MaterialBox style={{ fontWeight: 300, opacity: 0.8 }}>
              <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
            </MaterialBox>
          </MaterialAccordionDetails>
        </MaterialAccordion>
        <MaterialAccordion
          style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
        >
          <MaterialAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MaterialBox style={{ fontSize: 18 }}>Google Cloud</MaterialBox>
          </MaterialAccordionSummary>
          <MaterialAccordionDetails style={{ padding: '0 16px 16px' }}>
            <MaterialBox style={{ fontWeight: 300, opacity: 0.8 }}>
              <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
            </MaterialBox>
          </MaterialAccordionDetails>
        </MaterialAccordion>
        <MaterialAccordion
          style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
        >
          <MaterialAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MaterialBox style={{ fontSize: 18 }}>Azure Cloud</MaterialBox>
          </MaterialAccordionSummary>
          <MaterialAccordionDetails style={{ padding: '0 16px 16px' }}>
            <MaterialBox style={{ fontWeight: 300, opacity: 0.8 }}>
              <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
            </MaterialBox>
          </MaterialAccordionDetails>
        </MaterialAccordion>
      </MaterialBox>
    )
  }
}


export default observer(VirtualServiceDeploymentCard)
