import { useRef, useState } from 'react'
import { useNotesStore } from '@/store/notesStore'
import { NoteCard } from '@/components/NoteCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Filter, ArrowUpDown, Plus, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { SortOption, FilterOption } from '@/types/note'

interface NotesSidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void
}

export function NotesSidebar({ onCollapseChange }: NotesSidebarProps) {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    onCollapseChange?.(newCollapsedState)
  }
  
  const {
    searchQuery,
    filterOption,
    sortOption,
    setSearchQuery,
    setFilterOption,
    setSortOption,
    getFilteredAndSortedNotes,
  } = useNotesStore()

  const notes = getFilteredAndSortedNotes()

  // Keyboard shortcut: / to focus search
  useKeyboardShortcut('/', () => {
    searchInputRef.current?.focus()
  }, { preventDefault: true })

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First'
      case 'oldest': return 'Oldest First'
      case 'a-z': return 'A-Z'
    }
  }

  const getFilterLabel = (option: FilterOption) => {
    switch (option) {
      case 'all': return 'All Notes'
      case 'important': return 'Important Only'
    }
  }

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-full md:w-96'}`}>
      {/* Collapse Toggle */}
      <div className="p-2 border-b border-gray-200 bg-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapseToggle}
          className="w-full justify-start"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4 mr-2" />}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </Button>
      </div>

      {/* Header */}
      {!isCollapsed && (
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold tracking-tight">Notes</h1>
          <Button
            size="sm"
            onClick={() => navigate('/notes/new')}
            aria-label="Create new note"
          >
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes... (Press /)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search notes"
          />
        </div>

        {/* Filter and Sort */}
        <div className="flex gap-2 mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Filter className="w-4 h-4 mr-1" />
                {getFilterLabel(filterOption)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterOption('all')}>
                All Notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterOption('important')}>
                Important Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <ArrowUpDown className="w-4 h-4 mr-1" />
                {getSortLabel(sortOption)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('a-z')}>
                A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      )}

      {/* Notes List */}
      {!isCollapsed && (
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-muted-foreground mb-4 text-sm tracking-tight">
              {searchQuery || filterOption === 'important'
                ? 'No notes found'
                : ''}
            </p>
            {!searchQuery && filterOption === 'all' && (
              <Button onClick={() => navigate('/notes/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        )}
      </div>
      )}
    </div>
  )
}
