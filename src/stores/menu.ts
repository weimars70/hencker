import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuItem, MenuState } from '../types/menu'

export const useMenuStore = defineStore('menu', () => {
  const templateMenu = ref<MenuItem[]>([])
  const permissionsMenu = ref<MenuItem[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchMenus = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      const [templateResponse, permissionsResponse] = await Promise.all([
        fetch('http://108.181.193.178:3000/erp/plantilla'),
        fetch('http://108.181.193.178:3000/erp/plantilla/1')
      ])

      if (!templateResponse.ok || !permissionsResponse.ok) {
        throw new Error('Failed to fetch menu data')
      }

      const templateData: MenuItem[] = await templateResponse.json()
      const permissionsData: MenuItem[] = await permissionsResponse.json()

      templateMenu.value = templateData
      permissionsMenu.value = permissionsData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      error.value = errorMessage
      console.error('Error fetching menus:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    templateMenu,
    permissionsMenu,
    loading,
    error,
    fetchMenus
  }
})