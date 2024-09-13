import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Pressable, Dimensions, Animated, ImageBackground, Image, TouchableOpacity, View, Text, Button, ScrollView, SafeAreaView } from 'react-native'
import { SimpleGrid } from 'react-native-super-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchSelector from "react-native-switch-selector";
import { useTheme, Card, Avatar, Divider, DataTable, Surface } from 'react-native-paper';

import { ConvertTime, FormatDate } from '../toolkit.js';
import { ShowCalen } from '../User/Model/Sxlt'
import styles from './styles'
import { DATA_URL, API_KEY } from '../url.js';

let deviceWidth = Dimensions.get('window').width

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
				spacing={0}
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
	const theme = useTheme();
	const [school, setSchool] = useState()
	const [ltList, setLtList] = useState(null)
	const [week, setWeek] = useState(null)
	const [grade, setGrade] = useState(10)
	const [signal, setSignal] = useState(false)
	const [cellWidth, setCellWidth] = useState(0)

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

	const date = ConvertTime(new Date());

	const fetchWeek = async () => {		
		try {
			const response = await fetch(DATA_URL+'week', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
			const jsonData = await response.json();
			setWeek(jsonData.find(obj => ConvertTime(new Date(obj.start_date)) <= date && date <= ConvertTime(new Date(obj.end_date))));
			return true
		} catch (error) {
			
		}
	};  

	const fetchLtList = async () => {
		if (week) {
			try {
				const response = await fetch(DATA_URL+'lichtruc/'+week.week_id, {
				  method: 'GET',
				  headers: {
				    'api-key': API_KEY,
				  }
				});
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

	return (
		<SafeAreaView style={styles.container}>    
			<ScrollView 
				style={{flex:1}}
				scrollEventThrottle={16}
				contentContainerStyle={{margin:10}}
			>  
					<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
						<Card.Title title='Các khối học' titleVariant='titleLarge' />
						<Card.Content style={{flexDirection:'row',justifyContent:'space-between'}}>
							{/*<SchoolLevel level={school}/>*/}
							
							<Surface 
								style={[styles.surfaces,{height: cellWidth}]} elevation={3}
								onLayout={(event) => setCellWidth(event.nativeEvent.layout.width)}
								>
								<Pressable onPress={()=>navigation.push('Grade',{grade:'Khối 10'})}>
									<Image source={require('../assets/10.png')} style={{height:cellWidth,width:cellWidth,borderRadius:10}} blurRadius={1}/>
								</Pressable>
							</Surface>

							<Surface style={[styles.surfaces,{height: cellWidth}]} elevation={3}>
								<Pressable onPress={()=>navigation.push('Grade',{grade:'Khối 11'})}>
									<Image source={require('../assets/11.png')} style={{height:cellWidth,width:cellWidth,borderRadius:10}} blurRadius={1}/>
								</Pressable>
							</Surface>

							<Surface style={[styles.surfaces,{height: cellWidth}]} elevation={3}>
								  <Pressable onPress={()=>navigation.push('Grade',{grade:'Khối 12'})}>
									<Image source={require('../assets/12.png')} style={{height:cellWidth,width:cellWidth,borderRadius:10}} blurRadius={1}/>
								</Pressable>
							</Surface>

						</Card.Content>
					</Card>

					<View style={{height:10}}/>
					
					<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
						<Card.Title 
							title={`Lịch trực ${week ? week.week_name : '...'}`} 
							titleVariant='titleLarge' 
							subtitle={`Thứ ${date.getDay()+1}, ${date.getDate()} thg ${date.getMonth()+1}, ${date.getFullYear()}`} 
						/>
						<Divider />
						<Card.Content>
							<SwitchSelector
								initial={0}
								onPress={value => setGrade(value)}
								textColor='#1FBFF4'
								selectedColor='#fff'
								buttonColor='#1FBFF4'
								borderColor='#1FBFF4'
								hasPadding
								options={options}
								testID="gender-switch-selector"
								accessibilityLabel="gender-switch-selector"
							/>

							<ShowCalen data={ltList} grade={grade} />
						</Card.Content>
					</Card>   

					<View style={{height:15}}/>
				
			</ScrollView>
		</SafeAreaView>
	)
}

export const level = item;
export { Home }