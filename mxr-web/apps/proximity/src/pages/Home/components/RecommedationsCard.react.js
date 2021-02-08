import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Box from '@material-ui/core/Box'
import PolicyRecommendation from '/mxr-web/apps/proximity/src/stores/PolicyRecommendation.store'

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
    PolicyRecommendation.setSearchQuery(searchQuery)
    const recommendations = await PolicyRecommendation.objectQuery()
    this.setState({ policyRecommendationsLast7days: recommendations.count })
  }

  render() {
    return (
      <Box
        style={{
          background: 'white',
          padding: '10px',
          borderRadius: 10,
          textAlign: 'center'
        }}
      >
        <Box style={{ fontSize: 18 }}>New Recommendations</Box>
        <Box style={{ fontSize: 50, color: '#2D9CDB', margin: '10px 0' }}>
          {this.state.policyRecommendationsLast7days}
        </Box>
        <Box>in last 7 days</Box>
      </Box>
    )
  }
}

export default observer(RecommendationsCard)
