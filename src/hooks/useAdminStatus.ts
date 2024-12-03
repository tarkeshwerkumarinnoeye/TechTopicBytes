import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from 'firebase/auth';
import { useToast } from "@/components/ui/use-toast";

export const useAdminStatus = (user: User | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Reset loading and admin status if user is not fully initialized
      if (!user || !user.email) {
        console.log('User not fully initialized, resetting admin status');
        setIsAdmin(false);
        setIsLoading(true);
        return;
      }

      try {
        console.log(`Checking admin status for user: ${user.email}`);
        const adminUsersRef = collection(db, "adminusers");
        const q = query(adminUsersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        console.log(`Admin users query results:`, {
          empty: querySnapshot.empty,
          size: querySnapshot.size
        });

        // Log details of each document
        querySnapshot.forEach((doc) => {
          console.log("Document ID:", doc.id);
          console.log("Document Data:", doc.data());
        });

        const adminStatus = !querySnapshot.empty;
        console.log(`Setting admin status to: ${adminStatus}`);
        setIsAdmin(adminStatus);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        
        // Show a toast notification for the error
        toast({
          title: "Admin Status Check Failed",
          description: "Unable to verify admin status. Please try again later.",
          variant: "destructive"
        });

        setIsAdmin(false);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  return { isAdmin, isLoading };
};
