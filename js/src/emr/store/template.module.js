import store from '@/store'
import storage from '@/util/storage'
export const eventType = {
  SET_TEMPLATE_CHANGE: 'setTemplateChange',
  SET_EDITOR_PARAMS: 'setEditorObj'
}
export let registTemplateModule = () => {
  return store.registerModule('templateModule', {
    namespaced: true,
    state: {
      templateChange: false,
      editorObj: null
    },
    mutations: {
      [eventType.SET_TEMPLATE_CHANGE] (state, payload) {
        state.templateChange = payload
      },
      [eventType.SET_EDITOR_PARAMS] (state, payload) {
        state.editorObj = payload
        storage.setLocalStorage('editorObj', JSON.stringify(payload))
      }

    },
    actions: {
      [eventType.SET_TEMPLATE_CHANGE] ({commit}, payload) {
        commit(eventType.SET_TEMPLATE_CHANGE, payload)
      },
      [eventType.SET_EDITOR_PARAMS] ({commit}, payload) {
        commit(eventType.SET_EDITOR_PARAMS, payload)
      }
    }
    // ...
  })
}

// 缺一个销毁mudule
export let unRegistTemplateModule = () => {
  return store.unRegisterModule('templateModule')
}

