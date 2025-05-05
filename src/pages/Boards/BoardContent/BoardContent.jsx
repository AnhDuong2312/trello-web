import Box from "@mui/material/Box"
import ListColumns from "./ListColumns/ListColumns"
import { mapOrder  } from "~/utils/sorts"
import {DndContext, 
      //PointerSensor,
        MouseSensor, 
        TouchSensor, 
        useSensor, 
        useSensors,
        DragOverlay,
        defaultDropAnimationSideEffects,
        closestCorners
      } 
        from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from "react"
import Column from "./ListColumns/Columns/Column";
import TrelloCard from "./ListColumns/Columns/ListCards/Card/TrelloCard"
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }})
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 }})
  const touchSensor = useSensor(TouchSensor, {activationConstraint: { delay: 250, tolerance: 500 }})
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)  
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumn, setOldColumn] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId){
      setOldColumn(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over} = event

    if(!active || !over) return

    const { id: activeDraggingCardId, data: {current: activeDraggingCardData}} = active
    const { id: overCardId} = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if(!activeColumn || !overColumn) return

    if(activeColumn._id !== overColumn._id){
      setOrderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
              const modifier = isBelowOverItem ? 1 : 0

              newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        if (nextActiveColumn){
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn){
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          nextOverColumn.cards = nextOverColumn.cards.toSpliced( newCardIndex, 0, activeDraggingCardData)
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)


        }



        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event);
    const { active, over } = event

    if(!active || !over) return

    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD){
      const { id: activeDraggingCardId, data: {current: activeDraggingCardData}} = active
      const { id: overCardId} = over
  
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
  
      if(!activeColumn || !overColumn) return

      if (oldColumn._id !== overColumn._id){
        //
      }else{
        const oldCardIndex = oldColumn?.cards.findIndex( c => c._id === activeDragItemId)
        const newCardIndex = oldColumn?.cards.findIndex( c => c._id === overCardId)
        const dndOrderedCard = arrayMove(oldColumn?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns =>{
          const nextCard = cloneDeep(prevColumns)
          const targetColumn = nextCard.find(c => c._id === overColumn._id)
          targetColumn.cards = dndOrderedCard
          targetColumn.cardOrderIds = dndOrderedCard.map(card => card._id)
          return nextCard
        })
      }
    }

    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      if(active.id !== over.id){
        const oldColumnIndex = orderedColumns.findIndex( c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex( c => c._id === over.id)
  
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 cái consele.log dữ liệu này sau dùng để sử lí API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
        setOrderedColumns(dndOrderedColumns)
  
      }
    }


    
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumn(null)

  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: {active: {opacity: '0.5'}}})
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd} 
    >
      <Box sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          p: '10px 0'
      }}>
          <ListColumns columns={orderedColumns} />
          <DragOverlay dropAnimation = {dropAnimation}>
            {/* kiểm tra */}
            {(!activeDragItemType ) && null}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
            {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <TrelloCard card={activeDragItemData}/>}
          </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
