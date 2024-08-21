import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container:{
		backgroundColor:'white',
		padding: 10,
	    flex: 1,	
	},
	gridView: {
		//marginTop: 10,
		//flex: 1,
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
	surfaces: {
		borderRadius:15,
	},
})

export default styles