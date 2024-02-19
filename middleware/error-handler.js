const { UnauthenticatedError, NotFoundError, BadRequestError, NoPermissionError } = require('./errors')

module.exports = {
    generalErrorHandler (err, req, res, next) {
      // if error is from sql, then set sql's error message as error message
      if (err.errors && err.errors.length > 0) err = err.errors[0].message

      if (err instanceof UnauthenticatedError || 
          err instanceof NotFoundError || 
          err instanceof BadRequestError || 
          err instanceof NoPermissionError) {
            req.flash('error_msg', `${err.name}: ${err.message}`)
            console.log(`${err}`)
      } else {
            req.flash('error_msg', `${err}`)
            console.log(`${err}`)
      }
      res.redirect('back')
      next(err)
    },
    apiErrorHandler (err, req, res, next) {
        if (err instanceof UnauthenticatedError || 
            err instanceof NotFoundError || 
            err instanceof BadRequestError || 
            err instanceof NoPermissionError) {
            res.status(err.statusCode).json({
                status: 'error',
                message: `${err.name} : ${err.message}`
            })
        } else if (err instanceof Error) {
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