import { _debounce, _pick } from '@naturalcycles/js-lib'
import type { Plugin, Store } from 'vuex'

export interface CreateLocalStoragePlugin<STATE> extends Plugin<STATE> {
  /**
   * Force immediate persistence (skipping Debounce, etc).
   */
  persistNow(): void
}

export interface CreateLocalStoragePluginCfg<STATE> {
  emptyState: STATE

  /**
   * @default state
   */
  storageKey?: string

  /**
   * Set to persist only those keys, not the whole State.
   * @default undefined, persists the whole State
   */
  persistKeys?: (keyof STATE)[]

  /**
   * @default 1000
   */
  debounceTime?: number

  /**
   * @default false
   * Set to true to enable debug logging
   */
  debug?: boolean
}

type Logger = (...args: any[]) => void
const NO_OP_LOGGER: Logger = () => {}
const CONSOLE_LOGGER: Logger = (...args: any[]) => {
  console.log(...args)
}

export function createLocalStoragePlugin<STATE extends object>(
  cfg: CreateLocalStoragePluginCfg<STATE>,
): CreateLocalStoragePlugin<STATE> {
  const { emptyState, storageKey = 'state', debounceTime = 1000, persistKeys, debug = false } = cfg

  const log = debug ? CONSOLE_LOGGER : NO_OP_LOGGER

  const persist = (state: STATE) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(persistKeys ? _pick(state, persistKeys) : state),
    )
    log('<< LS', { ...state })
  }

  let _store: Store<STATE>

  const plugin = (store => {
    _store = store
    const stateStr = localStorage.getItem(storageKey)
    log('>> LS initialLoad', stateStr)

    if (stateStr) {
      store.replaceState({
        ...emptyState, // so new default properties can be added over time
        ...JSON.parse(stateStr),
      })
    } else {
      store.replaceState(emptyState)
    }

    store.subscribe(_debounce((_: any, state: STATE) => persist(state), debounceTime))
  }) as CreateLocalStoragePlugin<STATE>

  plugin.persistNow = () => {
    persist(_store.state)
  }

  return plugin
}
