import { useState } from "react"
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { highlightOrange, styles } from "../../Styles";
import { FontAwesome } from '@expo/vector-icons';

type RadioMainProps = {
    measures: {
        uri?: string,
        label?: string,
    }[],
    currentlySelected: string,
    onChange: (index: number) => void,
}

export default function RadioMain({measures, currentlySelected, onChange}: RadioMainProps){
    const [selected, setSelected] = useState<string>(currentlySelected);

    const handleChange = (index, item) => {
        setSelected(item.label)
        onChange(index)
    }

    return (
        <>
            {measures.map((item, index) => {
                return (
                    <TouchableOpacity style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20
                    }} key={index} onPress={() => handleChange(index, item)}>
                        {selected == item.label ? <FontAwesome name="circle" size={24} color={highlightOrange} /> : <FontAwesome name="circle-o" size={24} color={highlightOrange} />}
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </>
    )

}