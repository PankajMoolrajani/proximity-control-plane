import { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Box } from '@material-ui/core'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import {
  transformSortQuery,
  onSortQuery
} from '../../../libs/helpers/helper.lib'
import stores from '../../../stores/proximity.store'
const { policyStore } = stores

const PolicyListCard = () => {
  const { push } = useHistory()
  const { path } = useRouteMatch()

  const handleFetch = async () => {
    policyStore.setShowProcessCard(true)
    try {
      const policies = await policyStore.objectQuery([
        {
          model: 'PolicyRevision'
        }
      ])
      policyStore.setSearchResultsObjectCount(policies.count)
      policyStore.setObjects(policies.rows)
    } catch (error) {
      console.log(`Error: Getting Policies`)
    }
    policyStore.setShowProcessCard(false)
  }

  useEffect(() => {
    policyStore.setSearchPageObjectCount(10)
    policyStore.setSearchPageNum(0)
    policyStore.setSelectedObject(null)
    policyStore.setFormFields(null)
    handleFetch()
  }, [])

  const showLoader = policyStore.getShowProcessCard()
  const policies = policyStore.getObjects()
  const sortQuery = policyStore.getSortQuery()
  if (showLoader && !policies) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  if (!policies || policies.length === 0) {
    return <Box style={{ textAlign: 'center' }}>No Content</Box>
  }

  let sortQueryTransformed = transformSortQuery(sortQuery)
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
          push(`${path}/${policy.id}`)
        }}
        onPage={async (e) => {
          policyStore.setSearchPageNum(e.page)
          policyStore.setSearchPageObjectCount(e.rows)
          await handleFetch()
        }}
        multiSortMeta={sortQueryTransformed}
        onSort={async (e) => {
          let sortQuery = policyStore.getSortQuery()
          const updatedSortQuery = onSortQuery(sortQuery, e)
          policyStore.setSortQuery(updatedSortQuery)
          await handleFetch()
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
          field='createdAt'
          header='Date Created'
          body={(policy) => moment(policy.createdAt).format('MMM DD, YYYY')}
          sortable
        ></Column>
        <Column
          field='updatedAt'
          header='Date Modified'
          body={(policy) => moment(policy.updatedAt).format('MMM DD, YYYY')}
          sortable
        ></Column>
      </DataTable>
    </Box>
  )
}

export default observer(PolicyListCard)
