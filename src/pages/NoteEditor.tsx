import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotesStore } from '@/store/notesStore'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useDebounce } from '@/hooks/useDebounce'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { getZoomStorageKey } from '@/lib/deviceId'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Toolbox } from '@/components/Toolbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NotesSidebar } from '@/components/NotesSidebar'
import {
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

export function NoteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notes, addNote, updateNote, deleteNote } = useNotesStore()

  const isNewNote = id === 'new'
  const existingNote = notes.find((n) => n.id === id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#e5e7eb')
  const [important, setImportant] = useState(false)
  const [fontZoom, setFontZoom] = useLocalStorage(getZoomStorageKey(), 100)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Load existing note
  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title)
      setContent(existingNote.content)
      setColor(existingNote.color)
      setImportant(existingNote.important)
      setFontZoom(existingNote.fontZoom)
    }
  }, [id])

  // Auto-save function
  const autoSave = useDebounce(() => {
    if (!title.trim()) {
      return
    }

    setIsSaving(true)
    
    setTimeout(() => {
      if (isNewNote) {
        const newNote = addNote({
          title,
          content,
          color,
          important,
          fontZoom,
        })
        navigate(`/notes/${newNote.id}`, { replace: true })
        toast.success('Note created')
      } else if (existingNote) {
        updateNote(existingNote.id, {
          title,
          content,
          color,
          important,
          fontZoom,
        })
      }
      
      setIsSaving(false)
      setLastSaved(Date.now())
    }, 300)
  }, 500)

  // Trigger auto-save on content change
  useEffect(() => {
    if (title || content) {
      autoSave()
    }
  }, [title, content, color, important, fontZoom])

  // Manual save
  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsSaving(true)
    
    setTimeout(() => {
      if (isNewNote) {
        const newNote = addNote({
          title,
          content,
          color,
          important,
          fontZoom,
        })
        navigate(`/notes/${newNote.id}`, { replace: true })
        toast.success('Note created')
      } else if (existingNote) {
        updateNote(existingNote.id, {
          title,
          content,
          color,
          important,
          fontZoom,
        })
        toast.success('Note saved')
      }
      
      setIsSaving(false)
      setLastSaved(Date.now())
    }, 300)
  }

  // Delete note
  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id)
      toast.success('Note deleted')
      navigate('/notes')
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcut('s', handleSave, { ctrl: true, meta: true })
  useKeyboardShortcut('n', () => navigate('/notes/new'), { ctrl: true, meta: true })

  // Zoom controls
  const handleZoomIn = () => setFontZoom(Math.min(fontZoom + 10, 200))
  const handleZoomOut = () => setFontZoom(Math.max(fontZoom - 10, 50))
  const handleResetZoom = () => setFontZoom(100)

  // Clear formatting
  const handleClearFormatting = () => {
    setColor('#e5e7eb')
    setImportant(false)
    setFontZoom(100)
    toast.success('Formatting cleared')
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar - hidden on mobile when viewing note */}
      <div className={`hidden lg:block h-full transition-all duration-300 ${isSidebarCollapsed ? 'w-12' : 'w-96'}`}>
        <NotesSidebar onCollapseChange={setIsSidebarCollapsed} />
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notes')}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold text-sm tracking-tight">
              {isNewNote ? 'New Note' : 'Edit Note'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Status */}
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {isSaving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Saved</span>
                </>
              ) : null}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={fontZoom <= 50}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs px-2 text-muted-foreground">
                {fontZoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={fontZoom >= 200}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Save Button */}
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>

            {/* Delete Button */}
            {!isNewNote && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-gray-50">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto bg-white p-4 rounded-lg border border-gray-200">
            <Input
              type="text"
              placeholder="Note title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
              aria-label="Note title"
            />

            <Textarea
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[400px] resize-none"
              style={{ fontSize: `${fontZoom}%` }}
              aria-label="Note content"
            />
          </div>

          {/* Toolbox */}
          <div className="w-64 shrink-0">
            <Toolbox
              color={color}
              important={important}
              onColorChange={setColor}
              onImportantToggle={() => setImportant(!important)}
              onResetZoom={handleResetZoom}
              onClearFormatting={handleClearFormatting}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete()
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
