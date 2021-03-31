import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import JSONPretty from 'react-json-pretty'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Box, Grid } from '@material-ui/core'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import stores from '../../../stores/proximity.store'
import {
  transformSortQuery,
  onSortQuery
} from '../../../libs/helpers/helper.lib'
const { virtualServiceStore, logStore } = stores

const VirtualServiceDecisionLogs = ({ virtualServiceId }) => {
  const [expandedRows, setExpandedRows] = useState(false)

  const handleFetch = async () => {
    const virtualService = virtualServiceStore.getSelectedObject()
    if (!virtualService) {
      return
    }
    logStore.setShowProcessCard(true)
    try {
      logStore.setSearchQuery({
        VirtualServiceId: virtualService.id,
        type: 'PROXIMITY_DECISION_LOG'
      })
      const logs = await logStore.objectQuery()
      logStore.setSearchResultsObjectCount(logs.count)
      logStore.setObjects(logs.rows)
    } catch (error) {
      console.log(`Error: Getting logs`)
    }
    logStore.setShowProcessCard(false)
  }

  const fetchVirtualSeviceById = async () => {
    virtualServiceStore.setShowProcessCard(true)
    try {
      const virtualService = await virtualServiceStore.objectQueryById(
        virtualServiceId
      )
      if (virtualService) {
        virtualServiceStore.setSelectedObject(virtualService)
      }
    } catch (error) {
      virtualServiceStore.setShowProcessCard(false)
      console.log(error)
    }
    virtualServiceStore.setShowProcessCard(false)
  }

  useEffect(() => {
    const initFetch = async () => {
      await fetchVirtualSeviceById()
      logStore.setSearchPageObjectCount(10)
      logStore.setSearchPageNum(0)
      await handleFetch()
    }
    initFetch()

    return () => {
      logStore.resetAllFields()
    }
  }, [])

  const _renderLogTemplate = (log) => {
    return (
      <Box>
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <JSONPretty
              className='hideScroll'
              style={{ maxHeight: 200, overflowY: 'auto' }}
              data={log.data}
            ></JSONPretty>
          </Grid>
          <Grid item sm={6}>
            <JSONPretty data={log.data.decision}></JSONPretty>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const sortQuery = logStore.getSortQuery()
  const showLoader = logStore.getShowProcessCard()
  const logs = logStore.getObjects()
  if (showLoader && !logs) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }
  if (!logs || logs.length === 0) {
    return <Box style={{ textAlign: 'center' }}>No Content</Box>
  }
  let sortQueryTransformed = transformSortQuery(sortQuery)

  return (
    <DataTable
      className='p-datatable-striped p-datatable-hovered'
      value={logs}
      selectionMode='single'
      dataKey={
        logStore.getSelectedObject() ? logStore.getSelectedObject().id : ''
      }
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={_renderLogTemplate}
      totalRecords={logStore.getSearchResultsObjectCount()}
      loading={logStore.getShowProcessCard()}
      rows={logStore.getSearchPageObjectCount()}
      first={logStore.getSearchPageNum() * logStore.getSearchPageObjectCount()}
      sortMode='multiple'
      rowsPerPageOptions={[10, 20, 50, 1000]}
      onSelectionChange={(e) => {}}
      onPage={async (e) => {
        logStore.setSearchPageNum(e.page)
        logStore.setSearchPageObjectCount(e.rows)
        await handleFetch()
      }}
      multiSortMeta={sortQueryTransformed}
      onSort={async (e) => {
        let sortQuery = logStore.getSortQuery()
        const updatedSortQuery = onSortQuery(sortQuery, e)
        logStore.setSortQuery(updatedSortQuery)
        await handleFetch()
      }}
      removableSort
      lazy
      paginator
    >
      <Column expander style={{ width: '3em' }} />
      <Column
        field='policyName'
        header='Policy'
        body={(log) =>
          log.data.policyName ? log.data.policyName : 'Decision Log'
        }
      ></Column>
      <Column
        field='type'
        header='Type'
        body={(log) => (log.data.type ? log.data.type : '')}
      ></Column>
      <Column
        field='revision'
        header='Revision'
        body={(log) =>
          log.PolicyRevisionId
            ? `rev-${log.PolicyRevisionId.split('-').reverse()[0]}`
            : ''
        }
      ></Column>
      <Column
        field='decision'
        header='Decision'
        body={(log) =>
          log.data.decision
            ? log.data.decision.allow
              ? 'ALLOWED'
              : 'DEINED'
            : 'NA'
        }
      ></Column>
      <Column
        field='createdAt'
        header='Time Stamp'
        body={(log) => moment(log.createdAt).format('MMM DD, YYYY hh:mm A')}
        sortable
      ></Column>
    </DataTable>
  )
}

export default observer(VirtualServiceDecisionLogs)
