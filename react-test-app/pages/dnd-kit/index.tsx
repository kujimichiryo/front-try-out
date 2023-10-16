import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type ItemId = '1' | '2' | '3';
const items: ItemId[] = ['1', '2', '3'];

interface SortableItemProps {
  id: ItemId;
}

const SortableItem: React.FC<SortableItemProps & {index:number}> = ({ id, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    background: 'red',
  };

  return (
    <div ref={setNodeRef} style={{...style, height:index===1?'100px':''}} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

const Index: React.FC = () => {
  const [sortedItems, setSortedItems] = useState<ItemId[]>(items);
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event: DragEndEvent) => {
        const { active, over } = event;
        if (over) {
          const oldIndex = sortedItems.indexOf(active.id as ItemId);
          const newIndex = sortedItems.indexOf(over.id as ItemId);

          setSortedItems((currentItems) => {
            const updatedItems = [...currentItems];
            updatedItems.splice(oldIndex, 1);
            updatedItems.splice(newIndex, 0, active.id as ItemId);

            return updatedItems;
          });
        }
      }}
    >
      <SortableContext items={sortedItems} strategy={verticalListSortingStrategy}>
        {sortedItems.map((id, index) => (
          <SortableItem key={id} id={id} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default Index;
