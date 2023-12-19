module.exports = {
    generalErrorHandler (err, req, res, next) {
      err = err.errors[0].message || err

      if (err instanceof Error) {
        req.flash('error_msg', `${err.name}: ${err.message}`)
      } else {
        req.flash('error_msg', `Error : ${err}`)
      }
      res.redirect('back')
      next(err)
    }
}