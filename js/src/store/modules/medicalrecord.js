const state = {
  authority: null
}
const mutations = {
  setAuthority (state, value) {
    state.authority = value
  }
}

const actions = {
  getAuthority (context) {
    context.commit('setAuthority', 111)
  }
}

export default {
  state,
  mutations,
  actions
}
