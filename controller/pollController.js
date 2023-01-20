const Poll = require('../Poll')

exports.createPollGetController = (req, res, next) => {
    res.render('../views/create.ejs')
}

exports.createPollPostController = async (req, res, next) => {
    let { title, description, options } = req.body

    options = options.map(opt => {
        return {
            name: opt,
            vote: 0
        }
    })

    let poll = new Poll({
        title,
        description,
        options
    })

    try {
        await poll.save()
        res.redirect('/polls')
    } catch (e) {
        console.log(e)
    }
}

exports.getAllPollsController = async (req, res, next) => {

    try {
        let polls = await Poll.find();
        res.render('../views/polls.ejs', { polls })
    } catch (error) {
        console.log(error);
    }

}


exports.getPoolResultController = async (req, res, next) => {
    const id = req.params.id;
    try {
        let poll = await Poll.findById(id);
        let options = [...poll.options]

        let result = []
        options.forEach(option => {
            let percentage = (option.vote * 100 / poll.totalVote)

            result.push({
                ...option._doc,
                percentage: percentage ? percentage : 0
            })
        })
        res.render("../views/viewPoll.ejs", { poll, result })
    } catch (error) {
        console.log(error);
    }
}

exports.postPoolResultController = async (req, res, next) => {
    const id = req.params.id
    const optionId = req.body.option;
    try {
        const poll = await Poll.findById(id)
        let options = [...poll.options];
        let index = options.findIndex(o => o.id === optionId)
        options[index].vote = options[index].vote + 1;
        let totalVote = poll.totalVote + 1;

        await Poll.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { options, totalVote } }
        )

        res.redirect('/polls/' + id)
    } catch (error) {
        console.log(error);
    }
}