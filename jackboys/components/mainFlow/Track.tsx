import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import BasePage from "../BasePage";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { User, addFoodEntry, dbReturnType, getNutritionInformation } from "../../backend/db_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { highlightOrange, styles } from "../Styles";
import { MaterialIcons } from '@expo/vector-icons';
import SearchMain from "../extraComponents/SearchSuggestions/searchMain";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type TrackProps = {
    user: User
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Track({user, memoizedSetUser}: TrackProps){

    type displayFoodEntry = {
        title: string,
        calories: number
        fat: number,
        protien: number,
        carbs: number,
        uniqid: string,
    }

    const [addFood, setAddFood] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
        snacks: false,
    })

    const [newEntry, setNewEntry] = useState<{
        label: string,
        uniqId: string,
        measureUri: string,
        quantity?: Float,
    } | null>(null)

    const [todayInformation, setTodayInformtion] = useState<{
        calorieCount: number,
        breakfast: displayFoodEntry[],
        lunch: displayFoodEntry[],
        dinner: displayFoodEntry[],
        snacks: displayFoodEntry[]
    }>({
        calorieCount: 0,
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    })

    useEffect(() => {

        const tempToday = {
            calorieCount: 0,
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks:[]
        }
        if(user.nutritionInformation){
            user.nutritionInformation.foodEntries.map((entry) => {
                tempToday.calorieCount += parseInt(entry.calories + "")
                switch(entry.type){
                    case "breakfast":
                        tempToday.breakfast.push({
                            title: entry.title,
                            calories: entry.calories,
                            carbs: entry.carbs,
                            fat: entry.fat,
                            protien: entry.protien,
                            uniqid: entry.uniqId
                        })
                        break;
                    case "lunch":
                        tempToday.lunch.push({
                            title: entry.title,
                            calories: entry.calories,
                            carbs: entry.carbs,
                            fat: entry.fat,
                            protien: entry.protien,
                            uniqid: entry.uniqId
                        })
                        break;
                    case "dinner":
                        tempToday.dinner.push({
                            title: entry.title,
                            calories: entry.calories,
                            carbs: entry.carbs,
                            fat: entry.fat,
                            protien: entry.protien,
                            uniqid: entry.uniqId
                        })
                        break;
                    case "snacks":
                        tempToday.snacks.push({
                            title: entry.title,
                            calories: entry.calories,
                            carbs: entry.carbs,
                            fat: entry.fat,
                            protien: entry.protien,
                            uniqid: entry.uniqId
                        })
                        break;
                    default: 
                        break;

                }
            })
            setTodayInformtion(tempToday)
        }
    }, [user])

    useEffect(() => {
    }, [todayInformation])

    const toggleAddEntry = (field: string) => {
        setAddFood({
            ...addFood,
            [field]: !addFood[field]
        })
    }

    const submitEntry = () => {
        if(newEntry){
            getNutritionInformation(newEntry).then((res: dbReturnType) => {
                addFoodEntry(user, addFood.breakfast ? 'breakfast' : addFood.lunch ? 'lunch' : addFood.dinner ? 'dinner' : 'snacks', res.data).then((response: dbReturnType) => {
                    if(response.status == "success"){

                        memoizedSetUser({
                            ...user,
                            nutritionInformation: response.data
                        })
                        
                        setAddFood({
                            breakfast: false,
                            lunch: false,
                            dinner: false,
                            snacks: false
                        })

                    }else{
                        alert(response.error)
                    }
                })
            })
        }else{
            alert("Please select a food item")
        }
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}>

                <View style={styles.gappedContainer}>
                    <Text style={styles.h2}>Your Daily Calorie Count</Text>
                    <Text style={styles.whiteH2}>{parseInt(todayInformation.calorieCount + "")} / {parseInt(user.calorieInformation.calorieCount + "")} Calories</Text>
                    
                    <View style={styles.container}>
                        <Text style={styles.h3}>Track your calories below!</Text>
                        <Text style={styles.h3}>So far you consumed {todayInformation.calorieCount} / {parseInt(user.calorieInformation.calorieCount + "")}</Text>
                    </View>

                    <View style={styles.leftContainerTrans}>
                        <View style={styles.horizontalContainer2}>
                            <Text style={styles.h2}>Breakfast</Text>
                            <Text style={styles.h3}>{todayInformation.breakfast.reduce((accumulator, currentValue) => accumulator + currentValue.calories, 0)} Calories</Text>
                        </View>
                        {todayInformation.breakfast.length > 0 && todayInformation.breakfast.map((entry) => {
                            return (
                                <View key={entry.uniqid}>
                                    <View key={entry.uniqid} style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}><Text style={{fontWeight: "bold"}}>{entry.title}</Text></Text>
                                    </View>
                                    <View style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}>{entry.calories} Calories</Text>
                                        <Text style={styles.h3}>{entry.protien}g Protien</Text>
                                        <Text style={styles.h3}>{entry.carbs}g Carbs</Text>
                                        <Text style={styles.h3}>{entry.fat}g Fat</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <TouchableOpacity style={styles.subButton} onPress={() => toggleAddEntry("breakfast")}>
                            <Text style={styles.h3}>+ Add Entry</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.leftContainerTrans}>
                        <View style={styles.horizontalContainer2}>
                            <Text style={styles.h2}>Lunch</Text>
                            <Text style={styles.h3}>{todayInformation.lunch.reduce((accumulator, currentValue) => accumulator + currentValue.calories, 0)} Calories</Text>
                        </View>
                        {todayInformation.lunch.length > 0 && todayInformation.lunch.map((entry) => {
                            return (
                                <View key={entry.uniqid}>
                                    <View key={entry.uniqid} style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}><Text style={{fontWeight: "bold"}}>{entry.title}</Text></Text>
                                    </View>
                                    <View style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}>{entry.calories} Calories</Text>
                                        <Text style={styles.h3}>{entry.protien}g Protien</Text>
                                        <Text style={styles.h3}>{entry.carbs}g Carbs</Text>
                                        <Text style={styles.h3}>{entry.fat}g Fat</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <TouchableOpacity style={styles.subButton} onPress={() => toggleAddEntry("lunch")}>
                            <Text style={styles.h3}>+ Add Entry</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.leftContainerTrans}>
                        <View style={styles.horizontalContainer2}>
                            <Text style={styles.h2}>Dinner</Text>
                            <Text style={styles.h3}>{todayInformation.dinner.reduce((accumulator, currentValue) => accumulator + currentValue.calories, 0)} Calories</Text>
                        </View>
                        {todayInformation.dinner.length > 0 && todayInformation.dinner.map((entry) => {
                            return (
                                <View key={entry.uniqid}>
                                    <View key={entry.uniqid} style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}><Text style={{fontWeight: "bold"}}>{entry.title}</Text></Text>
                                    </View>
                                    <View style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}>{entry.calories} Calories</Text>
                                        <Text style={styles.h3}>{entry.protien}g Protien</Text>
                                        <Text style={styles.h3}>{entry.carbs}g Carbs</Text>
                                        <Text style={styles.h3}>{entry.fat}g Fat</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <TouchableOpacity style={styles.subButton} onPress={() => toggleAddEntry("dinner")}>
                            <Text style={styles.h3}>+ Add Entry</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.leftContainerTrans}>
                        <View style={styles.horizontalContainer2}>
                            <Text style={styles.h2}>Snacks / Dessert</Text>
                            <Text style={styles.h3}>{todayInformation.snacks.reduce((accumulator, currentValue) => accumulator + currentValue.calories, 0)} Calories</Text>
                        </View>
                        {todayInformation.snacks.length > 0 && todayInformation.snacks.map((entry) => {
                            return (
                                <View key={entry.uniqid}>
                                    <View key={entry.uniqid} style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}><Text style={{fontWeight: "bold"}}>{entry.title}</Text></Text>
                                    </View>
                                    <View style={styles.horizontalContainer2}>
                                        <Text style={styles.h3}>{entry.calories} Calories</Text>
                                        <Text style={styles.h3}>{entry.protien}g Protien</Text>
                                        <Text style={styles.h3}>{entry.carbs}g Carbs</Text>
                                        <Text style={styles.h3}>{entry.fat}g Fat</Text>
                                    </View>
                                </View>
                            )
                        })}
                        <TouchableOpacity style={styles.subButton} onPress={() => toggleAddEntry("snacks")}>
                            <Text style={styles.h3}>+ Add Entry</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        animationType="slide"
                        visible = {addFood.breakfast || addFood.lunch || addFood.dinner || addFood.snacks}
                        transparent={true}
                        >

                        <View style={styles.modal}>
                            <TouchableOpacity onPress={() => toggleAddEntry(addFood.breakfast ? "breakfast" : addFood.lunch ? "lunch" : addFood.dinner ? "dinner" : "snacks")}>
                                <MaterialIcons name="close" size={30} color={highlightOrange} />
                            </TouchableOpacity>
                            <Text style={styles.h2}>Add an entry for {addFood.breakfast ? "breakfast" : addFood.lunch ? "lunch" : addFood.dinner ? "dinner" : "snacks"}</Text>

                            <SearchMain newEntry={newEntry} setNewEntry={setNewEntry}/>

                            <TouchableOpacity style={styles.subButton} onPress={() => submitEntry()}>
                                <Text style={styles.subButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                        

                    </Modal>
                </View>

            </KeyboardAwareScrollView>
        </BasePage>
    )
}