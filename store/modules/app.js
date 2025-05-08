const appStore = {
  namespaced: true,

  state: {
    // TODO h5测试数据
    // deviceUuid: '123456789',
    deviceUuid: '',
    noticeList: []
  },

  mutations: {
    _setDeviceUuid(state, payload) {
      state.deviceUuid = payload
    },

    _setNoticeList(state, payload) {
      state.noticeList = payload
    }
  },

  actions: {},
};

export default appStore;
