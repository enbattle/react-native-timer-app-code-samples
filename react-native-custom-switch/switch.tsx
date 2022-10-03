import React from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from '@motify/components';
import { Easing } from 'react-native-reanimated';

const _colors = {
	active: "#2C2C2C",
	inactive: "#DCDCDC"
};

const transition: any = {
	type: 'timing',
	duration: 300,
	easing: Easing.inOut(Easing.ease)
}

const Switch = ({ size, onPress, isActive }: {size: number, onPress: () => void, isActive: boolean}) => {
	const trackWidth = React.useMemo(() => {
		return size * 1.5;
	}, [size]);

	const trackHeight = React.useMemo(() => {
		return size;
	}, [size]);

	const knobSize = React.useMemo(() => {
		return size * 0.6;
	}, [size]);
	
	return (
		<Pressable
			onPress={ onPress }
		>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<MotiView // Track area (for the switch)
					transition={ transition }
					animate={{
						backgroundColor: isActive ? _colors.active : _colors.inactive
					}}
					style={{
						position: "absolute",
						width: trackWidth,
						height: trackHeight,
						borderRadius: trackHeight / 2,
						backgroundColor: _colors.active
					}}
				/>
				<MotiView // Circular area around the Switch
					transition={ transition }
					animate={{
						translateX: isActive ? trackWidth / 4 : -trackWidth / 4
					}}
					style={{
						width: size,
						height: size,
						borderRadius: size / 2,
						backgroundColor: "#FFFFFF",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<MotiView // Circular switch in the center
						transition={ transition }
						animate={{
							width: isActive ? 0 : knobSize,
							borderColor: isActive ? _colors.active : _colors.inactive
						}}
						style={{
							width: knobSize,
							height: knobSize,
							borderRadius: knobSize / 2,
							borderWidth: size * 0.1,
							borderColor: _colors.active

						}}
					/>
				</MotiView>
			</View>
		</Pressable>
	);
}

export default Switch;
