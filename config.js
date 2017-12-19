'use strict'

export default {
	port: 8088,
	url: 'mongodb://root:123456@localhost:27017/admin',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
      secure: false,
      maxAge: 30 * 60 * 1000
		}
	}
}