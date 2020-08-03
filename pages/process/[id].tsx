import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'
import ArrowBack from '@material-ui/icons/ArrowBack'
import PlayArrow from '@material-ui/icons/PlayArrow'
import RestartIcon from '@material-ui/icons/Replay'
import StopIcon from '@material-ui/icons/Stop'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import Base from '../../components/Base'
import Api from '../../util/Api'

const SubProcess = () => {
  const router = useRouter()
  const [data, setData] = useState<any>({ pm2_env: {} })
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await Api().get('/process/' + router.query.id)
      setData(data.data)
    } catch (e) {
      //...
    }
    setLoading(false)
  }

  const callAction = async ({ id, action }) => {
    try {
      const { data } = await Api().post('/action', { id, action })
      console.log(data)
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (router.query.id) {
      fetchData()
    }
  }, [router.query.id])

  return (
    <Base>
      <Button
        variant='outlined'
        color='primary'
        startIcon={<ArrowBack />}
        onClick={() => {
          router.push('/')
        }}
      >
        Back
      </Button>
      <div style={{ marginTop: 20 }}>
        <Card>
          <CardContent>
            {loading ? (
              <div className='loading'>
                <CircularProgress />
              </div>
            ) : (
              <Fragment>
                <div className='action-button'>
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
                  {data.name}
                </Typography>
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
      <style jsx>{`
        .data-log {
          background: #333;
          overflow: scroll;
          height: 300px;
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
    </Base>
  )
}

export default SubProcess
