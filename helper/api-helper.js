module.exports = {
    // you can send api to here to make api package
    toPackage: (status, setting) => {
        return {
            status: `${status}`,
            setting: setting && { [setting]: true }
        }
    },
}