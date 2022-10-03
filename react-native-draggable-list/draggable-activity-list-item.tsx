import React, { MutableRefObject } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TEXT_SIZE } from '../../../constants/style-constants';

interface IDraggableActivityListItem {
	id: number,
	activityName: string,
	minutes: number,
	seconds: number,
}

interface DraggableActivityListItemState {
  item: IDraggableActivityListItem, 
  index: number, 
  data: IDraggableActivityListItem[], 
  setData: (data: IDraggableActivityListItem[]) => void,
  currentIndex: number, 
  setCurrentIndex: (index: number) => void, 
  currentIndexItem: IDraggableActivityListItem | null, 
  setCurrentIndexItem: (item: IDraggableActivityListItem | null) => void, 
	currentPagePos: number, 
  setCurrentPagePos: (pos: number) => void,
  scrollUp: boolean, 
  setScrollUp: (scrollUp: boolean) => void, 
  scrollDown: boolean, 
  setScrollDown: (scrollDown: boolean) => void,
  setDragging: (dragging: boolean) => void, 
  pan: Animated.ValueXY, 
  activityListYPos: number, 
  activityListHeight: number, 
  listOffset: number 
}

const ACTIVITY_LIST_ITEM = 60;
const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const DraggableActivityListItem = ({ 
  item, 
  index, 
  data, 
  setData,
  currentIndex, 
  setCurrentIndex, 
  currentIndexItem, 
  setCurrentIndexItem, 
	currentPagePos, 
  setCurrentPagePos,
  scrollUp, 
  setScrollUp, 
  scrollDown, 
  setScrollDown,
  setDragging, 
  pan, 
  activityListYPos, 
  activityListHeight, 
  listOffset 
}: DraggableActivityListItemState) => {

  // console.log("Recreating?");

  function updateData(event: any) {
    let endingHoverIndex = Math.floor((event.nativeEvent.pageY - activityListYPos) / ACTIVITY_LIST_ITEM) + Math.round(listOffset / ACTIVITY_LIST_ITEM);

    if(data.length > 1) {
      if(endingHoverIndex != currentIndex) {
        if(endingHoverIndex < 0) {
          endingHoverIndex = 0;
        }
        else if(endingHoverIndex > data.length) {
          endingHoverIndex = data.length - 1;
        }
        let tempData = [...data];
        let tempItem = {...data[currentIndex]};
        tempData.splice(currentIndex, 1);
        tempData.splice(endingHoverIndex, 0, tempItem);
        setData(tempData);
      }
    }
  }

  function setHoverPosition(event: any) {
    let currentHoverIndex = Math.floor((event.nativeEvent.pageY - activityListYPos) / ACTIVITY_LIST_ITEM) + Math.round(listOffset / ACTIVITY_LIST_ITEM);

    if(data.length > 1) {
      if(currentHoverIndex != currentIndex) {
        if(currentHoverIndex < 0) {
          currentHoverIndex = 0;
        }
        else if(currentHoverIndex > data.length) {
          currentHoverIndex = data.length - 1;
        }
        setCurrentPagePos(currentHoverIndex);
      }
    }
  }

  return (
    <Animated.View 
      style={ [{
        opacity: index === currentIndex ? 0 : 1,
        transform: (
          index > currentIndex 
          ? currentPagePos >= index 
          : index < currentIndex 
          ? currentPagePos <= index 
          : false
        )
        && currentPagePos != -1 && currentIndex <= data.length - 1
        ? [{ translateY: (currentIndex < index ? -1 : 1) * ACTIVITY_LIST_ITEM }]
        : [{ translateY: 0 }]
      }] }
    >				
      <View style={ draggableListItemStyles.activity__list__item }>
        <Text style={ draggableListItemStyles.activity__list__item__text }>
          { item.activityName }
        </Text>
        <TouchableOpacity 
          style={ draggableListItemStyles.activity__list__item__scroll__icon__view }
          onPress={() => {
            let tempData = [...data];
            let tempItem = {...item};
            tempItem.id = Math.round(Math.random() * (10 ** 7));
            tempData.splice(index + 1, 0, tempItem);
            setData(tempData);
          }}
        >
          <Ionicons name="duplicate" color={ "#FFFFFF" } size={ 31 }/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={ draggableListItemStyles.activity__list__item__scroll__icon__view }
          onPress={() => {
            let tempData = [...data];
            tempData.splice(index, 1);
            setData(tempData);
          }}
        >
          <MaterialCommunityIcons name="delete" color={ "#FFFFFF" } size={ 31 }/>
        </TouchableOpacity>
        <Animated.View 
          style={ draggableListItemStyles.activity__list__item__scroll__icon__view }
          onStartShouldSetResponder={(event) => true}
          onMoveShouldSetResponder={(event) => true}
          onResponderGrant={(event) => {
            console.log("when grant");
            setCurrentIndex(index);
            setCurrentIndexItem(item);
            setDragging(true);
        
            Animated.event(
              [
                { y: pan.y }
              ],
              { useNativeDriver: false }
            )({ y: event.nativeEvent.pageY });

            console.log(pan.y);

            setHoverPosition(event);
          }}
          onResponderMove={(event) => {
            // console.log("when move");
            Animated.event(
              [
                { y: pan.y }
              ],
              { useNativeDriver: false }
            )({ y: event.nativeEvent.pageY });
          
            setHoverPosition(event);

            // When dragging items to the top of the list, scroll upwards
            // When dragging items to the bottom of the list, scroll downwards
            if(event.nativeEvent.pageY - (ACTIVITY_LIST_ITEM * 0.5) <= activityListYPos) {
              setScrollUp(true);
            }
            else if(event.nativeEvent.pageY + (ACTIVITY_LIST_ITEM * 0.5) >= activityListHeight) {
              setScrollDown(true);
            }
            else {
              if(scrollUp) setScrollUp(false);
              if(scrollDown) setScrollDown(false);
            }
          }}
          onResponderRelease={(event) => {
            updateData(event);

            console.log("when release");
            setCurrentIndex(-1);
            setCurrentPagePos(-1);
            setCurrentIndexItem(null);
            setDragging(false);

            setScrollUp(false);
            setScrollDown(false);
          }}
          onResponderTerminate={(event) => {
            updateData(event);

            console.log("when terminate");
            setCurrentIndex(-1);
            setCurrentPagePos(-1);
            setCurrentIndexItem(null);
            setDragging(false);

            setScrollUp(false);
            setScrollDown(false);
          }}
          onResponderTerminationRequest={(event) => {
            updateData(event);

            console.log("when terminate requested");
            setCurrentIndex(-1);
            setCurrentPagePos(-1);
            setCurrentIndexItem(null);
            setDragging(false);

            setScrollUp(false);
            setScrollDown(false);

            return true;
          }}
        >
          <MaterialCommunityIcons name="arrow-up-down-bold" color="white" size={ 33 }/>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const draggableActivityListItemAreEqual = (prevProps: DraggableActivityListItemState, nextProps: DraggableActivityListItemState) => {
  const { 
    listOffset: prevListOffset,
    currentIndex: prevIndex,
    currentPagePos: prevPagePos,
    data: prevData
  } = prevProps;

  const { 
    listOffset: nextListOffset, 
    currentIndex: nextIndex,
    currentPagePos: nextPagePos,
    data: nextData
  } = nextProps;

  return prevListOffset === nextListOffset && prevIndex === nextIndex && prevPagePos === nextPagePos && prevData === nextData;
}

const DraggableActivityListItemMemo = React.memo(DraggableActivityListItem, draggableActivityListItemAreEqual);

const draggableListItemStyles = StyleSheet.create({
  activity__list__item__center: {
    alignItems: "center",
    justifyContent: "center",
  },

  activity__list__item: {
    flexDirection: "row",
    height: ACTIVITY_LIST_ITEM,
    width: screenWidth * 0.75,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    textAlign: "center",
    alignItems: "center"
  },

  activity__list__item__text: {
    flex: 4,
    fontSize: TEXT_SIZE,
    color: "#FFFFFF",
    padding: 10,
  },

  activity__list__item__scroll__icon__view: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    margin: 5
  }
});

export default DraggableActivityListItemMemo;