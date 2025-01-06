import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface WorkingHours {
  [key: string]: { open: string; close: string; closed: boolean } | null;
}

export function useShopManagement(shopId: string) {
  const [updating, setUpdating] = useState(false);

  const updateShopName = async (name: string) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'shops', shopId), { name });
    } finally {
      setUpdating(false);
    }
  };

  const updateWorkingHours = async (hours: WorkingHours) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'shops', shopId), { workingHours: hours });
    } finally {
      setUpdating(false);
    }
  };

  return { updateShopName, updateWorkingHours, updating };
}