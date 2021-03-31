import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Box, Button, ButtonGroup } from '@material-ui/core'
import { Line } from 'react-chartjs-2'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import stores from '../../../stores/proximity.store'
const { virtualServiceStore, logStore } = stores

const VirtualServiceMonitorCard = ({ virtualServiceId }) => {
  const [timeSteps, setTimeSteps] = useState(5)

  const handleFetch = async () => {
    const virtualService = virtualServiceStore.getSelectedObject()
    if (!virtualService) {
      return
    }
    logStore.setShowProcessCard(true)
    try {
      const logs = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(logs.count)
      logStore.setObjects(logs.rows)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    logStore.setShowProcessCard(false)
  }

  const handleLogsForTime = async (hour) => {
    const virtualService = virtualServiceStore.getSelectedObject()
    logStore.setSearchQuery({
      type: 'PROXIMITY_DP_HEALTH_LOG',
      VirtualServiceId: virtualService.id,
      createdAt: {
        $gt: new Date(new Date().getTime() - hour * 60 * 60 * 1000),
        $lt: new Date()
      }
    })
    await handleFetch()
    let timeStepsD
    switch (hour) {
      case 1:
        timeStepsD = 5
        break
      case 12:
        timeStepsD = 15
        break
      case 24:
        timeStepsD = 30
        break
      default:
        timeStepsD = 5
    }
    setTimeSteps(timeStepsD)
  }

  const fetchVirtualSeviceById = async () => {
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

  useEffect(() => {
    const initFetch = async () => {
      await fetchVirtualSeviceById()
      await handleLogsForTime(12)
    }
    initFetch()
  }, [])

  const logs = logStore.getObjects()
  if (!logs || logs.length === 0) {
    return <Box style={{ textAlign: 'center' }}>No Content</Box>
  }
  const timeFormat = 'DD/MM HH:mm'
  const logsTimeFormatted = logs.map((log) => ({
    ...log,
    createdAt: moment(
      moment(new Date(log.createdAt)).format(timeFormat),
      timeFormat
    )
  }))
  let firstTimeStep = logsTimeFormatted[0].createdAt
  const lastTimeStep = logsTimeFormatted[logsTimeFormatted.length - 1].createdAt
  let nextTimeStep = logsTimeFormatted[0].createdAt
  const logsTimeUpDownCount = []
  while (true) {
    nextTimeStep = moment(nextTimeStep, timeFormat).subtract(
      timeSteps,
      'minutes'
    )
    const logsInTimeLimit = logsTimeFormatted.filter((logTimeFormatted) => {
      if (
        logTimeFormatted.createdAt.isBetween(
          nextTimeStep,
          firstTimeStep,
          undefined,
          '[]'
        )
      ) {
        return true
      } else {
        return false
      }
    })
    firstTimeStep = moment(firstTimeStep, timeFormat).subtract(
      timeSteps,
      'minutes'
    )
    if (logsInTimeLimit.length > 0) {
      const time = logsInTimeLimit[0].createdAt
      let upCount = 0
      let downCount = 0
      logsInTimeLimit.forEach((logInTimeLimit) => {
        if (logInTimeLimit.data.status === 'UP') {
          upCount++
        } else {
          downCount++
        }
      })
      logsTimeUpDownCount.push({
        time: time,
        upCount: upCount,
        downCount: downCount
      })
    }

    if (nextTimeStep.isBefore(lastTimeStep)) {
      break
    }
  }
  const logsUpTimePercentage = logsTimeUpDownCount.map(
    (logTimeUpDownCount) => ({
      ...logTimeUpDownCount,
      percentage:
        (logTimeUpDownCount.upCount * 100) /
        (logTimeUpDownCount.upCount + logTimeUpDownCount.downCount)
    })
  )
  const upTimeMonitorDataLables = logsUpTimePercentage.map(
    (logUpTimePercentage) => logUpTimePercentage.time.format(timeFormat)
  )
  const upTimeMonitorDataValues = logsUpTimePercentage.map(
    (logUpTimePercentage) => logUpTimePercentage.percentage
  )
  const upTimeMonitorData = {
    labels: upTimeMonitorDataLables,
    datasets: [
      {
        fill: true,
        lineTension: 0.1,
        backgroundColor: '#ffcccb',
        borderColor: '#ffcccb',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'red',
        pointBackgroundColor: `#ffffff`,
        pointBorderWidth: 8,
        pointHoverRadius: 10,
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: upTimeMonitorDataValues
      }
    ]
  }

  return (
    <Box
      style={{
        padding: 40
      }}
    >
      <Box
        color='primary'
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 20
        }}
      >
        <ButtonGroup color='primary'>
          <Button
            variant={timeSteps === 5 ? 'contained' : ''}
            onClick={() => handleLogsForTime(1)}
          >
            Last Hour
          </Button>
          <Button
            variant={timeSteps === 15 ? 'contained' : ''}
            onClick={() => handleLogsForTime(12)}
          >
            Last 12 Hour
          </Button>
          <Button
            variant={timeSteps === 30 ? 'contained' : ''}
            onClick={() => handleLogsForTime(24)}
          >
            Last 24 Hour
          </Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Line
          height={150}
          width={800}
          options={{ maintainAspectRatio: false }}
          data={upTimeMonitorData}
          options={{
            legend: {
              display: true,
              labels: 'UP'
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
                  ticks: {
                    stepSize: timeSteps,
                    max: 100,
                    min: 0
                  }
                }
              ]
            }
          }}
        />
      </Box>
    </Box>
  )
}

export default observer(VirtualServiceMonitorCard)
