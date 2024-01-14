import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import BasePage from "../BasePage";
import { styles, screenWidth, screenHeight, tertairyRed, tertiaryGreen, tertiaryYellow, secondary, white, primary } from "../Styles";
import { LineChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { addEntry, retreiveEntries } from "../../backend/db_helper";

export default function Measure(){

    const [labels, setLabels] = useState<string[]>();
    const [weights, setWeights] = useState();

    const [newEntryVisible, setNewEntryVisible] = useState(false);
    const [newEntryWeight, setNewEntryWeight] = useState("");

    useEffect(() => {
        const relativeLabels = []
        for (let i = -6; i <= 3; i++){
            const data = new Date();
            data.setDate(data.getDate() + i);
            
            relativeLabels.push((data.getMonth() + 1) + "/" + data.getDate());
        }

        retreiveEntries().then((entries) => {
            setWeights(entries);
        })

        setLabels(relativeLabels);
    }, [])

    const handleAddEntry = () => {
        setNewEntryVisible(true);
    }

    const handleAddEntrySubmit = () => {
        addEntry(newEntryWeight);
        setNewEntryWeight("");
        setNewEntryVisible(false);
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView  
                resetScrollToCoords={{ x: 0, y: 0 }} 
                contentContainerStyle={styles.container}
                scrollEnabled={false}>
                
                <Text style={styles.h1}>Measure weight progress</Text>
                
                <LineChart
                    data={{
                    labels: labels!,
                    datasets: [
                        {
                        data: [
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]
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

                {newEntryVisible ? (
                    <View style={styles.rightContainer}>
                        <TextInput style={styles.subInput} keyboardType="decimal-pad" onChangeText={(text) => setNewEntryWeight(text)} value={newEntryWeight} placeholder="--- lbs">
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