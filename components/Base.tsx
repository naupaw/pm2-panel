import {
  AppBar,
  colors,
  Container,
  Toolbar,
  Typography,
} from '@material-ui/core'
import React, { Fragment } from 'react'

const Base = ({ children }) => {
  return (
    <Fragment>
      <AppBar position='fixed'>
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
        <Container maxWidth={'lg'} style={{ marginTop: 30 }}>
          {children}
        </Container>
      </div>
    </Fragment>
  )
}

export default Base
