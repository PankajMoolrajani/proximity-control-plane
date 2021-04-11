import { Fragment, useEffect, useState, useRef, useCallback } from 'react'
import { observer } from 'mobx-react'
import { Pie } from 'react-chartjs-2'
import { Box, Button, makeStyles } from '@material-ui/core'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import PolicyImpactAnalysisLogCard from '/mxr-web/apps/proximity/src/pages/policies/components/PolicyImpactAnalysisLogCard.react'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
import { toJS } from 'mobx'
const { logStore, policyStore, virtualServiceStore } = stores

const useStyle = makeStyles((theme) => ({
  dashTitle: {
    fontSize: 20,
    marginBottom: 10
  },
  dashNum: {
    fontSize: 32
  }
}))

const PolicyImpactAnalysisCard = () => {
  const [allowed, setAllowed] = useState(0)
  const [denied, setDenied] = useState(0)
  const [decisionChanged, setDecisionChanged] = useState(0)
  const classes = useStyle()
  const chartRef = useRef()

  useEffect(() => {
    return () => {
      logStore.resetAllFields()
    }
  }, [])

  const handleFetchLog = async () => {
    setAllowed(0)
    setDenied(0)
    setDecisionChanged(0)
    const virtualService = virtualServiceStore.getSelectedObject()
    if (virtualService) {
      const policy = policyStore.getSelectedObject()
      const policyRevisions = virtualService.PolicyRevisions
      const selectedPolicyRevision = policyRevisions.find(
        (policyRevision) => policyRevision.PolicyId === policy.id
      )
      console.log(toJS(virtualService), toJS(selectedPolicyRevision))
      logStore.setShowProcessCard(true)
      const searchQuery = {
        type: 'PROXIMITY_DECISION_LOG'
      }
      if (virtualService) {
        searchQuery['VirtualServiceId'] = virtualService.id
        searchQuery['PolicyRevisionId'] = selectedPolicyRevision.id
      } else if (policy) {
        searchQuery['PolicyId'] = policy.id
      }
      logStore.setSearchQuery(searchQuery)
      logStore.setSearchPageObjectCount(100)
      logStore.setSortQuery([['createdAt', 'DESC']])
      try {
        const logs = await logStore.objectQuery()
        logStore.setSearchResultsObjectCount(logs.count)
        logStore.setObjects(logs.rows)
      } catch (error) {
        console.log(`Error: Getting logs`)
      }
      logStore.setShowProcessCard(false)
    }
  }

  const _renderLogs = () => {
    const logs = logStore.getObjects()
    const count = logs ? logs.length : 0
    const percentageChanged = (100 * decisionChanged) / count

    if (!logs || logs.length === 0) {
      return <Box style={{ textAlign: 'center', marginTop: 20 }}>No Logs</Box>
    }
    return (
      <Fragment>
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
            <Box className={classes.dashTitle}>Sample Requests</Box>
            <Box className={classes.dashNum}>{count}</Box>
          </Box>
          <Box>
            <Box className={classes.dashTitle}>Decision</Box>
            <Box>
              <Pie
                ref={chartRef}
                width={150}
                height={75}
                data={{
                  labels: ['ALLOW', 'DENY'],
                  datasets: [
                    {
                      data: [allowed, denied],
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
            <Box className={classes.dashTitle}>Decision Changed</Box>
            <Box className={classes.dashNum}>
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
              addAllowed={() => setAllowed((value) => value + 1)}
              addDenied={() => setDenied((value) => value + 1)}
              decisionChanged={() => setDecisionChanged((value) => value + 1)}
            />
          ))}
        </Box>
      </Fragment>
    )
  }

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
          onClick={handleFetchLog}
        >
          Run Impact Analysis
        </Button>
      </Box>
      {_renderLogs()}
    </Box>
  )
}

export default observer(PolicyImpactAnalysisCard)
