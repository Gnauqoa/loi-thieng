import { View } from "react-native";
import { Input, Text, InputProps } from "tamagui";

const TextField = ({
  label,
  ...inputProps
}: {
  label?: string;
} & InputProps) => {
  return (
    <View className="flex flex-col gap-1">
      {label && <Text>{label}</Text>}
      <Input {...inputProps} />
    </View>
  );
};

export const createHandleChangeForm = (setState: (value: any) => void) => {
  return (key: string, value: any) => {
    setState((prev: any) => ({ ...prev, [key]: value }));
  };
};

export default TextField;
