import { findIndex, without } from 'lodash'

const namespaced = true

const state = {
	files: [],
	selected: []
}

const mutations = {
	LOAD_FILES(state, files) {
		state.files = files
	},
	ADD_FILE_SELECTION(state, file) {
		state.selected.push(file);
	},
	REMOVE_FILE_SELECTION(state, file) {
		if (state.selected.length > 1) {
			state.selected = without(state.selected, file);
			return;
		}
		state.selected = [];
	},
	RESET_SELECTION(state) {
		state.selected = [];
	},
    FAVORITE_FILE( state, item ) {
        let fileIndex = findIndex(state.files, (f) => {
            return f.name === item.name
        })
        state.files[fileIndex].starred = !item.starred
    },
    REMOVE_FILE( state, file ) {
        state.files = without(state.files, file);
    }
}

const actions = {
	loadFiles(context, files) {
		context.commit('LOAD_FILES', files);
	},
	addFileSelection(context, file) {
		context.commit('ADD_FILE_SELECTION', file);
	},
	removeFileSelection(context, file) {
		context.commit('REMOVE_FILE_SELECTION', file);
	},
	resetFileSelection(context) {
		context.commit('RESET_SELECTION');
	},
	markFavorite(context, payload) {
		let file = payload.file
		let client = payload.client
		let newValue = !file.starred
		client.files.favorite(file.path, newValue)
		  .then(() => {
			context.commit('FAVORITE_FILE', file);
		  })
		  .catch(error => {
			console.log(error)
		  })
	},
	deleteFiles(context, payload) {
        let files = payload.files
        let client = payload.client
        for (let file of files) {
            client.files.delete(file.path).then(() => {
                context.commit('REMOVE_FILE', file);
                context.commit('REMOVE_FILE_SELECTION', file);
            }).catch(error => {
                console.log('error: ' + file.path + ' not deleted: ' + error)
            })
        }
    }
}

const getters = {
    selectedFiles: state => {
        if (state.selected.length === 0) {
            return [];
        } else {
            return state.selected;
        }
    },
    files: state => {
        return state.files;
    }
}

export default {
  namespaced,
  state,
  actions,
  mutations,
  getters
}
