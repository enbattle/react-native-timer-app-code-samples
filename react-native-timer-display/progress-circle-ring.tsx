import 'react-native-reanimated';
import React from 'react';
import { Circle } from 'react-native-svg';

interface CircleRingState {
	cx: number, 
	cy: number, 
	r: number, 
	stroke: string, 
	strokeWidth : number
}

const ProgressCircleRing = ({ 
	cx, 
	cy, 
	r, 
	stroke, 
	strokeWidth 
}: CircleRingState) => {
	return (
		<Circle 
			cx={ cx } 
			cy={ cy } 
			r={ r } 
			stroke={ stroke }
			strokeWidth={ strokeWidth }
		/>
	);
}

const ProgressCircleRingMemo = React.memo(ProgressCircleRing, () => { return true; });

export default ProgressCircleRingMemo;