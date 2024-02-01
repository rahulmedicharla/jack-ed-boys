import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

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
const brightRed = "#FF6D6F"

const screenWidth = 390; 
const screenHeight = 844;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    topContainer: {
        flex: 1,
        alignItems: "center",
        margin: 20,
        gap:10
    },

    gappedContainer: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 15,
    },

    leftContainer: {
        flexDirection: "column",
        width: .9 * screenWidth,
        justifyContent: "flex-start",
        margin: 15,
        gap: 15,
        backgroundColor: primaryRed,
        padding: 12,
        borderRadius: 10,
    },

    leftContainerTrans: {
        flexDirection: "column",
        width: .9 * screenWidth,
        justifyContent: "flex-start",
        gap: 15,
        padding: 10,
        borderRadius: 10,
    },

    horizontalContainer: {
        flexDirection: "row",
        width: .9 * screenWidth,
        justifyContent: "space-evenly",
        margin: 15,
        alignItems: "center",
    },

    horizontalContainer2: {
        flexDirection: "row",
        gap: 10,
    },

    h1: {
        fontSize: 41,
        fontWeight: "bold",
        margin: 5,
        color: highlightOrange,
    },

    h2: {
        fontSize: 25,
        color: highlightOrange,
        fontWeight: "bold",
    },

    whiteH2: {
        fontSize: 25,
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
        backgroundColor: highlightOrange,
        borderRadius: 10,
        alignItems: "center",
        padding: 15,
        justifyContent: "center",
    },

    subButtonText: {
        color: white,
        fontSize: 15,
    },

    input: {
        backgroundColor: white,
        padding: 20,
        margin: 10,
        borderRadius: 10,
        width: .8 * screenWidth,
    },

    subInput: {
        backgroundColor: white,
        padding: 15,
        borderRadius: 5,
        width: .45 * screenWidth,
    },

    smallInput: {
        backgroundColor: white,
        padding: 20,
        borderRadius: 5,
        width: .4 * screenWidth,
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
        width: .9 * screenWidth,
        height: .83 * screenHeight,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 25,
        backgroundColor: primary,
        marginTop: 50,
        borderRadius: 20,
    }

});

export {primary, secondary, tertiaryYellow, tertiaryGreen, white, tertairyRed, lightPrimary, dark, primaryRed, highlightOrange, specialSalmon, brightYellow, brightRed}
export {screenWidth, screenHeight}