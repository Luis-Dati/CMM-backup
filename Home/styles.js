import { StyleSheet, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container:{
		//marginTop:30,
		backgroundColor:'white',
		flex:1,
	},
	image:{
		backgroundColor:'white',
		height:150,
    	justifyContent: 'center',
    	alignItems:'center'
	},
	gridView: {
		//marginTop: 10,
	},
	itemContainer: {
		justifyContent:'center',
		alignItems:'center',
		borderRadius: 20,
	},
	surfaces: {
		width:'30%',
		justifyContent:'center', 
		alignItems:'center',
		borderRadius:10,
	},
})

export default styles