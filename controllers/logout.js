exports.logout_User =  async (req, res) => {
    res.clearCookie('jwt')
    try{
        const token = req.user.resetJwtToken()
        
        res.status(200).json({success:true, message:"you have been logged out"})
    }
    catch (error){
        res.status(400).json({success:false, message:error})
    }
};


