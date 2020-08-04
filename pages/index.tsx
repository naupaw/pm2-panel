import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Base from '../components/Base'
import ProcessList from '../components/ProcessList'
import useStyles from '../util/globalStyles'
interface Props {}

const index = (props: Props) => {
  const [list, setList] = useState([])
  const router = useRouter()
  const classes = useStyles()

  return (
    <Base>
      <ProcessList />
      <div className={clsx(classes.main, classes.centered)}>
        <Typography variant='h5'>There is no process Selected</Typography>
        <Box pt={1}>
          <Typography variant='body2'>
            Please select process log left side to see more detail
          </Typography>
        </Box>
      </div>
    </Base>
  )
}

export default index
