import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import JSONPretty from 'react-json-pretty'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LogStore from '/mxr-web/apps/proximity/src/stores/Log.store'

export class VirtualServiceDecisionLogs extends Component {
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
    const searchQuery = LogStore.getSortQuery()
    const logs = LogStore.getObjects()
    if (!logs || logs.length === 0) {
      return (
        <Box style={{ textAlign: 'center' }}>No Content</Box>
      )
    }
    let searchQueryArray = []
    for (const field in searchQuery) {
      searchQueryArray.push({
        field: field,
        order: searchQuery[field]
      })
    }
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={logs}
        selectionMode='single'
        dataKey={
          LogStore.getSelectedObject() ? LogStore.getSelectedObject().id : ''
        }
        expandedRows={this.state.expandedRows}
        onRowToggle={(e) => this.setState({ expandedRows: e.data })}
        rowExpansionTemplate={this._renderLogTemplate}
        totalRecords={LogStore.getSearchResultsObjectCount()}
        loading={LogStore.getShowProcessCard()}
        rows={LogStore.getSearchPageObjectCount()}
        first={
          LogStore.getSearchPageNum() * LogStore.getSearchPageObjectCount()
        }
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {}}
        onPage={async (e) => {
          LogStore.setSearchPageNum(e.page)
          LogStore.setSearchPageObjectCount(e.rows)
          await this.props.fetchDecisionLogs()
        }}
        multiSortMeta={searchQueryArray}
        onSort={async (e) => {
          let sortQuery = LogStore.getSortQuery()
          if (!sortQuery) {
            sortQuery = {}
          }

          e.multiSortMeta.forEach((sortMeta) => {
            sortQuery[sortMeta.field] = sortMeta.order
          })

          for (const field in sortQuery) {
            if (
              e.multiSortMeta.findIndex(
                (msortMeta) => msortMeta.field === field
              ) === -1
            ) {
              delete sortQuery[field]
            }
          }
          LogStore.setSortQuery(sortQuery)
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
          body={(log) => log.data.policyName ? log.data.policyName : 'Access Log'}
        ></Column>
        <Column
          field='type'
          header='Type'
          body={(log) => log.data.policyType ? log.data.policyType : ''}
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(log) => log.data.policyRevisionName ? log.data.policyRevisionName : ''}
        ></Column>
        <Column
          field='decision'
          header='Decision'
          body={(log) => ( log.data.decision ? log.data.decision.allow ? 'ALLOWED' : 'DEINED' : 'NA')}
        ></Column>
        <Column
          field='tsCreate'
          header='Time Stamp'
          body={(log) => moment(log.tsCreate).format('MMM DD, YYYY hh:mm A')}
          sortable
        ></Column>
      </DataTable>
    )
  }
}


export default observer(VirtualServiceDecisionLogs)
