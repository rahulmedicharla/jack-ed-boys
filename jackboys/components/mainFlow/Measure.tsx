import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { styles, screenWidth, screenHeight, tertairyRed, tertiaryGreen, tertiaryYellow, secondary, white, primary, highlightOrange, specialSalmon, brightYellow, primaryRed, brightRed } from "../Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DisplayEntry, User, addEntry, dbReturnType } from "../../backend/db_helper";
import { Entry } from "../../backend/db_helper";
import moment from "moment";
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from "react-native-gifted-charts";

type MeasureProps = {
    user: User,
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Measure({user, memoizedSetUser}: MeasureProps){

    const [displayEntries, setDisplayEntries] = useState<DisplayEntry[] | null>(null);

    const [newEntry, setNewEntry] = useState<Entry>({
        status: false,
        date: null,
        weight: null
    });
    
    useEffect(() => {
        const displayItems: DisplayEntry[] = [];
        const lastWeek = moment().subtract(7, 'days')

        user.entries.forEach((entry) => {
            if (moment(entry.date).isAfter(lastWeek)){
                displayItems.push({
                    value: parseFloat(entry.weight),
                    label: moment().format("M/DD") != moment(entry.date).format("M/DD") ? moment(entry.date).format("M/DD") : "Today",
                    customDataPoint: customDataPoint
                })
            }
        })

        if(displayItems.length > 0){
            setDisplayEntries(displayItems)
        }

    }, [user])

    const getAverageWeight = () => {
        if (!displayEntries) return 0;
        
        let sum = 0;
        displayEntries.forEach((entry:DisplayEntry) => {
            sum += entry.value;
        })
        return sum / displayEntries.length;
    }

    const handleAddEntry = () => {
        setNewEntry({
            ...newEntry,
            status: true,
        })
    }

    const cancelAddEntry = () => {
        setNewEntry({
            status: false,
            date: null,
            weight: null
        })
    }

    const handleAddEntrySubmit = () => {
        const today = moment().format("MM/DD");
        

        if(displayEntries && displayEntries.some((entry) => entry.label === today)){
            alert("You have already made an entry for today")
            return;
        }
        addEntry(newEntry.weight, user.uid).then((response) => {
            memoizedSetUser({
                ...user,
                entries: [...user.entries, response.data]
            })
        });
        cancelAddEntry();
    }

    const customDataPoint = () => {
        return (
            <View style={{
                width: 15,
                height: 15,
                borderRadius: 10,
                borderWidth: 2,
                backgroundColor: white,
                borderColor: brightRed
            }}>
            </View>
        )
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView  
                resetScrollToCoords={{ x: 0, y: 0 }}   
                scrollEnabled={true}
                >

                <View style={styles.gappedContainer}>
                    <Text style={styles.h2}>Measure weight progress</Text>

                    {displayEntries ? (
                        <LineChart
                            areaChart
                            data={displayEntries}
                            width={.7 * screenWidth}
                            startFillColor1="rgb(256,109,111)"
                            startOpacity1={.6}
                            endFillColor1="rgb(255,109,111)"
                            endOpacity1={.1}
                            curved
                            hideRules
                            showFractionalValues
                            
                            color1={brightRed}
                            xAxisColor={"transparent"}
                            yAxisColor={"transparent"}
                            xAxisLabelTextStyle={{color: "lightgray"}}
                            yAxisTextStyle={{color: "lightgray"}}
                            isAnimated
                            
                            yAxisOffset={getAverageWeight() - 7}
                            maxValue={9}
                            noOfSections={5}
                        />

                    ):(
                        <Text style={styles.h3}>Add your first entry to get started!</Text>
                    )}
               
                    {newEntry.status ? (
                        <View style={styles.horizontalContainer2}>
                            <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => cancelAddEntry()}>
                                <MaterialIcons name="cancel" size={30} color={highlightOrange} />
                            </TouchableOpacity>
                            <TextInput style={styles.subInput} keyboardType="decimal-pad" onChangeText={(text) => {setNewEntry(
                                {
                                    ...newEntry,
                                    weight: text
                                }
                            )}} value={newEntry.weight} placeholder="--- lbs">
                            </TextInput>
                            <TouchableOpacity style={styles.subButton} onPress={() => handleAddEntrySubmit()}>
                                <Text style={styles.subButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.subButton} onPress={() => handleAddEntry()}>
                                <Text style={styles.subButtonText}>+ Add Entry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {displayEntries && displayEntries.map((entry: DisplayEntry, index) => (
                        <View key={index} style={styles.leftContainer}>
                            <Text style={styles.whiteH2}>{displayEntries[displayEntries.length - 1 - index].value} lbs</Text>
                            <Text style={styles.whiteH2}>{displayEntries[displayEntries.length - 1 - index].label}</Text>
                        </View>
                    ))}
                    
                </View>

               
            </KeyboardAwareScrollView>
        </BasePage>
    );
}