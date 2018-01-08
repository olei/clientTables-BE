'use strict'

export default {
	port: 80,
	url: 'mongodb://root:w8bjk72p@localhost:27017/admin',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
      secure: false,
			maxAge: 30 * 60 * 1000,
			// domain: "localhost"
		}
	}
}