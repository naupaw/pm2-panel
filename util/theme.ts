import { indigo, pink, red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo.A400,
    },
    secondary: {
      main: pink.A400,
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})

export default theme
