import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	image:{
		backgroundColor:'white',
		width:'100%',
	    flex: 2,
    	justifyContent: 'center',
		alignItems:'center',
	},
	dialog:{
    	// justifyContent: 'center',
		// alignItems:'center',	
		backgroundColor: 'transparent',
		marginTop:-30
	},
	header:{
		fontSize:25
	},
	loginbox:{
		marginTop:10,
		padding:15
	},
	input:{
		borderBottomWidth:1,
		fontSize:16,
		marginBottom:5
	},
	loginBtn:{
		width:115,
		height:50,
		justifyContent:'center',
		alignItems:'center',		
		borderRadius:10,
		marginTop:20,
	},
	login:{
		paddingTop:20,
		paddingBottom:30,
		fontSize:30, 
		color:'white',
		fontWeight:'bold'		
	},
	form:{
		//flex:1,
		backgroundColor:'transparent',
		justifyContent:'center',
		alignItems:'center'
	},
	boxQs:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',	
		borderBottomWidth:1, 
		borderColor:'white',
		marginBottom:0			
	},
	textForm:{
		padding: 10,  
		fontSize:17, 
		color:'white',
		fontWeight:'bold',
		width:'47%',
	},
	regisTxt:{
		textAlign:'center',
		fontSize:16,
		fontWeight:'500',
		color:'white'
	},
	dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 160
  },
})

export default styles