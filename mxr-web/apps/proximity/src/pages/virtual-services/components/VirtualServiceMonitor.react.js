import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { Line } from 'react-chartjs-2'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store'

class VirtualServiceMonitor extends Component {
  state = {
    timeSteps: 5
  }


  handleLogsForTime = async (hour) => {
    const virtualService = VirtualServiceStore.getSelectedObject()
    LogStore.setSearchQuery({
      type: 'PROXIMITY_DP_HEALTH_LOG',
      'data.virtualServiceId': virtualService.id,
      tsCreate: {
        $gt: new Date().getTime() - (hour * 60 * 60 * 1000),
        $lt: new Date().getTime()
      }
    })
    await this.props.fetchMonitorLogs()
    let timeStepsD
    switch(hour) {
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
    this.setState({ timeSteps: timeStepsD })
  }


  render() {
    const logs = LogStore.getObjects()
    if (!logs || logs.length === 0) {
      return (
        <Box style={{ textAlign: 'center' }}>No Content</Box>
      )
    }
    const timeFormat = 'DD/MM HH:mm'
    const logsTimeFormatted = logs.map((log) => ({
      ...log,
      tsCreate: moment(
        moment(new Date(log.tsCreate)).format(timeFormat),
        timeFormat
      )
    }))
    let firstTimeStep = logsTimeFormatted[0].tsCreate
    const lastTimeStep =
      logsTimeFormatted[logsTimeFormatted.length - 1].tsCreate
    let nextTimeStep = logsTimeFormatted[0].tsCreate
    const logsTimeUpDownCount = [] 
    while (true) {
      nextTimeStep = moment(nextTimeStep, timeFormat).subtract(
        this.state.timeSteps,
        'minutes'
      )
      const logsInTimeLimit = logsTimeFormatted.filter((logTimeFormatted) => {
        if (
          logTimeFormatted.tsCreate.isBetween(
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
        this.state.timeSteps,
        'minutes'
      )
      if (logsInTimeLimit.length > 0) {
        const time = logsInTimeLimit[0].tsCreate
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
              variant={this.state.timeSteps === 5 ? 'contained' : ''}
              onClick={() => this.handleLogsForTime(1)}
            >
              Last Hour
            </Button>
            <Button 
              variant={this.state.timeSteps === 15 ? 'contained' : ''}
              onClick={() => this.handleLogsForTime(12)}
            >
              Last 12 Hour
            </Button>
            <Button 
              variant={this.state.timeSteps === 30 ? 'contained' : ''}
              onClick={() => this.handleLogsForTime(24)}
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
                      stepSize: this.state.timeSteps,
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
}


export default observer(VirtualServiceMonitor)
