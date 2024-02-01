import React, { useState } from "react";
import { TextInput, TouchableWithoutFeedback, View, Text } from "react-native";
import { highlightOrange, screenWidth, styles, white } from "../../Styles";
import { AntDesign } from '@expo/vector-icons';
import SearchResult from "./individualSearchResult";
import { dbReturnType, foodItem, getFoodList } from "../../../backend/db_helper";
import RadioMain from "../RadioSelection/radioMain";


export default function SearchMain({newEntry, setNewEntry}) {

    const [searchValue, setSearchValue] = useState<{
        value: string,
        results: foodItem[],
        uniqId?: string,
        quantity?: string,
        measureUri?: string,
        measures?: {
            uri?: string,
            label?: string,
        }[],
        unit?: string,
    }>({
        value: "",
        results: [],
        unit: "Serving",
    })

    const selectItem = (item: foodItem) => {   
        setSearchValue({
            ...searchValue,
            value: item.label,
            uniqId: item.uniqId,
            measures: item.measures,
            results: []
        })
        setNewEntry({
            label: item.label,
            uniqId: item.uniqId,
            measureUri: item.measures[0].uri,
            unit: item.measures[0].label,
        })
    }

    const handleSearch = () => {
        getFoodList(searchValue.value).then((res: dbReturnType) => {
            if(res.error) return;
            setSearchValue({
                ...searchValue,
                results: res.data,
            })
        })
    }

    const handleSelectMeasure = (index: number) => {
        setNewEntry({
            ...newEntry,
            measureUri: searchValue.measures[index].uri,
            unit: searchValue.measures[index].label,
        })
    }

    return (
        <View style={{
            backgroundColor: "white",
            padding: 15,
            borderRadius: 10,
        }}>
            <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            }}>
                <TextInput value={searchValue.value} placeholderTextColor={"lightgray"} placeholder="Enter food item here" onChangeText={(text) => setSearchValue({
                    ...searchValue,
                    value: text
                })} style={{
                    padding: 5,
                    backgroundColor: "white",
                    width: screenWidth * .65,
                }}></TextInput>

                {searchValue.results.length > 0 ? (
                    <AntDesign name="caretdown" size={24} color="lightgray" />
                ):(
                    <TouchableWithoutFeedback onPress={() => handleSearch()}>
                        <AntDesign name="search1" size={24} color="lightgray" />
                    </TouchableWithoutFeedback>
                )}

            </View>

            {searchValue.results.length > 0 && searchValue.results.map((result, index) => {
                return (
                    <SearchResult key={index} result={result} selectItem={selectItem}/>
                )
            })}

            {searchValue.uniqId && newEntry ? (
                <View style={{gap: 10, margin: 10}}>
                    <View style={{borderTopColor: "lightgray", borderTopWidth: 1}}></View>
                    <Text>Select unit of measure & quantity</Text>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                        <TextInput value={newEntry.quantity} onChangeText={(value) => setNewEntry({...newEntry, quantity: value})} keyboardType="decimal-pad" placeholder="Ex... 1" placeholderTextColor={"gray"} style={{padding: 15, backgroundColor: "lightgray", borderRadius: 10 ,width: .20 * screenWidth}}></TextInput>
                        <Text>{searchValue.unit}</Text>
                    </View>

                   <RadioMain measures={searchValue.measures} currentlySelected={searchValue.unit} onChange={handleSelectMeasure} />
                   
                </View>
            ):null}

        </View>
    )
}