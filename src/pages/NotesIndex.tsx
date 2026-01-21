import { NotesSidebar } from '@/components/NotesSidebar'


export function NotesIndex() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-full md:w-96 h-full">
        <NotesSidebar />
      </div>

      {/* Main Content Area */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-gray-500 text-sm tracking-tight">
            Select a note to view or create a new one
          </p>
        </div>
      </div>
    </div>
  )
}
