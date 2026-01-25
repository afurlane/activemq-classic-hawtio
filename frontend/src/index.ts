import { hawtio, HawtioPlugin,helpRegistry, preferencesRegistry } from '@hawtio/react'
import { log, PLUGIN_NAME, PLUGIN_TITLE, PLUGIN_PATH } from './globals'
import { ActiveMQClassicPreferences } from './ActiveMQClassicPreferences'
import { ActiveMQClassicPlugin } from './ActiveMQClassicPlugin'
import help from './help.md'
import React from 'react'

export const plugin: HawtioPlugin = () => {
  log.info('Loading ActiveMQ Classic plugin...')

  hawtio.addPlugin({
    id: PLUGIN_NAME,
    title: PLUGIN_TITLE,
    path: PLUGIN_PATH,    
    component: ActiveMQClassicPlugin,
    isActive: async () => true,
  })

  helpRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, help, 100)
  preferencesRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, ActiveMQClassicPreferences, 100)
}
