import React from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { constants } from '../../constants';
import styles from './ScrollableTabBar.styles';
import type { Tab } from 'react-native-sticky-parallax-header';


export type ScrollableTabBarProps = {
  tabs: Tab[];
  activeTab: number;
  goToPage: (index: number) => void;
  scrollValue: Animated.AnimatedInterpolation;
  tabTextStyle: StyleProp<TextStyle>;
  tabTextActiveStyle: StyleProp<TextStyle>;
  tabTextContainerStyle: StyleProp<ViewStyle>;
  tabTextContainerActiveStyle: StyleProp<ViewStyle>;
  tabsContainerBackgroundColor?: string;
  tabWrapperStyle?: StyleProp<ViewStyle>;
  tabsContainerStyle?: StyleProp<ViewStyle>;
};

class ScrollableTabBar extends React.PureComponent<ScrollableTabBarProps> {
  scrollView: ScrollView | null = null;
  tabRefs: (View | null)[] = [];

  componentDidUpdate(prevProps: Readonly<ScrollableTabBarProps>) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.scrollToTab(this.props.activeTab);
    }
  }

  scrollToTab = (page: number) => {
    if (this.tabRefs[page] && this.scrollView) {
      this.tabRefs[page]?.measureLayout(
        this.scrollView as unknown as number,
        (x, _, width) => {
          const scrollOffset = x + width / 2 - constants.deviceWidth / 2;
          this.scrollView?.scrollTo({ x: Math.max(scrollOffset, 0), animated: true });
        },
        () => {}
      );
    }
  };

  goToPage = (page: number) => {
    this.scrollToTab(page);
    this.props.goToPage(page);
  };

  render() {
    const {
      activeTab,
      tabs,
      tabTextStyle,
      tabTextActiveStyle,
      tabTextContainerStyle,
      tabTextContainerActiveStyle,
      tabsContainerBackgroundColor,
      tabWrapperStyle,
      tabsContainerStyle,
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: tabsContainerBackgroundColor }]}> 
        <ScrollView
          ref={(r) => (this.scrollView = r)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainer, tabsContainerStyle]}
        >
          {tabs.map((tab, page) => {
            const isTabActive = activeTab === page;
            return (
              <TouchableOpacity
                key={tab.title || `tab ${page}`}
                style={tabWrapperStyle}
                onPress={() => this.goToPage(page)}
                activeOpacity={0.9}
              >
                <View
                  ref={(ref) => (this.tabRefs[page] = ref)}
                  style={[styles.tabContainer, tabTextContainerStyle, isTabActive && tabTextContainerActiveStyle]}
                >
                  <Text style={[styles.tabText, tabTextStyle, isTabActive && tabTextActiveStyle]}>
                    {tab.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default ScrollableTabBar;
