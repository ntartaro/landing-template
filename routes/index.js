// Full Documentation - https://docs.turbo360.co/
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers')

const CDN = (process.env.TURBO_ENV=='dev') ? null : process.env.CDN

const global = {}

router.get('/', (req, res) => {
	const data = {
		global: global,
		cdn: CDN
	}

	turbo.pageConfig('home', process.env.TURBO_API_KEY, process.env.TURBO_ENV)
	.then(homeConfig => {
		data['page'] = homeConfig
		res.render('index', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

router.get('/landing', (req, res) => {
	const data = {
		global: global,
		cdn: CDN
	}

	turbo.pageConfig('home', process.env.TURBO_API_KEY, process.env.TURBO_ENV)
	.then(homeConfig => {
		data['page'] = homeConfig
		res.render('landing', data)
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})
})

module.exports = router
