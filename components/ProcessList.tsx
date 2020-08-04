import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import clsx from 'clsx'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { useRouter } from 'next/router'
import { Fragment, useMemo } from 'react'
import useSWR from 'swr'
import Api from '../util/Api'

export const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) => {
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    itemActive: {
      background: theme.palette.grey[300],
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  }
})

interface Props {
  active?: string
}

const ProcessList = ({ active }: Props) => {
  const router = useRouter()
  const { data, error, isValidating, revalidate } = useSWR('/all', {
    revalidateOnMount: true,
    initialData: { data: [] },
  })
  const classes = useStyles()
  const theme = useTheme()

  const lists = useMemo(() => {
    if (data.data && data.data.length > 0) {
      return data.data
    }
    return []
  }, [data])

  const callAction = async ({ id, action }, onClose) => {
    onClose()
    try {
      const { data } = await Api().post('/action', { id, action })
      revalidate()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Drawer
      className={classes['drawer']}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {lists.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                router.push('/process/[id]', `/process/${item.pm_id}`)
              }}
              className={clsx({
                [classes.itemActive]: item.pm_id.toString() === active,
              })}
            >
              <ListItemIcon>
                {item.pm2_env.status === 'online' ? (
                  <OfflineBoltIcon
                    style={{ color: theme.palette.success.main }}
                  />
                ) : (
                  <RemoveCircleOutlineIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ noWrap: true }}
                secondary={item.pm2_env.status}
              />
              <ListItemSecondaryAction>
                <PopupState variant='popover' popupId={`process-${index}`}>
                  {(popupState) => (
                    <Fragment>
                      <IconButton {...bindTrigger(popupState)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu {...bindMenu(popupState)}>
                        {item.pm2_env.status === 'online' ? (
                          <Fragment>
                            <MenuItem
                              onClick={() =>
                                callAction(
                                  { id: item.name, action: 'stop' },
                                  popupState.close
                                )
                              }
                            >
                              Stop
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                callAction(
                                  { id: item.name, action: 'restart' },
                                  popupState.close
                                )
                              }
                            >
                              Restart
                            </MenuItem>
                          </Fragment>
                        ) : (
                          <MenuItem
                            onClick={() =>
                              callAction(
                                { id: item.name, action: 'start' },
                                popupState.close
                              )
                            }
                          >
                            Start
                          </MenuItem>
                        )}
                      </Menu>
                    </Fragment>
                  )}
                </PopupState>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

export default ProcessList
