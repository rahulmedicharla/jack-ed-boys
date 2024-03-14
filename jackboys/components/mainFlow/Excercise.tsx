import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, ScrollView, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { ExercisePrep, NewExcercise, User, addExerciseEntry, removeExerciseEntry } from "../../backend/db_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { highlightOrange, styles } from "../Styles";
import { MaterialIcons } from '@expo/vector-icons';
import { submitOpenAIQuestionExercise } from "../../backend/ai_helper";


type ExerciseProps = {
    user: User,
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Excercise({user, memoizedSetUser}: ExerciseProps){

    const [exercisePrep, setExercisePrep] = useState<ExercisePrep>(null);

    const [newExercise, setNewExercise] = useState<NewExcercise>({
        status: false
    })

    useEffect(() => {
        if (user.exercise) {
            setExercisePrep({
                exercises: user.exercise
            });
        }
    }, [])

    const toggleModal = (day: 'M' | 'T' | 'W' | 'Th' | 'F' | 'Sa' | 'Su' | null) => {
        setNewExercise({...newExercise, status: !newExercise.status, day: day});
    }

    const askQuestion = () => {
        submitOpenAIQuestionExercise(exercisePrep.question).then((response) => {
            if (response.status == 'success') {
                setExercisePrep({...exercisePrep, answer: response.data});
            }
        })
    }

    const addExercise = () => {
        addExerciseEntry(user, newExercise).then((response) => {
            if (response.status == 'success') {
                memoizedSetUser(response.data);
                setNewExercise({status: false})
            }
            else{
                setExercisePrep({...exercisePrep, error: response.error});
            }
        })
    }

    const removeExercise = (label: string) => {
        removeExerciseEntry(user, label).then((response) => {
            if (response.status == 'success') {
                memoizedSetUser(response.data);
            }
            else{
                setExercisePrep({...exercisePrep, error: response.error});
            }
        })
    }


    return (
        <BasePage>
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}   
                scrollEnabled={true}>
                    
                    <View style={styles.gappedContainer}>
                        <Text style={styles.h2}>Plan your excercise</Text>

                        <View style={styles.container}>
                            <View style={styles.container}>
                                <Text style={styles.h3}>Want to learn specific splits?</Text>
                                <TextInput style={styles.input} placeholder="Ask a question" placeholderTextColor={'darkgrey'} onChangeText={(text) => setExercisePrep({...exercisePrep, question: text})}></TextInput>

                                {exercisePrep && exercisePrep.answer && <Text style={styles.h3}>{exercisePrep.answer}</Text>}
                                <TouchableOpacity style={styles.subButton} onPress={() => askQuestion()}>
                                    <Text style={styles.h3}>Ask</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.leftContainerTrans}>
                                <Text style={styles.whiteH2}>Monday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'M').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <TouchableOpacity onPress={() => removeExercise(exercise.label)}>
                                                    <MaterialIcons name="close" size={30} color={highlightOrange} />
                                                </TouchableOpacity>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity style={styles.subButton} onPress={() => {toggleModal('M')}}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>

                                <Text style={styles.whiteH2}>Tuesday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'T').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('T')} >
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                                
                                <Text style={styles.whiteH2}>Wednesday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'W').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}

                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('W')}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                            
                                <Text style={styles.whiteH2}>Thursday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'Th').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('Th')}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                            
                                <Text style={styles.whiteH2}>Friday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'F').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('F')}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                            
                                <Text style={styles.whiteH2}>Saturday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'Sa').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('Sa')}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                            
                                <Text style={styles.whiteH2}>Sunday</Text>

                                {exercisePrep && exercisePrep.exercises.filter((exercise) => exercise.day == 'Su').map((exercise) => {
                                    return (
                                        <View style={styles.leftContainerTrans} key={exercise.label}>
                                            <View style={styles.horizontalContainer2}>
                                                <Text style={[styles.h3, {fontWeight: "bold"}]}>{exercise.label}</Text>
                                            </View>
                                            <View style={styles.horizontalContainer2}>    
                                                <Text style={styles.h3}>Sets: {exercise.sets}</Text>
                                                <Text style={styles.h3}>Weight: {exercise.weight}</Text>
                                                <Text style={styles.h3}>Reps: {exercise.reps}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                                <TouchableOpacity style={styles.subButton} onPress={() => toggleModal('Su')}>
                                    <Text style={styles.h3}>+ Add Excerise</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Modal
                        animationType="slide"
                        transparent={true} 
                        visible={newExercise.status}>

                            <KeyboardAwareScrollView 
                                resetScrollToCoords={{ x: 0, y: 0 }}   
                                scrollEnabled={true}>

                                    <View style={styles.modal}>
                                        <ScrollView contentContainerStyle={{alignItems:'center'}}>
                                            <View style={styles.topContainer}>
                                                <TouchableOpacity onPress={() => toggleModal(null)}>
                                                    <MaterialIcons name="close" size={30} color={highlightOrange} />
                                                </TouchableOpacity>

                                                <Text style={styles.h2}>Add Exercise for {newExercise.day}</Text>

                                                {exercisePrep && exercisePrep.error && <Text style={styles.error}>{exercisePrep.error}</Text>}

                                                <TextInput style={styles.input} placeholder="Title" placeholderTextColor={'darkgrey'} onChangeText={(text) => setNewExercise({...newExercise, label: text})}></TextInput>

                                                <View style={styles.horizontalContainer2}>
                                                    <Text style={styles.h3}>Sets: </Text>
                                                    <TextInput style={styles.subInput} keyboardType="number-pad" placeholder="ex... 3" placeholderTextColor={'darkgrey'} onChangeText={(text) => setNewExercise({...newExercise, sets: parseInt(text)})}></TextInput>
                                                </View>

                                                <View style={styles.horizontalContainer2}>
                                                    <Text style={styles.h3}>Weight: </Text>
                                                    <TextInput style={styles.subInput} keyboardType="number-pad" placeholder="ex... 100 lbs" placeholderTextColor={'darkgrey'} onChangeText={(text) => setNewExercise({...newExercise, weight: parseInt(text)})}></TextInput>
                                                </View>

                                                <View style={styles.horizontalContainer2}>
                                                    <Text style={styles.h3}>Reps: </Text>
                                                    <TextInput style={styles.subInput} keyboardType="number-pad" placeholder="ex... 10" placeholderTextColor={'darkgrey'} onChangeText={(text) => setNewExercise({...newExercise, reps: parseInt(text)})}></TextInput>
                                                </View>

                                                <TouchableOpacity style={styles.subButton} onPress={() => addExercise()}>
                                                    <Text style={styles.h3}>+ Add Exercise</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </ScrollView>  
                                    </View>
                            </KeyboardAwareScrollView>                        
                        </Modal>
                    </View>    
            </KeyboardAwareScrollView>
        </BasePage>
    )
}