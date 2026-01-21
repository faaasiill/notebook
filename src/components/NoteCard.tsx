import { Note } from '@/types/note'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, truncateText } from '@/lib/utils'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-500 bg-white border border-gray-200"
      onClick={() => navigate(`/notes/${note.id}`)}
      style={{ borderLeftColor: note.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm tracking-tight line-clamp-1">
          {note.title || 'Untitled'}
        </h3>
        {note.important && (
          <Badge variant="secondary" className="shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
        {truncateText(note.content || 'No content', 100)}
      </p>
      
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>Created: {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && (
          <span>• Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>
    </Card>
  )
}
