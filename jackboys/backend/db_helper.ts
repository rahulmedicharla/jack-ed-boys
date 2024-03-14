import { UserCredential, createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import {getFirestore, doc, setDoc, getDoc, updateDoc} from "firebase/firestore";
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
    } | null,
    nutritionInformation: {
        date: string,
        foodEntries: {
            title: string,
            calories: number,
            protien: number,
            carbs: number,
            fat: number,
            type: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
            uniqId: string,
        }[] | null,
    } | null,
    meals: {
            title: string,
            ingredients: {
                label: string,
                uniqid: string,
                measureUri: string,
                quantity?: string
            }[],
            calories: number,
            protien: number,
            carbs: number,
            fat: number,
            numberOfServings: number
    }[] | null,
    exercise: {
        label: string,
        sets: number,
        reps: number,
        weight: number,
        day: 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sa' | 'Su' | null
    }[] | null,
} | null;

export type dbReturnType = {
    status: 'success' | 'error',
    error?: string,
    data?: any
}

export type foodItem = {
    label: string,
    uniqId: string
    measures: {
        uri: string,
        label: string,
        weight: number
    }[]
}

export type mealPrepType = {
    status: boolean
    title?: string,
    ingredients?: {
        label: string,
        uniqid: string,
        measureUri: string,
        quantity?: string
    }[]
    calories?: number,
    protien?: number,
    carbs?: number,
    fat?: number,
    numberOfServings?: number
    error: string | null,
    question: string | null,
    answer: string | null
}

export type NewExcercise = {
    status: boolean,
    day?: 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sa' | 'Su' | null,
    label?: string,
    sets?: number,
    reps?: number,
    weight?: number,
    error?: string | null,
}

export type ExercisePrep = {
    exercises?: {
        label: string,
        sets: number,
        reps: number,
        weight: number,
        day: 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sa' | 'Su'
    }[],
    error?: string,
    question?: string,
    answer?: string
}


export const getNutritionInformation = async (newEntry: {
    label: string,
    measureUri: string,
    quantity?: number,
    uniqId: string,
}) => {
    const appId = process.env.EXPO_PUBLIC_APP_ID
    const appKey = process.env.EXPO_PUBLIC_APP_KEY  

    try{
        const response = await fetch("https://api.edamam.com/api/food-database/v2/nutrients?app_id=" + appId + "&app_key=" + appKey, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ingredients: [
                {
                    quantity: parseFloat(newEntry.quantity + ""),
                    measureURI: newEntry.measureUri,
                    foodId: newEntry.uniqId
                }]
            })
        })

        const data = await response.json()

        const returnVal: dbReturnType = {
            status: 'success',
            data: {
                title: newEntry.label,
                calories: data.calories,
                protien: parseInt(data.totalNutrients.PROCNT.quantity + ""),
                carbs: parseInt(data.totalNutrients.CHOCDF.quantity + ""),
                fat: parseInt(data.totalNutrients.FAT.quantity + ""),
                uniqId: newEntry.uniqId + moment().toISOString()
            }
        }

        return returnVal
        
    }catch(e){
        const returnVal: dbReturnType = {
            status: 'error',
            error: e.message
        }

        return returnVal
    }

}

export const getFoodList = async (searchQuery: string) => {
    const appId = process.env.EXPO_PUBLIC_APP_ID
    const appKey = process.env.EXPO_PUBLIC_APP_KEY

    const encodedQuery = encodeURIComponent(searchQuery)

    try{
        const response = await fetch("https://api.edamam.com/api/food-database/v2/parser?app_id=" + appId + "&app_key=" + appKey+ "&ingr=" + encodedQuery+ "&nutrition-type=logging")
        const data = await response.json()

        const foodList: foodItem[] = data.hints.map((item: any) => {
            return {
                label: item.food.label,
                uniqId: item.food.foodId,
                measures: item.measures.slice(0, 5)
            }
        })

        const returnVal:dbReturnType = {
            status: 'success',
            data: foodList.slice(0, 5)
        }

        return returnVal

    }catch(error){
        const returnVal: dbReturnType = {
            status: 'error',
            error: error.message
        }

        return returnVal
    }
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

export const addFoodEntry = async(user: User, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks', newEntry: {
    title: string,
    calories: number,
    protien: number,
    carbs: number,
    fat: number,
    uniqId: string,
}) => {
    const db = getFirestore()

    const todayDate = moment().toISOString()

    let updatedUser: User = user

    try{
        if(updatedUser.nutritionInformation){
            updatedUser.nutritionInformation.foodEntries.push({
                ...newEntry,
                type: type
            })
            updatedUser.nutritionInformation.date = todayDate
        }else{
            updatedUser.nutritionInformation = {
                date: todayDate,
                foodEntries:[{
                    ...newEntry,
                    type: type
                }]
            }
        }
        
        await setDoc(doc(db, "Users", user.uid), updatedUser)

        const returnVal: dbReturnType = {
            status: 'success',
            data:updatedUser.nutritionInformation
        }

        return returnVal;
        

    }catch(e){
        const returnVal: dbReturnType = {
            status:'error',
            error: e.message,

        }

        return returnVal
    }

}

export const removeMealEntry = async(user: User, title: string) => {
    const db = getFirestore()

    try{
        let updatedUser: User = user

        updatedUser.meals = updatedUser.meals.filter((item) => item.title != title)

        await setDoc(doc(db, "Users", user.uid), updatedUser)
    
        const returnVal: dbReturnType = {
            status: 'success',
            data: updatedUser.meals
        }

        return returnVal

    }catch(e){
        const returnVal: dbReturnType = {
            status:'error',
            error: e.message,

        }
        return returnVal
    }
}

export const addExerciseEntry = async(user: User, newExercise: NewExcercise) => {
    const db = getFirestore()

    try{
        let updatedUser: User = user

        if(updatedUser.exercise){
            updatedUser.exercise.push({
                label: newExercise.label,
                sets: newExercise.sets,
                reps: newExercise.reps,
                weight: newExercise.weight,
                day: newExercise.day
            })
        }else{
            updatedUser.exercise = [{
                    label: newExercise.label,
                    sets: newExercise.sets,
                    reps: newExercise.reps,
                    weight: newExercise.weight,
                    day: newExercise.day
                }]
        }

        await setDoc(doc(db, "Users", user.uid), updatedUser)
    
        const returnVal: dbReturnType = {
            status: 'success',
            data: updatedUser
        }

        return returnVal

    }catch(e){
        const returnVal: dbReturnType = {
            status:'error',
            error: e.message,

        }
        return returnVal
    }
}

export const removeExerciseEntry = async(user: User, label: string) => {
    const db = getFirestore()

    try{
        let updatedUser: User = user

        updatedUser.exercise = updatedUser.exercise.filter((item) => item.label != label)

        await setDoc(doc(db, "Users", user.uid), updatedUser)
    
        const returnVal: dbReturnType = {
            status: 'success',
            data: updatedUser
        }

        return returnVal

    }catch(e){
        const returnVal: dbReturnType = {
            status:'error',
            error: e.message,

        }
        return returnVal
    }
}

export const addMealEntry = async(user:User, mealEntry: mealPrepType) => {
    const db = getFirestore()

    try{
        let updatedUser: User = user

        if(updatedUser.meals){
            updatedUser.meals.push({
                title: mealEntry.title,
                ingredients: mealEntry.ingredients,
                calories: mealEntry.calories / mealEntry.numberOfServings,
                protien: mealEntry.protien / mealEntry.numberOfServings,
                carbs: mealEntry.carbs / mealEntry.numberOfServings,
                fat: mealEntry.fat / mealEntry.numberOfServings,
                numberOfServings: mealEntry.numberOfServings
            })
        }else{
            updatedUser.meals = [{
                title: mealEntry.title,
                ingredients: mealEntry.ingredients,
                calories: mealEntry.calories / mealEntry.numberOfServings,
                protien: mealEntry.protien / mealEntry.numberOfServings,
                carbs: mealEntry.carbs / mealEntry.numberOfServings,
                fat: mealEntry.fat / mealEntry.numberOfServings,
                numberOfServings: mealEntry.numberOfServings / mealEntry.numberOfServings
            }]
        }

        await setDoc(doc(db, "Users", user.uid), updatedUser)
    
        const returnVal: dbReturnType = {
            status: 'success',
            data: updatedUser.meals
        }

        return returnVal

    }catch(e){
        const returnVal: dbReturnType = {
            status:'error',
            error: e.message,

        }
        return returnVal
    }
}

export const createNewUserDocument = async (user: UserCredential, registerUser: registerUser) => {
    const db = getFirestore();

    const calorieCount = calculateCalorieCount(registerUser) 

    await setDoc(doc(db, "Users", user.user.uid), {
        username: registerUser.username,
        uid: user.user.uid,
        calorieInformation: {
            todaysCalorieCount: {
                value: 0,
                date: new Date().toISOString()
            },
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

const wipePastFoodRecord = async (data, uid) => {
    const db = getFirestore()
    delete data.nutritionInformation
    
    const docRef = doc(db, "Users", uid);
    await setDoc(docRef, data)

    return data
} 

const validateDate = async (data, uid) => {
    if(!data.nutritionInformation){
        return data
    }

    const today = moment()
    const notedDate = moment(data.nutritionInformation.date)

    if (today.isSame(notedDate, 'D')){
        return data;
    }

    const updatedData = await wipePastFoodRecord(data, uid)
    return updatedData;
}

export const readUserDoc = async (uid: string) => {
    const db = getFirestore()
    
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        const updatedData = await validateDate(data, uid)

        return {
            status: 'success',
            data: updatedData
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