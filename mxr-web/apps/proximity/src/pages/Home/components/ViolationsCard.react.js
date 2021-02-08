import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox, MaterialTypography, MaterialGrid } from 'libs/material'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Progress from '/mxr-web/apps/proximity/src/pages/Home/components/progressBar'
import theme from 'apps/proximity/themes'
import { Pie, Line } from 'react-chartjs-2'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store' 

class ViolationsCard extends Component {
  state = {
    totalViolations: 0,
    dates: [],
    dateWiseViolations: [],
    wafViolations: 0,
    authnViolations: 0,
    authzViolations: 0,
    vsWiseViolations: []
  }


  async componentDidMount() {
    const searchQuery = {}
    searchQuery['type'] = 'PROXIMITY_DECISION_LOG'
    searchQuery['data.decision.allow'] = false
    searchQuery['tsCreate'] = {
      $gt: new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
      $lt: new Date().getTime()
    }
    LogStore.setSearchPageObjectCount(1000000)
    LogStore.setSearchQuery(searchQuery)
    const logs = await LogStore.objectQuery()
    this.setState({ totalViolations: logs.count })
    this.setState({
      wafViolations: logs.data.filter((log) => log.data.policyType === 'WAF')
        .length
    })
    this.setState({
      authnViolations: logs.data.filter(
        (log) => log.data.policyType === 'AUTHN'
      ).length
    })
    this.setState({
      authzViolations: logs.data.filter(
        (log) => log.data.policyType === 'AUTHZ'
      ).length
    })
    const dateWiseLogs = []
    logs.data.forEach((log) => {
      const date = `${new Date(log.tsCreate).getMonth() + 1}/${new Date(
        log.tsCreate
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
    this.setState({ dateWiseViolations: dateWiseLogs })

    //Get All Virtual Services
    let vsWiseViolations = []
    VirtualServiceStore.setSearchPageObjectCount(1000)
    const virtualServices = await VirtualServiceStore.objectQuery()
    virtualServices.data.forEach((virtualService) => {
      vsWiseViolations.push({
        name: virtualService.name,
        percentage:
          Math.floor(
            ((logs.data.filter(
              (log) => log.data.virtualServiceId === virtualService.id
            ).length *
              100) /
              logs.data.length) *
              100
          ) / 100
      })
    })
    
    vsWiseViolations.sort((a, b) => {
      if (a.percentage < b.percentage) return 1
      if (a.percentage > b.percentage) return -1
    })
    vsWiseViolations = vsWiseViolations.slice(0,4)
    this.setState({ vsWiseViolations: vsWiseViolations })
  }


  render() {
    const policyTypeDecisionData = {
      labels: ['AUTHN', 'AUTHZ', 'WAF'],
      datasets: [
        {
          label: 'Violations',
          backgroundColor: [theme.error, theme.errorDark, theme.errorLight],
          hoverBackgroundColor: [
            theme.errorLight,
            theme.errorDark,
            theme.error
          ],
          data: [
            this.state.authnViolations,
            this.state.authzViolations,
            this.state.wafViolations
          ]
        }
      ]
    }
    const dateWiseViolations = {
      labels: this.state.dateWiseViolations.map((log) => log.date),
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
          data: this.state.dateWiseViolations.map((log) => log.count)
        }
      ]
    }
    return (
      <MaterialBox
        style={{
          background: 'white',
          padding: '10px 30px',
          borderRadius: 10
        }}
      >
        <MaterialBox
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <MaterialBox
            style={{
              padding: '40px 0'
            }}
          >
            <MaterialBox
              style={{
                fontSize: 22,
                fontWeight: 400
              }}
            >
              Violations
            </MaterialBox>
            <MaterialBox
              style={{
                fontSize: 50,
                color: theme.errorLight,
                padding: '10px 0'
              }}
            >
              {this.state.totalViolations}
            </MaterialBox>
          </MaterialBox>
          <MaterialBox>
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
          </MaterialBox>
        </MaterialBox>
        <MaterialBox>
          <Line
            height={150}
            data={dateWiseViolations}
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
        </MaterialBox>
        <MaterialBox style={{ marginTop: 40, textAlign: 'left' }}>
          <MaterialBox style={{ fontSize: 22 }}>
            Virtual Services with most Violations
          </MaterialBox>
          {this.state.vsWiseViolations.map((vsWiseViolation) => (
            <MaterialBox style={{ marginTop: 20 }} key={vsWiseViolation.name}>
              <MaterialBox style={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon
                  style={{ color: theme.errorLight, marginRight: 20 }}
                />
                <MaterialBox style={{ fontSize: 18, flexGrow: 1 }}>
                  {vsWiseViolation.name}
                </MaterialBox>
                <MaterialBox style={{ fontSize: 18 }}>
                  {vsWiseViolation.percentage}%
                </MaterialBox>
              </MaterialBox>
              <Progress done={vsWiseViolation.percentage} />
            </MaterialBox>
          ))}
        </MaterialBox>
      </MaterialBox>
    )
  }
}


export default observer(ViolationsCard)
