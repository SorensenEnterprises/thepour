import { useState, useCallback, useMemo } from 'react';
import { InventoryItem, QuantityLevel } from '../types';
import { sampleInventory } from '../data/sampleInventory';

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);

  const setQuantity = useCallback((ingredientId: string, quantity: QuantityLevel) => {
    setInventory(prev =>
      prev.map(item =>
        item.ingredientId === ingredientId ? { ...item, quantity } : item
      )
    );
  }, []);

  const addItem = useCallback((item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  }, []);

  const removeItem = useCallback((ingredientId: string) => {
    setInventory(prev => prev.filter(item => item.ingredientId !== ingredientId));
  }, []);

  // ids where quantity > 'out' (anything stocked, even a splash)
  const inStockIds = useMemo(
    () => new Set(inventory.filter(i => i.quantity !== 'out').map(i => i.ingredientId)),
    [inventory]
  );

  // ids where quantity is exactly 'splash' — used to surface low-stock warnings
  const splashIds = useMemo(
    () => new Set(inventory.filter(i => i.quantity === 'splash').map(i => i.ingredientId)),
    [inventory]
  );

  return { inventory, inStockIds, splashIds, setQuantity, addItem, removeItem };
}
