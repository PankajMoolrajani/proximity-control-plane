import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import JSONPretty from 'react-json-pretty'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import {
  transformSortQuery,
  onSortQuery
} from '/mxr-web/apps/proximity/src/libs/helpers/helper.lib'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { logStore } = stores

export class PolicyDecisionLogsCard extends Component {
  state = {
    expandedRows: null
  }

  _renderLogTemplate = (log) => {
    return (
      <Box>
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <JSONPretty
              className='hideScroll'
              style={{ maxHeight: 200, overflowY: 'auto' }}
              data={log.data}
            ></JSONPretty>
          </Grid>
          <Grid item sm={6}>
            <JSONPretty data={log.data.decision}></JSONPretty>
          </Grid>
        </Grid>
      </Box>
    )
  }

  render() {
    const sortQuery = logStore.getSortQuery()
    const logs = logStore.getObjects()
    if (!logs || logs.length === 0) {
      return <Box style={{ textAlign: 'center' }}>No Content</Box>
    }
    let sortQueryTransformed = transformSortQuery(sortQuery)
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={logs}
        selectionMode='single'
        dataKey={
          logStore.getSelectedObject() ? logStore.getSelectedObject().id : ''
        }
        expandedRows={this.state.expandedRows}
        onRowToggle={(e) => this.setState({ expandedRows: e.data })}
        rowExpansionTemplate={this._renderLogTemplate}
        totalRecords={logStore.getSearchResultsObjectCount()}
        loading={logStore.getShowProcessCard()}
        rows={logStore.getSearchPageObjectCount()}
        first={
          logStore.getSearchPageNum() * logStore.getSearchPageObjectCount()
        }
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {}}
        onPage={async (e) => {
          logStore.setSearchPageNum(e.page)
          logStore.setSearchPageObjectCount(e.rows)
          await this.props.fetchDecisionLogs()
        }}
        multiSortMeta={sortQueryTransformed}
        onSort={async (e) => {
          let sortQuery = logStore.getSortQuery()
          const updatedSortQuery = onSortQuery(sortQuery, e)
          logStore.setSortQuery(updatedSortQuery)
          await this.props.fetchDecisionLogs()
        }}
        removableSort
        lazy
        paginator
      >
        <Column expander style={{ width: '3em' }} />
        <Column
          field='policyName'
          header='Policy'
          body={(log) => log.data.policyName}
        ></Column>
        <Column
          field='type'
          header='Type'
          body={(log) => log.data.policyType}
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(log) => `rev-${log.PolicyRevisionId.split('-').reverse()[0]}`}
        ></Column>
        <Column
          field='decision'
          header='Decision'
          body={(log) => (log.data.decision.allow ? 'ALLOWED' : 'DEINED')}
        ></Column>
        <Column
          field='createdAt'
          header='Time Stamp'
          body={(log) => moment(log.createdAt).format('MMM DD, YYYY hh:mm A')}
          sortable
        ></Column>
      </DataTable>
    )
  }
}

export default observer(PolicyDecisionLogsCard)
