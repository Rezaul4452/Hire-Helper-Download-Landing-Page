import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

interface UseFirestoreReturn<T> {
  data: T[];
  setData: (newData: T[]) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useFirestore<T extends { id: string; title: string; downloadUrl: string; refreshUrl: string; group?: string; lastRefreshed?: string; }>(collectionName: string, initialData: T[]): UseFirestoreReturn<T> {
  const [data, setDataState] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const stableInitialData = JSON.stringify(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);

        if (snapshot.empty) {
          console.log('No data found in Firestore, populating with default items.');
          const initialItems = JSON.parse(stableInitialData) as T[];
          const batch = writeBatch(db);
          initialItems.forEach((item) => {
            const { id, ...dataToSet } = item;
            const docRef = doc(collectionRef, id);
            batch.set(docRef, dataToSet);
          });
          await batch.commit();
          setDataState(initialItems);
        } else {
          const fetchedData = snapshot.docs.map(doc => {
            const docData = doc.data();
            return {
              id: doc.id,
              title: docData.title || '',
              downloadUrl: docData.downloadUrl || '',
              refreshUrl: docData.refreshUrl || '',
              group: docData.group || '',
              lastRefreshed: docData.lastRefreshed || undefined,
            } as T;
          });
          setDataState(fetchedData);
        }
      } catch (err) {
        console.error("Firebase fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching data.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, stableInitialData]);

  const setData = useCallback(async (newData: T[]) => {
    try {
      setLoading(true);
      setError(null);
      
      const collectionRef = collection(db, collectionName);
      const batch = writeBatch(db);

      // First, remove all existing documents to ensure a clean slate.
      const existingDocsSnapshot = await getDocs(collectionRef);
      existingDocsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Then, add the new data, ensuring it's clean for Firestore.
      newData.forEach(item => {
        const { id, ...dataToSet } = item;

        // Firestore does not allow `undefined` values. We explicitly remove the `lastRefreshed`
        // field from the object if it's falsy (e.g., undefined, null, or empty string)
        // to prevent write errors.
        if (!dataToSet.lastRefreshed) {
          delete (dataToSet as Partial<T>).lastRefreshed;
        }
        
        const docRef = doc(collectionRef, id);
        batch.set(docRef, dataToSet);
      });

      await batch.commit();
      setDataState(newData);
    } catch (err) {
       console.error("Firebase save error:", err);
       const errorMessage = err instanceof Error ? err.message : 'Failed to save data.';
       setError(errorMessage);
    } finally {
        setLoading(false);
    }
  }, [collectionName]);

  return { data, setData, loading, error };
}