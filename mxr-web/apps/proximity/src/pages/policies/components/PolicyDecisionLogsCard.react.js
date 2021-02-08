import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import JSONPretty from 'react-json-pretty'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MaterialBox, MaterialGrid } from 'libs/material'
import { logStore } from 'apps/platform/stores/platform.store'


export class PolicyDecisionLogsCard extends Component {
  state = {
    expandedRows: null
  }


  _renderLogTemplate = (log) => {
    return (
      <MaterialBox>
        <MaterialGrid container spacing={1}>
          <MaterialGrid item sm={6}>
            <JSONPretty
              className='hideScroll'
              style={{ maxHeight: 200, overflowY: 'auto' }}
              data={log.data}
            ></JSONPretty>
          </MaterialGrid>
          <MaterialGrid item sm={6}>
            <JSONPretty data={log.data.decision}></JSONPretty>
          </MaterialGrid>
        </MaterialGrid>
      </MaterialBox>
    )
  }
  

  render() {
    const searchQuery = logStore.getSortQuery()
    const logs = logStore.getObjects()
    if (!logs || logs.length === 0) {
      return (
        <MaterialBox style={{ textAlign: 'center' }}>No Content</MaterialBox>
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
        multiSortMeta={searchQueryArray}
        onSort={async (e) => {
          let sortQuery = logStore.getSortQuery()
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
          logStore.setSortQuery(sortQuery)
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
          body={(log) => log.data.policyRevisionName}
        ></Column>
        <Column
          field='decision'
          header='Decision'
          body={(log) => (log.data.decision.allow ? 'ALLOWED' : 'DEINED')}
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


export default observer(PolicyDecisionLogsCard)
