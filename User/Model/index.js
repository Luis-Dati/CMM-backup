import React, { useState } from 'react'
import { View, Text } from 'react-native';

import { level } from '../../Home/index';
import styles from './styles';
import { Dslh } from './Dslh';
import { Stvp } from './Stvp';
import { Xbxh } from './Xbxh';
import Gutd from './Gutd';
import { Sxlt } from './Sxlt';
import { Qllt } from './Qllt';

const Model = ({route, navigation}) => {
	const { type } = route.params;
	const { login } = route.params;
	const { week } = route.params;
	const { classe } = route.params;
	const { weekin4 } = route.params;
	const { loginIn4 } = route.params;

	const Comparision = () => {
		switch (type) {
		case 'Danh sách lớp học':
			return ( <Dslh level={level}/> )
			break;
		case 'Xem bảng xếp hạng':
			return ( <Xbxh level={level} week={week} weekin4={weekin4} login={login} loginIn4={loginIn4}/> )
			break;
		case 'Sổ tay vi phạm': 
			return ( <Stvp level={level} classe={classe} login={login} week={week}/>)
			
		case 'Sắp xếp lịch trực': 
			return ( <Sxlt level={level} root='user' week={week}/> )
		
		case 'Giao ước thi đua':
			return ( <Gutd level={level}/> )

		case 'Quản lí lịch tuần':
			return ( <Qllt level={level}/> )
		}
	}
	return (
		<View style={styles.container}>
			<Comparision />		
		</View>
	)
}

export default Model