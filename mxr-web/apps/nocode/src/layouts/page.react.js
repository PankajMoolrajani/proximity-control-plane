import Box from '@material-ui/core/Box'
import Papar from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import ListIcon from '@material-ui/icons/List'

const Page = ({ title, subtitle, icon, onCreate, onShowAll, children }) => {
  return (
    <Papar>
      <Box>
        <Box
          px={2}
          py={1}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Box display='flex' alignItems='center'>
            {icon}
            <Box>
              <Typography variant='h5' style={{ marginLeft: 10 }}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography variant='body' style={{ marginLeft: 10 }}>
                  {subtitle}
                </Typography>
              ) : (
                ''
              )}
            </Box>
          </Box>
          <Box>
            {onCreate && (
              <Button
                variant='text'
                color='primary'
                startIcon={<AddIcon />}
                onClick={onCreate}
              >
                Create {title}
              </Button>
            )}
            {onShowAll && (
              <Button
                variant='text'
                color='primary'
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
        <Box py={4} style={{ minHeight: '100vh' }}>
          {children}
        </Box>
      </Box>
    </Papar>
  )
}

export default Page
