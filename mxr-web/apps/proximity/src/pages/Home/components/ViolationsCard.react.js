import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { Box } from '@material-ui/core'
import { Pie, Line } from 'react-chartjs-2'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Progress from '/mxr-web/apps/proximity/src/pages/Home/components/progressBar'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import theme from '/mxr-web/apps/proximity/src/libs/theme/theme.lib'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore, logStore } = stores
const ViolationsCard = () => {
  const [totalViolations, setTotalViolations] = useState(0)
  const [dateWiseViolations, setDateWiseViolations] = useState([])
  const [wafViolations, setWafViolations] = useState(0)
  const [authnViolations, setAuthnViolations] = useState(0)
  const [authzViolations, setAuthzViolations] = useState(0)
  const [vsWiseViolations, setVsWiseViolations] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      logStore.setSearchPageObjectCount(1000000)
      logStore.setShowProcessCard(true)
      logStore.setSearchQuery({
        type: 'PROXIMITY_DECISION_LOG',
        'data.decision.allow': false,
        createdAt: {
          $gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      })
      const logs = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(logs.count)
      logStore.setObjects(logs.rows)
      setTotalViolations(logs.count)
      setWafViolations(
        logs.rows.filter((log) => log.data.type === 'WAF').length
      )
      setAuthnViolations(
        logs.rows.filter((log) => log.data.type === 'AUTHN').length
      )
      setAuthzViolations(
        logs.rows.filter((log) => log.data.type === 'AUTHZ').length
      )
      const dateWiseLogs = []
      logs.rows.forEach((log) => {
        const date = `${new Date(log.createdAt).getMonth() + 1}/${new Date(
          log.createdAt
        ).getDate()}`
        const foundIndex = dateWiseLogs.findIndex((log) => log.date === date)
        if (foundIndex > -1) {
          dateWiseLogs[foundIndex] = {
            date: date,
            count: dateWiseLogs[foundIndex].count + 1
          }
        } else {
          dateWiseLogs.push({
            date: date,
            count: 1
          })
        }
      })
      setDateWiseViolations(dateWiseLogs)

      //Get All Virtual Services
      let vsWiseViolations = []
      virtualServiceStore.setSearchPageObjectCount(1000)
      const virtualServices = await virtualServiceStore.objectQuery()
      virtualServices.rows.forEach((virtualService) => {
        vsWiseViolations.push({
          name: virtualService.name,
          percentage:
            Math.floor(
              ((logs.rows.filter(
                (log) => log.data.VirtualServiceId === virtualService.id
              ).length *
                100) /
                logs.rows.length) *
                100
            ) / 100
        })
      })

      vsWiseViolations.sort((a, b) => {
        if (a.percentage < b.percentage) return 1
        if (a.percentage > b.percentage) return -1
      })
      vsWiseViolations = vsWiseViolations.slice(0, 4)
      setVsWiseViolations(vsWiseViolations)
    } catch (error) {
      setLoading(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    return () => {
      logStore.resetAllFields()
    }
  }, [])
  const policyTypeDecisionData = {
    labels: ['AUTHN', 'AUTHZ', 'WAF'],
    datasets: [
      {
        label: 'Violations',
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4,
        data: [authnViolations, authzViolations, wafViolations]
      }
    ]
  }
  const dateWiseViolationsChart = {
    labels: dateWiseViolations.map((log) => log.date),
    datasets: [
      {
        fill: false,
        lineTension: 0.1,
        backgroundColor: `${theme.errorLight}`,
        borderColor: `${theme.errorLight}`,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: `${theme.error}`,
        pointBackgroundColor: `${theme.color1}`,
        pointBorderWidth: 8,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: `${theme.error}`,
        pointHoverBorderColor: `${theme.error}`,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dateWiseViolations.map((log) => log.count)
      }
    ]
  }

  return (
    <Box
      style={{
        background: 'white',
        padding: '10px 30px',
        borderRadius: 10,
        position: 'relative',
        opacity: loading ? 0.5 : 1
      }}
    >
      {loading ? (
        <Box
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PlatformLoaderCard />
        </Box>
      ) : (
        ''
      )}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box
          style={{
            padding: '40px 0'
          }}
        >
          <Box
            style={{
              fontSize: 22,
              fontWeight: 400
            }}
          >
            Violations
          </Box>
          <Box
            style={{
              fontSize: 50,
              color: theme.errorLight,
              padding: '10px 0'
            }}
          >
            {totalViolations}
          </Box>
        </Box>
        <Box>
          <Pie
            width={200}
            height={100}
            data={policyTypeDecisionData}
            options={{
              legend: {
                position: 'right',
                align: 'top',
                labels: {
                  boxWidth: 20
                }
              }
            }}
          />
        </Box>
      </Box>
      <Box>
        <Line
          height={150}
          data={dateWiseViolationsChart}
          options={{
            legend: {
              display: false
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ],
              yAxes: [
                {
                  barPercentage: 5,
                  ticks: {
                    stepSize: 5
                  }
                }
              ]
            }
          }}
        />
      </Box>
      <Box style={{ marginTop: 40, textAlign: 'left' }}>
        <Box style={{ fontSize: 22 }}>
          Virtual Services with most Violations
        </Box>
        {vsWiseViolations.map((vsWiseViolation) => (
          <Box style={{ marginTop: 20 }} key={vsWiseViolation.name}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <FiberManualRecordIcon
                style={{ color: theme.errorLight, marginRight: 20 }}
              />
              <Box style={{ fontSize: 18, flexGrow: 1 }}>
                {vsWiseViolation.name}
              </Box>
              <Box style={{ fontSize: 18 }}>{vsWiseViolation.percentage}%</Box>
            </Box>
            <Progress done={vsWiseViolation.percentage} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default observer(ViolationsCard)
