import { Post as PostType } from "@/@types/post";
import { TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/config/redux/slices/auth";
import { Avatar, Button, Tooltip } from "@rneui/themed";
import useToggle from "@/hooks/useToggle";

const CommentModalPost = (props: PostType & { onClose: () => void }) => {
  const { title, user, content, created_at } = props;
  const [open, , , onClose, onOpen] = useToggle();
  const { user: currentUser } = useAuth();
  return (
    <View
      className={`flex flex-col gap-2 py-3 px-3 border-b-[#f1f1ef] border-b-[1px] relative`}
    >
      <View className="flex flex-row items-center gap-2">
        <Avatar
          rounded
          source={{ uri: props.user.avatar_url || "" }}
          size="small"
          containerStyle={{ borderWidth: 1 }}
        />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center gap-3">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
            </SizableText>
            <View className="flex flex-row items-center ml-auto gap-3">
              {currentUser?.role === "admin" ||
                (currentUser?.id === user.id && (
                  <Tooltip
                    width={200}
                    visible={open}
                    onClose={onClose}
                    onOpen={onOpen}
                    popover={
                      <View className="flex flex-col">
                        <Button>Chỉnh sửa</Button> <Button>Xoá</Button>
                      </View>
                    }
                  >
                    <TouchableOpacity className="ml-auto">
                      <Entypo
                        name="dots-three-horizontal"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </Tooltip>
                ))}
              <TouchableOpacity onPress={props.onClose}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
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
