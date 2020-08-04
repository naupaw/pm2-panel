import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useState } from 'react'

const defaultValue = {
  title: 'Konfirmasi',
  content: '',
}

export const useMaterialDialog = () => {
  const [isOpen, setOpen] = useState(false)
  const [data, setData] = useState({ ...defaultValue, action: null })

  return {
    isOpen,
    setOpen,
    data,
    confirmModal: ({ title = defaultValue.title, content, action }) => {
      setData({ title, content, action })
      setOpen(true)
    },
  }
}

export const DialogComponent = ({
  isOpen,
  data,
  setOpen,
}: ReturnType<typeof useMaterialDialog>) => {
  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (await data.action()) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogTitle>{data.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{data.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Tidak
        </Button>
        <Button onClick={handleConfirm} color='primary' autoFocus>
          Ya
        </Button>
      </DialogActions>
    </Dialog>
  )
}
