import { View, Pressable } from "react-native";
import { Text } from "@tamagui/core";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";

function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element {
  const { theme } = useTheme();
  return (
    <View className="flex flex-row items-center w-[100vw] py-3 overflow-hidden">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <View key={route.key} className="flex flex-row flex-1 px-2">
            <View className="flex-1 items-center justify-center">
              <Pressable
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                className="items-center justify-center"
              >
                {options.tabBarIcon
                  ? options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused
                        ? theme.colors.primary
                        : theme.colors.black,
                      size: 24,
                    })
                  : null}
                <Text
                  style={{
                    color: isFocused
                      ? theme.colors.primary
                      : theme.colors.black,
                  }}
                >
                  {label as string}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default TabBar;
