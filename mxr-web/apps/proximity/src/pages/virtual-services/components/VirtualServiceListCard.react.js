import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withStyles } from '@material-ui/styles'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MaterialBox } from 'libs/material'
import PlatformLoaderCard from 'apps/platform/components/PlatformLoaderCard.react'
import { virtualServiceStore } from 'apps/proximity/stores/proximity.store'


class VirtualServiceListCard extends Component {
  handleFetch = async () => {
    virtualServiceStore.setShowProcessCard(true)
    try {
      const virtualServices = await virtualServiceStore.objectQuery()
      virtualServiceStore.setSearchResultsObjectCount(virtualServices.count)
      virtualServiceStore.setObjects(virtualServices.data)
    } catch (error) {
      console.log(`Error: Getting Virtual Service`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }


  async componentDidMount() {
    virtualServiceStore.setSearchPageObjectCount(10)
    virtualServiceStore.setSearchPageNum(0)
    await this.handleFetch()
  }


  render() {
    const showLoader = virtualServiceStore.getShowProcessCard()
    const virtualServices = virtualServiceStore.getObjects()
    if (showLoader && !virtualServices) {
      return (
        <MaterialBox style={{ margin: 50 }}>
          <PlatformLoaderCard />
        </MaterialBox>
      )
    }

    const searchQuery = virtualServiceStore.getSortQuery()
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
          virtualServiceStore.getSelectedObject()
            ? virtualServiceStore.getSelectedObject().id
            : ''
        }
        totalRecords={virtualServiceStore.getSearchResultsObjectCount()}
        loading={virtualServiceStore.getShowProcessCard()}
        rows={virtualServiceStore.getSearchPageObjectCount()}
        first={
          virtualServiceStore.getSearchPageNum() *
          virtualServiceStore.getSearchPageObjectCount()
        }
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          const virtualService = e.value
          virtualServiceStore.setSelectedObject(virtualService)
          virtualServiceStore.setFormFields({
            id: virtualService.id,
            displayName: virtualService.displayName,
            proximityUrl:
              virtualService.currentRevision.virtualService.proximityUrl,
            targetUrl: virtualService.currentRevision.virtualService.targetUrl,
            policiesMetadata:
              virtualService.currentRevision.virtualService.policiesMetadata
          })
          virtualServiceStore.setShowObjectViewMode('UPDATE')
          virtualServiceStore.setShowObjectViewModeSecondary('DETAILS')
        }}
        onPage={async (e) => {
          virtualServiceStore.setSearchPageNum(e.page)
          virtualServiceStore.setSearchPageObjectCount(e.rows)
          await this.handleFetch()
        }}
        multiSortMeta={searchQueryArray}
        onSort={async (e) => {
          let sortQuery = virtualServiceStore.getSortQuery()
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
          virtualServiceStore.setSortQuery(sortQuery)
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
