import { Property } from './data'

interface PropertyWithVisibility extends Property {
  visible: boolean
}

let propertiesStore: PropertyWithVisibility[] = []
let isInitialized = false

export function initializeStore(initialProperties: Property[]) {
  if (!isInitialized) {
    propertiesStore = initialProperties.map(prop => ({
      ...prop,
      visible: true
    }))
    isInitialized = true
  }
}

export function getProperties(): PropertyWithVisibility[] {
  return JSON.parse(JSON.stringify(propertiesStore))
}

export function getPropertyById(id: string): PropertyWithVisibility | undefined {
  return JSON.parse(JSON.stringify(propertiesStore.find(p => p.id === id)))
}

export function updateProperty(id: string, updates: Partial<PropertyWithVisibility>) {
  const index = propertiesStore.findIndex(p => p.id === id)
  if (index !== -1) {
    propertiesStore[index] = { ...propertiesStore[index], ...updates }
    return JSON.parse(JSON.stringify(propertiesStore[index]))
  }
  return null
}

export function deleteProperty(id: string) {
  const index = propertiesStore.findIndex(p => p.id === id)
  if (index !== -1) {
    propertiesStore.splice(index, 1)
    return true
  }
  return false
}

export function addProperty(property: Omit<PropertyWithVisibility, 'id'>) {
  const newId = Math.max(...propertiesStore.map(p => parseInt(p.id)), 0) + 1
  const newProperty: PropertyWithVisibility = {
    ...property,
    id: newId.toString()
  }
  propertiesStore.push(newProperty)
  return JSON.parse(JSON.stringify(newProperty))
}

export function togglePropertyVisibility(id: string) {
  const property = propertiesStore.find(p => p.id === id)
  if (property) {
    property.visible = !property.visible
    return JSON.parse(JSON.stringify(property))
  }
  return null
}
