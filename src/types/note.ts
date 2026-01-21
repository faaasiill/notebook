export interface Note {
  id: string
  title: string
  content: string
  color: string
  important: boolean
  fontZoom: number
  createdAt: number
  updatedAt: number
}

export type SortOption = 'newest' | 'oldest' | 'a-z'
export type FilterOption = 'all' | 'important'
