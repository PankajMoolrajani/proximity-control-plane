import React, { useState, useEffect } from 'react'
import { axiosUnsecureInstance } from '../../libs/axios/axios'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import userStore from '../../store/user.store'
import EditIcon from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { observer } from 'mobx-react-lite'
import { useHistory, useRouteMatch } from 'react-router-dom'

const List = () => {
  const { push } = useHistory()
  const { path } = useRouteMatch()
  const [pages, setPages] = useState([])
  const getAllPages = async () => {
    const curOrg = userStore.getCurOrg()
    const defaultDb = `${curOrg.name}_default`
    const response = await axiosUnsecureInstance.post(
      `data/${defaultDb}/page/search`,
      {
        query: {}
      }
    )
    setPages(response.data.rows)
  }

  const deletePage = async (id) => {
    const curOrg = userStore.getCurOrg()
    const defaultDb = `${curOrg.name}_default`
    const reponse = await axiosUnsecureInstance.delete(
      `data/${defaultDb}/page/${id}`
    )
    const udpatedPages = pages.filter((page) => page.id !== id)
    setPages(udpatedPages)
  }

  useEffect(() => {
    getAllPages()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={100} component='th'>
              Sr. No.
            </TableCell>
            <TableCell component='th'>Name</TableCell>
            <TableCell component='th'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pages.length > 0 &&
            pages.map((page, index) => (
              <TableRow key={page.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{page.path}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      push({
                        pathname: `${path}/builder/${page.id}`,
                        state: { pagedata: page }
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deletePage(page.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default observer(List)
