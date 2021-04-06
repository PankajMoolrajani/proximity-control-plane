import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { Box, IconButton, Popover, Typography } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import VirtualServiceAddPolicyDialog from '/mxr-web/apps/proximity/src/pages/virtual-services/components/VirtualServiceAddPolicyDialog.react'
import PlatformLoaderCard from '../../../components/platform/PlatformLoaderCard.react'
import VirtualServiceAddExistingPolicyDialogCard from './VirtualServiceAddExistingPolicyDialogCard.react'
import {
  transformSortQuery,
  onSortQuery
} from '../../../libs/helpers/helper.lib'
import stores from '/mxr-web/apps/proximity/src/stores/proximity.store'
const { virtualServiceStore, policyStore, policyRecommendationStore } = stores

const RulePopover = ({ rule }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const packageName = `${rule.substr(0, 20)}...`
  return (
    <Box display='flex'>
      <Typography>{packageName}</Typography>
      <IconButton onClick={handleClick} size='small' style={{ marginLeft: 10 }}>
        <InfoIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <CodeMirror
          value={rule}
          options={{
            theme: 'idea',
            matchBrackets: true,
            mode: 'rego',
            readOnly: 'nocursor'
          }}
        />
      </Popover>
    </Box>
  )
}

const VirtualServicePolicyRecommendationCard = ({ virtualServiceId }) => {
  const [expandedRows, setExpandedRows] = useState(null)
  const [showAddPolicyPopUp, setShowAddPolicyPopUp] = useState(false)

  const handleFetch = async () => {
    const virtualService = virtualServiceStore.getSelectedObject()
    if (!virtualService) {
      return
    }
    policyRecommendationStore.setShowProcessCard(true)
    try {
      policyRecommendationStore.setSearchQuery({
        VirtualServiceId: virtualService.id
      })
      const policyRecommendations = await policyRecommendationStore.objectQuery()
      policyRecommendationStore.setSearchResultsObjectCount(
        policyRecommendations.count
      )
      policyRecommendationStore.setObjects(policyRecommendations.rows)
    } catch (error) {
      console.log(`Error: Getting policy recommendations`)
    }
    policyRecommendationStore.setShowProcessCard(false)
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
      policyRecommendationStore.setSearchPageObjectCount(10)
      policyRecommendationStore.setSearchPageNum(0)
      await handleFetch()
    }
    initFetch()
    return () => {
      policyRecommendationStore.resetAllFields()
    }
  }, [])

  const _renderPolicyTemplate = (poilcyRecommendation) => {
    return (
      <Box>
        <pre>{poilcyRecommendation.rules}</pre>
      </Box>
    )
  }

  const sortQuery = policyRecommendationStore.getSortQuery()
  const showPRLoader = policyRecommendationStore.getShowProcessCard()
  const showVsLoader = virtualServiceStore.getShowProcessCard()
  const showLoader = showPRLoader || showVsLoader
  const poilcyRecommendations = policyRecommendationStore.getObjects()
  const showAddPolicyDialog = virtualServiceStore.getShowAddObjectDialog()

  if (showLoader) {
    return (
      <Box style={{ margin: 50 }}>
        <PlatformLoaderCard />
      </Box>
    )
  }

  if (!poilcyRecommendations || poilcyRecommendations.length === 0) {
    return <Box style={{ textAlign: 'center' }}>No Content</Box>
  }

  let sortQueryTransformed = transformSortQuery(sortQuery)
  return (
    <Box>
      <DataTable
        className='p-datatable-striped p-datatable-hovered'
        value={poilcyRecommendations}
        selectionMode='single'
        dataKey={
          policyRecommendationStore.getSelectedObject()
            ? policyRecommendationStore.getSelectedObject().id
            : ''
        }
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={_renderPolicyTemplate}
        totalRecords={policyRecommendationStore.getSearchResultsObjectCount()}
        loading={policyRecommendationStore.getShowProcessCard()}
        rows={policyRecommendationStore.getSearchPageObjectCount()}
        first={
          policyRecommendationStore.getSearchPageNum() *
          policyRecommendationStore.getSearchPageObjectCount()
        }
        sortMode='multiple'
        rowsPerPageOptions={[10, 20, 50, 1000]}
        onSelectionChange={(e) => {
          policyStore.setFormFields({
            name: '',
            displayName: '',
            type: 'AUTHZ',
            rules: e.value.rule
          })
          policyStore.setShowObjectViewMode('CREATE')
          virtualServiceStore.setShowAddObjectDialog(true)
        }}
        onPage={async (e) => {
          policyRecommendationStore.setSearchPageNum(e.page)
          policyRecommendationStore.setSearchPageObjectCount(e.rows)
          await handleFetch()
        }}
        multiSortMeta={sortQueryTransformed}
        onSort={async (e) => {
          let sortQuery = policyRecommendationStore.getSortQuery()
          const updatedSortQuery = onSortQuery(sortQuery, e)
          policyRecommendationStore.setSortQuery(updatedSortQuery)
          await handleFetch()
        }}
        removableSort
        lazy
        paginator
      >
        <Column
          field='id'
          header='Policy Recommendation Id'
          body={(poilcyRecommendation) =>
            `rec-${poilcyRecommendation.id.split('-').reverse()[0]}`
          }
        ></Column>
        <Column
          field='rule'
          header='Rule'
          body={(poilcyRecommendation) => (
            <RulePopover rule={poilcyRecommendation.rule} />
          )}
        ></Column>
        <Column
          field='createdAt'
          header='Date'
          body={(poilcyRecommendation) =>
            moment(poilcyRecommendation.tsCreate).format('MMM DD, YYYY hh:mm A')
          }
          sortable
        ></Column>
      </DataTable>
      <VirtualServiceAddExistingPolicyDialogCard
        virtualServiceId={virtualServiceId}
        isOpen={showAddPolicyPopUp}
        onClose={() => setShowAddPolicyPopUp(false)}
        onOpen={() => setShowAddPolicyPopUp(true)}
      />
      {showAddPolicyDialog ? (
        <VirtualServiceAddPolicyDialog
          handleShowAddExistingPolicyPopup={setShowAddPolicyPopUp}
          fetchPolicies={handleFetch}
        />
      ) : null}
    </Box>
  )
}

export default observer(VirtualServicePolicyRecommendationCard)
