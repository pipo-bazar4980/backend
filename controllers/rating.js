
exports.create = (req, res) => {

    const { userId, rating, productId} = req.body;

    let ratings = new Rating({
        userId, rating, productId
    })

    ratings.save()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

// retrieve and return all product Item
exports.findOneRating = (req, res) => {
    const {userId, productId} = req.query
    if (productId && userId) {
        Rating.find({productId, userId})
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found food with id " + productId })
                } else {
                    res.send(data)
                    console.log(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + productId })
            })
    }
}
// retrieve and return a single product item
exports.findAllRating = (req, res) => {
    const {productId} = req.query
    console.log(productId)
    Rating.find({productId})
        .then(async menu => {

            let ratings = 0
            for (let i = 0; i < menu.length; i++) {
                ratings += menu[i].rating*1.0
            }
            ratings=((ratings)/menu.length)
            res.send({ratings: ratings, productId : productId})
        }).catch(err => {
        res.status(500).send({ message: err.message || "Error Occurred while retrieving user information" })
    })
}

exports.updateRating = (req, res)=> {
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    // console.log(id)
    Rating.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}