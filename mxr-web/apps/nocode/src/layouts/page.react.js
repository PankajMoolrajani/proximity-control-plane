import Box from '@material-ui/core/Box'
import Papar from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import ListIcon from '@material-ui/icons/List'

const Page = ({ title, onCreate, onShowAll, children }) => {
  return (
    <Papar>
      <Box p={4}>
        <Box py={1} display="flex" justifyContent="space-between">
          <Typography variant="h5">{title}</Typography>
          <Box>
            {onCreate && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onCreate}
              >
                Create {title}
              </Button>
            )}
            {onShowAll && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ListIcon />}
                onClick={onShowAll}
                style={{ marginLeft: 16 }}
              >
                Show all
              </Button>
            )}
          </Box>
        </Box>
        <Divider />
        <Box py={4}>{children}</Box>
      </Box>
    </Papar>
  )
}

export default Page
