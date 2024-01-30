import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container:{
		marginTop:-45,
		width:'100%',
		height:230,
		alignItems:"center",
		justifyContent:'center',
	},
	imgBox:{
		borderWidth:1,
		borderColor:'white',
		padding:10,
		borderRadius:30,
		backgroundColor:'gray'
	},
	usrTxt:{
		color:'white',
		fontSize:20,
		fontWeight:'bold'
	},
	wclTxt:{
		paddingHorizontal:10,
		fontSize:20,
		textAlign:'center'
	},
	entireView:{
		backgroundColor:'#000000aa',
		flex:1,
	},
	dialog:{
		backgroundColor:'#FFF',
		width:'80%',
		height:400,
		padding:10,
		borderColor:'black',
		borderWidth:1,
		borderRadius:10
	},
	changePass:{
		flex:1,
		justifyContent:'space-around'
	}
})

export default styles