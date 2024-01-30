import { StyleSheet, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
		//marginTop:30,
	},
	userbox:{
		//marginTop:-700,
		//flex:1,
		//marginTop:20,
		height:deviceHeight/10*2.75,
		alignItems:'center',
		backgroundColor:'#1FBFF4',
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-evenly',
		borderBottomRightRadius:20
	},
	icon:{
		borderRadius:100,
		backgroundColor:'white',
		padding:10
	},
	image:{
		width:deviceWidth/100*15,
		height:deviceWidth/100*15,
	},
	grtText:{
		width: '90%',
		fontSize:deviceWidth/100*4.5,
		color:'white',
		fontWeight:'bold'
	},
	greeting:{
	},
	main:{
		flex:1,
		width:'100%'
	},
	fncBox:{
		margin:10,
		flexDirection:'row',
		alignItems:'center',
		height:deviceWidth/4,
		borderRadius:20,
		backgroundColor:'white'
	},
	fncText:{
		fontWeight:'bold',
		fontSize:deviceWidth/100*5,
	},
  	boxWithShadow: {
	    shadowColor: '#000',
	    shadowOffset: { width: 0, height: 1 },
	    shadowOpacity: 0.8,
	    shadowRadius: 10,  
    	elevation: 5
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
	entireView:{
		flex:1,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center'
	},
	dialog:{
		flex:1,
		backgroundColor:'red'
	},
	btn:{
		padding:10,
		fontSize:16,
		backgroundColor:'#6A6ADA',
		color:'white',
		borderRadius:8,
		marginHorizontal:5,
		fontWeight:'bold',
	},
	gridView : {
		// flex:1
	},
	sectionHeader: {
		fontSize: 18,
		fontWeight: '600',
		alignItems: 'center',
		backgroundColor: '#636e72',
		color: 'white',
		padding: 10,
	},
	itemContainer: {
		//justifyContent: 'flex-end',
		justifyContent:'center',
		alignItems:'center',
		height:50,
		padding:5,
		borderRadius:10
	},
	qsTxt:{
		fontSize:16,
		fontWeight:'500'
	},
	header:{
		fontSize:26,
		fontWeight:'bold',
		marginBottom:10,
		textAlign:'center',
	},
})

export default styles