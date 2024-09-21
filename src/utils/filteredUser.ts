const filteredUser = (user: any) => {
    return { id: user.id, fullName: user.fullName, username: user.username, profilePic: user.profilePic }
}

export default filteredUser;