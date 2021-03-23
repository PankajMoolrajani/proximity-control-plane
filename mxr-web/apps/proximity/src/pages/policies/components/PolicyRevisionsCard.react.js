import { useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { Box } from '@material-ui/core'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'

import stores from '../../../stores/proximity.store'
const { policyStore, policyRevisionStore } = stores

const PolicyRevisionsCard = ({ policyId }) => {
  const showLoader = policyRevisionStore.getShowProcessCard()
  const policyRevisions = policyRevisionStore.getObjects()

  const fetchPolicyRevisionsByPolicyId = async () => {
    policyRevisionStore.setShowProcessCard(true)
    try {
      const policyRevisions = await policyRevisionStore.objectQuery()
      policyRevisionStore.setSearchResultsObjectCount(policyRevisions.count)
      policyRevisionStore.setObjects(policyRevisions.rows)
    } catch (error) {
      console.log(`Error: Getting Policie revisions`)
    }
    policyRevisionStore.setShowProcessCard(false)
  }

  useEffect(() => {
    policyRevisionStore.setSearchQuery({
      PolicyId: policyId
    })
    fetchPolicyRevisionsByPolicyId()
  }, [policyId])

  if (showLoader && !policyRevisions) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }
  return (
    <DataTable
      className='p-datatable-striped p-datatable-hovered'
      value={policyRevisions}
      selectionMode='single'
      rows={10}
      sortMode='multiple'
      rowsPerPageOptions={[10, 20, 50, 1000]}
      onSelectionChange={(e) => {}}
      removableSort
      paginator
    >
      <Column
        field='name'
        header='Name'
        body={(revision) => revision.name}
        sortable
      ></Column>
      <Column
        field='displayName'
        header='Display Name'
        body={(revision) => revision.displayName}
        sortable
      ></Column>
      <Column
        field='revisionId'
        header='Revision'
        body={(revision) => `rev-${revision.id.split('-').reverse()[0]}`}
        sortable
      ></Column>
      <Column
        field='tsCreate'
        header='Date Created'
        body={(revision) => moment(revision.createdAt).format('MMM DD, YYYY')}
        sortable
      ></Column>
    </DataTable>
  )
}

export default observer(PolicyRevisionsCard)
