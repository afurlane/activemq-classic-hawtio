import { hawtio, HawtioPlugin,helpRegistry, preferencesRegistry } from '@hawtio/react'
import { log, PLUGIN_NAME, PLUGIN_TITLE, PLUGIN_PATH } from './globals'
import { ActiveMQClassicPreferences } from './ActiveMQClassicPreferences'
import help from './help.md'

export const plugin: HawtioPlugin = async () => {
  log.info('Loading ActiveMQ Classic plugin...')

  hawtio.addDeferredPlugin('ActiveMQ 6', async () => {

    helpRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, help, 100)
    preferencesRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, ActiveMQClassicPreferences, 100)

    return import('./ActiveMQClassicPlugin').then(module => {
       return {
        id: PLUGIN_NAME,
        title: PLUGIN_TITLE,
        path: PLUGIN_PATH,    
        component: module.ActiveMQClassicPlugin,
        isActive: async () => true,
       }
    })
  })

}

