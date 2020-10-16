module.exports.signOut = (req, res) => {
  res.cookie('authorization', 'token', {
    maxAge: 0,
    httpOnly: true,
    sameSite: true,
  }).end();
};
