import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, InteractionManager, Dimensions } from 'react-native';
import ProgressWidgetMemo from './progress-timer/progress-widget';
import { 
  TITLE_SIZE, 
  TEXT_SIZE
} from '../constants/style-constants';
import PomodoroAreaMemo from './pomodoro-timer/pomodoro-input-area';
import DraggableActivityListMemo from './common/draggable-activity-list/draggable-activity-list';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface PomodoroTimerStates {
  ready: boolean,
  pomodoroMinutes: number,
  pomodoroSeconds: number,
  smallBreakMinutes: number,
  smallBreakSeconds: number,
  longBreakMinutes: number,
  longBreakSeconds: number,
  showPomodoro: boolean,
  showSmallBreak: boolean,
  showLongBreak: boolean,
  progressWidgetVisible: boolean,
  draggableListStartingYPos: number,
  draggableListStartingHeight: number
}

const PomodoroTimerHeader = ({}) => {
  console.log("Pomodoro Timer header rerender");
  return (
    <View style={ homeStyles.top__container }>
      <Text style={ homeStyles.home__page__title }>
        Pomo Discipline
      </Text>
    </View>
  );
}
const PomodoroTimerHeaderMemo = React.memo(PomodoroTimerHeader, () => { return true; });

class PomodoroTimerScreen extends React.PureComponent<any, PomodoroTimerStates> {
  constructor(props: any) {
    super(props);

    console.log("INIT HOMESCREEN");

    this.state = {
      // props: props, // Redux props
      ready: false,
      pomodoroMinutes: 0, // timer minutes
      pomodoroSeconds: 10, // timer seconds
      smallBreakMinutes: 0, //  small break minutes
      smallBreakSeconds: 3, // small break seconds
      longBreakMinutes: 0, // long break minutes
      longBreakSeconds: 2, // long break seconds
      showPomodoro: true,
      showSmallBreak: false,
      showLongBreak: false,
      progressWidgetVisible: false, // Progress widget modal visibility
      draggableListStartingYPos: 0,
      draggableListStartingHeight: 0
    }

    this.setPomodoro = this.setPomodoro.bind(this);
    this.setSmallBreak = this.setSmallBreak.bind(this);
    this.setLongBreak = this.setLongBreak.bind(this);
    this.setPomodoroInputVisible = this.setPomodoroInputVisible.bind(this);
    this.setProgressWidgetVisible = this.setProgressWidgetVisible.bind(this)
    this.onStartPress = this.onStartPress.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ ready: true });
    });
  }
  // componentDidUpdate() {}
  // componentWillUnmount() {}

  // Set current pomodoro
  setPomodoro(type: string, newTimerValue: number): void {
    if(type === "minutes") {
      this.setState({ pomodoroMinutes: newTimerValue });
      // this.props.dispatch(changeHomeTimerMinutes(newMinutes));
    }
    else if(type === "seconds") {
      this.setState({ pomodoroSeconds: newTimerValue });
    }
  }

  // Set current small break
  setSmallBreak(type: string, newBreakValue: number): void {
    if(type === "minutes") {
      this.setState({ smallBreakMinutes: newBreakValue });
      // this.props.dispatch(changeHomeTimerMinutes(newMinutes));
    }
    else if(type === "seconds") {
      this.setState({ smallBreakSeconds: newBreakValue });
    }
  }

  // Set current long break
  setLongBreak(type: string, newBreakValue: number): void {
    if(type === "minutes") {
      this.setState({ longBreakMinutes: newBreakValue });
      // this.props.dispatch(changeHomeTimerMinutes(newMinutes));
    }
    else if(type === "seconds") {
      this.setState({ longBreakSeconds: newBreakValue });
    }
  }

  setPomodoroInputVisible(inputType: string): void {
    if(inputType === "pomodoro") {
      this.setState({ 
        showPomodoro: true,
        showSmallBreak: false,
        showLongBreak: false
      });
    }
    else if(inputType === "smallBreak") {
      this.setState({ 
        showPomodoro: false,
        showSmallBreak: true,
        showLongBreak: false
      });
    }
    else if(inputType === "longBreak") {
      this.setState({ 
        showPomodoro: false,
        showSmallBreak: false,
        showLongBreak: true
      });
    }
  }

  // Set progress widget component modal visibility
  setProgressWidgetVisible(newVisible: boolean): void {
    this.setState({ progressWidgetVisible: newVisible });
  }

  // Pressing the start component opens the progress widget component
  onStartPress(): void {
    console.log(this.state.pomodoroMinutes);
    this.setState({ progressWidgetVisible: true });
  }

  render() {
    return (
      <View style={ homeStyles.container }>
        {/* Pomodoro Timer Title */}
        <PomodoroTimerHeaderMemo/>

        {/* Timer input area */}
        <PomodoroAreaMemo
          pomodoroMinutes={ this.state.pomodoroMinutes }
          pomodoroSeconds={ this.state.pomodoroSeconds }
          smallBreakMinutes={ this.state.smallBreakMinutes }
          smallBreakSeconds={ this.state.smallBreakSeconds }
          longBreakMinutes={ this.state.longBreakMinutes }
          longBreakSeconds={ this.state.longBreakSeconds }
          showPomodoro={ this.state.showPomodoro }
          showSmallBreak={ this.state.showSmallBreak }
          showLongBreak={ this.state.showLongBreak }
          setPomodoroInputVisible={ this.setPomodoroInputVisible }
          setPomodoro={ this.setPomodoro }
          setSmallBreak={ this.setSmallBreak }
          setLongBreak={ this.setLongBreak }
        />

        <View style={ homeStyles.home__page__task__list__title}>
          <Text style={{ color: "#FFFFFF", fontSize: TEXT_SIZE }}>Task List</Text>
        </View>

        <View
          onLayout={(event) => {
            var { y, height } = event.nativeEvent.layout;
            this.setState({
              draggableListStartingYPos: y,
              draggableListStartingHeight: height
            });
          }}
        >
          <DraggableActivityListMemo 
            listStartingYPos={ this.state.draggableListStartingYPos }
            listStartingHeight={ this.state.draggableListStartingHeight }
          />
        </View>

        {/* Start Pomodoro Timer */}
        <View style={ homeStyles.home__page__view__center }>
          <TouchableOpacity
            style={ (this.state.pomodoroMinutes) || (this.state.pomodoroSeconds) 
              ? homeStyles.home__page__start__button : homeStyles.home__page__start__button__disabled }
            onPress={ this.onStartPress }
            disabled={ !(this.state.pomodoroMinutes) && !(this.state.pomodoroSeconds) }
          >
            <Text style={ homeStyles.home__page__text } >
              Start
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Circle and Timer Widget Modal (in the background) */}
        <ProgressWidgetMemo
          progressWidgetVisible={ this.state.progressWidgetVisible }
          setProgressWidgetVisible={ this.setProgressWidgetVisible }
          totalTimePomodoro={ (this.state.pomodoroMinutes * 60) + this.state.pomodoroSeconds }
          totalTimeSmallBreak={ (this.state.smallBreakMinutes * 60) + this.state.smallBreakSeconds }
          totalTimeLongBreak={ (this.state.longBreakMinutes * 60) + this.state.longBreakSeconds }
        />    
      </View>
    );
  }
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  top__container: {
    alignItems: "center",
  },

  home__page__title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: TITLE_SIZE,
  },

  home__page__text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: TEXT_SIZE
  },

  home__page__view__center: {
    justifyContent: "center",
    alignItems: "center"
  },

  home__page__start__button: {
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "green"
  },

  home__page__start__button__disabled: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: "gray"
  },

  home__page__task__list__title: {
    width: screenWidth * 0.75,
    justifyContent: "center",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    padding: 10
  }
});

export default PomodoroTimerScreen;