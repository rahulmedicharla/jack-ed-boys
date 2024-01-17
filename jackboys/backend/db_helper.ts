import { UserCredential, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
import moment from "moment";

export type Entry = {
    status?: boolean,
    date: string | null,
    weight: string | null
}

export type DisplayEntry = {
    date: string[],
    weight: number[]
} | null

export type User = {
    username: string,
    uid: string,
    entries: Entry[],
    openaikey: string | null,
    calorieInformation: {
        calorieCount?: number,
        age?: number,
        height?: number,
        weight?: number,
        gender?: 'male' | 'female',
        goal?: 'cut' | 'bulk' | 'maintain',
    } | null
} | null;

export type dbReturnType = {
    status: 'success' | 'error',
    error?: string,
    data?: any
}

export const createNewUserDocument = async (user: UserCredential, username: string) => {
    const auth = getAuth();
    const db = getFirestore();

    await setDoc(doc(db, "Users", user.user.uid), {
        username: username,
        uid: user.user.uid
    })
};

export const readUserDoc = async (uid: string) => {
    const db = getFirestore()
    
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            status: 'success',
            data: data
        }
    }else{
        return {
            status: 'error',
            error: 'User does not exist'
        }
    }

}

export const updateOpenaiKey = async (uid: string, key: string): Promise<dbReturnType> => {
    const db = getFirestore()

    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        try{
            const data = docSnap.data();
            await setDoc(docRef, {
                ...data,
                openaikey: key
            }, {merge: true})

            return {
                status: 'success',
            }

        }catch(error){
            return {
                status: 'error',
                error: error.message
            }
        }
    }else{
        return {
            status: 'error',
            error: 'User does not exist'
        }
    }
}

export const addEntry = async (weight: string, uid: string) => {
    const db = getFirestore()

    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const entries = data.entries;
        const currentMoment = moment().toDate().toISOString()

        if (entries == undefined){
            await setDoc(docRef, {
                ...data,
                entries: [
                    {
                        weight: weight,
                        date: currentMoment
                    }
                ]
            }, {merge: true})

            return {
                status: 'success',
                data: {
                    weight: weight,
                    date: currentMoment
                }
            }
        } else {
            await setDoc(docRef, {
                ...data,
                entries: [
                    ...entries,
                    {
                        weight: weight,
                        date: currentMoment
                    }
                ]
            }, {merge: true})

            return {
                status: 'success',
                data: {
                    weight: weight,
                    date: currentMoment
                }
            }
        }
    }

}