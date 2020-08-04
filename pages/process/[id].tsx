import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RestartIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import SyncIcon from '@material-ui/icons/Sync'
import moment from 'moment'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import useSWR from 'swr'
import Base from '../../components/Base'
import {
  DialogComponent,
  useMaterialDialog,
} from '../../components/DialogController'
import ProcessList from '../../components/ProcessList'
import Api from '../../util/Api'
import useStyles from '../../util/globalStyles'

const SubProcess = () => {
  const router = useRouter()
  const classes = useStyles()
  const materialDialog = useMaterialDialog()
  const { data, error, isValidating, revalidate } = useSWR(
    () => (router.query.id ? '/process/' + router.query.id : null),
    {
      revalidateOnMount: true,
      initialData: null,
    }
  )

  const callAction = async ({ id, action }) => {
    try {
      const { data } = await Api().post('/action', { id, action })
      revalidate()
    } catch (e) {}
  }

  const confirmFlush = (name) => {
    materialDialog.confirmModal({
      content: 'Are you sure to flush this process logs?',
      action: async () => {
        callAction({ id: name, action: 'flush' })
        return true
      },
    })
  }

  return (
    <Base>
      <ProcessList active={router.query.id as string} />
      <div className={classes.main}>
        <div>
          <Card>
            <CardContent>
              {data === null ? (
                <div className='loading'>
                  <CircularProgress />
                </div>
              ) : (
                <Fragment>
                  <div className='action-button'>
                    <Button
                      variant='outlined'
                      color='secondary'
                      disableElevation
                      style={{ marginRight: '.5rem' }}
                      startIcon={<SyncIcon />}
                      onClick={() => revalidate()}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      disableElevation
                      style={{ marginRight: '.5rem' }}
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => confirmFlush(data.name)}
                    >
                      Flush Logs
                    </Button>

                    {data.pm2_env.status === 'online' ? (
                      <Fragment>
                        <Button
                          variant='contained'
                          color='primary'
                          disableElevation
                          style={{ marginRight: '.5rem' }}
                          startIcon={<StopIcon />}
                          onClick={() =>
                            callAction({ id: data.pm_id, action: 'stop' })
                          }
                        >
                          Stop
                        </Button>
                        <Button
                          variant='outlined'
                          disableElevation
                          color='primary'
                          startIcon={<RestartIcon />}
                          onClick={() =>
                            callAction({ id: data.pm_id, action: 'restart' })
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
                        startIcon={<PlayArrow />}
                        onClick={() =>
                          callAction({ id: data.name, action: 'start' })
                        }
                      >
                        Start
                      </Button>
                    )}
                  </div>
                  <Typography gutterBottom variant='h5'>
                    #{data.pm2_env.pm_id} - {data.name}
                  </Typography>
                  <div>
                    <Grid container spacing={3}>
                      <Grid item>
                        <Typography variant='subtitle2'>Status</Typography>
                        <Typography variant='h5'>
                          {data.pm2_env.status}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>Memory</Typography>
                        <Typography variant='h5'>
                          {(data.monit.memory / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>CPU</Typography>
                        <Typography variant='h5'>
                          {data.monit.cpu.toFixed(2)}%
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>Restart</Typography>
                        <Typography variant='h5'>
                          {data.pm2_env.restart_time}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>
                          Unstable Restart
                        </Typography>
                        <Typography variant='h5'>
                          {data.pm2_env.unstable_restarts}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>Process ID</Typography>
                        <Typography variant='h5'>{data.pid}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant='subtitle2'>Uptime</Typography>
                        <Typography variant='h5'>
                          {data.pm2_env.status !== 'online'
                            ? '-'
                            : moment(data.pm2_env.pm_uptime).fromNow()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <div>
                        <Typography gutterBottom variant='subtitle1'>
                          Logs
                        </Typography>
                        <pre className='data-log'>{data.log}</pre>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div>
                        <Typography gutterBottom variant='subtitle1'>
                          Error Logs
                        </Typography>
                        <pre className='data-log'>{data.errLog}</pre>
                      </div>
                    </Grid>
                  </Grid>
                </Fragment>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx>{`
        .data-log {
          background: #333;
          overflow: scroll;
          height: 600px;
          color: #fff;
          padding: 15px;
        }
        .action-button {
          float: right;
        }
        .loading {
          text-align: center;
          margin: 100px;
        }
      `}</style>
      <DialogComponent {...materialDialog} />
    </Base>
  )
}

export default SubProcess
