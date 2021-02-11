import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore } = stores

const classes = {
  tableHeadCell: {
    fontSize: 16,
    fontWeight: 700
  },
  tableCell: {
    fontSize: 16,
    fontWeight: 400
  }
}

class PolicyListCard extends Component {
  handleFetch = async () => {
    policyStore.setShowProcessCard(true)
    try {
      const policies = await policyStore.objectQuery()
      policyStore.setSearchResultsObjectCount(policies.count)
      policyStore.setObjects(policies.data)
    } catch (error) {
      console.log(`Error: Getting Policies`)
    }
    policyStore.setShowProcessCard(false)
  }

  async componentDidMount() {
    policyStore.setSearchPageObjectCount(10)
    policyStore.setSearchPageNum(0)
    await this.handleFetch()
  }

  render() {
    const showLoader = policyStore.getShowProcessCard()
    const policies = policyStore.getObjects()
    if (showLoader && !policies) {
      return <Box style={{ margin: 50 }}>Loading...</Box>
    }

    if (!policies || policies.length === 0) {
      return <Box style={{ textAlign: 'center' }}>No Content</Box>
    }

    const searchQuery = policyStore.getSortQuery()
    let searchQueryArray = []
    for (const field in searchQuery) {
      searchQueryArray.push({
        field: field,
        order: searchQuery[field]
      })
    }
    return (
      <Box className='card'>
        <DataTable
          value={policies}
          selectionMode='single'
          dataKey={
            policyStore.getSelectedObject()
              ? policyStore.getSelectedObject().id
              : ''
          }
          totalRecords={policyStore.getSearchResultsObjectCount()}
          loading={policyStore.getShowProcessCard()}
          rows={policyStore.getSearchPageObjectCount()}
          first={
            policyStore.getSearchPageNum() *
            policyStore.getSearchPageObjectCount()
          }
          sortMode='multiple'
          rowsPerPageOptions={[10, 20, 50, 1000]}
          onSelectionChange={(e) => {
            const policy = e.value
            policyStore.setSelectedObject(policy)
            policyStore.setFormFields({
              id: policy.id,
              displayName: policy.displayName,
              type: policy.currentRevision.policy.type,
              rules: policy.currentRevision.policy.rules
            })
            policyStore.setShowObjectViewMode('UPDATE')
            policyStore.setShowObjectViewModeSecondary('DETAILS')
          }}
          onPage={async (e) => {
            policyStore.setSearchPageNum(e.page)
            policyStore.setSearchPageObjectCount(e.rows)
            await this.handleFetch()
          }}
          multiSortMeta={searchQueryArray}
          onSort={async (e) => {
            let sortQuery = policyStore.getSortQuery()
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
            policyStore.setSortQuery(sortQuery)
            await this.handleFetch()
          }}
          removableSort
          lazy
          paginator
        >
          <Column
            field='name'
            header='Name'
            body={(policy) => policy.name}
            sortable
          ></Column>
          <Column
            field='revision'
            header='Revision'
            body={(policy) => policy.currentRevision.name}
            sortable
          ></Column>
          <Column
            field='tsCreate'
            header='Date Created'
            body={(policy) => moment(policy.tsCreate).format('MMM DD, YYYY')}
            sortable
          ></Column>
          <Column
            field='tsUpdate'
            header='Date Modified'
            body={(policy) => moment(policy.tsUpdate).format('MMM DD, YYYY')}
            sortable
          ></Column>
        </DataTable>
      </Box>
    )
  }
}

export default withStyles(classes)(observer(PolicyListCard))
