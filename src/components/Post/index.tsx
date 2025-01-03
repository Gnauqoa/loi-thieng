import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SizableText } from "tamagui";
import dayjs from "@/config/dayjs";
import HeartIcon from "@/assets/icons/heart.svg";
import HeartFillIcon from "@/assets/icons/heart-fill.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import useToggle from "@/hooks/useToggle";
import CommentModal from "./CommentModal";
import {
  likePost,
  PostReducerType,
  unlikePost,
  usePost,
} from "@/config/redux/slices/post";
import { Avatar } from "@rneui/themed";

const Post = ({ ...props }: PostReducerType & { isHighlight: boolean }) => {
  const [commentModal, , , onClose, onOpen] = useToggle();
  const {
    title,
    content,
    created_at,
    liked,
    total_likes,
    user,
    total_comments,
    isLoading,
  } = props;
  const { dispatch } = usePost();

  const handleLike = () => {
    if (isLoading) return;
    dispatch(likePost(props.id));
  };

  const handleUnlike = () => {
    if (isLoading) return;
    dispatch(unlikePost(props.id));
  };

  return (
    <View
      className={`flex flex-col gap-2 py-3 px-4 border-b-[#f1f1ef] border-b-[1px] ${
        props.isHighlight ? "bg-[#ede7f6]" : ""
      }`}
    >
      <View className="flex flex-row items-center gap-2">
        <Avatar
          rounded
          source={{ uri: props.user.avatar_url || "" }}
          size="small"
          containerStyle={{ borderWidth: 1 }}
        />

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
        <View className="flex flex-row items-center gap-1">
          <TouchableOpacity onPress={liked ? handleUnlike : handleLike}>
            {liked ? (
              <HeartFillIcon style={{ width: 20, height: 20 }} />
            ) : (
              <HeartIcon style={{ width: 20, height: 20 }} />
            )}
          </TouchableOpacity>
          <SizableText size={"$1"}>{total_likes}</SizableText>
        </View>
        <View className="">
          <View
            className={`z-20 absolute rounded-full p-[3px] top-[-6px] right-[-6px] bg-[#673ab7]`}
          >
            <Text className="text-[8px] text-white">{total_comments}</Text>
          </View>
          <TouchableOpacity className="z-10" onPress={onOpen}>
            <CommentIcon style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
      {commentModal && (
        <CommentModal open={commentModal} onClose={onClose} post={props} />
      )}
    </View>
  );
};

export default Post;
