import React, { useState, useEffect } from 'react'
import { TextInput, FlatList, Alert, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import { useTheme, FAB, Portal, Avatar, DataTable, Card, Button, Divider, Menu, PaperProvider, Snackbar } from 'react-native-paper';
import XLSX from 'xlsx-js-style'
import { documentDirectory, writeAsStringAsync, readAsStringAsync } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Dropdown } from 'react-native-element-dropdown';

import { FormatDate, ConvertTime } from '../../toolkit.js';
import { DATA_URL, API_KEY } from '../../url.js';
import styles from "./styles.js";

const Tkdl = () => {
	const theme = useTheme();
	const navigation = useNavigation();

	const options = [
	  { label: "Thống kê điểm", value: 'diem' },
	  { label: "Thống kê vi phạm", value: 'vipham' },
	];
	const [opt, setOpt] = useState('diem')
	const [scoreList, setScoreList] = useState(null)
	const [classList, setClassList] = useState(null)
	const [startWeek, setStartWeek] = useState("...")
	const [endWeek, setEndWeek] = useState("...")
	const [selectClass, setSelectClass] = useState("...")
	const [weekList, setWeekList] = useState(null)
	const [signal, setSignal] = useState(false)
	var data2 = null;

	const fetchWeek = async () => {
		try {
			const response = await fetch(DATA_URL+'week', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
			const jsonData = await response.json();
			setWeekList(jsonData)
		} catch (error) {
			
		}
	};

	const fetchScoreList = async () => {
    try {
      const response = await fetch(DATA_URL+'scoreallweek', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      setScoreList(jsonData);
    } catch (error) {
      
    }
  };

  const fetchClassList = async () => {
    try {
      const response = await fetch(DATA_URL+'class', {
			  method: 'GET',
			  headers: {
			    'api-key': API_KEY,
			  }
			});
      const jsonData = await response.json();
      setClassList(jsonData);
    } catch (error) {
      
    }
  };

 	useEffect(() => {
  	fetchScoreList()
  	fetchClassList()
  	fetchWeek()
  }, [signal]);

  const FontStyle = (char, fillColor) => ({
	  t: 's',
	  v: char,
	  s: {
	    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "000000" } },
	    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
	    fill: { fgColor: { rgb: fillColor } },
	    border: { 
	    	top: { style: 'thin', color: 'black'},
	    	bottom: { style: 'thin', color: 'black'},
	    	left: { style: 'thin', color: 'black'},
	    	right: { style: 'thin', color: 'black'}
	    }
	  }
	})

	const FontStyleNote = (char) => ({
	  t: 's',
	  v: char,
	  s: {
	    font: { name: "Times New Roman", sz: 13, color: { rgb: "000000" } },
	    alignment: { wrapText: true, vertical: 'center' },
	    border: { 
	    	top: { style: 'thin', color: 'black'},
	    	bottom: { style: 'thin', color: 'black'},
	    	left: { style: 'thin', color: 'black'},
	    	right: { style: 'thin', color: 'black'}
	    }
	  }
	})

  function XuliDiem(startNumber, endNumber){
  	let result = [];

		const classMap = {}
		scoreList.forEach(item => {
		  const { class_id, week_id, score } = item;
		  const weekNumber = parseInt(week_id.slice(2));
		  // Lọc theo từ tuần start đến tuần end
		  if (weekNumber >= startNumber && weekNumber <= endNumber) {
		    if (!classMap[class_id]) {
		      classMap[class_id] = { class_id, totalScore: 0 };
		    }
		    classMap[class_id][`scoreWeek${weekNumber}`] = score;
		    classMap[class_id].totalScore += score;
		  }
		});
		
		// chuyển classMap từ object sang array
		classArray = Object.values(classMap)

		const groups = { 10: [], 11: [], 12: []	};

		//chia theo khối
		classArray.forEach(item => {
		  const grade = parseInt(item.class_id.slice(3, 5)); // Lấy "10", "11", "12"
		  groups[grade].push(item);
		});

		for (const grade in groups) {
		  const classes = groups[grade];
		  
		  // Sắp xếp các lớp trong khối theo totalScore giảm dần
		  classes.sort((a, b) => b.totalScore - a.totalScore);
		  
		  // Gán thứ hạng cho các lớp
		  classes.forEach((classItem, index) => {
		    classItem.rank = index + 1;  // Xếp hạng bắt đầu từ 1
		  });
		}

		//Sắp xếp trong từng khối theo thứ tự tên lớp
		for (const grade in groups) {
		  groups[grade].sort((a, b) => a.class_id.localeCompare(b.class_id));
		}

		//Định dạng cho từng ô

		for(const grade in groups) {
			result.push(groups[grade].map(oneclass => {
				let temp = [FontStyle(oneclass.class_id.slice(3), "fbfb9b")];
				for(let weekNumber = startNumber; weekNumber <= endNumber; weekNumber++){
					temp.push(FontStyle(oneclass[`scoreWeek${weekNumber}`], "FFFFFF"))
				}
				temp.push(FontStyle(oneclass.totalScore, "f6f409"))
				temp.push(FontStyle(oneclass.rank, "f6f409"))
				
				return temp
			}))
		}

		return result
  	
  }

  async function writeWorkbookOpt1(wb) {
  	const startNumber = parseInt(startWeek.week_id.slice(2))
  	const endNumber = parseInt(endWeek.week_id.slice(2))
		let thongKeDiem = await XuliDiem(startNumber, endNumber);
		
	  /* generate worksheet and workbook */
		let MainRow = [
			{ v: FormatDate(new Date()), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 14, italic: true, color: { rgb: "000000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			},
			{ v: 'TỔNG KẾT THI ĐUA TỪ TUẦN ' + startWeek.week_id.slice(2) + ' ĐẾN TUẦN ' + endWeek.week_id.slice(2), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 16, bold: true, color: { rgb: "000000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			}
		];	

	  const worksheet = XLSX.utils.aoa_to_sheet([[MainRow[0]],[MainRow[1]]])
	  const workbook = XLSX.utils.book_new();

	  const header = ["LỚP"];

	  for(let i = parseInt(startWeek.week_id.slice(2)); i <= parseInt(endWeek.week_id.slice(2)); i++){
	  	header.push("T"+i);
	  }

	  header.push("TỔNG");
	  header.push("XẾP HẠNG");

		const headerRow1 = header.map(headers => ({
		  t: 's',
		  v: headers,
		  s: {
		    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "000000" } },
		    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
		    fill: { fgColor: { rgb: "cbfbcb" } },
		    border: { 
		    	top: { style: 'thin', color: 'black'},
		    	bottom: { style: 'thin', color: 'black'},
		    	left: { style: 'thin', color: 'black'},
		    	right: { style: 'thin', color: 'black'}
		    }
		 	}
		}));
	
		XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A4" });
	  XLSX.utils.sheet_add_aoa(worksheet, thongKeDiem[0], { origin: "A5" });
	  XLSX.utils.sheet_add_aoa(worksheet, thongKeDiem[1], { origin: "A"+(4+thongKeDiem[0].length+2) });
	  XLSX.utils.sheet_add_aoa(worksheet, thongKeDiem[2], { origin: "A"+(4+thongKeDiem[0].length+thongKeDiem[1].length+3) });

	  worksheet["!cols"] = []

	  header.forEach((obj, idx)=>{
	  	worksheet["!cols"].push({ wch: 5 });
	  })

	  worksheet["!cols"][0].wch = 8
	  worksheet["!cols"][endNumber-startNumber+2].wch = 10
		worksheet["!cols"][endNumber-startNumber+3].wch = 15

	  let merge = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: endNumber-startNumber+4 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: endNumber-startNumber+4 } },
		];

		worksheet["!merges"] = merge;

		XLSX.utils.book_append_sheet(workbook, worksheet, 'KẾT QUẢ');
		
		const wbout = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
	  const file = documentDirectory + 'TỔNG KẾT THI ĐUA TỪ TUẦN ' + startWeek.week_id.slice(2) + ' ĐẾN TUẦN ' + endWeek.week_id.slice(2)+".xlsx";

	  try {
		  await writeAsStringAsync(file, wbout, {
		    encoding: "base64",
		  });
		  
		  await saveXLSXFile(file);
		} catch (e) {
		  Alert('Lưu không thành công')
		}

	  return file;
	}

	function XuliVipham(startNumber, endNumber){
		let result = [], oneclass = [];

		scoreList.forEach(item => {
		  const { class_id, week_id, score, note } = item;
		  const weekNumber = parseInt(week_id.slice(2));
		  // Lọc theo từ tuần start đến tuần end
		  if (weekNumber >= startNumber && weekNumber <= endNumber && class_id == selectClass.class_id) {
		    oneclass.push(item)
		  }
		});

		result.push(oneclass.map(oneweek => ([
			FontStyle(oneweek.week_id.slice(2), "ffffff"),
			FontStyleNote(oneweek.note),
			FontStyle(oneweek.score, "ffffff")
		])))

		return result
	}

  async function writeWorkbookOpt2(wb) {
  	const startNumber = parseInt(startWeek.week_id.slice(2))
  	const endNumber = parseInt(endWeek.week_id.slice(2))
		let thongKeVipham = await XuliVipham(startNumber, endNumber);

		let MainRow = [
			{ v: FormatDate(new Date()), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 14, italic: true, color: { rgb: "000000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			},
			{ v: 'TỔNG KẾT THI ĐUA LỚP '+selectClass.class_id.slice(3)+'\nTỪ TUẦN ' + startWeek.week_id.slice(2) + ' ĐẾN TUẦN ' + endWeek.week_id.slice(2), t: "s", 
				s: { 

					font: { name: "Times New Roman", sz: 16, bold: true, color: { rgb: "000000" } },
					alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} 
				} 
			}
		];	

	  const worksheet = XLSX.utils.aoa_to_sheet([[MainRow[0]],[MainRow[1]]])
	  const workbook = XLSX.utils.book_new();

	  const header = ["TUẦN"];

	  header.push("VI PHẠM");
	  header.push("ĐIỂM");

		const headerRow1 = header.map(headers => ({
		  t: 's',
		  v: headers,
		  s: {
		    font: { name: "Times New Roman", sz: 13, bold: true, color: { rgb: "000000" } },
		    alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },
		    fill: { fgColor: { rgb: "cbfbcb" } },
		    border: { 
		    	top: { style: 'thin', color: 'black'},
		    	bottom: { style: 'thin', color: 'black'},
		    	left: { style: 'thin', color: 'black'},
		    	right: { style: 'thin', color: 'black'}
		    }
		 	}
		}));
	
		XLSX.utils.sheet_add_aoa(worksheet, [headerRow1], { origin: "A4" });
	  XLSX.utils.sheet_add_aoa(worksheet, thongKeVipham[0], { origin: "A5" });

	  worksheet["!cols"] = [{wch: 10}, {wpx: 750}, {wch: 10}]

	  let merge = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
		];

		worksheet["!merges"] = merge;

		XLSX.utils.book_append_sheet(workbook, worksheet, 'KẾT QUẢ');
		
		const wbout = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
	  const file = documentDirectory + 'TỔNG KẾT THI ĐUA LỚP '+selectClass.class_id.slice(3)+'\nTỪ TUẦN ' + startWeek.week_id.slice(2) + ' ĐẾN TUẦN ' + endWeek.week_id.slice(2)+".xlsx";

	  try {
		  await writeAsStringAsync(file, wbout, {
		    encoding: "base64",
		  });
		  
		  await saveXLSXFile(file);
		} catch (e) {
		  Alert('Lưu không thành công')
		}

	  return file;

	}

	const saveXLSXFile = async (fileUri) => {
    const isShare = await Sharing.isAvailableAsync()
    if (isShare) {
      await Sharing.shareAsync(fileUri)  
    }
  }

	return (
		<PaperProvider>
			<SwitchSelector
			  initial={0}
			  onPress={value => setOpt(value)}
			  textColor='#1FBFF4'
			  selectedColor='#fff'
			  buttonColor='#1FBFF4'
			  borderColor='#1FBFF4'
			  hasPadding
			  options={options}
			  testID="gender-switch-selector"
				accessibilityLabel="gender-switch-selector"
			/>
			<View style={{height:10}} />

			
			<Card style={{backgroundColor: theme.colors.inverseOnSurface}}>
				<Card.Title title={`Bảng chọn`} titleVariant='titleLarge'/>
				<Divider />
				<Card.Content>
				{opt == "diem"
				? (
						<>
							<View style={{margin: 5,flexDirection: 'row', alignItems: 'center'}}>
								<Text>Tuần bắt đầu: </Text>
								<Dropdown
									autoScroll={false}
									style={[styles.dropdown, {flex: 1}]}
									iconStyle={{height:30,width:30}}
									iconColor='black'
									activeColor='lightblue'
									data={weekList ? weekList : []}
									maxHeight={250}
									labelField="week_name"
									valueField="week_id"
									placeholder={"..."}
									value={startWeek}
									onChange={item => setStartWeek(item)}
									itemContainerStyle={{borderWidth:0.5}}
								/>	
							</View>

							<View style={{margin: 5,flexDirection:'row', alignItems: 'center'}}>
								<Text>Tuần kết thúc: </Text>
								<Dropdown
									autoScroll={false}
									style={[styles.dropdown, {flex: 1}]}
									iconStyle={{height:30,width:30}}
									iconColor='black'
									activeColor='lightblue'
									data={weekList ? weekList : []}
									maxHeight={250}
									labelField="week_name"
									valueField="week_id"
									placeholder={"..."}
									value={endWeek}
									onChange={item => setEndWeek(item)}
									itemContainerStyle={{borderWidth:0.5}}
								/>	
							</View>
						</>
					)
				: (
						<>
							<View style={{margin: 5,flexDirection: 'row', alignItems: 'center'}}>
								<Text>Chọn lớp: </Text>
								<Dropdown
									autoScroll={false}
									style={[styles.dropdown, {flex: 1}]}
									iconStyle={{height:30,width:30}}
									iconColor='black'
									activeColor='lightblue'
									data={classList ? classList : []}
									maxHeight={250}
									labelField="class_name"
									valueField="class_id"
									placeholder={"..."}
									value={selectClass}
									onChange={item => setSelectClass(item)}
									itemContainerStyle={{borderWidth:0.5}}
								/>	
							</View>

							<View style={{margin: 5,flexDirection: 'row', alignItems: 'center'}}>
								<Text>Tuần bắt đầu: </Text>
								<Dropdown
									autoScroll={false}
									style={[styles.dropdown, {flex: 1}]}
									iconStyle={{height:30,width:30}}
									iconColor='black'
									activeColor='lightblue'
									data={weekList ? weekList : []}
									maxHeight={250}
									labelField="week_name"
									valueField="week_id"
									placeholder={"..."}
									value={startWeek}
									onChange={item => setStartWeek(item)}
									itemContainerStyle={{borderWidth:0.5}}
								/>	
							</View>

							<View style={{margin: 5,flexDirection:'row', alignItems: 'center'}}>
								<Text>Tuần kết thúc: </Text>
								<Dropdown
									autoScroll={false}
									style={[styles.dropdown, {flex: 1}]}
									iconStyle={{height:30,width:30}}
									iconColor='black'
									activeColor='lightblue'
									data={weekList ? weekList : []}
									maxHeight={250}
									labelField="week_name"
									valueField="week_id"
									placeholder={"..."}
									value={endWeek}
									onChange={item => setEndWeek(item)}
									itemContainerStyle={{borderWidth:0.5}}
								/>	
							</View>
						</>
					)
				}

				</Card.Content>
				<Card.Actions>
		      <Button mode="contained" onPress={()=>{
		      	if(startWeek != "..." && endWeek != "..."){
		      		if(opt == "diem") writeWorkbookOpt1()
		      		if(opt == "vipham") writeWorkbookOpt2()
		      	}
		      }}>Xuất file Excel</Button>
		    </Card.Actions>
			</Card>
			
		</PaperProvider>
	)
}

export { Tkdl }