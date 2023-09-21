import { createContext, ReactNode, useContext, useState } from "react"
import { ShoppingCard } from "../components/ShoppingCard"
import { useLocalStorage } from "../hooks/useLocalStorage"

type ShoppingCardProviderProps = {
  children: ReactNode
}

type CardItem = {
  id: number
  quantity: number
}

type ShoppingCardContext = {
  openCard: () => void
  closeCard: () => void
  getItemQuantity: (id: number) => number
  increaseCardQuantity: (id: number) => void
  decreaseCardQuantity: (id: number) => void
  removeFromCard: (id: number) => void
  cardQuantity: number
  cardItems: CardItem[]
}

const ShoppingCardContext = createContext({} as ShoppingCardContext)

export function useShoppingCard() {
  return useContext(ShoppingCardContext)
}
export function ShoppingCardProvider({ children }: ShoppingCardProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [cardItems, setCardItems] = useLocalStorage<CardItem[]>("shopping-card", [])

  const cardQuantity = cardItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )

  const openCard = () => setIsOpen(true)
  const closeCard = () => setIsOpen(false)


  function getItemQuantity(id: number) {
    return cardItems.find(item => item.id === id)?.quantity || 0
  }

  function increaseCardQuantity(id: number) {
    setCardItems(currentItems => {
      if (currentItems.find(item => item.id === id) == null) {
        return [...currentItems, { id, quantity: 1 }]
      } else {
        return currentItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      }
    })
  }
  function decreaseCardQuantity(id: number) {
    setCardItems(currentItems => {
      if (currentItems.find(item => item.id === id)?.quantity === 1) {
        return currentItems.filter(item => item.id !== id)
      } else {
        return currentItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  function removeFromCard(id: number) {
    setCardItems(currentItems => {
      return currentItems.filter(item => item.id !== id)
    })
  }

  return (
    <ShoppingCardContext.Provider
      value={{
        getItemQuantity,
        increaseCardQuantity,
        decreaseCardQuantity,
        removeFromCard,
        cardItems,
        cardQuantity,
        openCard,
        closeCard
      }}
    >
      {children}
      <ShoppingCard isOpen={isOpen} />
    </ShoppingCardContext.Provider>
  )
}