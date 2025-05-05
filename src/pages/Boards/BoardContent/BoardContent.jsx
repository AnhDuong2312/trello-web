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
        closestCorners,
        pointerWithin,
        rectIntersection,
        getFirstCollision,
        closestCenter
      } 
        from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState, useCallback, useRef } from "react"
import Column from "./ListColumns/Columns/Column";
import TrelloCard from "./ListColumns/Columns/ListCards/Card/TrelloCard"
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from "~/utils/formatters"



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

  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const moveCard = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData

  ) => {
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

        if (isEmpty(nextActiveColumn.cards)){
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn){
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced( newCardIndex, 0, activeDraggingCardData)

        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)


      }



      return nextColumns
    })
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
      moveCard(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
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
        moveCard(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
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

  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      return closestCorners({...args})
    }

    const poiterIntersections = pointerWithin(args)
    const interSection = poiterIntersections?.length > 0
    ? poiterIntersections
    : rectIntersection(args)

    let overId = getFirstCollision(interSection, 'id')

    if (overId){

      const intersetColumn = orderedColumns.find(column => column._id === overId)
      if (intersetColumn){
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId && intersetColumn?.cardOrderIds?.includes(container.id))
          })[0]?.id
        })
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext 
      sensors={sensors}
      
      collisionDetection={collisionDetectionStrategy}
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
