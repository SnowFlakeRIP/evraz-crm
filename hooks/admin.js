module.exports = function checker(request, reply, next) {
    if (request.url.indexOf("admin") > 0) {
        const { role } = request.user

        if (role !== "3") {
            return reply.status(403).send({ message: "Access denied" })
        }
        else {
            return next()
        }
    }
    else {
        next()
    }
}