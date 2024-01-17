import { StyleSheet } from "react-native";

const primary = "#362F44";
const tertiaryYellow = "#FFFFFF";
const tertiaryGreen = "#B5E47C";
const tertairyRed = "#D34040";
const lightPrimary = "#5e5869";

const white = "#FFFFFF";

const secondary = "#FFA87D";
const dark = "#6D6875"
const primaryRed = "#B5838D"
const highlightOrange = "#D69AA6" 
const specialSalmon = "#FFB4A2"
const brightYellow = "#FFCDB2"
const brightRed = "FF6D6F"

const screenWidth = 390; 
const screenHeight = 844;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    gappedContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftContainer: {
        flexDirection: "column",
        width: .9 * screenWidth,
        justifyContent: "flex-start",
        margin: 15,
        gap: 15,
        backgroundColor: tertiaryGreen,
        padding: 12,
        borderRadius: 10,
    },

    horizontalContainer: {
        flexDirection: "row",
        width: .9 * screenWidth,
        justifyContent: "space-evenly",
        margin: 15,
        alignItems: "center",
    },

    h1: {
        fontSize: 41,
        fontWeight: "bold",
        margin: 5,
        color: highlightOrange,
    },

    h2: {
        fontSize: 20,
        color: white,
        fontWeight: "bold",
    },

    h3: {
        fontSize: 15,
        color: white,
        margin: 5,
        justifyContent: 'center',
        lineHeight: 20,
    },


    button: {
        backgroundColor: highlightOrange,
        width: .7 * screenWidth,
        alignItems: "center",
        padding: 30,
        margin: 20,
        borderRadius: 15,
    },

    subButton: {
        backgroundColor: secondary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },

    subButtonText: {
        color: white,
        fontSize: 15,
    },

    input: {
        backgroundColor: white,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        width: .8 * screenWidth,
    },

    subInput: {
        backgroundColor: white,
        padding: 15,
        borderRadius: 5,
        width: .45 * screenWidth,
    },

    error: {
        color: secondary,
    },

    image: {
        width: 250,
        height: 250,
    },

    grayColor: {
        color: 'lightgray',
    },

    modal: {
        width: .8 * screenWidth,
        height: .8 * screenHeight,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: lightPrimary,
        marginTop: 50,
        borderRadius: 20,
    }

});

export {primary, secondary, tertiaryYellow, tertiaryGreen, white, tertairyRed, lightPrimary, dark, primaryRed, highlightOrange, specialSalmon, brightYellow, brightRed}
export {screenWidth, screenHeight}