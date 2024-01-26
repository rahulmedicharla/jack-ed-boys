import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { foodItem } from '../../../backend/db_helper';

type SearchResultProps = {
    result: foodItem,
    selectItem: (item: foodItem) => void
}

export default function SearchResult({result, selectItem}: SearchResultProps){

    return (
        <TouchableWithoutFeedback onPress={() => selectItem(result)}>
                <View style={{
                backgroundColor: "white",
                padding: 10,
                justifyContent: "center",
            }}>
                <View style={{borderTopWidth: 1, borderTopColor: 'lightgray'}} />
                <Text>{result.label}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}