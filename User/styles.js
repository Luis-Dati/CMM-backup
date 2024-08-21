import { StyleSheet, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'white',
		padding:10,
	},
	entireView2:{
		backgroundColor:'#000000aa',
		flex:1,
	},
	dialog2:{
		flex:1,
		backgroundColor:'#FFF',
		borderRadius:20,
		height:100,
		marginHorizontal:20,
		marginVertical:30,
		paddingHorizontal:20,
		paddingVertical:20,
	},
	sectionHeader: {
		fontSize: 18,
		fontWeight: '600',
		alignItems: 'center',
		backgroundColor: '#636e72',
		color: 'white',
		padding: 10,
	},
	header:{
		fontSize:26,
		fontWeight:'bold',
		marginBottom:10,
		textAlign:'center',
	},
	dropdown: {
		height: 50,
		borderColor: 'black',
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
		width: 200,
	},
})

export default styles