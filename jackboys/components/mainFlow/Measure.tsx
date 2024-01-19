import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { styles, screenWidth, screenHeight, tertairyRed, tertiaryGreen, tertiaryYellow, secondary, white, primary, highlightOrange, specialSalmon, brightYellow, primaryRed, brightRed } from "../Styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DisplayEntry, User, addEntry, dbReturnType } from "../../backend/db_helper";
import { Entry } from "../../backend/db_helper";
import moment from "moment";
import { MaterialIcons } from '@expo/vector-icons';
import { LineChart } from "react-native-chart-kit";

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
                    label: moment(entry.date).format("MM/DD"),
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
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 4,
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
                        data={{
                            labels: Object.values(displayEntries).map((entry) => entry.label),
                            datasets: [
                            {
                              data: Object.values(displayEntries).map((entry) => entry.value),
                            }
                          ]
                        }}
                        width={.9 * screenWidth} // from react-native
                        height={.3 * screenHeight}
                        yAxisInterval={4} // optional, defaults to 1
                        withHorizontalLines={false}
                        chartConfig={{
                          decimalPlaces: 1, // optional, defaults to 2dp
                          backgroundGradientFrom: "white",
                          backgroundGradientFromOpacity: .2,
                          backgroundGradientToOpacity: .2,
                          backgroundGradientTo: "white",


                          fillShadowGradientFrom: "rgb(255,109,111)",
                          fillShadowGradientFromOpacity: 1,
                          fillShadowGradientTo: "rgb(255,109,111)",
                          fillShadowGradientToOpacity: 0,

                          
                          color: (opacity = 1) => "white",
                          labelColor: (opacity = 1) => `lightgray`,
                          style: {
                            borderRadius: 16,
                          },
                          propsForDots: {
                            r: "8",
                            strokeWidth: "2",
                            stroke: brightRed
                          }
                        }}
                        bezier
                        style={{
                          marginVertical: 8,
                          borderRadius: 16,
                          shadowColor: "black",
                            shadowOffset: {
                                width: -10,
                                height: 10,
                            },
                            shadowOpacity: .5,
                            shadowRadius: 5,

                        }}
                      />

                    ):(
                        <Text style={styles.h3}>Add your first entry to get started!</Text>
                    )}
               
                    {newEntry.status ? (
                        <View style={styles.horizontalContainer2}>
                            <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => cancelAddEntry()}>
                                <MaterialIcons name="cancel" size={30} color={secondary} />
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
                            <Text style={styles.h2}>{displayEntries[displayEntries.length - 1 - index].value}</Text>
                            <Text style={styles.h2}>{displayEntries[displayEntries.length - 1 - index].label} lbs</Text>
                        </View>
                    ))}
                    
                </View>

               
            </KeyboardAwareScrollView>
        </BasePage>
    );
}