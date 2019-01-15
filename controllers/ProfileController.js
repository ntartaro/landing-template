const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Profile = require('../models/Profile')

const COLLECTION_NAME = Profile.collectionName()
const LOCAL_DIR = path.join(__dirname, process.env.TMP_DIR).replace('controllers/', '')

const syncCollection = () => {
	const filePath = (process.env.TURBO_ENV=='dev') ? LOCAL_DIR + '/'+COLLECTION_NAME+'.db' : process.env.TMP_DIR+'/'+COLLECTION_NAME+'.db'
	return turbo.syncCollection(COLLECTION_NAME, filePath, process.env.TURBO_API_KEY)
}

module.exports = {
	collectionName: () => {
		return COLLECTION_NAME
	},

	get: (params) => {
		return new Promise((resolve, reject) => {
			Profile.find(params)
			.then(profiles => {
				resolve(Profile.convertToJson(profiles))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			Profile.findById(id)
			.then(profile => {
				if (profile == null){
					throw new Error(Profile.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(profile.summary())
			})
			.catch(err => {
				reject(new Error(Profile.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			Profile.create(body)
			.then(profile => {
				payload = profile.summary()
				return syncCollection()
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	put: (id, params) => {
		return new Promise((resolve, reject) => {
			let payload = null
			Profile.findByIdAndUpdate(id, params, {new:true})
			.then(profile => {
				payload = profile.summary()
				return syncCollection()
			})
			.then(data => {
				resolve(payload)
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	delete: (id) => {
		return new Promise((resolve, reject) => {
			Profile.findByIdAndRemove(id)
			.then(() => {
				return syncCollection()
			})
			.then(data => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
		})
	}

}
