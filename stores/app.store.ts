export const useAppStore = defineStore("app", {
  state: () => ({
    _isBusy: false,
  }),
  getters: {
    busy(state) {
      return state._isBusy;
    },
  },
  actions: {
    setBusy(v: boolean) {
      this._isBusy = v;
    },
  },
});
