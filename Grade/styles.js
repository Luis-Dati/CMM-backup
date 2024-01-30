import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	image:{
		backgroundColor:'white',
		padding: 10,
	    flex: 1,	
	},
	mainText:{
		fontSize:24,
		fontWeight:'bold',
		marginLeft:10, 
		marginBottom:10
	},
	Btn:{
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#EAEAEA',
		marginVertical:10,
		width:90,
		height:90,
		borderRadius:10,
		borderWidth:3,
		borderColor:'lightblue',
	},
	textBtn:{
		textAlign:'center',
		fontSize:24,
		fontWeight:'600',
		color:'#2B2626',
	},
	gridView: {
		//marginTop: 10,
		flex: 1,
	},
	itemContainer: {
		//justifyContent: 'flex-end',
		justifyContent:'center',
		alignItems:'center',
		borderRadius: 20,
		height: 100,
	},
	itemName: {
		fontSize: 22,
		color: 'black',
		fontWeight: '600',
	},
	itemCode: {
		fontWeight: '600',
		fontSize: 12,
		color: '#fff',
	},	
})

export default styles