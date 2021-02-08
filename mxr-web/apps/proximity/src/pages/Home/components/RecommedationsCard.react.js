import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { MaterialBox } from 'libs/material'
import { policyRecommendationStore } from 'apps/proximity/stores/proximity.store'


class RecommendationsCard extends Component {
  state = {
    policyRecommendationsLast7days: 0
  }


  async componentDidMount() {
    const searchQuery = {}
    searchQuery['tsCreate'] = {
      $gt: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
      $lt: new Date().getTime()
    }
    policyRecommendationStore.setSearchQuery(searchQuery)
    const recommendations = await policyRecommendationStore.objectQuery()
    this.setState({ policyRecommendationsLast7days: recommendations.count })
  }


  render() {
    return (
      <MaterialBox
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: 10,
          textAlign: 'center'
        }}
      >
        <MaterialBox style={{ fontSize: 18 }}>New Recommendations</MaterialBox>
        <MaterialBox
          style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}
        >
          {this.state.policyRecommendationsLast7days}
        </MaterialBox>
        <MaterialBox>in last 7 days</MaterialBox>
      </MaterialBox>
    )
  }
}


export default observer(RecommendationsCard)
