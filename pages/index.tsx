import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RestartIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import Base from '../components/Base'
import Api from '../util/Api'
interface Props {}

const index = (props: Props) => {
  const [list, setList] = useState([])
  const router = useRouter()
  const fetchAll = async () => {
    const { data } = await Api().get('/all')
    setList(data.data)
  }

  const callAction = async ({ id, action }) => {
    try {
      const { data } = await Api().post('/action', { id, action })
      console.log(data)
      fetchAll()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchAll()
    return () => {}
  }, [])

  return (
    <Base>
      <div style={{ float: 'right', marginBottom: 15 }}>
        <Button
          color='primary'
          variant='contained'
          disableElevation
          onClick={fetchAll}
        >
          Reload
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>PID</TableCell>
              <TableCell>Restart</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.pm_id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.pid}</TableCell>
                <TableCell>{item.pm2_env.restart_time}</TableCell>
                <TableCell>{item.pm2_env.status}</TableCell>
                <TableCell>
                  {(item.monit.memory / 1024 / 1024).toFixed(2)} MB
                </TableCell>
                <TableCell>{item.monit.cpu.toFixed(2)}%</TableCell>
                <TableCell style={{ textAlign: 'right', width: '300px' }}>
                  {item.pm2_env.status === 'online' ? (
                    <Fragment>
                      <Button
                        variant='contained'
                        color='primary'
                        disableElevation
                        size='small'
                        style={{ marginRight: '.5rem' }}
                        startIcon={<StopIcon />}
                        onClick={() =>
                          callAction({ id: item.pm_id, action: 'stop' })
                        }
                      >
                        Stop
                      </Button>
                      <Button
                        variant='outlined'
                        disableElevation
                        color='primary'
                        size='small'
                        startIcon={<RestartIcon />}
                        onClick={() =>
                          callAction({ id: item.pm_id, action: 'restart' })
                        }
                      >
                        Restart
                      </Button>
                    </Fragment>
                  ) : (
                    <Button
                      variant='contained'
                      disableElevation
                      color='primary'
                      size='small'
                      startIcon={<PlayArrow />}
                      onClick={() =>
                        callAction({ id: item.name, action: 'start' })
                      }
                    >
                      Start
                    </Button>
                  )}
                  <div
                    style={{
                      marginLeft: '.5rem',
                      display: 'inline-block',
                    }}
                  >
                    <IconButton
                      size='small'
                      onClick={() => {
                        //
                        router.push('/process/[id]', '/process/' + item.pm_id)
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Base>
  )
}

export default index
