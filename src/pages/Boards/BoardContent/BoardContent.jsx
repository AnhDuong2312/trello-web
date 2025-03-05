import Box from "@mui/material/Box"
import ListColumns from "./ListColumns/ListColumns"
import { mapOrder  } from "~/utils/sorts"
import {DndContext, 
      //PointerSensor,
        MouseSensor, 
        TouchSensor, 
        useSensor, 
        useSensors} 
        from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from "react"


function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }})
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 }})
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 500 }})
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event);
    const { active, over } = event

    if(!over) return

    if(active.id !== over.id){
      const oldIndex = orderedColumns.findIndex( c => c._id === active.id)
      const newIndex = orderedColumns.findIndex( c => c._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // 2 cái consele.log dữ liệu này sau dùng để sử lí API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)

    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          p: '10px 0'
      }}>
          <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
