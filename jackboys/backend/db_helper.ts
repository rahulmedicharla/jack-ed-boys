import { UserCredential, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";

export const createNewUserDocument = async (user: UserCredential, username: string) => {
    const auth = getAuth();
    const db = getFirestore();

    await setDoc(doc(db, "Users", user.user.uid), {
        username: username,
        uid: user.user.uid
    })
};

export const retreiveEntries = async () => {
    const db = getFirestore()
    const auth = getAuth();

    const uid = auth.currentUser!.uid;

    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const entries = data.entries;

        if (entries == undefined){
            return []
        } else {
            return entries
        }
    }

}

export const addEntry = async (weight: string) => {
    const db = getFirestore()
    const auth = getAuth();

    const uid = auth.currentUser!.uid;

    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const entries = data.entries;

        if (entries == undefined){
            await setDoc(docRef, {
                ...data,
                entries: [
                    {
                        weight: weight,
                        date: new Date()
                    }
                ]
            }, {merge: true})
        } else {
            await setDoc(docRef, {
                entries: [
                    ...entries,
                    {
                        weight: weight,
                        date: new Date()
                    }
                ]
            }, {merge: true})
        }
    }

}