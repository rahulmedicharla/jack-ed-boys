import React, { Dispatch, SetStateAction, useState } from "react";
import { Text,TextInput,TouchableOpacity,Modal,View, ScrollView } from "react-native";
import BasePage from "../BasePage";
import { User, addMealEntry, dbReturnType, foodItem, getNutritionInformation, mealPrepType } from "../../backend/db_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { highlightOrange, secondary, styles } from "../Styles";
import { MaterialIcons } from '@expo/vector-icons';
import { submitOpenAIQuestion } from "../../backend/ai_helper";
import { Double, Float } from "react-native/Libraries/Types/CodegenTypes";
import SearchMain from "../extraComponents/SearchSuggestions/searchMain";

type MealProps = {
    user: User,
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Meal({user, memoizedSetUser}: MealProps){

    const [newEntry, setNewEntry] = useState<{
        label: string,
        uniqId: string,
        measureUri: string,
        quantity?: Float,
    } | null>(null)

    const [mealPrep, setMealPrep] = useState<mealPrepType>({
        error: null,
        status: false,
        title: "",
        numberOfServings: null,
        ingredients: [],
        calories: 0,
        protien: 0,
        carbs: 0,
        fat: 0,
    });

    const toggleModal = () => {
        setMealPrep({
            ...mealPrep,
            status: !mealPrep.status
        })
    }

    const updateMealPrep = (value: string | number, field: string) => {
        setMealPrep({
            ...mealPrep,
            [field]: value
        })
    }

    const submitMeal = () => {
        if(mealPrep.title == "" || mealPrep.numberOfServings == null || mealPrep.ingredients.length == 0){
            setMealPrep({
                ...mealPrep,
                error: "Please fill out all fields"
            })
            return;
        }

        addMealEntry(user, mealPrep).then((res: dbReturnType) => {
            if(res.status == 'success'){
                memoizedSetUser({
                    ...user,
                    meals: res.data
                })
                toggleModal();
            }else{
                setMealPrep({
                    ...mealPrep,
                    error: res.error
                })
            }
        })

          
    }

    const addIngredient = () => {
        if(newEntry == null){
            setMealPrep({
                ...mealPrep,
                error: "Please fill out all fields"
            })
            return;
        };

        getNutritionInformation(newEntry).then((res: dbReturnType) => {
            if(res.status == 'success'){
                setMealPrep({
                    ...mealPrep,
                    ingredients: [...mealPrep.ingredients, {
                        label: newEntry.label,
                        uniqid: newEntry.uniqId,
                        measureUri: newEntry.measureUri,
                        quantity: newEntry.quantity + "",
                    }],
                    calories: mealPrep.calories + res.data.calories,
                    protien: mealPrep.protien + res.data.protien,
                    carbs: mealPrep.carbs + res.data.carbs,
                    fat: mealPrep.fat + res.data.fat,
                    error: null,
                })
                setNewEntry(null);
            }else{
                setMealPrep({
                    ...mealPrep,
                    error: res.error
                })
            }
        })
    }




    return (
        <BasePage>
            <View style={styles.topContainer}>
                <Text style={styles.h2}>Plan your meals</Text>
                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal()}>
                    <Text style={styles.h3}>+  Create a new meal</Text>
                </TouchableOpacity>

                <Text style={styles.h3}>Your meals below</Text>
                {user.meals && user.meals.length > 0 && user.meals.map((meal, index) => {
                    return (
                        <View key={index} style={styles.leftContainer}>
                            <View style={styles.horizontalContainer2}>
                                <Text style={styles.whiteH2}>{meal.title}</Text>
                                <Text style={styles.h3}>{meal.numberOfServings} servings</Text>        
                            </View>
                            <View style={styles.horizontalContainer2}>    
                                <Text style={styles.h3}>Calories: {meal.calories} cal/s</Text>
                                <Text style={styles.h3}>Protien: {meal.protien} g/s</Text>
                            </View>
                            <View style={styles.horizontalContainer2}>    
                                <Text style={styles.h3}>Carbs: {meal.carbs} g/s</Text>
                                <Text style={styles.h3}>Fat: {meal.fat} g/s</Text>
                            </View>
                        </View>
                    );
                })}

                <Modal
                    animationType="slide"
                    transparent={true} 
                    visible={mealPrep.status}>

                        <KeyboardAwareScrollView 
                            resetScrollToCoords={{ x: 0, y: 0 }}   
                            scrollEnabled={true}>

                                <View style={styles.modal}>
                                    <ScrollView contentContainerStyle={{alignItems:'center'}}>
                                        <View style={styles.topContainer}>
                                            <TouchableOpacity onPress={() => toggleModal()}>
                                                <MaterialIcons name="close" size={30} color={highlightOrange} />
                                            </TouchableOpacity>

                                            <View>
                                                <Text style={styles.h3}>Enter a meal title & number of servings</Text>
                                                <View style={styles.horizontalContainer2}>
                                                    <TextInput style={styles.smallInput} placeholder="title" placeholderTextColor={'darkgrey'} value={mealPrep.title} onChangeText={(value) => updateMealPrep(value, 'title')}></TextInput>
                                                    <TextInput style={styles.smallInput} placeholder="# of servings" placeholderTextColor={'darkgrey'} keyboardType="decimal-pad" value={mealPrep.numberOfServings? mealPrep.numberOfServings + "" : ""} onChangeText={(value) => updateMealPrep(parseInt(value), 'numberOfServings')}></TextInput>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.h3}>Add ingredients</Text>
                                                <SearchMain newEntry={newEntry} setNewEntry={setNewEntry}></SearchMain>
                                            </View>

                                            {mealPrep.error ? <Text style={styles.error}>{mealPrep.error}</Text>: null}
                                            
                                            <TouchableOpacity style={styles.subButton} onPress={() => addIngredient()}>
                                                <Text style={styles.h3}>Add ingredient</Text>
                                            </TouchableOpacity>

                                            <View>
                                                <View style={styles.horizontalContainer2}>
                                                    <Text style={styles.h3}>Calories: {mealPrep.calories}</Text>
                                                    <Text style={styles.h3}>Protien: {mealPrep.protien}</Text>
                                                    <Text style={styles.h3}>Carbs: {mealPrep.carbs}</Text>
                                                    <Text style={styles.h3}>Fat: {mealPrep.fat}</Text>
                                                </View>
                                            </View>

                                            {mealPrep.ingredients.length > 0 && mealPrep.ingredients.map((ingredient, index) => {
                                                return (
                                                    <View key={ingredient.uniqid} style={styles.horizontalContainer2}>
                                                        <Text style={styles.h3}><Text style={{fontWeight: 'bold'}}>{ingredient.quantity}</Text></Text>
                                                        <Text style={styles.h3}><Text style={{fontWeight: "bold"}}>{ingredient.label}(s)</Text></Text>
                                                    </View>
                                                );
                                            })}

                                            <TouchableOpacity style={styles.subButton} onPress={() => submitMeal()}>
                                                <Text style={styles.h3}>Submit Meal</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </ScrollView>  
                                </View>
                        </KeyboardAwareScrollView>                        
                </Modal>
            </View>
        </BasePage>
    )
}