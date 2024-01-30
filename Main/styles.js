import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
  },
  header:{
    fontSize:27,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:5
  },	
  itemBox:{
    alignItems:'center',
    justifyContent:'center',
    flex:1,
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
  gridTxt2:{
    borderWidth:1,
    textAlign:'center',
    padding:5,
  },
  entireView:{
    backgroundColor:'#000000aa',
    flex:1,
  },
  qsTxt:{
    fontSize:16,
    fontWeight:'500'
  },
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width:100,
  },
  filterBox:{
    backgroundColor:'white', 
    width: 200,
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
    marginBottom: 10
  },
})

export default styles