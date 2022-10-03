import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ScrollPickerListMemo from './scrollpicker-list';
import { 
  ScrollPickerSelectAreaMemo, 
  ScrollPickerLeftColonMemo, 
  ScrollPickerRightColonMemo 
} from './scrollpicker-constants';
import { HOUR_VALUES, MINUTES_VALUES, SECONDS_VALUES } from './scrollpicker-values';
import { 
  SCROLL_PICKER_COLUMN_MAX_HEIGHT,
  SCROLL_PICKER_AREA_MIN_WIDTH
} from '../../../constants/style-constants';

interface ScrollPickerState {
  timerHours: number, 
  timerMinutes: number, 
  timerSeconds: number,
  handleCustomTimerInputs: (time: number, timeType: string) => void, 
  userIsChangingCustomInputs: boolean,
  onHoursIndexChange: (newHours: number) => void, 
  onMinutesIndexChange: (newMinutes: number) => void, 
  onSecondsIndexChange: (newMInutes: number) => void 
}

/* Get window sizes */
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const QuickTimerHoursColumnHeader = () => {
  return (
    <Text style={ pickerStyles.scroll__picker__area__title }>Hours</Text>
  );
}
const QuickTimerMinutesColumnHeader = () => {
  return (
    <Text style={ pickerStyles.scroll__picker__area__title }>Minutes</Text>
  );
}
const QuickTimerSecondsColumnHeader = () => {
  return (
    <Text style={ pickerStyles.scroll__picker__area__title }>Seconds</Text>
  );
}

const QuickTimerHoursColumnHeaderMemo = React.memo(QuickTimerHoursColumnHeader, () => { return true; });
const QuickTimerMinutesColumnHeaderMemo = React.memo(QuickTimerMinutesColumnHeader, () => { return true; });
const QuickTimerSecondsColumnHeaderMemo = React.memo(QuickTimerSecondsColumnHeader, () => { return true; });

/*
  Scroll Picker Component
*/
const ScrollPicker = ({ 
  timerHours, 
  timerMinutes, 
  timerSeconds,
  handleCustomTimerInputs, 
  userIsChangingCustomInputs,
  onHoursIndexChange, 
  onMinutesIndexChange, 
  onSecondsIndexChange 
}: ScrollPickerState) => {

  console.log("Picker init");

  return (
    <View style={ pickerStyles.scroll__picker }>
      {/* Center Shade Area of scroll picker to depict selected time values */}
      <ScrollPickerSelectAreaMemo/>

      {/* Colon between hours and minutes */}
      <ScrollPickerLeftColonMemo/>

      {/* Colon between minutes and seconds */}
      <ScrollPickerRightColonMemo/>

      {/* Hours Picker */}
      <View style={ pickerStyles.scroll__picker__area }>
        <QuickTimerHoursColumnHeaderMemo/>
        <ScrollPickerListMemo 
          scrollPickerData={ HOUR_VALUES}
          timerValue={ timerHours }
          onTimerValueChange={ onHoursIndexChange }
          handleCustomTimerInputs={ handleCustomTimerInputs }
          isUserChangingInputs={ userIsChangingCustomInputs }
          timerType="hours"
        />
      </View>

      {/* Minutes Picker */}
      <View style={ pickerStyles.scroll__picker__area }>
        <QuickTimerMinutesColumnHeaderMemo/>
        <ScrollPickerListMemo 
          scrollPickerData={ MINUTES_VALUES }
          timerValue={ timerMinutes }
          onTimerValueChange={ onMinutesIndexChange }
          handleCustomTimerInputs={ handleCustomTimerInputs }
          isUserChangingInputs={ userIsChangingCustomInputs }
          timerType="minutes"
        />
      </View>

      {/* Seconds Picker */}
      <View style={ pickerStyles.scroll__picker__area }>
        <QuickTimerSecondsColumnHeaderMemo/>
        <ScrollPickerListMemo 
          scrollPickerData={ SECONDS_VALUES }
          timerValue={ timerSeconds }
          onTimerValueChange={ onSecondsIndexChange }
          handleCustomTimerInputs={ handleCustomTimerInputs }
          isUserChangingInputs={ userIsChangingCustomInputs }
          timerType="seconds"
        />
      </View>
    </View>
  );
};

/* 
  Check if props have changed for the scroll picker list
  If changed, re-render
*/
const scrollPickerAreEqual = (prevProps: ScrollPickerState, nextProps: ScrollPickerState) => {
	const { 
    timerHours: prevHours,
    timerMinutes: prevMinutes,
    timerSeconds: prevSeconds,
    userIsChangingCustomInputs: prevCustomStatus
  } = prevProps;

  const { 
    timerHours: nextHours,
    timerMinutes: nextMinutes,
    timerSeconds: nextSeconds,
    userIsChangingCustomInputs:  nextCustomStatus
  } = nextProps;

  // Re-render the scroll picker only if user is making custom input changes
  if(prevCustomStatus == nextCustomStatus == true) {
    return (prevHours == nextHours) && 
      (prevMinutes == nextMinutes) && 
      (prevSeconds == nextSeconds);
  }
  else {
    return true;
  }
}

/* 
  Memoized Object for rendering scroll picker list
*/
const ScrollPickerMemo = React.memo(ScrollPicker, scrollPickerAreEqual);

const pickerStyles = StyleSheet.create({
  scroll__picker: {
    margin: screenWidth * 0.05,
    flexDirection: "row"
  },

  scroll__picker__area: {
    maxHeight: SCROLL_PICKER_COLUMN_MAX_HEIGHT,
    minWidth: SCROLL_PICKER_AREA_MIN_WIDTH,
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  scroll__picker__area__title: {
    margin: 5,
    fontWeight: "bold",
    color: "#FFFFFF"
  }
});

export default ScrollPickerMemo; 