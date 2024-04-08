module.exports = function(object) {
    const User = object.User.rows[0]
    const Bio = object.UserBio.rows[0]

    return {
        userId: User.userId,
        userEmail: User.userEmail,
        userPhone: User.userPhone,
        userTelegramChatId: User.userTelegramChatId,
        userActive: User.userActive,
        userRole: User.userRole,
        bioName: Bio.bioName,
        bioMiddleName: Bio.bioMiddleName,
        bioLastName: Bio.bioLastName,
        bioInviteCode: Bio.bioInviteCode
    }
}