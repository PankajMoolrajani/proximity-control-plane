import { useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import stores from '../../../stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceDeploymentCard = ({ virtualServiceId }) => {
  const virtualService = virtualServiceStore.getSelectedObject()
  const showLoader = virtualServiceStore.getShowProcessCard()

  useEffect(() => {
    const fetchVirtualServiceById = async () => {
      virtualServiceStore.setShowProcessCard(true)
      try {
        const virtualService = await virtualServiceStore.objectQueryById(
          virtualServiceId
        )
        if (virtualService) {
          virtualServiceStore.setSelectedObject(virtualService)
        }
      } catch (error) {
        virtualServiceStore.setShowProcessCard(false)
        console.log(error)
      }
      virtualServiceStore.setShowProcessCard(false)
    }
    fetchVirtualServiceById()
  }, [])

  if (showLoader || !virtualService) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  const servicePort =
    virtualService.proximityUrl.split(':').length > 2
      ? virtualService.proximityUrl.split(':')[2].split('/')[0]
      : 80

  return (
    <Box style={{ maxWidth: 800, padding: 24 }}>
      <Accordion
        defaultExpanded
        style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>Docker Deployment on VM</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box style={{ fontWeight: 300, opacity: 0.8 }}>
            #] docker run -d -p {servicePort}:5005 -e ORG_ID= -e
            VIRTUAL_SERVICE_ID={virtualService.id} -e VIRUTAL_SERVICE_AUTH_KEY=
            {virtualService.authKey} esque/mxr-proximity-dp:latest
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>K8s Deployment</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box style={{ fontWeight: 300, opacity: 0.8 }}>
            <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>AWS EC2 Deployment</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box style={{ fontWeight: 300, opacity: 0.8 }}>
            <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>Google Cloud</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box style={{ fontWeight: 300, opacity: 0.8 }}>
            <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>Azure Cloud</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box style={{ fontWeight: 300, opacity: 0.8 }}>
            <pre style={{ margin: 0, fontSize: 15 }}>Coming Soon!</pre>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default observer(VirtualServiceDeploymentCard)
