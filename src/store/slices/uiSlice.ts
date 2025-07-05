import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  // Sidebar and layout
  sidebarOpen: boolean
  sidebarWidth: number
  
  // Search and filters
  searchTerm: string
  activeFilters: {
    category?: string
    tags: string[]
    aiModel?: string
    author?: string
    isPublic?: boolean
    isFavorite?: boolean
    importance?: number[]
    dateRange?: {
      start: string
      end: string
    }
  }
  
  // Modal and popup states
  modals: {
    createPrompt: boolean
    editPrompt: boolean
    sharePrompt: boolean
    deleteConfirm: boolean
    abTestSetup: boolean
  }
  
  // Editor states
  editor: {
    activePromptId: string | null
    isDirty: boolean
    showPreview: boolean
    showSuggestions: boolean
    fontSize: number
    wordWrap: boolean
  }
  
  // Loading states
  loading: {
    prompts: boolean
    suggestions: boolean
    collaboration: boolean
  }
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarWidth: 280,
  
  searchTerm: '',
  activeFilters: {
    tags: [],
  },
  
  modals: {
    createPrompt: false,
    editPrompt: false,
    sharePrompt: false,
    deleteConfirm: false,
    abTestSetup: false,
  },
  
  editor: {
    activePromptId: null,
    isDirty: false,
    showPreview: false,
    showSuggestions: true,
    fontSize: 14,
    wordWrap: true,
  },
  
  loading: {
    prompts: false,
    suggestions: false,
    collaboration: false,
  },
  
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload
    },
    
    // Search and filter actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setActiveFilters: (state, action: PayloadAction<Partial<UIState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload }
    },
    clearFilters: (state) => {
      state.activeFilters = { tags: [] }
      state.searchTerm = ''
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState['modals']] = false
      })
    },
    
    // Editor actions
    setActivePrompt: (state, action: PayloadAction<string | null>) => {
      state.editor.activePromptId = action.payload
      state.editor.isDirty = false
    },
    setEditorDirty: (state, action: PayloadAction<boolean>) => {
      state.editor.isDirty = action.payload
    },
    togglePreview: (state) => {
      state.editor.showPreview = !state.editor.showPreview
    },
    toggleSuggestions: (state) => {
      state.editor.showSuggestions = !state.editor.showSuggestions
    },
    setEditorSettings: (state, action: PayloadAction<Partial<UIState['editor']>>) => {
      state.editor = { ...state.editor, ...action.payload }
    },
    
    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>>) => {
      const notification = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false,
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarWidth,
  setSearchTerm,
  setActiveFilters,
  clearFilters,
  openModal,
  closeModal,
  closeAllModals,
  setActivePrompt,
  setEditorDirty,
  togglePreview,
  toggleSuggestions,
  setEditorSettings,
  setLoading,
  addNotification,
  markNotificationRead,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions

export default uiSlice.reducer
