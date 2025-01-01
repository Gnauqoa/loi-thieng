import { TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import MenuIcon from "@/assets/icons/menu.svg";
import { Comment as CommentType } from "@/@types/comment";

const Comment = (props: CommentType) => {
  const { content, created_at, user } = props;
  return (
    <View className={`flex flex-col gap-2 py-3 px-4`}>
      <View className="flex flex-row items-center gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />

        <View className="flex flex-col flex-1 justify-start">
          <View className="flex flex-row items-center">
            <SizableText size={"$1"}>
              {`${user.first_name} ${user.last_name}`}
            </SizableText>
            <TouchableOpacity className="ml-auto">
              <MenuIcon
                fill={"#000"}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          </View>
          <SizableText size={"$1"}>
            {dayjs(created_at).from(dayjs())}
          </SizableText>
        </View>
      </View>
      <SizableText size={"$3"}>{content}</SizableText>

      {/* <View className="flex flex-row gap-12 items-center">
        <TouchableOpacity>
          {is_liked ? (
            <HeartFillIcon style={{ width: 20, height: 20 }} />
          ) : (
            <HeartIcon fill={"#000"} style={{ width: 20, height: 20 }} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpen}>
          <CommentIcon style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default Comment;
