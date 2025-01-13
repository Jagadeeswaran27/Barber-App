import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function generateUniqueShopCode(shopName: string, phone: string): Promise<string> {
  // Get first 3 characters of shop name (uppercase)
  const namePrefix = shopName.slice(0, 3).toUpperCase();
  
  // Try different number combinations until we find a unique code
  for (let i = 0; i <= phone.length - 3; i++) {
    const numberPart = phone.slice(i, i + 3);
    const shopCode = `${namePrefix}${numberPart}`;

    // Check if code exists
    const shopQuery = query(
      collection(db, 'shops'),
      where('code', '==', shopCode)
    );
    const snapshot = await getDocs(shopQuery);

    if (snapshot.empty) {
      return shopCode;
    }
  }

  // If all combinations are taken, add a random number
  const randomNum = Math.floor(Math.random() * 900 + 100);
  return `${namePrefix}${randomNum}`;
}