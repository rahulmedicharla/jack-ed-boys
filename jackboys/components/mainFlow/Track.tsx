import React, { Dispatch, SetStateAction } from "react";
import BasePage from "../BasePage";
import { Text, TextInput, View } from "react-native";
import { User } from "../../backend/db_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../Styles";

type TrackProps = {
    user: User
    memoizedSetUser: Dispatch<SetStateAction<User>>
}

export default function Track({user, memoizedSetUser}: TrackProps){
    return (
        <BasePage>
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}   
            scrollEnabled={true}>

                <View style={styles.container}>
                    {user.calorieInformation ? (
                        <></>
                    ):(
                        <View style={styles.container}>
                            <Text style={styles.h2}>You have not entered any info yet</Text>
                            <Text style={styles.h2}>Please enter your information below</Text>

                            
                        </View>
                    )}

                </View>

            </KeyboardAwareScrollView>
        </BasePage>
    )
}