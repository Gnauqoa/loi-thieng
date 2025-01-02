import { Post as PostType } from "@/@types/post";
import { TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

const CommentModalPost = (props: PostType & { onClose: () => void }) => {
  const { title, user, content, created_at } = props;
  return (
    <View
      className={`flex flex-col gap-2 py-3 px-3 border-b-[#f1f1ef] border-b-[1px] relative`}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center gap-3">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
            </SizableText>
            <TouchableOpacity className="ml-auto">
              <Entypo name="dots-three-horizontal" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onClose}>
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <SizableText size={"$1"}>
            {dayjs(created_at).from(dayjs())}
          </SizableText>
        </View>
      </View>
      <SizableText size={"$6"}>{title}</SizableText>

      <SizableText size={"$2"}>{content}</SizableText>
    </View>
  );
};

export default CommentModalPost;
