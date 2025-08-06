import React from 'react'
import { View , Text , StyleSheet , Dimensions} from 'react-native'

const {height, width} = Dimensions.get("window");

const Add = () => {
  return (
    <View style={style.container}>
        <Text>Add</Text>
    </View>
  )
}

export default Add
// "#F1F4FF"
const style=StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: width * 0.04,
        marginHorizontal: width * 0.09,
        marginVertical: height * 0.2,
        shadowColor: "gray",
        shadowOffset: {    
            width: 0,
            height: height * 0.004
        },
        shadowOpacity: 0.3, 
        shadowRadius: width * 0.01,
        elevation: 8, 
    }
});