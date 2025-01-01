import { Post as PostType } from "@/@types/post";
import { TouchableOpacity, View } from "react-native";
import { Avatar, SizableText, Text } from "tamagui";
import dayjs from "@/config/dayjs";
import AvatarSample from "@/assets/icons/avatar.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heart-fill.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import useToggle from "@/hooks/useToggle";
import CommentModal from "./CommentModal";

const Post = ({ ...props }: PostType) => {
  const [commentModal, , , onClose, onOpen] = useToggle();
  const { title, content, created_at, is_liked, user } = props;

  return (
    <View
      className={`flex flex-col gap-2 py-3 px-4 border-b-[#f1f1ef] border-b-[1px]`}
    >
      <View className="flex flex-row items-center gap-2">
        <View className="w-6 h-6 bg-black rounded-full" />
        <View className="flex flex-col flex-1">
          <View className="flex flex-row items-center">
            <SizableText size={"$3"}>
              {user.first_name} {user.last_name}
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
      <SizableText size={"$6"}>{title}</SizableText>

      <SizableText size={"$2"}>{content}</SizableText>

      <View className="flex flex-row gap-12 items-center">
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
      </View>
      {commentModal && (
        <CommentModal open={commentModal} onClose={onClose} post={props} />
      )}
    </View>
  );
};

export default Post;
