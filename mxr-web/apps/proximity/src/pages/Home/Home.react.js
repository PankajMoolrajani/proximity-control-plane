import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PageLayout from '/mxr-web/apps/proximity/src/components/PageLayout'
import ViolationsCard from '/mxr-web/apps/proximity/src/pages/Home/components/ViolationsCard.react'
import VirtualServices from '/mxr-web/apps/proximity/src/pages/Home/components/VirtualServices.react'
import PoliciesCard from '/mxr-web/apps/proximity/src/pages/Home/components/PoliciesCard.react'
import RecommedationsCard from '/mxr-web/apps/proximity/src/pages/Home/components/RecommedationsCard.react'
import FeedsCard from '/mxr-web/apps/proximity/src/pages/Home/components/FeedsCard.react'

const Home = () => {
  const _renderTitle = () => {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box style={{ marginRight: 25 }}>
          <DashboardIcon />
        </Box>
        <Typography variant='h5'>Dashboard</Typography>
      </Box>
    )
  }

  return (
    <PageLayout title={_renderTitle()}>
      <Box
        style={{
          padding: '0 20px',
          marginTop: 20
        }}
      >
        <Grid style={{ flexGrow: 1 }} container spacing={2}>
          <Grid item sm={4}>
            <ViolationsCard />
          </Grid>
          <Grid item sm={8}>
            <Grid container spacing={2}>
              <Grid item sm={3}>
                <VirtualServices />
              </Grid>
              <Grid item sm={5}>
                <PoliciesCard />
              </Grid>
              <Grid item sm={4}>
                <RecommedationsCard />
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: 10 }}>
              <Grid item sm={12}>
                <FeedsCard />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageLayout>
  )
}

export default observer(Home)
