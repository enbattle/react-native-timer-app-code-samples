import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { ScrollPickerItemMemo } from './scrollpicker-item';
import { 
  SCROLL_PICKER_LIST_MAX_HEIGHT, 
  MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT,
  NUMBER_SIZE
} from '../../../constants/style-constants';

interface ScrollPickerListState {
  scrollPickerData: {key: string, value: string}[], 
  timerValue: number, 
  onTimerValueChange: (timeValue: number) => void, 
  handleCustomTimerInputs: (time: number, timeType: string) => void, 
  isUserChangingInputs: boolean, 
  timerType: string 
}

/*
 Render the static scroll picker header and footer
*/
const ScrollPickerListHeaderFooter = () => {
	console.log("HF rerendering");

  return (
    <TouchableOpacity
      style={ listStyles.scroll__picker__area__list__item__hf }
    >
      <Text style={ listStyles.scroll__picker__area__list__item__number__hf }>
        --
      </Text>
    </TouchableOpacity>
  );
}
const ScrollPickerListHeaderFooterMemo = React.memo(ScrollPickerListHeaderFooter, () => { return true; });

/* 
  Scroll picker flatlist that contains all the scroll picker items
*/
const ScrollPickerList = ({ 
  scrollPickerData, 
  timerValue, 
  onTimerValueChange, 
  handleCustomTimerInputs, 
  isUserChangingInputs, 
  timerType 
}: ScrollPickerListState) => {

  console.log("List rerendering?");

	// Scroll Picker flatlist reference
	const scrollPickerListRef = React.useRef<FlatList<{key: string, value: string}> | any>();

  // If timer value changes, scroll the picker to the indicated value
  useEffect(() => {
    scrollPickerListRef.current.scrollToIndex({ 
      index: timerValue, 
      viewPosition: 0.5, 
      animated: false 
    });
  }, [timerValue]);

  const renderListItem = ({ item, index }: {item: {key: string, value: string}, index: number}) => (
    <ScrollPickerItemMemo 
      item={ item }
      index={ index }
      onTimerValueChange={ onTimerValueChange }
      scrollPickerListRef={ scrollPickerListRef }
      handleCustomTimerInputs={ handleCustomTimerInputs }
      timerType={ timerType }
    />
  );

  return (
    <View style={ listStyles.scroll__picker__area__list }>
      <FlatList
        initialNumToRender={ 10 }
        maxToRenderPerBatch={ 10 }
        windowSize={ 10 }
				ref={ scrollPickerListRef }
        ListHeaderComponent={ <ScrollPickerListHeaderFooterMemo/> }
        ListFooterComponent={ <ScrollPickerListHeaderFooterMemo/> }
        showsVerticalScrollIndicator={ false }
        snapToInterval={ MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT }
        decelerationRate="fast"
        scrollEventThrottle={ 16 }
        contentContainerStyle={{ alignItems: 'center' }}
        bounces={ false }
        data={ scrollPickerData } 
        renderItem={ renderListItem }
        onScrollToIndexFailed={() => {
          Alert.alert("Timer has restarted, please hold on for a moment...");
        }}
        keyExtractor={ (item: {key: string, value: string}) => item.key }
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(Math.round(event.nativeEvent.contentOffset.y) / MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT);
          onTimerValueChange(newIndex);
        }}
      />
    </View>
  );
};

/* 
  Check if props have changed for the scroll picker list
  If changed, re-render
*/
const scrollPickerListAreEqual = (prevProps: ScrollPickerListState, nextProps: ScrollPickerListState) => {
	const { 
    timerValue: prevTimerValue,
    isUserChangingInputs: prevCustomStatus
  } = prevProps;
  
  const { 
    timerValue: nextTimerValue,
    isUserChangingInputs: nextCustomStatus
  } = nextProps;

  // Re-render the scroll picker list only if user is making custom input changes
  if(prevCustomStatus == nextCustomStatus == true) {
    return (prevTimerValue == nextTimerValue);
  }
  else {
    return true;
  }
}

/* 
  Memoized Object for rendering scroll picker list
*/
const ScrollPickerListMemo = React.memo(ScrollPickerList, scrollPickerListAreEqual);

const listStyles = StyleSheet.create({
  scroll__picker__area__list: {
    maxHeight: SCROLL_PICKER_LIST_MAX_HEIGHT,
  },

	scroll__picker__area__list__item__hf: {
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: MIN_MAX_SCROLL_PICKER_ITEM_HEIGHT
  },

  scroll__picker__area__list__item__number__hf: {
    color: "#FFFFFF",
    fontSize: NUMBER_SIZE
  }
});

export default ScrollPickerListMemo;