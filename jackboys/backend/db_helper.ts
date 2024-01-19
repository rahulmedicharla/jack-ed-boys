import { UserCredential, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
import moment from "moment";
import { registerUser } from "./auth_helper";

export type Entry = {
    status?: boolean,
    date: string | null,
    weight: string | null
}

export type DisplayEntry = {
    value: number,
    label: string,
    customDataPoint?: () => JSX.Element
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
        activityLevel?: 'none' | 'light' | 'moderate' | 'heavy',
    } | null
} | null;

export type dbReturnType = {
    status: 'success' | 'error',
    error?: string,
    data?: any
}

const calculateCalorieCount = (registerUser: registerUser) => {
    const weightInKg = parseFloat(registerUser.weight) * 0.453592
    const heightInCm = parseFloat(registerUser.height.split(".")[0]) * 30.48 + parseFloat(registerUser.height.split(".")[1]) * 2.54
    let BMR = 0
    if (registerUser.gender == 'male'){
        BMR = 66.5 + (13.75 * weightInKg) + (5.003 * heightInCm) - (6.755 * parseInt(registerUser.age))
    }else{
        BMR = 655.1 + (9.563 * weightInKg) + (1.85 * heightInCm) - (4.676 * parseInt(registerUser.age))
    }

    if (registerUser.activityLevel == 'none'){
        BMR *= 1.2
    }else if (registerUser.activityLevel == 'light'){
        BMR *= 1.375
    }else if (registerUser.activityLevel == 'moderate'){
        BMR *= 1.55
    }else if (registerUser.activityLevel == 'heavy'){
        BMR *= 1.725
    }

    if (registerUser.goal == 'cut'){
        BMR -= 300
    }else if (registerUser.goal == 'bulk'){
        BMR += 300
    }

    return BMR
}

export const createNewUserDocument = async (user: UserCredential, registerUser: registerUser) => {
    const db = getFirestore();

    const calorieCount = calculateCalorieCount(registerUser) 

    await setDoc(doc(db, "Users", user.user.uid), {
        username: registerUser.username,
        uid: user.user.uid,
        calorieInformation: {
            calorieCount: calorieCount,
            age: registerUser.age,
            height: registerUser.height,
            weight: registerUser.weight,
            gender: registerUser.gender,
            goal: registerUser.goal,
            activityLevel: registerUser.activityLevel,
        }
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