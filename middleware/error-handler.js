module.exports = {
    generalErrorHandler (err, req, res, next) {
      // if error is from sql, then set sql's error message as error message
      if (err.errors) err = err.errors[0].message
      if (err instanceof Error) {
          req.flash('error_msg', `${err.name}: ${err.message}`)
      } else {
          req.flash('error_msg', `Error : ${err}`)
      }
      res.redirect('back')
      next(err)
    },
    apiErrorHandler (err, req, res, next) {
        if (err instanceof Error) {
            res.status(err.status || 500).json({
                status: 'error',
                message: `${err.name} : ${err.message}`
            })
        } else {
            res.status(500).json({
                status: 'error',
                message: `${err}`
            })
        }
        next(err)
    },
}