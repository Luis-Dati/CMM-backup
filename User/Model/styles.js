import React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container:{
		flex:1,
		padding:10,
	},
	qsTxt:{
		fontSize:16,
		fontWeight:'500'
	},

	//Danh sách lớp học
	boxName:{
		flexDirection:'row',
		borderWidth:0.7,
		padding:10,
		alignItems:'center',
		// justifyContent:'space-between'
	},
	inputBox2:{
		backgroundColor:'#D0D0D0',
		flex:1,
		fontSize:16,
		padding:5
	},
	entireView2:{
		flex:1,
		backgroundColor:'white',
		//justifyContent:'center',
		//alignItems:'center'
	},
	entireView:{
		backgroundColor:'#000000aa',
		flex:1,
	},
	dialog:{
		flex:1,
		backgroundColor:'#FFF',
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		marginHorizontal:20,
		marginTop:30,
		paddingHorizontal:20,
	},
	gridView: {
		//marginTop: 10,
		flex:1
	},
	sectionHeader: {
		//flex: 1,
		marginTop:10,
		fontSize: 18,
		fontWeight: '600',
		alignItems: 'center',
		backgroundColor: '#636e72',
		color: 'white',
		padding: 10,
	},
	itemContainer: {
		//justifyContent: 'flex-end',
		backgroundColor:'#D0D0D0',
		justifyContent:'center',
		alignItems:'center',
	},

	//Sổ tay vi phạm
	header:{
		fontSize:26,
		fontWeight:'bold',
		//marginTop:10,
		marginBottom:10,
		textAlign:'center',
	},	
	itemBox:{
		alignItems:'center',
		justifyContent:'center',
		flex:1,
	},
	waitTxt:{
		fontWeight:'bold',
		fontSize:20,
		color:'grey'
	},
	frame:{
		flexDirection:'row',
		justifyContent:'space-between',
		backgroundColor:'white',
		paddingHorizontal:20,
		paddingVertical:15,
		borderRadius:20,
		flex:1,
	},
	delBox:{
		width:50,
		height:50,
		marginLeft:10,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:10,
		borderWidth:1
	},
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width:120,
  },
  filterBox:{
  	backgroundColor:'white', 
  	
  	marginHorizontal:10, 
  	flexDirection:'row', 
  	alignItems:'center', 
  	justifyContent:'space-evenly',
  	shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 5
  },

	//Lichtruc thi đua
	gridTxt2:{
		borderWidth:1,
		textAlign:'center',
		padding:10,
	},
	toolBox:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'lightblue',
		borderRadius:10,
		padding:10
	},

	//Giao uoc thi dua
	toolTxtBox: {
		fontSize:16,
		borderRadius:10,
		borderWidth:1,
		alignItems:'center',
		textAlign:'center',
		padding:5,
		width:70,
		backgroundColor:'yellow',
		marginRight:5
	},
	numarea:{
		margin:10,
		borderWidth:1,
		padding:10,
		fontSize:16,
	},
	inputBox: {
		borderWidth:0.8,
		padding:10,
		borderRadius:5,
		margin:10
	},
	CorD:{
		alignSelf:'flex-end',
		flexDirection:'row',
		right:35,
		bottom:45,
		justifyContent:'space-between',
	},

})

export default styles