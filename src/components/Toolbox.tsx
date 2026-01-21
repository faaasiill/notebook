import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ChevronDown, 
  ChevronUp, 
  Star,
  RotateCcw,
  Eraser
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolboxProps {
  color: string
  important: boolean
  onColorChange: (color: string) => void
  onImportantToggle: () => void
  onResetZoom: () => void
  onClearFormatting: () => void
}

const COLORS = [
  { name: 'Default', value: '#e5e7eb' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Pink', value: '#fbcfe8' },
]


export function Toolbox({
  color,
  important,
  onColorChange,
  onImportantToggle,
  onResetZoom,
  onClearFormatting,
}: ToolboxProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors bg-white"
      >
        <span className="text-sm font-medium tracking-tight">Toolbox</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <div
        className={cn(
          "transition-all duration-300 bg-white",
          isExpanded ? "max-h-96 opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-3 space-y-3 border-t border-gray-200">
          {/* Color Picker */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block tracking-tight">
              Note Border Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onColorChange(c.value)}
                  className={cn(
                    "w-full h-8 rounded border-2 transition-all hover:scale-110",
                    color === c.value ? "border-gray-900 ring-2 ring-gray-300" : "border-gray-300"
                  )}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  aria-label={`Set color to ${c.name}`}
                />
              ))}
            </div>
          </div>

          {/* Important Toggle */}
          <Button
            variant={important ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full justify-start",
              important && "bg-yellow-500 hover:bg-yellow-600 text-white"
            )}
            onClick={onImportantToggle}
          >
            <Star className={cn("w-4 h-4 mr-2", important && "fill-white")} />
            {important ? 'Marked Important' : 'Mark Important'}
          </Button>

          {/* Reset Zoom */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onResetZoom}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Zoom
          </Button>

          {/* Clear Formatting */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={onClearFormatting}
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear Formatting
          </Button>
        </div>
      </div>
    </div>
  )
}
