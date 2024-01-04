const fs = require('fs') // 引入 fs 模組
const localFileHandler = async(file) => { // file 是 multer 處理完的檔案
    if (!file) return null
    const fileName = `upload/${file.originalname}`
    // eslint-disable-next-line no-useless-catch
    try {
        const data = await fs.promises.readFile(file.path)
        await fs.promises.writeFile(fileName, data)
        return `/${fileName}`
    } catch(err) {
        throw(err)
    }
}
module.exports = {
  localFileHandler
}