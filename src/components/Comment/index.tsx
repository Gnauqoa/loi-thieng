import { TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import MenuIcon from "@/assets/icons/menu.svg";
import { Comment as CommentType } from "@/@types/comment";
import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heart-fill.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import {
  CommentReducerType,
  likeComment,
  unlikeComment,
  useComment,
} from "@/config/redux/slices/comment";

const Comment = (props: CommentReducerType) => {
  const { isLoading, id, content, created_at, user, liked, total_likes } =
    props;
  const { dispatch } = useComment();

  const handleLike = () => {
    console.log(isLoading);
    if (isLoading) return;
    dispatch(likeComment(id));
  };

  const handleUnlike = () => {
    if (isLoading) return;
    dispatch(unlikeComment(id));
  };

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

      <View className="flex flex-row items-center gap-1">
        <TouchableOpacity onPress={liked ? handleUnlike : handleLike}>
          {liked ? (
            <HeartFillIcon style={{ width: 20, height: 20 }} />
          ) : (
            <HeartIcon fill={"#000"} style={{ width: 20, height: 20 }} />
          )}
        </TouchableOpacity>
        <SizableText size={"$1"}>{total_likes}</SizableText>
      </View>
    </View>
  );
};

export default Comment;
