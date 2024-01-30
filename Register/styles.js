import React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container:{
		flex:1,
		padding:15
	},
	boxName:{
		flexDirection:'row',
		borderWidth:0.7,
		padding:10,
		alignItems:'center',
		// justifyContent:'space-between'
	},
	qsTxt:{
		fontSize:16,
		fontWeight:'500'
	},
	inputBox:{
		backgroundColor:'#D0D0D0',
		flex:1,
		fontSize:16,
		padding:5
	}
})

export default styles