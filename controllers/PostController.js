const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const path = require('path')
const Post = require('../models/Post')

const COLLECTION_NAME = Post.collectionName()
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
			Post.find(params)
			.then(posts => {
				resolve(Post.convertToJson(posts))
			})
			.catch(err => {
				reject(err)
			})
		})
	},

	getById: (id) => {
		return new Promise((resolve, reject) => {
			Post.findById(id)
			.then(post => {
				if (post == null){
					throw new Error(Post.resourceName + ' ' + id + ' not found.')
					return
				}

				resolve(post.summary())
			})
			.catch(err => {
				reject(new Error(Post.resourceName + ' ' + id + ' not found.'))
			})
		})
	},

	post: (body) => {
		return new Promise((resolve, reject) => {
			let payload = null
			Post.create(body)
			.then(post => {
				payload = post.summary()
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
			Post.findByIdAndUpdate(id, params, {new:true})
			.then(post => {
				payload = post.summary()
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
			Post.findByIdAndRemove(id)
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
