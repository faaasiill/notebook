import { create } from 'zustand'
import { Note, SortOption, FilterOption } from '../types/note'
import { getNotesStorageKey } from '../lib/deviceId'

interface NotesState {
  notes: Note[]
  searchQuery: string
  filterOption: FilterOption
  sortOption: SortOption
  
  // Actions
  loadNotes: () => void
  saveNotes: (notes: Note[]) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSearchQuery: (query: string) => void
  setFilterOption: (option: FilterOption) => void
  setSortOption: (option: SortOption) => void
  getFilteredAndSortedNotes: () => Note[]
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  searchQuery: '',
  filterOption: 'all',
  sortOption: 'newest',

  loadNotes: () => {
    try {
      const storageKey = getNotesStorageKey()
      const storedNotes = localStorage.getItem(storageKey)
      if (storedNotes) {
        set({ notes: JSON.parse(storedNotes) })
      }
    } catch (error) {
      console.error('Error loading notes:', error)
    }
  },

  saveNotes: (notes: Note[]) => {
    try {
      const storageKey = getNotesStorageKey()
      localStorage.setItem(storageKey, JSON.stringify(notes))
      set({ notes })
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  },

  addNote: (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const updatedNotes = [...get().notes, newNote]
    get().saveNotes(updatedNotes)
    return newNote
  },

  updateNote: (id, updates) => {
    const updatedNotes = get().notes.map((note) =>
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    )
    get().saveNotes(updatedNotes)
  },

  deleteNote: (id) => {
    const updatedNotes = get().notes.filter((note) => note.id !== id)
    get().saveNotes(updatedNotes)
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterOption: (option) => set({ filterOption: option }),
  setSortOption: (option) => set({ sortOption: option }),

  getFilteredAndSortedNotes: () => {
    const { notes, searchQuery, filterOption, sortOption } = get()
    
    let filtered = [...notes]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      )
    }

    // Filter by important
    if (filterOption === 'important') {
      filtered = filtered.filter((note) => note.important)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortOption === 'newest') {
        return b.createdAt - a.createdAt
      } else if (sortOption === 'oldest') {
        return a.createdAt - b.createdAt
      } else if (sortOption === 'a-z') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    // Pin important notes at the top (unless sorting A-Z)
    if (sortOption !== 'a-z') {
      const important = filtered.filter((note) => note.important)
      const regular = filtered.filter((note) => !note.important)
      return [...important, ...regular]
    }

    return filtered
  },
}))
