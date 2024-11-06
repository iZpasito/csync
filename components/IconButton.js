
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

function IconButton(props){
    return (
        <Pressable style={styles.container}>
            <Ionicons 
                name={props.name} 
                size={24} 
                color={props.color}
                onPress={props.onPress}
                />
        </Pressable>
    )
}

export default IconButton;

const styles=StyleSheet.create({
    container:{
        marginRight:16
    }
})