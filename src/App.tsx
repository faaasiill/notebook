import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useNotesStore } from '@/store/notesStore'
import { NotesIndex } from '@/pages/NotesIndex'
import { NoteEditor } from '@/pages/NoteEditor'

function App() {
  const loadNotes = useNotesStore((state) => state.loadNotes)

  // Load notes from localStorage on mount
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesIndex />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  )
}

export default App
