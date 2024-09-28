const filteredUser = (user: any) => {
    return { id: user.id, fullName: user.fullName, email: user.email, profilePic: user.profilePic }
}

export default filteredUser;