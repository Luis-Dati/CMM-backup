import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	addarea:{
		bottom:70,
		left:30,
	},
	header:{
		fontSize:23,
		textAlign:'center',
		fontWeight:'bold',
	},
	add:{
		width:40,
		height:40,
		borderRadius:20,
		backgroundColor:'yellow',
		// alignItems:'flex-end',
		color:'white',
		textAlign:'center',
		fontSize:28,
	},
	entireView:{
		backgroundColor:'#000000aa',
		flex:1,
	},
	dialog:{
		flex:1,
		backgroundColor:'#FFF',
		borderTopLeftRadius:20,
		borderTopRightRadius:20,
		marginHorizontal:15,
		marginTop:30,
		paddingHorizontal:15,
	},
	labelinput:{
		//marginTop:20,
		color:'gray',
		fontSize:16,
		marginBottom:10,
	},
	numarea:{
		margin:10,
		borderWidth:1,
		padding:10,
		fontSize:16,
		width:'30%'
	},
	inputBox: {
		borderWidth:0.8,
		padding:10,
		borderRadius:5,
		margin:5
	},
	toolTxtBox: {
		backgroundColor:'yellow',
		borderRadius:10,
		borderWidth:1,
		alignItems:'center',
		justifyContent:'center',
		padding:5,
		width:70,
		marginRight:5
	},
	handMBtn:{
		width:45,
		height:45,
		backgroundColor:'blue',
		borderRadius:25,
		justifyContent:'center',
		alignItems:'center',
		marginHorizontal:3
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
	inputBox2:{
		backgroundColor:'#D0D0D0',
		flex:1,
		fontSize:16,
		padding:5
	},
	itemContainer: {
		//justifyContent: 'flex-end',
		backgroundColor:'#D0D0D0',
		justifyContent:'center',
		alignItems:'center',
	}, 
	gridTxt2:{
		borderWidth:1,
		textAlign:'center',
		padding:5,
	},
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
})

export default styles