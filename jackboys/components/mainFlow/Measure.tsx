import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { styles, screenWidth, screenHeight, tertairyRed, tertiaryGreen, tertiaryYellow, secondary, white, primary } from "../Styles";
import { LineChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DisplayEntry, User, addEntry, dbReturnType } from "../../backend/db_helper";
import { Entry } from "../../backend/db_helper";
import moment from "moment";

type MeasureProps = {
    user: User,
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Measure({user, memoizedSetUser}: MeasureProps){

    const [displayEntries, setDisplayEntries] = useState<DisplayEntry>(null);

    const [newEntry, setNewEntry] = useState<Entry>({
        status: false,
        date: null,
        weight: null
    });
    
    useEffect(() => {
        const currentLabels = [];
        const currentWeights = [];
        const lastWeek = moment().subtract(7, 'days')

        user.entries.forEach((entry) => {
            if (moment(entry.date).isAfter(lastWeek)){
                currentLabels.push(moment(entry.date).format("MM/DD"))
                currentWeights.push(entry.weight)
            }
        })

        setDisplayEntries({
            date: currentLabels,
            weight: currentWeights
        })

    }, [user])

    const handleAddEntry = () => {
        setNewEntry({
            ...newEntry,
            status: true,
        })
    }

    const handleAddEntrySubmit = () => {
        addEntry(newEntry.weight, user.uid).then((response) => {
            memoizedSetUser({
                ...user,
                entries: [...user.entries, response.data]
            })
        });
        setNewEntry({
            status: false,
            date: null,
            weight: null
        })
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView  
                resetScrollToCoords={{ x: 0, y: 0 }} 
                contentContainerStyle={styles.container}
                scrollEnabled={false}>
                
                <Text style={styles.h1}>Measure weight progress</Text>
                
                {displayEntries ? (
                    <LineChart
                    data={{
                    labels: displayEntries.date,
                    datasets: [
                        {
                        data: displayEntries.weight
                        }
                    ]
                    }}
                    width={.9 * screenWidth}
                    height={.4 * screenHeight}
                    yAxisSuffix=" lbs"
                    chartConfig={{
                    backgroundGradientFrom: tertiaryYellow,
                    backgroundGradientTo: tertiaryGreen,
                    decimalPlaces: 1, // optional, defaults to 2dp
                    color: (opacity = 1) => primary,
                    labelColor: (opacity = 1) => primary,
                    style: {
                        borderRadius: 10
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: primary,
                        fill: primary
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 10
                    }}
                />
                ):null}

                {newEntry.status ? (
                    <View style={styles.rightContainer}>
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
                    <View style={styles.rightContainer}>
                        <TouchableOpacity style={styles.subButton} onPress={() => handleAddEntry()}>
                            <Text style={styles.subButtonText}>+ Add Entry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </BasePage>
    );
}