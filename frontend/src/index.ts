import { hawtio, helpRegistry, preferencesRegistry } from '@hawtio/react'
import { PLUGIN_NAME, PLUGIN_TITLE, PLUGIN_PATH } from './globals'
import { ActiveMQClassicPreferences } from './ActiveMQClassicPreferences'
import { ActiveMQClassicPlugin } from './ActiveMQClassicPlugin'

export default function register() {
  hawtio.addPlugin({
    id: PLUGIN_NAME,
    title: PLUGIN_TITLE,
    path: PLUGIN_PATH,
    component: ActiveMQClassicPlugin,
    isActive: async () => true,
  })

  helpRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, '', 100)
  preferencesRegistry.add(PLUGIN_NAME, PLUGIN_TITLE, ActiveMQClassicPreferences, 100)
}
