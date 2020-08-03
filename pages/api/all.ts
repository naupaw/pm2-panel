import pm2 from 'pm2'

export default async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if (err) return reject({ message: 'couldnt connect to pm2' })

        pm2.list((err, list) => {
          if (err) {
            pm2.disconnect()
            return reject({ message: 'couldnt getting list pm2' })
          }
          pm2.disconnect()
          return resolve({ data: list })
        })
      })
    })
    return res.json(result)
  } catch (e) {
    return res.code(500).json(e)
  }
}
