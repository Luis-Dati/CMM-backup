import React, { useState, useEffect } from 'react';
import { FlatList, Alert, SafeAreaView, ScrollView, View, Text, Button, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NumericInput from 'react-native-numeric-input';

import styles from './styles'
import DATA_URL from '../../url.js'

const Qllt = () => {
	const [show, setShow] = useState(false)
	const [weekList, setWeekList] = useState(null)
	const [modal, setModal] = useState(false)
	const [newModal, setNewModal] = useState(false)
	const [idWeek, setIdWeek] = useState('')
	const [signal, setSignal] = useState(false)
	const [newNum, setNewNum] = useState(0)

	const [showStart, setShowStart] = useState(false)
	const [showEnd, setShowEnd] = useState(false)	
	const [dateStart, setDateStart] = useState(new Date())
	const [dateEnd, setDateEnd] = useState(new Date())

	const fetchWeekList = async () => {
		try {
			const response = await fetch(DATA_URL+'week');
			const jsonData = await response.json();
			setWeekList(jsonData);
		} catch (error) {

		}
	};

	async function HandleChange () {
		setModal(false)
		let week = {
			week_id: idWeek,
			start_date: dateStart.toDateString(),
			end_date: dateEnd.toDateString()
		}
		
		const response = await fetch(DATA_URL+'week', {
	    method: 'PUT',
	    headers: {
	    	'Accept': 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify(week),
	  });

	  if (response.status === 200) {
	    Alert.alert('Thông báo', 'Chỉnh sửa thành công',[
    		{text:'OK',onPress:()=>setSignal(week)}
    	])
	  } else {
	  	Alert.alert('Chỉnh sửa thất bại')
	  }	
	}

	async function HandleCreate () {
		setNewModal(false)
		let newWeek = {
			week_id: 'wk'+(newNum < 10 ? '0'+newNum : newNum),
			week_name: 'Tuần '+(newNum < 10 ? '0'+newNum : newNum),
			start_date: dateStart.toDateString(),
			end_date: dateEnd.toDateString()
		}
		
		const response = await fetch(DATA_URL+'week', {
	    method: 'POST',
	    headers: {
	    	'Accept': 'application/json',
	      'Content-Type': 'application/json',
	    },
	    body: JSON.stringify(newWeek),
	  });

	  if (response.status === 200) {
	    Alert.alert('Thông báo', 'Thêm mới thành công',[
    		{text:'OK',onPress:()=>setSignal(newWeek)}
    	])
	  } else {
	  	Alert.alert('Thêm mới thất bại')
	  }	
	}

	useEffect(() => {
		fetchWeekList()
	}, [signal])
	
	const onChangeStart = (event, selectedDate) => {
		// const currentDate = ConvertTime(selectedDate);
		const currentDate = new Date(selectedDate.toDateString('en'))
		setShowStart(false);
		setDateStart(currentDate);
		setDateEnd(add7days(currentDate))
	};

	const onChangeEnd = (event, selectedDate) => {
		// const currentDate = ConvertTime(selectedDate);
		const currentDate = new Date(selectedDate.toDateString('en'))
		setShowEnd(false);
		setDateEnd(currentDate)
	};

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

	function FormatDate(item){
		const formatter = new Intl.DateTimeFormat('vi-VN', {
			weekday: 'long',     // Ngày trong tuần, ví dụ: Thứ Hai
			year: 'numeric',     // Năm, ví dụ: 2023
			month: 'long',       // Tháng, ví dụ: Tháng Tám
			day: 'numeric',      // Ngày trong tháng, ví dụ: 2
		});

		const date = new Date(item)
		return formatter.format(date);
	}

	function add7days(item) {
		return new Date(item.getTime() + 7 * 24 * 60 * 60 * 1000);
	}
	
	return (
		<View style={styles.container}>	
			<View style={{flexDirection:'row'}}>
				<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:0.4}]}>Tuần</Text>
				<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Ngày bắt đầu</Text>
				<Text style={[styles.qsTxt,styles.gridTxt2,{fontWeight:'bold',flex:1}]}>Ngày kết thúc</Text>        
			</View>		

			<FlatList
        data={weekList}
        renderItem={({item, index}) => (	
	        <TouchableOpacity 
						style={{flexDirection:'row'}} 
						onPress={()=>{
							setModal(true);setIdWeek(item.week_id);
							setDateStart(item.start_date ? new Date(item.start_date) : new Date());
							setDateEnd(item.end_date ? new Date(item.end_date) : new Date());
						}}
					>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:0.4}]}>{item.week_id.slice(2)}</Text>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{
							item.start_date 
							? new Date(item.start_date).toLocaleDateString('vi') 
							: 'Không xác định'
						}</Text>
						<Text style={[styles.qsTxt,styles.gridTxt2,{flex:1}]}>{
							item.end_date 
							? new Date(item.end_date).toLocaleDateString('vi') 
							: 'Không xác định'
						}</Text>
					</TouchableOpacity>
				)}
        keyExtractor={(item, idx) => JSON.stringify(item)}
        ListFooterComponent={
      		<View style={{height:50}} />  	
        }
        ListEmptyComponent={
        	<View style={styles.itemBox}>
						<Text>Chưa có vi phạm</Text>
						<ActivityIndicator size="large" />
					</View>	
        }
      />

			<Modal
				animationType='fade'
				transparent={true}
				visible={modal}
			>
				<View style={styles.entireView}>
					<ScrollView style={styles.dialog}>
						<View style={{backgroundColor:'#D0D0D0',margin:10}}>
							<Text style={styles.header}>Tuần {idWeek.slice(2)}</Text>
						</View>
						<View style={styles.inputarea}>
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Ngày bắt đầu</Text>
								<Button onPress={()=>setShowStart(true)} title={FormatDate(dateStart)} />
								{showStart && (
									<DateTimePicker
										testID="dateTimePicker"
										value={dateStart}
										mode='date'
										onChange={onChangeStart}
									/>
								)}
							</View>
																
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Ngày kết thúc</Text>
								<Button onPress={()=>setShowEnd(true)} title={FormatDate(dateEnd)} />
								{showEnd && (
									<DateTimePicker
										testID="dateTimePicker"
										value={dateEnd}
										mode='date'
										onChange={onChangeEnd}
									/>
								)}
							</View> 
						</View>
					</ScrollView>
					<View style={styles.CorD}>
						<Button
							onPress={()=>{
								setModal(false);
							}}
							title='Hủy bỏ'
							color='red'
						/>
						<View style={{width:10}}/>
						<Button
							onPress={HandleChange}
							title='Hoàn thành'
							color='green'
						/>
					</View>
				</View>
			</Modal>  

			<Modal
				animationType='fade'
				transparent={true}
				visible={newModal}
			>
				<View style={styles.entireView}>
					<ScrollView style={styles.dialog}>
						<View style={{backgroundColor:'#D0D0D0',margin:10}}>
							<Text style={styles.header}>Thêm mới tuần</Text>
						</View>
						<View style={styles.inputarea}>
							<View style={[styles.inputBox,{flexDirection:'row',alignItems:'center'}]}>
								<Text style={[styles.qsTxt,{marginRight:10}]}>Tuần</Text>
								<NumericInput  
									value={newNum}
									onChange={value => setNewNum(value)} 
									rounded
								/>
							</View>
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Ngày bắt đầu</Text>
								<Button onPress={()=>setShowStart(true)} title={FormatDate(dateStart)} />
								{showStart && (
									<DateTimePicker
										testID="dateTimePicker"
										value={dateStart}
										mode='date'
										onChange={onChangeStart}
									/>
								)}
							</View>
																
							<View style={styles.inputBox}>
								<Text style={[styles.qsTxt,{marginBottom:10}]}>Ngày kết thúc</Text>
								<Button onPress={()=>setShowEnd(true)} title={FormatDate(dateEnd)} />
								{showEnd && (
									<DateTimePicker
										testID="dateTimePicker"
										value={newDateEnd}
										mode='date'
										onChange={onChangeEnd}
									/>
								)}
							</View> 
						</View>
					</ScrollView>
					<View style={styles.CorD}>
						<Button
							onPress={()=>{
								setNewModal(false);
							}}
							title='Hủy bỏ'
							color='red'
						/>
						<View style={{width:10}}/>
						<Button
							onPress={HandleCreate}
							title='Hoàn thành'
							color='green'
						/>
					</View>
				</View>
			</Modal>

			<View style={{position:'absolute',bottom:5,left:0}}>
				<TouchableOpacity onPress={() => setNewModal(true)}>
					<MaterialCommunityIcons name='plus-circle' size={50} color='blue' />	
				</TouchableOpacity>
			</View>	
		</View>
	);
};

export { Qllt }