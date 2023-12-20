const quizController = {
    home: (req, res) => {
        res.json({
            status:'success',
            data: {
                test: 'test'
            }
        })
    }
}

module.exports = quizController