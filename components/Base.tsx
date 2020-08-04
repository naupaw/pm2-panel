import { AppBar, colors, Toolbar, Typography } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles, Theme } from '@material-ui/core/styles'
import React, { Fragment } from 'react'

const useStyles = makeStyles((theme: Theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }
})

const Base = ({ children }) => {
  const classes = useStyles()
  return (
    <Fragment>
      <CssBaseline />
      <AppBar className={classes.appBar} position='fixed'>
        <Toolbar>
          <Typography variant='h6'>Process Monitor</Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          backgroundColor: colors.grey[100],
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <div className='main'>{children}</div>
      </div>
    </Fragment>
  )
}

export default Base
