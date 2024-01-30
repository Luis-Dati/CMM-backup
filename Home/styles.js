import { StyleSheet, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container:{
		//marginTop:30,
		backgroundColor:'white',
		flex:1,
	},
	main:{
		margin:15,
		flex:1
	},
	image:{
		//opacity:0.1,
		backgroundColor:'white',
		//width:'100%',
		height:150,
    	justifyContent: 'center',
    	alignItems:'center'
	},
	welcome:{
		textAlign:'center',
		fontSize:30,
		fontWeight:'bold',	
	},
	block:{
		borderWidth:1,
		borderColor:'gray',
		borderRadius:20,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
	},
	name:{
		fontSize:16,
		fontWeight:'bold',
		color:'green',
		padding:20
	},
	Func:{
		marginTop:5,
		// backgroundColor:'blue'
	},
	boxFunc1:{
		margin:10,
		flexDirection:'row',
		justifyContent:"space-around",
	},
	textFunc:{
		fontSize:22,
		fontWeight:'bold',
	},
	gridView: {
		//marginTop: 10,
	},
	itemContainer: {
		//justifyContent: 'flex-end',
		justifyContent:'center',
		alignItems:'center',
		borderRadius: 20,
		//height: 100,
	},
	itemName: {
		fontSize: 20,
		color: 'black',
		fontWeight: '600',
	},
	lichtruc: {
		borderWidth:1,
		flexDirection:'row',
		justifyContent:'space-around',
		borderRadius:0,
	},
})

export default styles