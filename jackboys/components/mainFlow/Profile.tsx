import React from "react";
import BasePage from "../BasePage";
import {Text, TouchableOpacity} from "react-native";
import {getAuth, signOut} from "firebase/auth";

export default function Profile(){

    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth) 
    }

    return (
        <BasePage>
            <Text>Profile</Text>
            <TouchableOpacity onPress={() => handleLogout()}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </BasePage>
    )
}