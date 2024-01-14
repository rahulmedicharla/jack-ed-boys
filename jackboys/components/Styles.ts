import { StyleSheet } from "react-native";

const primary = "#362F44";
const secondary = "#FFA87D";
const tertiaryYellow = "#FFFCC7";
const tertiaryGreen = "#B5E47C";
const tertairyRed = "#D34040";

const white = "#FFFFFF";

const screenWidth = 390; 
const screenHeight = 844;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
        alignItems: "center",
        justifyContent: "center",
    },

    rightContainer: {
        flexDirection: "row",
        width: .9 * screenWidth,
        justifyContent: "flex-end",
        margin: 15,
        gap: 15,
    },

    h1: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: white,
    },
    button: {
        backgroundColor: secondary,
        width: .7 * screenWidth,
        alignItems: "center",
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },

    subButton: {
        backgroundColor: secondary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },

    buttonText: {
        color: white,
        fontSize: 20,
    },

    subButtonText: {
        color: white,
        fontSize: 15,
    },

    input: {
        backgroundColor: tertiaryYellow,
        padding: 20,
        margin: 20,
        borderRadius: 5,
        width: .8 * screenWidth,
    },

    subInput: {
        backgroundColor: white,
        padding: 10,
        borderRadius: 5,
        width: .63 * screenWidth,
    },

    error: {
        color: secondary,
    },

    image: {
        width: 250,
        height: 250,
    },

});

export {primary, secondary, tertiaryYellow, tertiaryGreen, white, tertairyRed}
export {screenWidth, screenHeight}