import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Box from '@material-ui/core/Box'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'

class VirtualServiceListCard extends Component {
  handleFetch = async () => {
    VirtualServiceStore.setShowProcessCard(true)
    try {
      const virtualServices = await VirtualServiceStore.objectQuery()
      VirtualServiceStore.setSearchResultsObjectCount(virtualServices.count)
      VirtualServiceStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting Virtual Service`)
    }
    VirtualServiceStore.setShowProcessCard(false)
  }

  async componentDidMount() {
    VirtualServiceStore.setSearchPageObjectCount(10)
    VirtualServiceStore.setSearchPageNum(0)
    await this.handleFetch()
  }

  render() {
    const showLoader = VirtualServiceStore.getShowProcessCard()
    const virtualServices = VirtualServiceStore.getObjects()
    if (showLoader && !virtualServices) {
      return (
        <Box style={{ margin: 50 }}>
          <PlatformLoaderCard />
        </Box>
      )
    }

    const searchQuery = VirtualServiceStore.getSortQuery()
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
        value={virtualServices}
        selectionMode='single'
        dataKey={
          VirtualServiceStore.getSelectedObject()
            ? VirtualServiceStore.getSelectedObject().id
            : ''
        }
        totalRecords={VirtualServiceStore.getSearchResultsObjectCount()}
        loading={VirtualServiceStore.getShowProcessCard()}
        rows={VirtualServiceStore.getSearchPageObjectCount()}
        first={
          VirtualServiceStore.getSearchPageNum() *
          VirtualServiceStore.getSearchPageObjectCount()
        }
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          const virtualService = e.value
          VirtualServiceStore.setSelectedObject(virtualService)
          VirtualServiceStore.setFormFields({
            id: virtualService.id,
            displayName: virtualService.displayName,
            proximityUrl:
              virtualService.currentRevision.virtualService.proximityUrl,
            targetUrl: virtualService.currentRevision.virtualService.targetUrl,
            policiesMetadata:
              virtualService.currentRevision.virtualService.policiesMetadata
          })
          VirtualServiceStore.setShowObjectViewMode('UPDATE')
          VirtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
        }}
        onPage={async (e) => {
          VirtualServiceStore.setSearchPageNum(e.page)
          VirtualServiceStore.setSearchPageObjectCount(e.rows)
          await this.handleFetch()
        }}
        multiSortMeta={searchQueryArray}
        onSort={async (e) => {
          let sortQuery = VirtualServiceStore.getSortQuery()
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
          VirtualServiceStore.setSortQuery(sortQuery)
          await this.handleFetch()
        }}
        removableSort
        lazy
        paginator
      >
        <Column
          field='name'
          header='Name'
          body={(virtualService) => virtualService.name}
          sortable
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(virtualService) => virtualService.currentRevision.name}
          sortable
        ></Column>
        <Column
          field='tsCreate'
          header='Date Created'
          body={(virtualService) =>
            moment(virtualService.tsCreate).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
        <Column
          field='tsUpdate'
          header='Date Modified'
          body={(virtualService) =>
            moment(virtualService.tsUpdate).format('MMM DD, YYYY')
          }
          sortable
        ></Column>
      </DataTable>
    )
  }
}

export default observer(VirtualServiceListCard)
