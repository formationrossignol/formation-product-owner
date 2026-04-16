import { useState } from 'react'
import GlossaryText from '../shared/GlossaryText'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({ id, label, rank }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className="ranking-item" {...attributes} {...listeners}>
      <span className="rank-number">{rank}</span>
      {label}
    </div>
  )
}

export default function Ranking({ task, onAnswer, disabled }) {
  const [items, setItems] = useState(task.options)
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems(prev => {
        const oldIndex = prev.findIndex(i => i.id === active.id)
        const newIndex = prev.findIndex(i => i.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="task-ranking">
      <p className="task-label"><GlossaryText>{task.label}</GlossaryText></p>
      {task.hint && <p className="task-hint">💡 <GlossaryText>{task.hint}</GlossaryText></p>}
      <p className="ranking-instruction">Glissez pour réordonner du plus prioritaire au moins prioritaire</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id} label={item.label} rank={index + 1} />
          ))}
        </SortableContext>
      </DndContext>
      <button
        className="submit-btn"
        disabled={disabled}
        onClick={() => onAnswer(task, items.map(i => i.id))}
      >
        Valider l'ordre
      </button>
    </div>
  )
}
