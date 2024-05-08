module.exports = function(object) {
    const User = object.User
    const Bio = object.UserBio

    return {
        userId: User.userId,
        userEmail: User.userEmail,
        userPhone: User.userPhone,
        userTelegramChatId: User.userTelegramChatId,
        userActive: User.userActive,
        userRole: User.userRole,
        userTelegram: User.userTelegramChatId,
        bioName: Bio.bioName,
        bioAge: Bio.bioAge,
        bioMiddleName: Bio.bioMiddleName,
        bioLastName: Bio.bioLastName,
        bioInviteCode: Bio.bioInviteCode
    }
}