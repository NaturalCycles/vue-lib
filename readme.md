## @naturalcycles/vue-lib

> Useful functions for Vue.js 2.x

[![npm](https://img.shields.io/npm/v/@naturalcycles/vue-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/vue-lib)
[![min.gz size](https://badgen.net/bundlephobia/minzip/@naturalcycles/vue-lib)](https://bundlephobia.com/result?p=@naturalcycles/vue-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

## createLocalStoragePlugin

LocalStorage persistence plugin for [Vuex](https://github.com/vuejs/vuex) 3.x (compatible with Vue
2.x).

```ts
interface GlobalState {
  count: number
}

const emptyState: GlobalState = {
  count: 0,
}

export const localStoragePlugin = createLocalStoragePlugin<GlobalState>({
  emptyState,
})

export const store = new Vuex.Store<GlobalState>({
  mutations: {},
  plugins: [localStoragePlugin],
})
```
