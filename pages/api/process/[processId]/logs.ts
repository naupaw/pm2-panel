import pm2 from 'pm2'
import shelljs from 'shelljs'

export default async (req, res) => {
  try {
    const { processId } = req.query
    const result = await new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if (err) return reject({ message: 'couldnt connect to pm2' })

        pm2.describe(processId, async (err, desc) => {
          if (err) {
            pm2.disconnect()
            return reject({ message: 'couldnt getting list pm2' })
          }
          pm2.disconnect()

          if (desc.length > 0) {
            const data = desc[0]

            const log = shelljs.tail(
              { '-n': 100 },
              data.pm2_env.pm_out_log_path
            )
            const errLog = shelljs.tail(
              { '-n': 100 },
              data.pm2_env.pm_err_log_path
            )

            // const log = await readLast.read(data.pm2_env.pm_out_log_path, 100)
            // const errLog = await readLast.read(
            //   data.pm2_env.pm_err_log_path,
            //   100
            // )
            return resolve({ data: { log, errLog } })
          }
          return resolve({ message: 'process not found' })
        })
      })
    })
    return res.json(result)
  } catch (e) {
    console.error(e)
    return res.status(500).json(e)
  }
}
