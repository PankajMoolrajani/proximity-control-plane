import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import PolicyStore from '/mxr-web/apps/proximity/src/stores/Policy.store'

export class PolicyRevisionsCard extends Component {
  render() {
    const policy = PolicyStore.getSelectedObject()
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={policy.revisions}
        selectionMode='single'
        rows={10}
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          console.log(JSON.parse(JSON.stringify(e.value)))
          // const policy = e.value
          // PolicyStore.setSelectedObject(policy)
          // PolicyStore.setFormFields({
          //   id: policy.id,
          //   name: policy.currentRevision.policy.name,
          //   type: policy.currentRevision.policy.type,
          //   rules: policy.currentRevision.policy.rules
          // })
          // PolicyStore.setShowObjectViewMode('UPDATE')
        }}
        removableSort
        paginator
      >
        <Column
          field='name'
          header='Name'
          body={(revision) => revision.policy.name}
          sortable
        ></Column>
        <Column
          field='displayName'
          header='Display Name'
          body={(revision) => revision.policy.displayName}
          sortable
        ></Column>
        <Column
          field='revision'
          header='Revision'
          body={(revision) => revision.name}
          sortable
        ></Column>
        <Column
          field='tsCreate'
          header='Date Created'
          body={(policy) => moment(policy.tsCreate).format('MMM DD, YYYY')}
          sortable
        ></Column>
      </DataTable>
    )
  }
}


export default observer(PolicyRevisionsCard)
