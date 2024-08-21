import React, { useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity, ImageBackground, View, Text, ActivityIndicator } from 'react-native'
import { SimpleGrid } from 'react-native-super-grid';
import { Surface, Card, Divider, useTheme } from 'react-native-paper';

import styles from './styles'
import { GradeShow } from '../User/Model/Xbxh';
import DATA_URL from '../url.js'

const Sunday = ({ navigation, grade, classList, week }) => {
	const [scoreList, setScoreList] = useState(null)
	const [signal, setSignal] = useState(false)
	var data2 = null;

	const fetchScoreList = async () => {
    try {
      const response = await fetch(DATA_URL+'score/'+week);
      const jsonData = await response.json();
      setScoreList(jsonData);
    } catch (error) {
      
    }
  };

  if (scoreList != null && classList != null) {
 		let dataTemp = JSON.parse(JSON.stringify(scoreList));

 		dataTemp.map((item)=>{
 			let scoreClass = classList.find((item2)=>item2.class_id == item.class_id)
 			item.class_id = scoreClass
 		})
 		data2 = dataTemp
 	}
 	
  useEffect(() => {
  	fetchScoreList()
  }, [signal]);

	return (
		<View>
			<GradeShow navigation={navigation} data2={data2} grade={grade.slice(5)} week={week} fnc={true}/>
		</View>
	)
}

const Grade = ({ navigation, route }) => {
	const theme = useTheme()
	const { grade } = route.params;
	const [classList, setClassList] = useState([])
	const [week, setWeek] = useState(null)

	const fetchWeek = async () => {
		const date = new Date()
		try {
			const response = await fetch(DATA_URL+'week');
			const jsonData = await response.json();
			const temp = jsonData.find(obj => date.toDateString() == add1days(new Date(obj.end_date)).toDateString())
			if (!temp) {
				temp = jsonData.find(obj => date.toDateString() == new Date(obj.end_date).toDateString())				
			}
			if (temp) {
				setWeek(temp.week_id)
			}
			
		} catch (error) {
			
		}
	};	

  const fetchClassList = async () => {
    try {
      const response = await fetch(DATA_URL+'class');
      const jsonData = await response.json();
      setClassList(jsonData);
    } catch (error) {
      
    }
  };

	useEffect(() => {
		fetchClassList()
		fetchWeek()
	}, [])

	const onPress = (classId, className) => {
		navigation.push("Main",{classId:classId,className:className})
	}

	function add1days(item) {
		return new Date(item.getTime() + 24 * 60 * 60 * 1000);
	}

	return (
		<ScrollView style={styles.container}>
			{classList.length != 0
			?	(
					<>
						{week
						?	(
								<Sunday navigation={navigation} grade={grade} classList={classList} week={week} onPress={onPress}/>
							)
						:	(									
								<Card>
									<Card.Title titleVariant="headlineMedium" title="Chọn lớp của bạn" />
									<Divider bold/>
									<Card.Content>		
										<SimpleGrid
										  itemDimension={130}
										  data={classList.filter(obj=>obj.class_id.includes(grade.slice(5)))}
										  spacing={10}
										  renderItem={({ item }) => (
										  	<Surface style={{borderRadius:15,backgroundColor:theme.colors.ownColorContainer}} elevation={3}>
										  		<TouchableOpacity onPress={()=>onPress(item.class_id, item.class_name)} style={[styles.itemContainer]}>
													  <Text style={[styles.itemName,{color:theme.colors.lighterOwnColor}]}>{item.class_name}</Text> 
													</TouchableOpacity>
										  	</Surface>
										  )}
										/>	
									</Card.Content>
								</Card>
							)
						}
					</>
				)
			: (
					<ActivityIndicator size='large' />
				)
			}
			
		</ScrollView>
	)
}

export default Grade