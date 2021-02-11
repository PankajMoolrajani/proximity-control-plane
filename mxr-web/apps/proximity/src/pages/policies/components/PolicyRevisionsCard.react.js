import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { policyStore } = stores

export class PolicyRevisionsCard extends Component {
  render() {
    const policy = policyStore.getSelectedObject()
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={policy.PolicyRevisions}
        selectionMode='single'
        rows={10}
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => { 
          const revision = e.value
          policyStore.setSelectedObject(revision)
          policyStore.setFormFields({
            id: revision.PolicyId,
            name: revision.name,
            displayName: revision.displayName,
            type: revision.type,
            rules: revision.rules
          })
          policyStore.setShowObjectViewMode('UPDATE')
        }}
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
          body={(revision) => revision.id}
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
}

export default observer(PolicyRevisionsCard)
