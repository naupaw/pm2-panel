import { makeStyles, Theme } from '@material-ui/core/styles'
import { drawerWidth } from '../components/ProcessList'

const globalStyles = makeStyles((theme: Theme) => ({
  main: {
    marginLeft: drawerWidth,
    padding: 30,
  },
  centered: {
    textAlign: 'center',
    marginTop: 100,
  },
}))

export default globalStyles
