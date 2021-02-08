import React, { Component } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import VirtualServiceStore from '/mxr-web/apps/proximity/src/stores/VirtualService.store'

export class VirtualServiceRevisionsCard extends Component {
  render() {
    const virtualService = VirtualServiceStore.getSelectedObject()
    return (
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={virtualService.revisions}
        selectionMode='single'
        rows={10}
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          console.log(JSON.parse(JSON.stringify(e.value)))
        }}
        removableSort
        paginator
      >
        <Column
          field='name'
          header='Name'
          body={(revision) => revision.virtualService.name}
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
          body={(revision) => moment(revision.tsCreate).format('MMM DD, YYYY')}
          sortable
        ></Column>
      </DataTable>
    )
  }
}


export default observer(VirtualServiceRevisionsCard)
