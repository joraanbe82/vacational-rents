import { initializeStore } from './property-store'
import { RENTAL_PROPERTIES } from './data'

// Inicializar el store cuando se carga el módulo
if (typeof window === 'undefined') {
  initializeStore(RENTAL_PROPERTIES)
}
