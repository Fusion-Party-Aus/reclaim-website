// @ts-expect-error virtual module
import icons from 'virtual:astro-icon'
import { getIconData } from '@iconify/utils'

/**
 * Validates if a given icon name exists in the configured Astro Iconify collections or local icons.
 * This prevents runtime crashes when a dynamic icon is not found.
 */
export function checkIconExists(name: string): boolean {
  if (!name || typeof name !== 'string') return false
  let [setName, iconName] = name.split(':')

  if (!iconName) {
    // Local icon reference
    iconName = setName
    setName = 'local'

    const localCollection = icons[setName]
    if (localCollection && localCollection.icons && iconName in localCollection.icons) {
      return true
    }
  } else {
    // Collection icon
    const collection = icons[setName]
    if (collection) {
      const iconData = getIconData(collection, iconName)
      if (iconData) {
        return true
      }
    }
  }
  return false
}
