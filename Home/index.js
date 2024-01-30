import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Animated, ImageBackground, Image, TouchableOpacity, View, Text, Button, ScrollView, SafeAreaView } from 'react-native'
import { SimpleGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchSelector from "react-native-switch-selector";

import { ShowCalen } from '../User/Model/Sxlt'
import styles from './styles'
import DATA_URL from '../url.js'

let deviceWidth = Dimensions.get('window').width
//const DATA_URL = 'https://realistic.luis-dati.repl.co/'

const SchoolLevel = ({ level }) => {
  const navigation = useNavigation();

  if (level && level.toLocaleUpperCase().includes('THPT')) {
    let classes = [
      {name: 'Khối 10',img:require('../assets/k10.png')},
      {name: "Khối 11",img:require('../assets/k11.png')},
      {name: 'Khối 12',img:require('../assets/k12.png')},
    ] 
    return (
      <SimpleGrid
        itemDimension={deviceWidth/100*25}
        data={classes}
        style={styles.gridView}
        spacing={10}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>navigation.push('Grade',{grade:item.name})} style={[styles.itemContainer,{borderRadius:20}]}>
            <Image  
              source={item.img} 
              style={{height:deviceWidth/100*25,width:deviceWidth/100*25}}
            />  
          </TouchableOpacity>
        )}
      />
    )
  } 

  if (level && level.toLocaleUpperCase().includes('THCS')) {
    let classes = [
      {name: 'Khối 6', link:'Grade6', img:require('../assets/k6.jpg')},
      {name: "Khối 7", link:'Grade7', img:require('../assets/k7.jpg')},
      {name: 'Khối 8', link:'Grade8', img:require('../assets/k8.jpg')},
      {name: 'Khối 9', link:'Grade9', img:require('../assets/k9.jpg')},
    ]
    return (
      <SimpleGrid
        itemDimension={deviceWidth/100*40}
        data={classes}
        style={styles.gridView}
        //fixed
        spacing={10}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>{console.log(item.link)}} style={[styles.itemContainer]}>
            <Image 
              source={item.img} 
              style={{height:deviceWidth/100*40,width:deviceWidth/100*40}}
            /> 
          </TouchableOpacity>
        )}
      />
    )
  }
}

var item;

const Home = ({ route, navigation }) => {
  const [school, setSchool] = useState()
  const [ltList, setLtList] = useState(null)
  const [week, setWeek] = useState(null)
  const [grade, setGrade] = useState(10)
  const [signal, setSignal] = useState(false)

  const options = [
    { label: "Khối 10", value: '10' },
    { label: "Khối 11", value: '11' },
    { label: "Khối 12", value: '12' }
  ];

  const getSchoolItems = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('UserSchool');
      if (jsonValue !== null) {
        setSchool(jsonValue)
        item = jsonValue
      } else {
        setSchool(route.params.item)
        item = route.params.item
      }
    } catch (e) {
      // error reading value
      
    }
  };

  const fetchWeek = async () => {
    const date = ConvertTime(new Date())
    try {
      const response = await fetch(DATA_URL+'week');
      const jsonData = await response.json();
      setWeek(jsonData.find(obj => ConvertTime(new Date(obj.start_date)) <= date && date <= ConvertTime(new Date(obj.end_date))));
      return true
    } catch (error) {
      
    }
  };  

  const fetchLtList = async () => {
    if (week) {
      try {
        const response = await fetch(DATA_URL+'lichtruc/'+week.week_id);
        const jsonData = await response.json();
        setLtList(jsonData);
        return true
      } catch (error) {
        
      }  
    }
  };

  async function CreateDate() {
    await fetchWeek()
    await fetchLtList()
    setSignal('created')
  }

  useEffect(() => {
    getSchoolItems();
    CreateDate()
  }, [signal]);

  function ConvertTime(item){
    const currentTime = new Date(item);

    // Lấy offset (độ lệch) múi giờ của máy tính địa phương so với UTC
    const localOffset = currentTime.getTimezoneOffset();

    // Tính toán offset (độ lệch) múi giờ từ GMT+0 đến GMT+7 (7 * 60 phút)
    const offsetGMT7 = 7 * 60;

    // Tính toán timestamp mới cho thời gian theo múi giờ GMT+7
    const timestampGMT7 = currentTime.getTime() + localOffset * 60 * 1000 + offsetGMT7 * 60 * 1000;

    // Tạo một đối tượng Date mới từ timestamp đã tính toán
    const date = new Date(timestampGMT7);
    return date;
  }

	return (
    <SafeAreaView style={styles.container}>    
      <ScrollView 
        style={{flex:1}}
        scrollEventThrottle={16}
      >
        
        <View style={styles.main}>  
          <View style={styles.Func}>
            <Text style={styles.textFunc}>Chọn khối của bạn</Text>
            <View style={styles.Func}>
              <SchoolLevel level={school}/>
            </View>    
          </View>

          <View style={styles.Func}>
            <Text style={styles.textFunc}>Xem lịch trực tuần này ({week && week.week_name})</Text>
            <View style={{height:10}} />
            <SwitchSelector
              initial={0}
              onPress={value => setGrade(value)}
              textColor='blue'
              selectedColor='#fff'
              buttonColor='blue'
              borderColor='blue'
              hasPadding
              options={options}
              testID="gender-switch-selector"
              accessibilityLabel="gender-switch-selector"
            />
            <View style={styles.Func}>
              <ShowCalen data={ltList} grade={grade} />
            </View>       
          </View>    
        
        </View>
      </ScrollView>
      {/*<View style={{flex:0.1}}></View>*/}
    </SafeAreaView>
	)
}

export const level = item;
export { Home }