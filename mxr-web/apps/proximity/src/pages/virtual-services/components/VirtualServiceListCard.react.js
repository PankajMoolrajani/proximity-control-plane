import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Box } from '@material-ui/core'
import PlatformLoaderCard from '/mxr-web/apps/proximity/src/components/platform/PlatformLoaderCard.react'
import {
  transformSortQuery,
  onSortQuery
} from '/mxr-web/apps/proximity/src/libs/helpers/helper.lib'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore } = stores

const VirtualServiceListCard = () => {
  const { push } = useHistory()
  const { path } = useRouteMatch()
  const handleFetch = async () => {
    virtualServiceStore.setShowProcessCard(true)
    try {
      const virtualServices = await virtualServiceStore.objectQuery()
      virtualServiceStore.setSearchResultsObjectCount(virtualServices.count)
      virtualServiceStore.setObjects(virtualServices.rows)
    } catch (error) {
      console.log(`Error: Getting Virtual Service`)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  useEffect(() => {
    virtualServiceStore.setSearchPageObjectCount(10)
    virtualServiceStore.setSearchPageNum(0)
    handleFetch()
  }, [])

  const showLoader = virtualServiceStore.getShowProcessCard()
  const virtualServices = virtualServiceStore.getObjects()
  const sortQuery = virtualServiceStore.getSortQuery()

  if (showLoader && !virtualServices) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  if (!virtualServices || virtualServices.length === 0) {
    return <Box style={{ textAlign: 'center' }}>No Content</Box>
  }

  let sortQueryTransformed = transformSortQuery(sortQuery)
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
        push(`${path}/${virtualService.id}`)
      }}
      onPage={async (e) => {
        virtualServiceStore.setSearchPageNum(e.page)
        virtualServiceStore.setSearchPageObjectCount(e.rows)
        await handleFetch()
      }}
      multiSortMeta={sortQueryTransformed}
      onSort={async (e) => {
        let sortQuery = virtualServiceStore.getSortQuery()
        const updatedSortQuery = onSortQuery(sortQuery, e)
        virtualServiceStore.setSortQuery(updatedSortQuery)
        await handleFetch()
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
        field='createdAt'
        header='Date Created'
        body={(virtualService) =>
          moment(virtualService.createdAt).format('MMM DD, YYYY')
        }
        sortable
      ></Column>
      <Column
        field='updatedAt'
        header='Date Modified'
        body={(virtualService) =>
          moment(virtualService.updatedAt).format('MMM DD, YYYY')
        }
        sortable
      ></Column>
    </DataTable>
  )
}

export default observer(VirtualServiceListCard)
