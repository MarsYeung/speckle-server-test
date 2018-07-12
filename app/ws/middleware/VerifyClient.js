'use strict'
const winston     = require('winston')
const chalk       = require('chalk')
const url         = require('url')
const User        = require('../../../models/User')

module.exports = function( info, cb ) {
  let location = url.parse(info.req.url, true);
  let token = location.query.access_token

  winston.info( chalk.red.underline( 'WS: Access token: ' + token ) ) 
  if( !token )
    return cb( false, 401, 'Unauthorized' )
  
  User.findOne( { apitoken: token } )
  .then( user => {
    if( !user ) throw new Error('WS Auth: User not found. ' + token)
    return cb( true, 400, 'Authorized')
  })
  .catch( err => {
    winston.error( err )
    return cb( false, 401, 'Unauthorized' )
  })
}