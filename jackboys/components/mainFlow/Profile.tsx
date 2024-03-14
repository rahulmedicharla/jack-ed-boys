import React, { Dispatch, SetStateAction, useState } from "react";
import BasePage from "../BasePage";
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {getAuth, signOut} from "firebase/auth";
import { secondary, styles } from "../Styles";
import { User, dbReturnType, updateOpenaiKey } from "../../backend/db_helper";
import { logout } from "../../backend/auth_helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from '@expo/vector-icons';


type ProfileProps = {
    user: User
    memoizedSetUser: Dispatch<SetStateAction<User>>   
}

export default function Profile({user, memoizedSetUser}: ProfileProps){

    const [openaikey, setOpenaiKey] = useState<string>(user.openaikey);
    const [error, setError] = useState<string|null>(null);

    const handleOpenaiKeyChange = () => {
        updateOpenaiKey(user.uid, openaikey).then((response: dbReturnType) => {
            if(response.status === "success"){
                memoizedSetUser({
                    ...user,
                    openaikey: openaikey
                })
                setError(null)
            }else{
                setError(response.error)
            }

        })
    }

    return (
        <BasePage>
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}   
                scrollEnabled={true}>

                <View style={styles.gappedContainer}>
                    <Text style={styles.h2}>Welcome, {user.username}</Text>
                    
                    <TouchableOpacity style={styles.subButton} onPress={() => logout()}>
                        <Text style={styles.h3}>Sign Out</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAwareScrollView>
        </BasePage>
    )
}