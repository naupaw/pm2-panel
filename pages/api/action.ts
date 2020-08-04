import pm2 from 'pm2'

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.json({ message: 'Not implemented' })
    }

    const { id, action } = req.body
    if (!id && !action) {
      return res.json({ message: 'please fill required field' })
    }

    const result = await new Promise((resolve, reject) => {
      const theCallback = (err) => {
        if (err) {
          pm2.disconnect()
          console.error(err)
          return reject({ message: 'failed to process action' })
        }
        pm2.disconnect()
        return resolve({ message: 'ok' })
      }

      pm2.connect((err) => {
        if (err) return reject({ message: 'couldnt connect to pm2' })

        if (action === 'restart') {
          pm2.restart(id, (err) => {
            return theCallback(err)
          })
        } else if (action === 'start') {
          pm2.start(
            {
              name: id,
            },
            (err) => {
              return theCallback(err)
            }
          )
        } else if (action === 'stop') {
          pm2.stop(id, (err) => {
            return theCallback(err)
          })
        } else if (action === 'flush') {
          pm2.flush(id, (err) => theCallback(err))
        } else {
          return reject({ message: 'action not found' })
        }
      })
    })
    return res.json(result)
  } catch (e) {
    return res.status(500).json(e)
  }
}
