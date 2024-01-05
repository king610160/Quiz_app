const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

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
const imgurFileHandler = async(file) => { // file 是 multer 處理完的檔案
    if (!file) return null

    // eslint-disable-next-line no-useless-catch
    try {
        const image = await imgur.uploadFile(file.path)
        return image.link || null
    } catch(err) {
        throw(err)
    }
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}