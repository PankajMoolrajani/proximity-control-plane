import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'

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
    PolicyStore.setShowProcessCard(true)
    try {
      const policies = await PolicyStore.objectQuery()
      PolicyStore.setSearchResultsObjectCount(policies.count)
      PolicyStore.setObjects(policies.data)
    } catch (error) {
      console.log(`Error: Getting Policies`)
    }
    PolicyStore.setShowProcessCard(false)
  }

  async componentDidMount() {
    PolicyStore.setSearchPageObjectCount(10)
    PolicyStore.setSearchPageNum(0)
    await this.handleFetch()
  }

  render() {
    const showLoader = PolicyStore.getShowProcessCard()
    const policies = PolicyStore.getObjects()
    if (showLoader && !policies) {
      return <Box style={{ margin: 50 }}>Loading...</Box>
    }

    if (!policies || policies.length === 0) {
      return <Box style={{ textAlign: 'center' }}>No Content</Box>
    }

    const searchQuery = PolicyStore.getSortQuery()
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
            PolicyStore.getSelectedObject()
              ? PolicyStore.getSelectedObject().id
              : ''
          }
          totalRecords={PolicyStore.getSearchResultsObjectCount()}
          loading={PolicyStore.getShowProcessCard()}
          rows={PolicyStore.getSearchPageObjectCount()}
          first={
            PolicyStore.getSearchPageNum() *
            PolicyStore.getSearchPageObjectCount()
          }
          sortMode='multiple'
          rowsPerPageOptions={[10, 20, 50, 1000]}
          onSelectionChange={(e) => {
            const policy = e.value
            PolicyStore.setSelectedObject(policy)
            PolicyStore.setFormFields({
              id: policy.id,
              displayName: policy.displayName,
              type: policy.currentRevision.policy.type,
              rules: policy.currentRevision.policy.rules
            })
            PolicyStore.setShowObjectViewMode('UPDATE')
            PolicyStore.setShowObjectViewModeSecondary('DETAILS')
          }}
          onPage={async (e) => {
            PolicyStore.setSearchPageNum(e.page)
            PolicyStore.setSearchPageObjectCount(e.rows)
            await this.handleFetch()
          }}
          multiSortMeta={searchQueryArray}
          onSort={async (e) => {
            let sortQuery = PolicyStore.getSortQuery()
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
            PolicyStore.setSortQuery(sortQuery)
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
