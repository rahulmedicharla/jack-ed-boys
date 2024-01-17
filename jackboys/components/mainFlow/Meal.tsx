import React, { Dispatch, SetStateAction, useState } from "react";
import { Text,TextInput,TouchableOpacity,Modal,View } from "react-native";
import BasePage from "../BasePage";
import { User } from "../../backend/db_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { secondary, styles } from "../Styles";
import { MaterialIcons } from '@expo/vector-icons';
import { submitOpenAIQuestion } from "../../backend/ai_helper";

type MealProps = {
    user: User,
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Meal({user, memoizedSetUser}: MealProps){

    type mealQuestionType = {
        status: boolean | null
        question: string | null,
        answer: string | null
    }

    const [mealQuestion, setMealQuestion] = useState<mealQuestionType>({
        status: false,
        question: null,
        answer: null
    });

    const toggleModal = () => {
        setMealQuestion({
            ...mealQuestion,
            status: !mealQuestion.status
        })
    }

    const handleQuestionChange = (text: string) => {
        setMealQuestion({
            ...mealQuestion,
            question: text
        })
    }

    const submitQuestion = async() => {
        if(!user.openaikey){
            alert("Please add a valid openaikey in the profile page")
        }else{
            submitOpenAIQuestion(mealQuestion.question, user.openaikey).then((response) => {
                if(response.status === "success"){
                    setMealQuestion({
                        ...mealQuestion,
                        answer: response.data,
                    })
                    toggleModal()
                }else{
                    alert(response.message)
                }
            })
        }
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView 
                resetScrollToCoords={{ x: 0, y: 0 }}   
                scrollEnabled={true}>

                <View style={styles.container}>
                    <Text style={styles.h1}>Prep your meals</Text>

                    <Text style={styles.h3}>Type here to ask a question about your meal</Text>
                    <View style={styles.rightContainer}>
                        <TextInput style={styles.subInput} onChangeText={(text) => {handleQuestionChange(text)}} value={mealQuestion.question} placeholder="What can I make with..."></TextInput>
                        <TouchableOpacity style={styles.subButton} onPress={() => submitQuestion()}>
                            <Text style={styles.subButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    visible={mealQuestion.status}
                    transparent={true}
                    >
                    <View style={styles.modal}>
                        <KeyboardAwareScrollView 
                            resetScrollToCoords={{ x: 0, y: 0 }}   
                            scrollEnabled={true}>

                            <View>
                                <TouchableOpacity onPress={() => toggleModal()} >
                                    <MaterialIcons name="close" size={30} color={secondary}/>
                                </TouchableOpacity>
                            </View>

                            {mealQuestion.answer ? (
                                <View style={styles.container}>
                                    <Text style={styles.h1}>Answer</Text>
                                    <Text style={styles.h2}>{mealQuestion.answer}</Text>
                                </View> 
                            ):null}
                    
                        </KeyboardAwareScrollView>
                    </View>
                </Modal>
            </KeyboardAwareScrollView>
        </BasePage>
    )
}