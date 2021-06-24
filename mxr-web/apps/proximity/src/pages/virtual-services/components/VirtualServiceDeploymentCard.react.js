import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@material-ui/core'
import yaml from 'js-yaml'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceDeploymentCard = ({ virtualServiceId }) => {
  const virtualService = virtualServiceStore.getSelectedObject()
  const showLoader = virtualServiceStore.getShowProcessCard()

  useEffect(() => {
    const fetchVirtualServiceById = async () => {
      virtualServiceStore.setShowProcessCard(true)
      try {
        const virtualService = await virtualServiceStore.objectQueryById(
          virtualServiceId,
          [
            {
              model: 'PolicyRevision'
            }
          ]
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

  const json_conversionVS = {
    version: '3',
    services: {
      [`proxmity-vs-${virtualService.name}`]: {
        image: `registry.digitalocean.com/monoxor/proximity-dp-es:latest`,
        environment: [
          `TOKEN_SECRET=YOUR_SECRET`,
          `VIRTUAL_SERVICE_ID=${virtualService.id}`,
          `DATA_SERVICES_URL=https://dev.monoxor.com/data-services/crud/k8ti/proximity`
        ],
        ports: [`YOUR_PORT:5005`],
        restart: `always`
      }
    }
  }
  const dockerVS = yaml.dump(json_conversionVS)

  const json_conversionK8s_1 = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: `proximity-vs-${virtualService.name}`
    },
    spec: {
      ports: [
        {
          port: 80,
          targetPort: 5005
        }
      ],
      selector: {
        app: `proximity-vs-${virtualService.name}`
      }
    }
  }

  const json_conversionK8s_2 = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `proximity-vs-${virtualService.name}`
    },
    spec: {
      selector: {
        matchLabels: {
          app: `proximity-vs-${virtualService.name}`
        }
      },
      replicas: 1,
      template: {
        metadata: {
          labels: {
            app: `proximity-vs-${virtualService.name}`
          }
        },
        spec: {
          containers: [
            {
              name: `proximity-vs-${virtualService.name}`,
              image: 'registry.digitalocean.com/monoxor/proximity-dp-es:latest',
              imagePullPolicy: 'Always',
              ports: [
                {
                  containerPort: 5005
                }
              ],
              env: [
                {
                  name: 'TOKEN_SECRET',
                  value: 'YOUR_TOKEN'
                },
                {
                  name: 'VIRTUAL_SERVICE_ID',
                  value: `${virtualService.id}`
                },
                {
                  name: 'DATA_SERVICES_URL',
                  value:
                    'https://dev.monoxor.com/data-services/crud/k8ti/proximity'
                }
              ]
            }
          ]
        }
      }
    }
  }

  const k8sDeploymentDoc = `${yaml.dump(
    json_conversionK8s_1
  )}${`---\n`}${yaml.dump(json_conversionK8s_2)}`

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
          <Box
            style={{
              fontWeight: 300,
              opacity: 0.8,
              width: '100%',
              position: 'relative'
            }}
          >
            <CopyToClipboard
              text={dockerVS}
              style={{ position: 'absolute', top: 0, right: '20px' }}
            >
              <IconButton size='small'>
                <FileCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <pre
              style={{
                margin: 0,
                fontSize: 15,
                maxHeight: 300,
                overflowY: 'auto'
              }}
            >
              {dockerVS}
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ boxShadow: 'none', borderRadius: 5, marginTop: 10 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box style={{ fontSize: 18 }}>K8s Deployment</Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0 16px 16px' }}>
          <Box
            style={{
              fontWeight: 300,
              opacity: 0.8,
              width: '100%',
              position: 'relative'
            }}
          >
            <CopyToClipboard
              text={k8sDeploymentDoc}
              style={{ position: 'absolute', top: 0, right: '20px' }}
            >
              <IconButton size='small'>
                <FileCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <pre
              style={{
                margin: 0,
                fontSize: 15,
                maxHeight: 300,
                overflowY: 'auto'
              }}
            >
              {k8sDeploymentDoc}
            </pre>
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
