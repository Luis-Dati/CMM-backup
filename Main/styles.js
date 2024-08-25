import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding:10,
    backgroundColor: '#fff',
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
  gridTxtQs:{
    fontSize:16,
    fontWeight:'500',
    borderWidth:1,
    textAlign:'center',
    padding:5,
    flex: 1,
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
    paddingHorizontal: 5,
  },
  filterBox:{  
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-evenly',
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    width:'100%',
  },
})

export default styles