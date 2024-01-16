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

                <View style={styles.container}>
                    <Text style={styles.h1}>Welcome, {user.username}</Text>

                    {user.openaikey ? (
                        <View style={styles.container}>
                            <Text style={styles.h2}>Your openaikey: {user.openaikey.substring(0,6) + "..."}</Text>
                            <Text style={styles.h2}>Change key below</Text>
                            <View style={styles.rightContainer}>
                                <TextInput style={styles.subInput} onChangeText={(text) => {setOpenaiKey(text)}} value={openaikey} placeholder="Sx-..."></TextInput>
                                <TouchableOpacity style={styles.subButton} onPress={() => handleOpenaiKeyChange()}>
                                    <Text style={styles.subButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ):(
                        <View style={styles.container}>
                            <Text style={styles.h2}>Set your openaikey key below</Text>
                            <View style={styles.rightContainer}>
                                <TextInput style={styles.subInput} onChangeText={(text) => {setOpenaiKey(text)}} value={openaikey} placeholder="Sx-..."></TextInput>
                                <TouchableOpacity style={styles.subButton} onPress={() => handleOpenaiKeyChange()}>
                                    <Text style={styles.subButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    
                    
                    <TouchableOpacity style={styles.button} onPress={() => logout()}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAwareScrollView>
        </BasePage>
    )
}