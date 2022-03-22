const jwt = require('jsonwebtoken');
const key = process.env.KEY


function auth(req, res, next) {
    const token = req.header("x-auth-token");
  
    //check for token:
    if(!token) 
        return res.status(401).json({msg : 'No token, authorization denied'});
  
  
    try{
  //verify token:
    const decoded = jwt.verify(token, key);
    //add user from payload:
    req.user = decoded ;
    next()
    } catch (e) {
      //in case of error, send a bad request (400) response:
      res.status(400).json({msg : 'Bad request, token is not valid'})
  
    }
    
  };

  module.exports = auth; 

  