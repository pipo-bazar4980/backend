const activeAdmin = []
module.exports.adminQueueAdd = async (req, res) => {

    const activeAdminClick = req.params

    if (activeAdminClick) {
        activeAdmin.push(activeAdminClick)
    }
}

module.exports.adminQueue = async (req, res) => {
    if (activeAdmin) {
        return activeAdmin
    }
}